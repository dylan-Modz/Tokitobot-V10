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

const scraper = require('../../../scrapers/downloads/play')

module.exports = {
nome: "play",
comandos: ["play", "ytplay"],
categoria: "downloads",

info: {
descricao: "Executa o comando play.",
uso: "play",
categoria: "downloads"
},

async executar(ctx) {
with (ctx) {
try {
if (!q || !q.trim()) {
return reply(
`*❌ | ᴘᴏʀ ғᴀᴠᴏʀ, ɪɴsɪʀᴀ ᴏ ɴᴏᴍᴇ ᴅᴀ ᴍᴜsɪᴄᴀ.*

*📌 | ᴇxᴇᴍᴘʟᴏ:*
> ${prefix + command} ᴠᴇᴍ ᴄᴀ`
)
}

await reagir(from, '🎧')

const contextInfo = {
...newsletter,
mentionedJid: [sender]
}

const pesquisa = q.trim()
const data = await scraper.buscar(pesquisa)

if (!data?.status || !data?.resultado) {
await reagir(from, '❌')

return reply(
'*❌ | ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴇɪ ɴᴇɴʜᴜᴍ ᴀᴜᴅɪᴏ.*'
)
}

const res = data.resultado

const title = String(
res?.title ||
res?.titulo ||
'ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ'
)

const canal = String(
res?.canal ||
res?.channel ||
res?.author ||
res?.autor ||
'ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ'
)

const duration = String(
res?.duration ||
res?.duracao ||
'0:00'
)

const views = String(
res?.views_formatado ||
res?.views ||
res?.visualizacoes ||
'ɴᴀᴏ ɪɴғᴏʀᴍᴀᴅᴏ'
)

const descricao = String(
res?.description ||
res?.descricao ||
res?.desc ||
'sᴇᴍ ᴅᴇsᴄʀɪᴄ̧ᴀ̃ᴏ.'
)

const postado = String(
res?.uploaded ||
res?.uploaded_at ||
res?.uploadDate ||
res?.upload_date ||
res?.published ||
res?.ago ||
'ɴᴀᴏ ɪɴғᴏʀᴍᴀᴅᴏ'
)

const thumbnail =
res?.image ||
res?.thumbnail ||
res?.thumb ||
null

const url = String(
res?.url ||
res?.link ||
pesquisa
)

const download =
typeof res?.download === 'string'
? res.download
: res?.download?.url ||
res?.download?.link ||
res?.audio ||
res?.audio_url ||
res?.download_url ||
null

const nomeArquivo = String(
res?.filename || `${title}.mp3`
)
.replace(/[\\/:*?"<>|]/g, '')
.slice(0, 100)

if (!download) {
await reagir(from, '❌')

return reply(
'*❌ | ᴀ ᴀᴘɪ ɴᴀᴏ ʀᴇᴛᴏʀɴᴏᴜ ᴏ ʟɪɴᴋ ᴅᴏ ᴀᴜᴅɪᴏ.*'
)
}

const numeroUsuario = sender.split('@')[0]

const texto = `⏤͟͟͞͞𝐌𝐮́𝐬𝐢𝐜𝐚 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐝𝐚! 𖤐⃝🎧
•
> ╭ ℹ️ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒
> *[✏️]* • *𝚝𝚒́𝚝𝚞𝚕𝚘:* *${title}*
> *[⏱️]* • *ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ:* ${duration}
> *[👥]* • *ᴠɪᴇᴡs:* ${views}
> *[👨‍🎤]* • *ᴀᴜᴛᴏʀ:* ${canal}
> *[🔗]* • *ʟɪɴᴋ:* ${url}
•`

const enviandoAudio =
`> *[🎼]* • *𝙴𝚗𝚟𝚒𝚊𝚗𝚍𝚘 𝚘 𝚜𝚎𝚞 𝚊́𝚞𝚍𝚒𝚘* _@${numeroUsuario}_`

if (isBotoes) {
try {
let header

if (thumbnail) {
const media = await prepareWAMessageMedia(
{
image: {
url: thumbnail
}
},
{
upload: tokito.waUploadToServer
}
)

header = proto.Message.InteractiveMessage.Header.create({
hasMediaAttachment: true,
imageMessage: media.imageMessage
})
}

const mensagemInterativa = {
contextInfo,

body: proto.Message.InteractiveMessage.Body.create({
text: `${texto}

> *[🎼]* • *𝙴𝚜𝚌𝚘𝚕𝚑𝚊 𝚌𝚘𝚖𝚘 𝚍𝚎𝚜𝚎𝚓𝚊 𝚋𝚊𝚒𝚡𝚊𝚛*`
}),

footer: proto.Message.InteractiveMessage.Footer.create({
text: ``
}),

nativeFlowMessage:
proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [
{
name: 'quick_reply',

buttonParamsJson: JSON.stringify({
display_text: '🎧﹚𝐀́𝐔𝐃𝐈𝐎﹙🎧',
id: `${prefix}play_audio ${url}`
})
},

{
name: 'quick_reply',

buttonParamsJson: JSON.stringify({
display_text: '🎬﹚𝐕𝐈́𝐃𝐄𝐎﹙🎬',
id: `${prefix}play_video ${url}`
})
},

{
name: 'quick_reply',

buttonParamsJson: JSON.stringify({
display_text: '📄﹚𝐃𝐎𝐂𝐔𝐌𝐄𝐍𝐓𝐎﹙📄',
id: `${prefix}playdoc ${url}`
})
}
]
})
}

if (header) {
mensagemInterativa.header = header
}

const msg = generateWAMessageFromContent(
from,
{
interactiveMessage:
proto.Message.InteractiveMessage.create(
mensagemInterativa
)
},
{
quoted: selo,
userJid: tokito.user.id
}
)

await tokito.relayMessage(
from,
msg.message,
{
messageId: msg.key.id
}
)

await reagir(from, '✅')

return
} catch (e) {
console.log(
'[PLAY BOTÕES]',
modulos.sanitizarErro(
e,
[API_KEY_TOKITO]
)
)
}
}

if (thumbnail) {
await tokito.sendMessage(
from,
{
image: {
url: thumbnail
},

caption: `${texto}

${enviandoAudio}`,

contextInfo
},
{
quoted: selo
}
)
} else {
await tokito.sendMessage(
from,
{
text: `${texto}

${enviandoAudio}`,

contextInfo
},
{
quoted: selo
}
)
}

await tokito.sendMessage(
from,
{
audio: {
url: download
},

mimetype: 'audio/mpeg',
ptt: false,
fileName: nomeArquivo,
contextInfo
},
{
quoted: selo
}
)

await reagir(from, '✅')
} catch (e) {
console.log(
'[PLAY ERRO]',
modulos.sanitizarErro(
e,
[API_KEY_TOKITO]
)
)

await reagir(from, '❌').catch(() => {})

await reply(
mess.erroApi(API_URL)
)
}
}
}
}
