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
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'shazam',
comandos: ['shazam'],
categoria: 'downloads',
info: {
descricao: 'Reconhece uma música respondendo um áudio, voz ou vídeo.',
uso: 'shazam (responder áudio ou vídeo)',
categoria: 'downloads'
},
async executar(ctx) {
with (ctx) {
try {
const midias = modulos.mediaAtual(ctx)

if (!midias?.audio && !midias?.video)
return reply(mess.shazamUso(prefix))

await reagir(from, '🎛️').catch(() => {})
await reply(mess.shazamAnalisando())

const musica = await modulos.identificarMusica(ctx)

if (!musica?.matched) {
await reagir(from, '❌').catch(() => {})
return reply(mess.shazamNaoEncontrada())
}

const pesquisa = String(
musica.busca ||
[musica.titulo, musica.artista].filter(Boolean).join(' ')
).trim()

const contextInfo = {
...newsletter,
mentionedJid: [sender]
}

const texto = mess.shazamResultado(
musica,
prefix,
isBotoes === true
)

if (isBotoes) {
try {
let header

if (musica.capa) {
const media = await prepareWAMessageMedia(
{
image: {
url: musica.capa
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
text: texto
}),

footer: proto.Message.InteractiveMessage.Footer.create({
text: `🎧 ${NomeDoBot}`
}),

nativeFlowMessage:
proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [
{
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: '🎧﹚𝐀́𝐔𝐃𝐈𝐎﹙🎧',
id: `${prefix}play_audio ${pesquisa}`
})
},
{
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: '🎬﹚𝐕𝐈́𝐃𝐄𝐎﹙🎬',
id: `${prefix}play_video ${pesquisa}`
})
}
]
})
}

if (header)
mensagemInterativa.header = header

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

await reagir(from, '✅').catch(() => {})
return true
}
catch (error) {
console.log(
'[SHAZAM BOTÕES]',
modulos.sanitizarErro(
error,
[API_KEY_TOKITO]
) || 'Erro sem detalhes'
)
}
}

const instrucoes = `${texto}

> 🎧 ׄ ( ᴀ́ᴜᴅɪᴏ: ${prefix}play_audio ${pesquisa} )
> 🎬 ׄ ( ᴠɪ́ᴅᴇᴏ: ${prefix}play_video ${pesquisa} )`

if (musica.capa) {
try {
await tokito.sendMessage(
from,
{
image: {
url: musica.capa
},
caption: instrucoes,
contextInfo
},
{
quoted: selo
}
)
}
catch {
await tokito.sendMessage(
from,
{
text: instrucoes,
contextInfo
},
{
quoted: selo
}
)
}
}
else {
await tokito.sendMessage(
from,
{
text: instrucoes,
contextInfo
},
{
quoted: selo
}
)
}

await reagir(from, '✅').catch(() => {})
return true
}
catch (error) {
await reagir(from, '❌').catch(() => {})

if (error?.code === 'SHAZAM_ARQUIVO_GRANDE')
return reply(mess.shazamMidiaGrande())

if (error?.code === 'SHAZAM_LIMITE')
return reply(
mess.shazamErro(
'Limite temporário do identificador. Tente novamente em instantes.'
)
)

if (
error?.code === 'SHAZAM_TIMEOUT_DOWNLOAD' ||
error?.code === 'SHAZAM_TIMEOUT_RECONHECER'
) {
return reply(
mess.shazamErro(
'O reconhecimento demorou demais. Tente novamente com um trecho menor.'
)
)
}

console.log(
'[SHAZAM]',
modulos.sanitizarErro(
error,
[API_KEY_TOKITO]
) || 'Erro sem detalhes'
)

return reply(
mess.shazamErro()
)
}
}
}
}
)
