/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

const CAMADAS = ['ephemeralMessage', 'viewOnceMessage', 'viewOnceMessageV2',
  'viewOnceMessageV2Extension', 'documentWithCaptionMessage', 'editedMessage']

const desenrolar = entrada => {
  let msg = entrada?.message || entrada || {}
  for (let i = 0; i < 12; i++) {
    const camada = CAMADAS.find(c => msg?.[c]?.message)
    if (!camada) break
    msg = msg[camada].message
  }
  return msg
}

const pegarContexto = entrada => {
  let msg = entrada?.message || entrada || {}
  for (let i = 0; i < 12; i++) {
    const contexto = msg?.extendedTextMessage?.contextInfo ||
      msg?.imageMessage?.contextInfo || msg?.videoMessage?.contextInfo ||
      msg?.audioMessage?.contextInfo || msg?.documentMessage?.contextInfo ||
      msg?.stickerMessage?.contextInfo
    if (contexto) return contexto
    const camada = CAMADAS.find(c => msg?.[c]?.message)
    if (!camada) break
    msg = msg[camada].message
  }
  return null
}

const possuiArquivo = media => Boolean(
  media?.mediaKey && (media?.url || media?.directPath)
)

const bufferMidia = async (ctx, media, tipo) => {
if (typeof ctx.getFileBuffer !== 'function')
throw new Error('getFileBuffer não está disponível.')

const buffer = await ctx.getFileBuffer(media, tipo)

if (!Buffer.isBuffer(buffer) || !buffer.length)
throw new Error('Não foi possível baixar a mídia.')

return buffer
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'open',
comandos: ['open', 'revelar'],
categoria: 'admin',

info: {
descricao: 'Reenvia mídia respondida, inclusive visualização única quando o arquivo foi recebido pela Stone.',
uso: 'open respondendo uma mídia',
permissao: 'ADM',
categoria: 'admin'
},

async executar(ctx) {
with (ctx) {
try {
if (!isGroup)
return reply(mess.sogrupo())

if (!isGroupAdmins)
return reply(mess.soadm())

await reagir(from, '👁️').catch(() => {})

const contexto = ctxMsg?.quotedMessage ? ctxMsg : pegarContexto(info)
const marcada = contexto?.quotedMessage || null
const origem = marcada || (contexto?.stanzaId ? null : info?.message)

if (!origem) {
await reagir(from, '❌').catch(() => {})
return reply(`- 👁️ \`𝙾𝙿𝙴𝙽\`

> *『 ${prefix + command} 』— ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ, ᴠɪ́ᴅᴇᴏ ᴏᴜ ᴀ́ᴜᴅɪᴏ.*`)
}

const msg = desenrolar(origem)
const usandoMarcada = Boolean(marcada)
const media = msg?.imageMessage || msg?.videoMessage || msg?.ptvMessage || msg?.audioMessage
if (media && !possuiArquivo(media)) {
  await reagir(from, '🔒').catch(() => {})
  return reply('A mídia foi recebida sem a chave ou o caminho do arquivo. Não foi possível baixar.')
}

if (msg?.imageMessage) {
const media = msg.imageMessage
const buffer = await bufferMidia(ctx, media, 'image')
const caption = usandoMarcada ? String(media.caption || '').trim() : ''

await tokito.sendMessage(from, {
image: buffer,
caption,
mimetype: media.mimetype || 'image/jpeg',
contextInfo: canalInfo([sender])
}, { quoted: selo })

await reagir(from, '✅')
return
}

if (msg?.videoMessage || msg?.ptvMessage) {
const media = msg.videoMessage || msg.ptvMessage
const buffer = await bufferMidia(ctx, media, 'video')
const caption = usandoMarcada ? String(media.caption || '').trim() : ''

await tokito.sendMessage(from, {
video: buffer,
caption,
mimetype: media.mimetype || 'video/mp4',
gifPlayback: Boolean(media.gifPlayback),
contextInfo: canalInfo([sender])
}, { quoted: selo })

await reagir(from, '✅')
return
}

if (msg?.audioMessage) {
const media = msg.audioMessage
const buffer = await bufferMidia(ctx, media, 'audio')
const mimetype = String(media.mimetype || 'audio/ogg; codecs=opus').trim()

await tokito.sendPresenceUpdate('recording', from).catch(() => {})

try {
await tokito.sendMessage(from, {
audio: buffer,
mimetype,
ptt: false,
contextInfo: canalInfo([sender])
}, { quoted: selo })
} finally {
await tokito.sendPresenceUpdate('paused', from).catch(() => {})
}

await reagir(from, '✅')
return
}

await reagir(from, '❌').catch(() => {})

return reply(`- 👁️ \`𝙾𝙿𝙴𝙽\`

> *『 ❌ 』— ᴀ ᴍᴇɴsᴀɢᴇᴍ ᴍᴀʀᴄᴀᴅᴀ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ɪᴍᴀɢᴇᴍ, ᴠɪ́ᴅᴇᴏ ᴏᴜ ᴀ́ᴜᴅɪᴏ ᴄᴏᴍᴘᴀᴛɪ́ᴠᴇʟ.*`)

} catch (error) {
console.log('[OPEN/REVELAR]', error?.stack || error?.message || error)
await reagir(from, '❌').catch(() => {})

return reply(mess.padraoErro({
titulo: 'ERRO NO OPEN',
descricao: 'Não foi possível baixar ou reenviar a mídia. Confira se o arquivo ainda está disponível.'
}))
}
}
}
}
)
