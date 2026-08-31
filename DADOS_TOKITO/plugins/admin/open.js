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

const pegarContexto = info => {
const m = info?.message || {}

return m?.extendedTextMessage?.contextInfo ||
m?.imageMessage?.contextInfo ||
m?.videoMessage?.contextInfo ||
m?.audioMessage?.contextInfo ||
m?.documentMessage?.contextInfo ||
m?.stickerMessage?.contextInfo || null
}

const pegarMarcada = info => pegarContexto(info)?.quotedMessage || null

const temViewOnce = msg => {
if (!msg)
return false

if (
msg?.viewOnceMessage?.message ||
msg?.viewOnceMessageV2?.message ||
msg?.viewOnceMessageV2Extension?.message
)
return true

if (msg?.ephemeralMessage?.message)
return temViewOnce(msg.ephemeralMessage.message)

if (msg?.documentWithCaptionMessage?.message)
return temViewOnce(msg.documentWithCaptionMessage.message)

return false
}

const desenrolar = msg => {
let m = msg || {}

for (let i = 0; i < 5; i++) {
if (m?.ephemeralMessage?.message) {
m = m.ephemeralMessage.message
continue
}

if (m?.documentWithCaptionMessage?.message) {
m = m.documentWithCaptionMessage.message
continue
}

break
}

return m
}

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
descricao: 'Reenvia imagem, vídeo ou áudio normal respondido pelo administrador.',
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

await reagir(from, '👁️')

const marcada = pegarMarcada(info)
const origem = marcada || info?.message

if (!origem) {
await reagir(from, '❌').catch(() => {})
return reply(`- 👁️ \`𝙾𝙿𝙴𝙽\`

> *『 ${prefix + command} 』— ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ, ᴠɪ́ᴅᴇᴏ ᴏᴜ ᴀ́ᴜᴅɪᴏ.*`)
}

if (temViewOnce(origem)) {
await reagir(from, '🔒').catch(() => {})
return reply(`- 🔒 \`𝚅𝙸𝚂𝚄𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾 𝚄́𝙽𝙸𝙲𝙰\`

> *『 👁️ 』— ᴇssᴀ ᴍɪ́ᴅɪᴀ ғᴏɪ ᴇɴᴠɪᴀᴅᴀ ᴄᴏᴍᴏ ᴠɪsᴜᴀʟɪᴢᴀᴄ̧ᴀ̃ᴏ ᴜ́ɴɪᴄᴀ ᴇ ɴᴀ̃ᴏ ᴘᴏᴅᴇ sᴇʀ ʀᴇᴘᴜʙʟɪᴄᴀᴅᴀ ᴘᴇʟᴏ ʙᴏᴛ.*`)
}

const msg = desenrolar(origem)
const usandoMarcada = Boolean(marcada)

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

if (msg?.videoMessage) {
const media = msg.videoMessage
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
descricao: 'Não foi possível processar essa mídia.'
}))
}
}
}
}
)
