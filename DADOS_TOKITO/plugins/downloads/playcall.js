/*
 * TOKITO BOT V10 — PlayCall
 * Busca música como o Play, prepara áudio e envia depois do atendimento.
 * Exibe somente números telefônicos reais; nunca apresenta LID como telefone.
 */
'use strict'

const dylan = require('../../database/lib/comandos')
const axios = require('axios')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { pipeline } = require('node:stream/promises')
const { execFile } = require('node:child_process')
const { promisify } = require('node:util')
const executarFfmpeg = promisify(execFile)

const chamadas = global.__TOKITO_PLAYCALL_ATIVAS__ ||= new Map()
const estadosAtivos = new Set(['connected', 'established', 'in_call', 'active', 'media_connected'])
const estadosFinais = new Set(['ended', 'terminate', 'terminated', 'rejected', 'reject', 'declined', 'timeout'])

const youtubeUrl = (value) => {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    if (host === 'youtu.be') return /^[\w-]{11}$/.test(url.pathname.slice(1)) ? 'https://www.youtube.com/watch?v=' + url.pathname.slice(1) : ''
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const id = url.pathname.startsWith('/shorts/') ? url.pathname.split('/')[2] : url.searchParams.get('v')
      return id && /^[\w-]{11}$/.test(id) ? 'https://www.youtube.com/watch?v=' + id : ''
    }
  } catch {}
  return ''
}

async function localizar(ctx, entrada) {
  const direta = youtubeUrl(entrada)
  if (/^https?:\/\//i.test(entrada) && !direta) throw new Error('Use um link do YouTube ou informe o nome da música.')
  const termo = direta || entrada
  const url = String(ctx.API_URL || '').replace(/\/+$/, '') +
    '/api/youtube-search?query=' + encodeURIComponent(termo) +
    '&apikey=' + encodeURIComponent(ctx.API_KEY_TOKITO || '')
  const res = await axios.get(url, { timeout: 20000, validateStatus: () => true })
  const lista = Array.isArray(res.data?.resultado) ? res.data.resultado : []
  const item = lista.find(v => v?.type === 'video' && v?.url) || lista.find(v => v?.url)
  if (!item && !direta) throw new Error('Não encontrei essa música na pesquisa.')
  const videoUrl = direta || String(item.url)
  const id = /[?&]v=([\w-]{11})/.exec(videoUrl)?.[1] || ''
  return {
    url: videoUrl,
    titulo: String(item?.title || 'Música selecionada').slice(0, 130),
    artista: String(item?.author?.name || 'YouTube').slice(0, 90),
    duracao: String(item?.timestamp || item?.duration?.timestamp || '—'),
    capa: String(item?.image || item?.thumbnail || (id ? 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg' : ''))
  }
}

async function prepararAudio(ctx, videoUrl) {
  const pasta = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'tokito-playcall-'))
  const arquivo = path.join(pasta, 'musica.mp3')
  try {
    const url = String(ctx.API_URL || '').replace(/\/+$/, '') +
      '/api/youtube-audio?q=' + encodeURIComponent(videoUrl) +
      '&apikey=' + encodeURIComponent(ctx.API_KEY_TOKITO || '')
    const resposta = await axios.get(url, {
      responseType: 'stream', timeout: 60000, maxRedirects: 3,
      validateStatus: () => true
    })
    if (resposta.status !== 200) {
      resposta.data?.destroy?.()
      throw new Error('A API de áudio não retornou a música (HTTP ' + resposta.status + ').')
    }
    const tipo = String(resposta.headers?.['content-type'] || '').toLowerCase()
    if (tipo.includes('json') || tipo.includes('text/html')) {
      resposta.data?.destroy?.()
      throw new Error('A API não retornou um arquivo de áudio válido.')
    }
    const tamanho = Number(resposta.headers?.['content-length'] || 0)
    if (tamanho > 35 * 1024 * 1024) {
      resposta.data?.destroy?.()
      throw new Error('O áudio excedeu o limite de 35 MB.')
    }
    let bytes = 0
    resposta.data.on('data', chunk => {
      bytes += chunk.length
      if (bytes > 35 * 1024 * 1024) resposta.data.destroy(new Error('O áudio excedeu o limite de 35 MB.'))
    })
    await pipeline(resposta.data, fs.createWriteStream(arquivo))
    if (bytes < 1024) throw new Error('O arquivo de áudio recebido está vazio ou incompleto.')
    // O content-type sozinho não comprova que a resposta é áudio decodificável.
    // Usa o mesmo FFmpeg necessário ao motor VoIP, sem tocar música no chat.
    const { stdout } = await executarFfmpeg(process.env.FFMPEG_PATH || 'ffmpeg', [
      '-nostdin', '-hide_banner', '-loglevel', 'error', '-i', arquivo,
      '-t', '3', '-vn', '-sn', '-dn', '-ac', '1', '-ar', '16000',
      '-f', 's16le', 'pipe:1'
    ], { timeout: 20000, maxBuffer: 512 * 1024, encoding: 'buffer' })
    if (!stdout || stdout.length < 3200) throw new Error('A música não pôde ser decodificada pelo FFmpeg.')
    return { pasta, arquivo }
  } catch (erro) {
    await fs.promises.rm(pasta, { recursive: true, force: true }).catch(() => {})
    throw erro
  }
}



const digits = x => String(x || '').split('@')[0].split(':')[0].replace(/\D/g, '')
const numeroPN = valor => {
  if (typeof valor !== 'string') return ''
  const entrada = valor.trim().replace(/:\d+(?=@)/, '')
  if (!entrada || /@(?:lid|hosted\.lid|g\.us)$/i.test(entrada)) return ''
  if (entrada.includes('@') && !/@(?:s\.whatsapp\.net|c\.us)$/i.test(entrada)) return ''
  if (!/^\+?[\d\s().-]+(?:@(?:s\.whatsapp\.net|c\.us))?$/i.test(entrada)) return ''
  const numero = digits(entrada)
  return /^\d{10,15}$/.test(numero) ? numero : ''
}
const telefone = numero => numero ? '+' + numero : 'Número indisponível'
const limpo = value => String(value || '—').replace(/\s+/g, ' ').trim()
const marcado = valor => String.fromCharCode(96) + valor + String.fromCharCode(96)
const infoPlay = (titulo, linhas, emoji = '🎧') => [
  '• ' + marcado(titulo) + ' ' + emoji,
  '> ℹ️ ' + marcado('𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂'),
  ...linhas.map(x => x ? '> ' + x : '')
].join('\n')
const cardMusica = (m, n) => infoPlay('𝙼𝚄́𝚂𝙸𝙲𝙰 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰', [
  '✏️ ᴛɪ́ᴛᴜʟᴏ: ' + limpo(m.titulo),
  '⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ' + limpo(m.duracao),
  '👨‍🎤 ᴀᴜᴛᴏʀ: ' + limpo(m.artista),
  '🔗 ʟɪɴᴋ: ' + m.url, '',
  '📱 ᴅᴇsᴛɪɴᴏ: ' + telefone(n),
  '📞 ᴇsᴛᴀᴅᴏ: Música encontrada'
])
const cardChamando = (n,m) => infoPlay('𝙿𝙻𝙰𝚈𝙲𝙰𝙻𝙻 𝙲𝙷𝙰𝙼𝙰𝙽𝙳𝙾',[
  '📱 ᴄᴏɴᴛᴀᴛᴏ: ' + telefone(n),
  '🎵 ᴍᴜ́sɪᴄᴀ: ' + limpo(m.titulo),
  '📞 ᴇsᴛᴀᴅᴏ: Chamando...',
  '⌛ Aguardando atender.'
], '📞')
const cardPreparando = (n,m) => infoPlay('𝙲𝙷𝙰𝙼𝙰𝙳𝙰 𝙰𝚃𝙴𝙽𝙳𝙸𝙳𝙰',[
  '✅ A pessoa atendeu.',
  '📱 ᴄᴏɴᴛᴀᴛᴏ: ' + telefone(n),
  '🎵 ᴍᴜ́sɪᴄᴀ: ' + limpo(m.titulo),
  '🎧 Preparando a música.'
], '✅')
const cardConectou = (n,m) => infoPlay('𝙿𝙻𝙰𝚈𝙲𝙰𝙻𝙻 𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙳𝙾',[
  '✅ Chamada atendida.',
  '📱 ᴄᴏɴᴛᴀᴛᴏ: ' + telefone(n),
  '🎵 ᴍᴜ́sɪᴄᴀ: ' + limpo(m.titulo),
  '🎶 Música iniciada na ligação.',
  '📞 A chamada continua até desligarem.'
], '🎧')
const cardSemAudio = (n,m) => infoPlay('𝙿𝙻𝙰𝚈𝙲𝙰𝙻𝙻',[
  '🔇 Não foi possível tocar a música.',
  '📱 ᴄᴏɴᴛᴀᴛᴏ: ' + telefone(n),
  '🎵 ᴍᴜ́sɪᴄᴀ: ' + limpo(m.titulo),
  '📞 A ligação continua ativa.'
], '⚠️')
const cardFim = (n,t,conectou) => infoPlay('𝙲𝙷𝙰𝙼𝙰𝙳𝙰 𝙴𝙽𝙲𝙴𝚁𝚁𝙰𝙳𝙰',[
  '📱 ᴄᴏɴᴛᴀᴛᴏ: ' + telefone(n),
  ...(t ? ['⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ' + t] : []),
  '📞 ᴇsᴛᴀᴅᴏ: ' + (conectou ? 'Chamada finalizada.' : 'Não atendida.')
], '📴')
const cardUso = p => infoPlay('𝙿𝙻𝙰𝚈𝙲𝙰𝙻𝙻',[
  '📞 Música por ligação',
  '📱 ɴᴜ́ᴍᴇʀᴏ: ' + p + 'playcall 5511999999999 vem cá',
  '👤 ᴍᴇɴᴄ̧ᴀ̃ᴏ: ' + p + 'playcall @pessoa vem cá',
  '🔗 Também aceita link do YouTube.'
])
const cardSemNumero = p => infoPlay('𝙿𝙻𝙰𝚈𝙲𝙰𝙻𝙻',[
  '⚠️ O telefone do contato marcado não está disponível.',
  '📱 Digite o número real com DDI e DDD:',
  p + 'playcall 5511999999999 nome da música'
], '⚠️')

// Consome apenas o telefone inicial, preservando a música ou link integral.
const porNumero = entrada => {
  const texto = String(entrada || '').trim()
  // @contato não é número digitado: seus dígitos podem ser um LID.
  if (!texto || texto.startsWith('@')) return null
  const tokens = texto.split(/\s+/)
  let resultado = null
  for (let n = 1; n < tokens.length && n <= 6; n++) {
    const candidato = tokens.slice(0, n).join(' ')
    if (!/^\+?[\d().\-\s]+$/.test(candidato)) break
    let numero = candidato.replace(/\D/g, '')
    if (!numero.startsWith('55') && [10, 11].includes(numero.length)) numero = '55' + numero
    if (numero.length >= 10 && numero.length <= 15) {
      resultado = { destino: numero + '@s.whatsapp.net', busca: tokens.slice(n).join(' ').trim() }
    }
  }
  return resultado?.busca ? resultado : null
}

const normalizarId = jid => String(jid || '').trim().replace(/:\d+(?=@)/, '').toLowerCase()
const ehLid = jid => /@(?:lid|hosted\.lid)$/i.test(normalizarId(jid))
const ehTelefone = jid => /@(?:s\.whatsapp\.net|c\.us)$/i.test(normalizarId(jid))
const porMencao = async (ctx, entrada) => {
  const busca = String(entrada || '').replace(/^@\S+\s*/, '').trim()
  if (!busca) return null
  const contexto = ctx.ctxMsg || {}
  const origens = [
    ...(Array.isArray(contexto.mentionedJid) ? contexto.mentionedJid : []),
    ...(Array.isArray(ctx.mentionedList) ? ctx.mentionedList : []),
    ...(Array.isArray(ctx.mentions) ? ctx.mentions : []),
    ...(Array.isArray(ctx.menc_jid2) ? ctx.menc_jid2 : [])
  ].filter(v => typeof v === 'string' && (ehLid(v) || ehTelefone(v)))
  if (!origens.length) return null
  // A menção original @lid prevalece sobre possíveis representações já normalizadas.
  const selecionado = origens.find(ehLid) || origens[0]
  const ids = origens.map(normalizarId)
  const membros = Array.isArray(ctx.groupMembers) ? ctx.groupMembers : []
  const membro = membros.find(m => [
    m?.lid, m?.id, m?.jid, m?.participant,
    m?.phoneNumber, m?.participantPn, m?.participantAlt
  ].some(id => ids.includes(normalizarId(id))))
  let numero = ''
  for (const id of [membro?.phoneNumber, membro?.participantPn, membro?.participantAlt, membro?.jid, membro?.id]) {
    if (ehTelefone(id) && numeroPN(id)) { numero = numeroPN(id); break }
  }
  if (!numero && ehLid(selecionado)) {
    const mapa = ctx.tokito?.signalRepository?.lidMapping
    if (typeof mapa?.getPNForLID === 'function') {
      for (const id of origens.filter(ehLid)) {
        try {
          const pn = await mapa.getPNForLID(normalizarId(id))
          if (ehTelefone(pn) && numeroPN(pn)) { numero = numeroPN(pn); break }
        } catch {}
      }
    }
  }
  // Não tratar números internos do @lid como telefone, mesmo que tenham 15 dígitos.
  if (!numero && ehTelefone(selecionado)) numero = numeroPN(selecionado)
  return numero ? { destino: numero + '@s.whatsapp.net', numero, busca } : null
}

dylan.setCommand({
  nome: 'playcall',
  comandos: ['playcall'],
  categoria: 'downloads',
  info: {
    descricao: 'Liga para um número ou contato marcado e toca uma música na ligação.',
    uso: 'playcall 5511999999999 música | playcall @pessoa música',
    categoria: 'downloads', permissao: 'Dono'
  },
  async executar(ctx) {
    const { tokito, from, reply, prefix, sender } = ctx
    if (!ctx.SoDono) return reply(ctx.mess?.onlyOwner?.() || 'Apenas o dono pode iniciar ligações.')
    const pedido = porNumero(ctx.q) || await porMencao(ctx, ctx.q)
    if (!pedido) return reply(String(ctx.q || '').trim().startsWith('@') ? cardSemNumero(prefix) : cardUso(prefix))
    const { destino, busca } = pedido
    const numero = numeroPN(destino)
    if (!numero) return reply(cardSemNumero(prefix))
    if (!digits(destino) || digits(destino) === digits(ctx.botNumber)) {
      return reply('❌ Informe o número de outra pessoa.')
    }
    const calls = tokito.calls
    if (!calls || typeof calls.enableVoip !== 'function' ||
      typeof calls.startCall !== 'function' || typeof calls.loadAudio !== 'function') {
      return reply('📞 Não foi possível iniciar a ligação agora.')
    }
    const sessao = String(tokito.user?.id || ctx.botNumber || 'bot')
    if (chamadas.has(sessao)) return reply('☎️ Já existe uma ligação PlayCall ativa.')
    chamadas.set(sessao, { fase: 'preparando', destino, origem: from, musica: busca })
    let mp3 = null, musica = null, callId = null
    let ouvindo = false, finalizado = false, conectado = false, carregando = false
    let inicio = null
    const ids = [destino, ...(numeroPN(sender) ? [sender] : [])]
    const ctxMsg = para => typeof ctx.canalInfo === 'function'
      ? { ...ctx.canalInfo(para), mentionedJid: para }
      : { mentionedJid: para }
    // NÃO editar a mensagem antiga: cada etapa ganha um cartão de texto novo,
    // sempre citando o selo do bot e usando o canal configurado (igual Play).
    const enviar = (payload, para = ids) => tokito.sendMessage(from,
      { ...payload, contextInfo: ctxMsg(para) }, { quoted: ctx.selo })
    const aviso = async texto => {
      try { await enviar({ text: texto }) }
      catch (e) { console.warn('[PLAYCALL MENSAGEM]', String(e?.message || e).slice(0, 120)) }
    }
    const duracao = () => {
      if (!inicio) return ''
      const s = Math.max(0, Math.floor((Date.now() - inicio) / 1000))
      return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
    }
    const terminar = async () => {
      if (finalizado) return
      finalizado = true
      if (ouvindo) calls.off?.('state', observar)
      chamadas.delete(sessao)
      if (mp3) await fs.promises.rm(mp3.pasta, { recursive: true, force: true }).catch(() => {})
      await aviso(cardFim(numero, duracao(), conectado))
    }
    const tocar = async () => {
      if (!conectado || finalizado || carregando || !mp3 || !callId) return
      carregando = true
      // Inicia o áudio sem aguardar a busca da foto do contato.
      // O avatar e a mensagem são enviados em paralelo.
      const avisoAtendido = (async () => {
        const textoAtendeu = cardPreparando(numero, musica)
        let foto = ''
        if (typeof tokito.profilePictureUrl === 'function') {
          try { foto = await tokito.profilePictureUrl(destino, 'image') } catch {}
        }
        if (typeof foto === 'string' && /^https?:\/\/\S+$/i.test(foto)) {
          try { await enviar({ image: { url: foto }, caption: textoAtendeu }); return }
          catch {}
        }
        await aviso(textoAtendeu)
      })().catch(() => {})
      try {
        await calls.loadAudio(callId, mp3.arquivo)
        if (finalizado) return
        chamadas.set(sessao, { fase: 'musica-enviada', destino, origem: from, musica: musica.titulo, callId })
        await aviso(cardConectou(numero, musica))
      } catch (e) {
        if (!finalizado) {
          console.warn('[PLAYCALL ÁUDIO]', String(e?.message || e).slice(0, 130))
          chamadas.set(sessao, { fase: 'sem-audio', destino, origem: from, musica: musica.titulo, callId })
          await aviso(cardSemAudio(numero, musica))
        }
      } finally { carregando = false }
    }
    const observar = evento => {
      if (finalizado || !callId || String(evento?.callId || evento?.id || '') !== String(callId)) return
      const estado = String(evento?.stateData?.state || evento?.status || '').toLowerCase()
      if (estadosFinais.has(estado)) { void terminar(); return }
      if (!estadosAtivos.has(estado) || conectado) return
      conectado = true
      inicio = Date.now()
      // Chamada conectada só termina com o evento real do WhatsApp.
      void tocar()
    }
    try {
      const cap = await calls.enableVoip()
      if (!cap?.startCall || !cap?.audioFiles) throw new Error('Áudio indisponível')
      musica = await localizar(ctx, busca)
      mp3 = await prepararAudio(ctx, musica.url)
      if (musica.capa) {
        await enviar({ image: { url: musica.capa }, caption: cardMusica(musica, numero) })
          .catch(() => enviar({ text: cardMusica(musica, numero) }))
      } else await enviar({ text: cardMusica(musica, numero) })
      calls.on('state', observar)
      ouvindo = true
      callId = await calls.startCall({ peerJid: destino, isVideo: false })
      chamadas.set(sessao, { fase: 'chamando', destino, origem: from, musica: musica.titulo, callId })
      const atual = calls.getCall(callId)
      if (atual) observar(atual)
      if (!conectado && !finalizado) await aviso(cardChamando(numero, musica))
    } catch(e) {
      if (!finalizado) {
        finalizado = true
        if (ouvindo) calls.off?.('state', observar)
        chamadas.delete(sessao)
        if (callId && !conectado) await calls.endCall(callId).catch(() => {})
        if (mp3) await fs.promises.rm(mp3.pasta, { recursive: true, force: true }).catch(() => {})
      }
      console.warn('[PLAYCALL FALHA]', String(e?.message || e).slice(0, 130))
      return reply(infoPlay('𝙿𝙻𝙰𝚈𝙲𝙰𝙻𝙻', [
        'Não foi possível iniciar a ligação.',
        '📱 Confira o número e tente novamente.'
      ]))
    }
  }
})
