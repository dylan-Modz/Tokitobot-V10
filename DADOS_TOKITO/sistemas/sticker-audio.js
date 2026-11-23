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

async function normalizarAudio(ctx, audioOrigem) {
  if (typeof ctx.getFileBuffer !== 'function') {
    throw new Error('Esta conexão não consegue baixar áudios.')
  }
  const buffer = await ctx.getFileBuffer(audioOrigem, 'audio')
  if (!Buffer.isBuffer(buffer) || !buffer.length || buffer.length > MAX_AUDIO) {
    throw new Error('Áudio inválido ou maior que 8 MB.')
  }
  const duracao = Number(audioOrigem.seconds || 0)
  const mime = String(audioOrigem.mimetype || '').toLowerCase()
  if (temOpus(mime, buffer) && duracao > 0 && duracao <= MAX_SEGUNDOS) {
    return buffer
  }

  // Figurinhas sonoras Android usam Opus curto. Converte e corta
  // com FFmpeg quando o áudio não está nesse formato.
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'tokito-sound-sticker-'))
  const entrada = path.join(temp, 'entrada.bin')
  const saida = path.join(temp, 'saida.ogg')
  try {
    fs.writeFileSync(entrada, buffer)
    await executar(process.env.FFMPEG_PATH || 'ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-i', entrada, '-t', String(MAX_SEGUNDOS),
      '-vn', '-ac', '1', '-ar', '48000',
      '-c:a', 'libopus', '-b:a', '32k',
      '-f', 'ogg', saida
    ], { timeout: 30000, maxBuffer: 1024 * 1024 })
    const convertido = fs.readFileSync(saida)
    if (!temOpus('audio/ogg; codecs=opus', convertido)) {
      throw new Error('A conversão não gerou um áudio Opus válido.')
    }
    return convertido
  } catch (err) {
    if (err?.code === 'ENOENT') {
      throw new Error('FFmpeg não encontrado. Instale o FFmpeg ou use um áudio OGG/Opus de até 10 segundos.')
    }
    throw new Error('Não foi possível converter o áudio para OGG/Opus: ' + (err?.message || 'erro'))
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
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
