/*
 * TOKITO BOT V10 — Figurinhas com áudio, suporte de mídia compatível.
 * Usa StickerMessage.audioMessage (campo 26); não mistura o wrapper
 * FutureProofMessage, cujo conteúdo não tem estrutura confirmada.
 * Author: Dylan Modz
 */
'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const { promisify } = require('util')
const { execFile } = require('child_process')
const { randomBytes } = require('crypto')
const { proto, prepareWAMessageMedia } = require('@stone-wpp/ofc')
const modulos = require('./modulos')

const executar = promisify(execFile)
const ARQUIVO = path.join(__dirname, '..', 'database', 'sistemas', 'sticker-audio.webp')
const META = path.join(__dirname, '..', 'database', 'sistemas', 'sticker-audio.json')
const PATCH = Symbol.for('tokito.stickerAudio.sticker26.v2')
const MAX_WEBP = 1024 * 1024
const MAX_AUDIO = 8 * 1024 * 1024
const MAX_SEGUNDOS = 10

const registrada = () => fs.existsSync(ARQUIVO)
const metadados = () => {
  try { return JSON.parse(fs.readFileSync(META, 'utf8')) } catch { return {} }
}
const stickerAtual = ctx => modulos.mediaAtual(ctx).sticker
const audioAtual = ctx => modulos.audioAtual(ctx)

function patchProtocolo() {
  const mensagem = proto?.Message
  const sticker = mensagem?.StickerMessage
  const audio = mensagem?.AudioMessage
  if (!mensagem || !sticker || !audio ||
      typeof mensagem.encode !== 'function' ||
      typeof sticker.encode !== 'function' ||
      typeof audio.encode !== 'function') {
    throw new Error('A Stone WPP instalada não disponibiliza o encoder do áudio de figurinha.')
  }
  if (sticker[PATCH]) return
  const anterior = sticker.encode
  // Se uma versão futura da Stone já codificar audioMessage, não duplicar.
  if (/\baudioMessage\b/.test(Function.prototype.toString.call(anterior))) {
    Object.defineProperty(sticker, PATCH, { value: true })
    return
  }
  sticker.encode = function (valor, writer) {
    const resultado = anterior.call(this, valor, writer)
    // Campo 26, wire type 2 -> tag varint 210. Não duplicar se o schema
    // da Stone passar a suportar o campo nativamente.
    if (valor?.audioMessage) {
      audio.encode(valor.audioMessage, resultado.uint32(210).fork()).ldelim()
    }
    return resultado
  }
  Object.defineProperty(sticker, PATCH, { value: true })
}

async function registrar(ctx) {
  const st = stickerAtual(ctx)
  if (!st) throw new Error('Marque a figurinha que deseja registrar.')
  if (st.isLottie) throw new Error('Figurinhas Lottie não são suportadas.')
  const buffer = await ctx.getFileBuffer(st, 'sticker')
  if (!Buffer.isBuffer(buffer) || buffer.length < 12 || buffer.length > MAX_WEBP ||
      buffer.toString('ascii', 0, 4) !== 'RIFF' ||
      buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Use uma figurinha WebP válida de até 1 MB.')
  }
  fs.mkdirSync(path.dirname(ARQUIVO), { recursive: true })
  const tmp = ARQUIVO + '.' + process.pid + '.tmp'
  const tmpMeta = META + '.' + process.pid + '.tmp'
  try {
    fs.writeFileSync(tmp, buffer)
    fs.renameSync(tmp, ARQUIVO)
    fs.writeFileSync(tmpMeta, JSON.stringify({
      width: Number(st.width) || 512,
      height: Number(st.height) || 512,
      isAnimated: st.isAnimated === true,
      savedAt: new Date().toISOString()
    }, null, 2) + '\n')
    fs.renameSync(tmpMeta, META)
  } finally {
    for (const p of [tmp, tmpMeta]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true })
    }
  }
  return metadados()
}

function remover() {
  if (!registrada()) return false
  fs.rmSync(ARQUIVO, { force: true })
  fs.rmSync(META, { force: true })
  return true
}

async function visualizar(ctx) {
  if (!registrada()) throw new Error('Nenhuma figurinha registrada.')
  return ctx.tokito.sendMessage(ctx.from, {
    sticker: fs.readFileSync(ARQUIVO),
    isAnimated: metadados().isAnimated === true
  }, { quoted: ctx.selo })
}

function temOpus(mime, bytes) {
  // Áudio do WhatsApp costuma ser OGG/Opus. Não confiar apenas no MIME.
  return /audio\/ogg/i.test(mime) &&
    bytes.length >= 8 && bytes.subarray(0, 4).toString('ascii') === 'OggS' &&
    bytes.includes(Buffer.from('OpusHead'))
}

const MAX_VIDEO_SEGUNDOS = 9.9
const MAX_MUSICA_SEGUNDOS = 30
const MAX_VIDEO_BYTES = 22 * 1024 * 1024
const MAX_IMAGEM_BYTES = 10 * 1024 * 1024
const { imageToWebp2, videoToWebp2 } = require('../plugins/figurinhas/exif2')
const midiaCitada = require('./midia-citada')
const axios = require('axios')

const temporario = funcao => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokito-figaudio-'))
  return Promise.resolve().then(() => funcao(dir)).finally(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })
}

const transcodificar = async (bytes, extensao, args, formato = '.ogg') => {
  if (!Buffer.isBuffer(bytes) || !bytes.length) throw new Error('Mídia vazia.')
  return temporario(async dir => {
    const entrada = path.join(dir, 'entrada.' + extensao)
    const saida = path.join(dir, 'saida' + formato)
    fs.writeFileSync(entrada, bytes)
    try {
      await executar(process.env.FFMPEG_PATH || 'ffmpeg', [
        '-hide_banner', '-loglevel', 'error', '-y',
        '-i', entrada, ...args, saida
      ], { timeout: 45000, maxBuffer: 1024 * 1024 })
    } catch (error) {
      if (error?.code === 'ENOENT') throw new Error('FFmpeg não está instalado na hospedagem.')
      throw new Error('Não foi possível extrair ou converter o áudio da mídia.')
    }
    const resultado = fs.readFileSync(saida)
    if (!resultado.length || resultado.length > MAX_AUDIO) {
      throw new Error('O áudio convertido excedeu o limite permitido.')
    }
    return resultado
  })
}

const opcoesOpus = segundos => [
  '-t', String(segundos), '-vn', '-ac', '1', '-ar', '48000',
  '-c:a', 'libopus', '-b:a', '32k', '-f', 'ogg'
]

async function normalizarBufferAudio(buffer, mime = '', duracao = 0, segundos = MAX_SEGUNDOS) {
  if (!Buffer.isBuffer(buffer) || !buffer.length || buffer.length > 35 * 1024 * 1024) {
    throw new Error('Áudio inválido ou maior que o permitido.')
  }
  if (temOpus(mime, buffer) && duracao > 0 && duracao <= segundos) return buffer
  return transcodificar(buffer, 'bin', opcoesOpus(segundos))
}

async function normalizarAudio(ctx, audioOrigem) {
  if (!audioOrigem) throw new Error('Marque um áudio para usar figaudio.')
  const { fontes, referencia } = midiaCitada.preparar(ctx)
  const candidatos = midiaCitada.candidatos(fontes, 'audio')
  const lista = [audioOrigem, ...candidatos.filter(item => item !== audioOrigem)]
  const dados = await midiaCitada.baixar(ctx, 'audio', lista, referencia)
  return normalizarBufferAudio(dados, audioOrigem.mimetype || '', Number(audioOrigem.seconds || 0), MAX_SEGUNDOS)
}

const youtubeId = entrada => {
  try {
    const url = new URL(String(entrada || '').trim())
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = url.pathname.split('/')[1]
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : ''
    }
    if (['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) {
      const id = url.pathname.startsWith('/shorts/') ? url.pathname.split('/')[2]
        : url.pathname.startsWith('/live/') ? url.pathname.split('/')[2]
        : url.searchParams.get('v')
      return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? id : ''
    }
  } catch {}
  return ''
}

const apiUrl = (ctx, endpoint, params) => {
  const base = new URL(String(ctx.API_URL || 'https://tokito-apis.com.br'))
  if (!['https:', 'http:'].includes(base.protocol)) throw new Error('API inválida.')
  const link = new URL(endpoint, base.origin)
  for (const [key, value] of Object.entries(params)) {
    if (value) link.searchParams.set(key, String(value))
  }
  if (ctx.API_KEY_TOKITO) link.searchParams.set('apikey', String(ctx.API_KEY_TOKITO))
  return link.toString()
}

async function baixarMusica(ctx, termo) {
  let id = youtubeId(termo)
  if (!id) {
    if (/^https?:\/\//i.test(termo)) throw new Error('Use um link válido do YouTube.')
    if (String(termo || '').trim().length < 2 || String(termo).length > 140) {
      throw new Error('Informe o nome da música para pesquisar.')
    }
    const busca = await axios.get(apiUrl(ctx, '/api/youtube-search', { query: termo }), {
      timeout: 20000, validateStatus: () => true
    })
    const resultados = busca.data?.resultado
    const encontrado = busca.status === 200 && Array.isArray(resultados)
      ? resultados.find(item => item?.type === 'video' && (item?.videoId || youtubeId(item?.url))) : null
    id = encontrado?.videoId && /^[a-zA-Z0-9_-]{11}$/.test(encontrado.videoId)
      ? encontrado.videoId : youtubeId(encontrado?.url)
    if (!id) throw new Error('Não encontrei essa música no YouTube.')
  }
  const url = 'https://www.youtube.com/watch?v=' + id
  const resposta = await axios.get(apiUrl(ctx, '/api/youtube-audio', { q: url }), {
    timeout: 90000, responseType: 'arraybuffer',
    maxContentLength: 35 * 1024 * 1024, maxBodyLength: 35 * 1024 * 1024,
    validateStatus: () => true
  })
  const mime = String(resposta.headers?.['content-type'] || '').toLowerCase()
  if (resposta.status !== 200 || mime.includes('json') || mime.includes('text/html')) {
    throw new Error('Não foi possível obter o áudio dessa música.')
  }
  const bytes = Buffer.from(resposta.data || [])
  if (!bytes.length || bytes.length > 35 * 1024 * 1024) {
    throw new Error('A música não está disponível para conversão.')
  }
  return normalizarBufferAudio(bytes, mime, 0, MAX_MUSICA_SEGUNDOS)
}

async function prepararVideo(ctx, lista, referencia) {
  const media = lista[0]
  const duracao = Number(media?.seconds || 0)
  if (duracao >= 10) throw new Error('O vídeo deve ter menos de 10 segundos (até 9,9s).')
  const bytes = await midiaCitada.baixar(ctx, 'video', lista, referencia)
  if (bytes.length > MAX_VIDEO_BYTES) throw new Error('O vídeo ultrapassou 22 MB.')
  const som = await transcodificar(bytes, 'mp4', opcoesOpus(MAX_SEGUNDOS))
  // Mesmo conversor usado pelo comando /s; preserva a animação em WebP.
  const figurinha = await videoToWebp2(bytes)
  if (!figurinha?.length || figurinha.length > MAX_WEBP) {
    throw new Error('A figurinha animada excedeu 1 MB.')
  }
  return { figurinha, som, animada: true }
}

async function prepararImagem(ctx, lista, referencia) {
  const bytes = await midiaCitada.baixar(ctx, 'image', lista, referencia)
  if (bytes.length > MAX_IMAGEM_BYTES) throw new Error('A imagem ultrapassou 10 MB.')
  const figurinha = await imageToWebp2(bytes)
  if (!figurinha?.length || figurinha.length > MAX_WEBP) {
    throw new Error('A figurinha gerada excedeu 1 MB.')
  }
  return { figurinha, animada: false }
}

async function prepararFigurinha(ctx, lista, referencia) {
  const buffer = await midiaCitada.baixar(ctx, 'sticker', lista, referencia)
  if (!buffer?.length || buffer.length > MAX_WEBP) throw new Error('Figurinha inválida ou maior que 1 MB.')
  return { figurinha: buffer, animada: lista[0]?.isAnimated === true }
}

function construirMensagem(fig, som) {
  if (!fig?.stickerMessage || !som?.audioMessage) {
    throw new Error('Falha no preparo da figurinha ou do áudio.')
  }
  patchProtocolo()
  const resultado = proto.Message.fromObject({
    stickerMessage: fig.stickerMessage,
    messageContextInfo: { messageSecret: randomBytes(32) }
  })
  // fromObject normalmente ignora campos experimentais desconhecidos;
  // adicionar o áudio DEPOIS do fromObject garante o encoder patchado.
  resultado.stickerMessage.audioMessage = som.audioMessage
  if (!resultado.stickerMessage.audioMessage?.mediaKey ||
      !(resultado.stickerMessage.audioMessage?.directPath || resultado.stickerMessage.audioMessage?.url)) {
    throw new Error('Áudio sem metadados de upload; não é seguro anunciar envio com som.')
  }
  return resultado
}

async function enviar(ctx, audioOrigem) {
  if (!registrada()) throw new Error('Nenhuma figurinha registrada. Use rgfigaudio.')
  if (!audioOrigem) throw new Error('Marque um áudio para usar figaudio.')
  if (typeof ctx.tokito?.relayMessage !== 'function' ||
      typeof ctx.tokito?.waUploadToServer !== 'function') {
    throw new Error('A conexão não disponibiliza envio de mídia.')
  }

  const audio = await normalizarAudio(ctx, audioOrigem)
  const dados = metadados()
  const upload = ctx.tokito.waUploadToServer
  const [fig, som] = await Promise.all([
    prepareWAMessageMedia({
      sticker: fs.readFileSync(ARQUIVO),
      mimetype: 'image/webp',
      isAnimated: dados.isAnimated === true,
      width: Number(dados.width) || 512,
      height: Number(dados.height) || 512
    }, { upload }),
    prepareWAMessageMedia({
      audio,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: false
    }, { upload })
  ])
  const mensagem = construirMensagem(fig, som)
  await ctx.tokito.relayMessage(ctx.from, mensagem, {})
  // Confirma apenas o envio pelo socket; a reprodução depende do app.
  return true
}

module.exports = {
  ARQUIVO, META, registrada, metadados, stickerAtual, audioAtual,
  registrar, remover, visualizar, enviar, patchProtocolo, construirMensagem,
  normalizarAudio, MAX_SEGUNDOS
}
