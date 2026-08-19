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

const axios = require('axios')

module.exports = {
nome: "playdoc", comandos: ["playdoc"], categoria: "downloads",

info: {
descricao: "Baixa a música em formato de documento.",
uso: "playdoc", categoria: "downloads"
},

async executar(ctx) {
with (ctx) {
try {

if (!q || !q.trim()) {
return reply(
'*❌ | ɪɴsɪʀᴀ ᴏ ɴᴏᴍᴇ ᴏᴜ ʟɪɴᴋ ᴅᴀ ᴍᴜ́sɪᴄᴀ.*'
)
}

await reagir(from, '📄')

const pesquisa = q.trim()

const buscaUrl =
`${API_URL}/api/youtube-search` +
`?query=${encodeURIComponent(pesquisa)}` +
`&apikey=${encodeURIComponent(API_KEY_TOKITO)}`

const response = await axios.get(
buscaUrl,
{
timeout: 20000,
validateStatus: () => true
}
)

if (
response.status !== 200 ||
!response.data?.status ||
!Array.isArray(response.data?.resultado) ||
!response.data.resultado.length
) {
await reagir(from, '❌')

return reply(
'*❌ | ɴᴇɴʜᴜᴍ ʀᴇsᴜʟᴛᴀᴅᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*'
)
}

const res =
response.data.resultado.find(
item =>
item?.type === 'video' &&
(item?.url || item?.videoId)
) ||
response.data.resultado[0]

if (!res) {
await reagir(from, '❌')

return reply(
'*❌ | ɴᴇɴʜᴜᴍ ᴠɪ́ᴅᴇᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*'
)
}

const titulo = String(
res?.title ||
'YouTube'
)

const canal = String(
res?.author?.name ||
'ɴᴀ̃ᴏ ɪɴғᴏʀᴍᴀᴅᴏ'
)

const duracao = String(
res?.timestamp ||
res?.duration?.timestamp ||
'0:00'
)

const viewsTexto = String(
res?.views ||
'0'
)

const viewsNumeros =
viewsTexto.replace(/[^\d]/g, '')

const views =
viewsNumeros
? Number(viewsNumeros).toLocaleString('pt-BR')
: '0'

const thumbnail =
res?.image ||
res?.thumbnail ||
(
res?.videoId
? `https://i.ytimg.com/vi/${res.videoId}/hq720.jpg`
: null
)

const url = String(
res?.url ||
(
res?.videoId
? `https://www.youtube.com/watch?v=${res.videoId}`
: ''
)
)

if (!url) {
await reagir(from, '❌')

return reply(
'*❌ | ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴏʙᴛᴇʀ ᴏ ʟɪɴᴋ ᴅᴏ ᴠɪ́ᴅᴇᴏ.*'
)
}

const nomeArquivo =
titulo
.replace(/[\\/:*?"<>|]/g, '')
.trim()
.slice(0, 100) || 'musica'

const audioApi =
`${API_URL}/api/youtube-audio` +
`?q=${encodeURIComponent(url)}` +
`&apikey=${encodeURIComponent(API_KEY_TOKITO)}`

const numeroUsuario =
sender.split('@')[0]

const contextInfo = {
...newsletter,
mentionedJid: [sender]
}

const texto = `⏤͟͟͞͞𝐌𝐮́𝐬𝐢𝐜𝐚 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐝𝐚! 𖤐⃝🎧
•
> ╭ ℹ️ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒
> *[✏️]* • *𝚝𝚒́𝚝𝚞𝚕𝚘:* *${titulo}*
> *[⏱️]* • *ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ:* ${duracao}
> *[👥]* • *ᴠɪᴇᴡs:* ${views}
> *[👨‍🎤]* • *ᴀᴜᴛᴏʀ:* ${canal}
> *[🔗]* • *ʟɪɴᴋ:* ${url}
•
> *[📄]* • *𝙴𝚗𝚟𝚒𝚊𝚗𝚍𝚘 𝚘 𝚜𝚎𝚞 𝚍𝚘𝚌𝚞𝚖𝚎𝚗𝚝𝚘* _@${numeroUsuario}_`

if (thumbnail) {

await tokito.sendMessage(
from,
{
image: {
url: thumbnail
},
caption: texto,
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
text: texto,
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
document: {
url: audioApi
},
mimetype: 'audio/mpeg',
fileName: `${nomeArquivo}.mp3`,
contextInfo
},
{
quoted: selo
}
)

await reagir(from, '✅')

} catch (e) {

console.log(
'[PLAYDOC ERRO]',
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