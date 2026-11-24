'use strict'

// Compartilha a resolução de mídias citadas. Usa apenas mensagens recebidas pelo bot.
const CACHE_MS = 10 * 60 * 1000
const CAMADAS = [
  'ephemeralMessage', 'viewOnceMessage', 'viewOnceMessageV2',
  'viewOnceMessageV2Extension', 'documentWithCaptionMessage',
  'editedMessage', 'associatedChildMessage'
]

const desenrolar = entrada => {
  let atual = entrada || {}
  for (let i = 0; i < 12; i++) {
    const camada = CAMADAS.find(tipo => atual?.[tipo]?.message)
    if (!camada) break
    atual = atual[camada].message
  }
  return atual
}

const obterContexto = ctx => {
  const fontes = [ctx?.ctxMsg, ctx?.mensagem, ctx?.info?.message]
  for (const entrada of fontes) {
    if (entrada?.quotedMessage || entrada?.stanzaId) return entrada
    const msg = desenrolar(entrada)
    for (const nome of ['extendedTextMessage', 'imageMessage', 'videoMessage', 'ptvMessage']) {
      const info = msg?.[nome]?.contextInfo
      if (info?.quotedMessage || info?.stanzaId) return info
    }
  }
  return {}
}

const extrair = (entrada, tipo) => {
  const msg = desenrolar(entrada)
  return tipo === 'video'
    ? msg?.videoMessage || msg?.ptvMessage || null
    : msg?.[`${tipo}Message`] || null
}

const completo = media => Boolean(media?.mediaKey && (media?.url || media?.directPath))

const obterOriginal = (socket, jid, id) => {
  if (!socket || !jid || !id) return null
  const chave = `${jid}|${id}`
  const salvo = socket.__tokitoMidiasOriginais?.get(chave)
  if (salvo) {
    if (Date.now() - salvo.at <= CACHE_MS && salvo?.key?.remoteJid === jid) {
      return { message: desenrolar(salvo.message), key: salvo.key }
    }
    socket.__tokitoMidiasOriginais?.delete(chave)
  }
  const alternativa = global.messageStore?.[id]
  if (alternativa?.key?.remoteJid !== jid) return null
  const mensagem = desenrolar(alternativa.message)
  const media = extrair(mensagem, 'image') || extrair(mensagem, 'video') ||
    extrair(mensagem, 'audio') || extrair(mensagem, 'sticker')
  if (!completo(media)) return null
  return { message: mensagem, key: alternativa.key }
}

const preparar = ctx => {
  const contexto = obterContexto(ctx)
  const stanzaId = contexto?.stanzaId || ''
  const original = stanzaId ? obterOriginal(ctx?.tokito, ctx?.from, stanzaId) : null
  const fontes = [
    contexto?.quotedMessage,
    original?.message,
    ctx?.mensagem,
    ctx?.info?.message
  ].filter(Boolean)
  const referencia = {
    stanzaId,
    fromMe: Boolean(original?.key?.fromMe),
    participant: original?.key?.participant || contexto?.participant || ''
  }
  return { fontes, referencia, original, contexto }
}

const candidatos = (fontes, tipo) => {
  const encontrados = []
  for (const fonte of fontes || []) {
    const media = extrair(fonte, tipo)
    if (media && !encontrados.includes(media)) encontrados.push(media)
  }
  // A referência original completa vem antes de uma citação sem mediaKey.
  return encontrados.sort((a, b) => Number(completo(b)) - Number(completo(a)))
}

const statusHttp = erro => Number(
  erro?.output?.statusCode || erro?.statusCode || erro?.response?.status || 0
)

const baixar = async (ctx, tipo, lista, referencia = {}) => {
  if (typeof ctx?.getFileBuffer !== 'function') {
    const error = new Error('Download de mídia indisponível')
    error.code = 'DOWNLOAD_INDISPONIVEL'
    throw error
  }
  let ultimaFalha = null
  let existeChave = false
  let existeCaminho = false
  let renovado = false
  for (const media of lista || []) {
    if (!media?.mediaKey) continue
    existeChave = true
    if (media.url || media.directPath) existeCaminho = true
    if (media.url || media.directPath) {
      try {
        const buffer = await ctx.getFileBuffer(media, tipo)
        if (Buffer.isBuffer(buffer) && buffer.length) return buffer
      } catch (error) { ultimaFalha = error }
    }
    const status = statusHttp(ultimaFalha)
    if (renovado || !referencia.stanzaId ||
        typeof ctx.tokito?.updateMediaMessage !== 'function' ||
        ((media.url || media.directPath) && status !== 404 && status !== 410)) continue
    renovado = true
    try {
      const campo = `${tipo}Message`
      const original = {
        key: {
          remoteJid: ctx.from,
          id: referencia.stanzaId,
          fromMe: Boolean(referencia.fromMe),
          ...(referencia.participant ? { participant: referencia.participant } : {})
        },
        message: { [campo]: media }
      }
      await ctx.tokito.updateMediaMessage(original)
      const atualizado = extrair(original.message, tipo) || media
      const buffer = await ctx.getFileBuffer(atualizado, tipo)
      if (Buffer.isBuffer(buffer) && buffer.length) return buffer
    } catch (error) { ultimaFalha = error }
  }
  const error = new Error(
    !existeChave ? 'O WhatsApp não entregou a chave da mídia.' :
    !existeCaminho ? 'O WhatsApp não entregou o caminho da mídia.' :
    'Falha ao baixar a mídia recebida.'
  )
  error.code = !existeChave ? 'SEM_CHAVE' : !existeCaminho ? 'SEM_CAMINHO' : 'FALHA_DOWNLOAD'
  error.cause = ultimaFalha
  throw error
}


/**
 * Cache limitado, somente em RAM, compartilhado por reconexoes do mesmo
 * processo. Preserva a mensagem criptografada/metadata original se a Stone
 * de fato a recebeu. Nao inventa chave, arquivo ou caminho de mídia.
 */
const MAX_CACHE = 400
const originaisRecebidos = new Map()

const vincularCache = socket => {
  if (socket) socket.__tokitoMidiasOriginais = originaisRecebidos
  return originaisRecebidos
}

const registrarRecebidas = (socket, mensagens) => {
  const cache = vincularCache(socket)
  const agora = Date.now()
  for (const [id, item] of cache) {
    if (agora - item.at > CACHE_MS) cache.delete(id)
  }
  for (const item of mensagens || []) {
    const jid = item?.key?.remoteJid
    const id = item?.key?.id
    if (!jid || !id) continue
    const mensagem = item?.message || item?.update?.message
    if (!mensagem) {
      if (item?.key?.isViewOnce && process.env.TOKITO_DEBUG_RX === '1') {
        console.log('[REVELAR RX]', {
          tipoEvento: item.update ? 'update' : 'upsert',
          tipo: 'viewOnceStub',
          temConteudo: false, temChave: false, temCaminho: false,
          cacheOriginal: cache.has(jid + '|' + id)
        })
      }
      continue
    }
    const conteudo = desenrolar(mensagem)
    const media = conteudo?.imageMessage || conteudo?.videoMessage ||
      conteudo?.ptvMessage || conteudo?.audioMessage || conteudo?.stickerMessage
    if (!media) continue
    const chave = jid + '|' + id
    // Atualizacoes parciais nao substituem o original completo ja recebido.
    const anterior = cache.get(chave)
    const mediaAnterior = anterior && (
      extrair(anterior.message, 'image') ||
      extrair(anterior.message, 'video') ||
      extrair(anterior.message, 'audio') || extrair(anterior.message, 'sticker')
    )
    // Figurinhas sonoras vindas de outros bots não foram enviadas pelo
    // nosso /figaudio. Registra o áudio recebido ANTES da citação perder
    // o campo experimental. Não regrava o registro com dados incompletos.
    const sticker = conteudo?.stickerMessage
    const audioSticker = sticker?.audioMessage
    if (audioSticker?.mediaKey && (audioSticker.directPath || audioSticker.url)) {
      try {
        require('./sticker-audio').registrarAudioMensagem(
          jid, id, audioSticker, null, sticker.fileSha256
        )
      } catch (erro) {
        console.warn('[MIDIA STICKER AUDIO]', erro?.message || erro)
      }
    }
    const originalTemSom = Boolean(mediaAnterior?.audioMessage?.mediaKey)
    const atualTemSom = Boolean(sticker?.audioMessage?.mediaKey)
    if (media.mediaKey && (!completo(mediaAnterior) || completo(media) &&
        (!originalTemSom || atualTemSom))) {
      cache.delete(chave)
      cache.set(chave, { message: mensagem, key: item.key, at: agora })
    }
    const viewOnce = Boolean(
      item.key?.isViewOnce || media.viewOnce ||
      mensagem.viewOnceMessage || mensagem.viewOnceMessageV2 ||
      mensagem.viewOnceMessageV2Extension
    )
    if (viewOnce && process.env.TOKITO_DEBUG_RX === '1') console.log('[REVELAR RX]', {
      tipoEvento: item.update ? 'update' : 'upsert',
      tipo: conteudo?.imageMessage ? 'image' : conteudo?.audioMessage ? 'audio' : 'video',
      temChave: Boolean(media.mediaKey),
      temCaminho: Boolean(media.url || media.directPath),
      cacheOriginal: cache.has(chave),
      viewOnce: true
    })
  }
  while (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value)
}

module.exports = { desenrolar, obterContexto, extrair, completo, obterOriginal, preparar, candidatos, baixar, vincularCache, registrarRecebidas }
