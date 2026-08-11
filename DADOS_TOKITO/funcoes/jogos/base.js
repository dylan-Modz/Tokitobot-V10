const fs = require('fs')
const path = require('path')
const { proto, prepareWAMessageMedia, generateWAMessageFromContent } = require('@whiskeysockets/baileys')
const funcoesBase = require('../base.js')

const TEMPO_RESET = 5 * 60 * 1000

const PASTA_DADOS = path.join(__dirname, 'dados')

const PASTA_PARTIDAS = path.join(__dirname, 'partidas')

for (const pasta of [PASTA_DADOS, PASTA_PARTIDAS]) {
  if (!fs.existsSync(pasta))
    fs.mkdirSync(pasta, { recursive: true })
}

const files = {
  adivinhe: path.join(PASTA_PARTIDAS, 'adivinhe.json'),
  quiz: path.join(PASTA_PARTIDAS, 'quiz.json'),
  forca: path.join(PASTA_PARTIDAS, 'forca.json'),
  caca: path.join(PASTA_PARTIDAS, 'cacapalavras.json'),
  mines: path.join(PASTA_PARTIDAS, 'mines.json'),
  velha: path.join(PASTA_PARTIDAS, 'jogodavelha.json'),
  dama: path.join(PASTA_PARTIDAS, 'dama.json'),
  palavrasAdivinhe: path.join(PASTA_DADOS, 'palavras_adivinhe.json'),
  palavrasCaca: path.join(PASTA_DADOS, 'palavras_caca.json'),
  palavrasForca: path.join(PASTA_DADOS, 'palavras.json'),
  perguntasQuiz: path.join(PASTA_DADOS, 'perguntas_quiz.json')
}

for (const file of [files.adivinhe, files.quiz, files.forca, files.caca, files.mines, files.velha, files.dama]) {
  if (!fs.existsSync(file))
    fs.writeFileSync(file, '[]\n')
}

const now = () => Date.now()

const norm = (txt = '') => String(txt || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const onlyLetters = (txt = '') => norm(txt).replace(/[^a-z]/g, '')

const mention = jid => `@${String(jid || '').split('@')[0].split(':')[0]}`

function readJSON(file, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  }
  catch {
    return fallback
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
}

function getList(file) {
  const data = readJSON(file, [])
  return Array.isArray(data) ? data : []
}

function setList(file, list) {
  writeJSON(file, Array.isArray(list) ? list : [])
}

function getGame(file, grupo) {
  return getList(file).find(game => game.grupo === grupo) || null
}

function saveGame(file, game) {
  const list = getList(file).filter(item => item.grupo !== game.grupo)
  list.push({
    ...game,
    atualizadoEm: now()
  })
  setList(file, list)
  return game
}

function removeGame(file, grupo) {
  const atual = getList(file)
  const nova = atual.filter(item => item.grupo !== grupo)
  setList(file, nova)
  return nova.length !== atual.length
}

function jidNum(jid = '') {
  return String(jid || '').split('@')[0].split(':')[0].replace(/\D/g, '')
}

function sameJid(a = '', b = '') {
  if (!a || !b)
    return false
  if (String(a) === String(b))
    return true
  const na = jidNum(a)
  const nb = jidNum(b)
  return Boolean(na && nb && na === nb)
}

function senderIds(ctx = {}) {
  return [
    ctx.sender,
    ctx.senderPn,
    ctx.info?.key?.participant,
    ctx.info?.key?.participantPn,
    ctx.info?.key?.senderPn,
    ctx.info?.participant,
    ctx.info?.participantPn
  ].filter(Boolean)
}

function isSender(ctx = {}, jid = '') {
  return senderIds(ctx).some(id => sameJid(id, jid))
}

function getBody(ctx = {}) {
  return String(ctx.body || ctx.budy || '').trim()
}

function quickReplies(botoes = []) {
  return botoes.filter(item => item?.texto && item?.id).map(item => ({
    name: 'quick_reply',
    buttonParamsJson: JSON.stringify({
      display_text: String(item.texto),
      id: String(item.id)
    })
  }))
}

async function sendText(ctx, text, mentions = [], botoes = []) {
  if (ctx.isBotoes === false || !botoes.length) {
    return ctx.tokito.sendMessage(ctx.from, {
      text,
      contextInfo: ctx.canalInfo(mentions)
    }, { quoted: ctx.selo || ctx.info })
  }
  try {
    const msg = generateWAMessageFromContent(ctx.from, {
      interactiveMessage: proto.Message.InteractiveMessage.create({
        contextInfo: ctx.canalInfo(mentions),
        body: proto.Message.InteractiveMessage.Body.create({ text }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: `🧊﹚${ctx.NomeDoBot || 'Tokito'}﹙🧊` }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: quickReplies(botoes) })
      })
    }, {
      quoted: ctx.selo || ctx.info,
      userJid: ctx.tokito.user.id
    })
    return ctx.tokito.relayMessage(ctx.from, msg.message, { messageId: msg.key.id })
  }
  catch (e) {
    console.log('[BOTÕES JOGOS TEXTO]', e?.message || e)
    return ctx.tokito.sendMessage(ctx.from, {
      text,
      contextInfo: ctx.canalInfo(mentions)
    }, { quoted: ctx.selo || ctx.info })
  }
}

async function sendImage(ctx, url, caption, mentions = [], botoes = []) {
  if (ctx.isBotoes === false || !botoes.length) {
    return ctx.tokito.sendMessage(ctx.from, {
      image: { url },
      caption,
      contextInfo: ctx.canalInfo(mentions)
    }, { quoted: ctx.selo || ctx.info })
  }
  try {
    const media = await prepareWAMessageMedia({ image: { url } }, { upload: ctx.tokito.waUploadToServer })
    const msg = generateWAMessageFromContent(ctx.from, {
      interactiveMessage: proto.Message.InteractiveMessage.create({
        contextInfo: ctx.canalInfo(mentions),
        header: proto.Message.InteractiveMessage.Header.create({
          hasMediaAttachment: true,
          imageMessage: media.imageMessage
        }),
        body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: `🧊﹚${ctx.NomeDoBot || 'Tokito'}﹙🧊` }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: quickReplies(botoes) })
      })
    }, {
      quoted: ctx.selo || ctx.info,
      userJid: ctx.tokito.user.id
    })
    return ctx.tokito.relayMessage(ctx.from, msg.message, { messageId: msg.key.id })
  }
  catch (e) {
    console.log('[BOTÕES JOGOS IMAGEM]', e?.message || e)
    return ctx.tokito.sendMessage(ctx.from, {
      image: { url },
      caption,
      contextInfo: ctx.canalInfo(mentions)
    }, { quoted: ctx.selo || ctx.info })
  }
}

async function reactMsg(ctx, emoji = '🎮') {
  try {
    if (typeof ctx.reagir === 'function')
      return await ctx.reagir(ctx.from, emoji)
    if (ctx.tokito && ctx.info?.key)
      return await ctx.tokito.sendMessage(ctx.from, {
        react: {
          text: emoji,
          key: ctx.info.key
        }
      })
  }
  catch {
  }
}

async function responder(ctx, texto, mentions = []) {
  if (typeof ctx.reply === 'function')
    return ctx.reply(texto, mentions)
  return sendText(ctx, texto, mentions)
}

function modoAtivo(grupo, dataGp = null) {
  if (typeof dataGp?.[0]?.funcoes?.modojogos === 'boolean')
    return dataGp[0].funcoes.modojogos
  return grupo ? funcoesBase.config(grupo).modojogos === true : false
}

function limparInativos() {
  for (const file of [files.adivinhe, files.quiz, files.forca, files.caca, files.mines, files.velha, files.dama]) {
    const atual = getList(file)
    const filtrado = atual.filter(game => now() - (game.atualizadoEm || game.iniciadoEm || now()) < TEMPO_RESET)
    if (filtrado.length !== atual.length)
      setList(file, filtrado)
  }
}

module.exports = {
  files,
  now,
  norm,
  onlyLetters,
  mention,
  readJSON,
  getList,
  getGame,
  saveGame,
  removeGame,
  sameJid,
  isSender,
  getBody,
  sendText,
  sendImage,
  reactMsg,
  responder,
  modoAtivo,
  limparInativos
}
