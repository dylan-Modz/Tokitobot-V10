/*
 * TOKITO BOT V10 — Figurinha com áudio (protocolo experimental)
 * A exibição depende da compatibilidade do WhatsApp do destinatário.
 * Author: Dylan Modz
 */
'use strict'

const fs = require('fs')
const path = require('path')
const { randomBytes } = require('crypto')
const { proto, prepareWAMessageMedia } = require('@stone-wpp/ofc')

const ARQUIVO = path.join(__dirname, '..', 'database', 'sistemas', 'sticker-audio.webp')
const META = path.join(__dirname, '..', 'database', 'sistemas', 'sticker-audio.json')
const PATCH = Symbol.for('tokito.stickerAudio.encoder.v1')
const MAX_WEBP = 1024 * 1024
const MAX_AUDIO = 8 * 1024 * 1024
const MAX_SEGUNDOS = 120

const registrada = () => fs.existsSync(ARQUIVO)
const metadados = () => {
  try { return JSON.parse(fs.readFileSync(META, 'utf8')) } catch { return {} }
}

const stickerAtual = ctx =>
  ctx.ctxMsg?.quotedMessage?.stickerMessage ||
  ctx.mensagem?.stickerMessage ||
  null

const audioAtual = ctx =>
  ctx.ctxMsg?.quotedMessage?.audioMessage ||
  ctx.mensagem?.audioMessage ||
  null

function patchProtocolo() {
  const mensagem = proto?.Message
  const futuro = mensagem?.FutureProofMessage
  const sticker = mensagem?.StickerMessage
  const audio = mensagem?.AudioMessage
  if (!mensagem || !futuro || !sticker || !audio ||
      typeof mensagem.encode !== 'function' ||
      typeof futuro.encode !== 'function' ||
      typeof sticker.encode !== 'function' ||
      typeof audio.encode !== 'function') {
    throw new Error('A versão atual da Stone WPP não disponibiliza os tipos de figurinha com áudio.')
  }
  if (mensagem[PATCH]) return
  const originalMensagem = mensagem.encode
  const originalSticker = sticker.encode
  // Campos experimentais ainda não incluídos no schema gerado da biblioteca.
  mensagem.encode = function (valor, writer) {
    const resultado = originalMensagem.call(this, valor, writer)
    if (valor?.audioStickerMessage) {
      futuro.encode(valor.audioStickerMessage, resultado.uint32(1074).fork()).ldelim()
    }
    return resultado
  }
  sticker.encode = function (valor, writer) {
    const resultado = originalSticker.call(this, valor, writer)
    if (valor?.audioMessage) {
      audio.encode(valor.audioMessage, resultado.uint32(210).fork()).ldelim()
    }
    return resultado
  }
  Object.defineProperty(mensagem, PATCH, { value: true })
}

async function registrar(ctx) {
  const st = stickerAtual(ctx)
  if (!st) throw new Error('Responda à figurinha que deseja registrar.')
  if (st.isLottie) throw new Error('Figurinhas Lottie não são suportadas.')
  const buffer = await ctx.getFileBuffer(st, 'sticker')
  if (!Buffer.isBuffer(buffer) || buffer.length < 12 || buffer.length > MAX_WEBP ||
      buffer.toString('ascii', 0, 4) !== 'RIFF' ||
      buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Marque uma figurinha WebP válida de até 1 MB.')
  }
  fs.mkdirSync(path.dirname(ARQUIVO), { recursive: true })
  const temporario = ARQUIVO + '.tmp'
  const temporarioMeta = META + '.tmp'
  try {
    fs.writeFileSync(temporario, buffer)
    fs.renameSync(temporario, ARQUIVO)
    fs.writeFileSync(temporarioMeta, JSON.stringify({
      width: Number(st.width) || 512,
      height: Number(st.height) || 512,
      isAnimated: st.isAnimated === true,
      savedAt: new Date().toISOString()
    }, null, 2) + '\n')
    fs.renameSync(temporarioMeta, META)
  } finally {
    for (const p of [temporario, temporarioMeta]) {
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
  if (!registrada()) throw new Error('Nenhuma figurinha com áudio foi registrada.')
  return ctx.tokito.sendMessage(ctx.from, {
    sticker: fs.readFileSync(ARQUIVO),
    isAnimated: metadados().isAnimated === true
  }, { quoted: ctx.selo })
}

async function enviar(ctx, audioOrigem) {
  if (!registrada()) throw new Error('Nenhuma figurinha registrada. Use rgfigaudio.')
  if (!audioOrigem) throw new Error('Responda a um áudio para usar figaudio.')
  if (typeof ctx.getFileBuffer !== 'function' ||
      typeof ctx.tokito?.relayMessage !== 'function' ||
      typeof ctx.tokito?.waUploadToServer !== 'function' ||
      typeof prepareWAMessageMedia !== 'function') {
    throw new Error('Esta conexão não possui os recursos necessários de envio.')
  }
  const seconds = Number(audioOrigem.seconds || 0)
  if (seconds > MAX_SEGUNDOS) throw new Error('O áudio deve ter no máximo 2 minutos.')
  const mime = String(audioOrigem.mimetype || 'audio/ogg; codecs=opus')
  if (!/^audio\//i.test(mime)) throw new Error('Tipo de áudio não suportado.')
  const bytes = await ctx.getFileBuffer(audioOrigem, 'audio')
  if (!Buffer.isBuffer(bytes) || bytes.length === 0 || bytes.length > MAX_AUDIO) {
    throw new Error('Não consegui baixar o áudio ou ele excede 8 MB.')
  }
  const dadosSticker = metadados()
  const upload = ctx.tokito.waUploadToServer
  const [fig, som] = await Promise.all([
    prepareWAMessageMedia({
      sticker: fs.readFileSync(ARQUIVO),
      mimetype: 'image/webp',
      isAnimated: dadosSticker.isAnimated === true,
      width: Number(dadosSticker.width) || 512,
      height: Number(dadosSticker.height) || 512
    }, { upload }),
    prepareWAMessageMedia({
      audio: bytes,
      mimetype: mime,
      ptt: audioOrigem.ptt === true
    }, { upload })
  ])
  if (!fig?.stickerMessage || !som?.audioMessage) {
    throw new Error('Não foi possível preparar o áudio e a figurinha para envio.')
  }
  patchProtocolo()
  const interna = proto.Message.fromObject({ stickerMessage: fig.stickerMessage })
  interna.stickerMessage.audioMessage = som.audioMessage
  const externa = proto.Message.fromObject({
    messageContextInfo: { messageSecret: randomBytes(32) }
  })
  externa.audioStickerMessage = { message: interna }
  await ctx.tokito.relayMessage(ctx.from, externa, {})
  // O protocolo pode aceitar o envio mesmo sem exibir a figurinha sonora no cliente.
  return true
}

module.exports = {
  ARQUIVO, META, registrada, metadados, stickerAtual, audioAtual,
  registrar, remover, visualizar, enviar, patchProtocolo
}
