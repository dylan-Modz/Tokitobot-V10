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

const axios = require('axios')

module.exports = {
nome: "playvideo", comandos: ["playvideo", "play-video", "ytvideo", "ytmp4", "play_video"], categoria: "downloads",

info: {
descricao: "Executa o comando playvideo.", uso: "playvideo", categoria: "downloads"
},

async executar(ctx) {
with (ctx) {
try {
if (!q || !q.trim()) return reply(`*❌ | ɪɴsɪʀᴀ ᴏ ɴᴏᴍᴇ ᴏᴜ ʟɪɴᴋ ᴅᴏ ᴠɪᴅᴇᴏ.*

*📌 | ᴇxᴇᴍᴘʟᴏ:*
> ${prefix + command} ᴠᴇᴍ ᴄᴀ`)

await reagir(from, '🎥')

const pesquisa = q.trim()
const contextInfo = { ...newsletter, mentionedJid: [sender] }

const buscaUrl = `${API_URL}/api/youtube-search?query=${encodeURIComponent(pesquisa)}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`

const { data } = await axios.get(buscaUrl, {
timeout: 20000,
validateStatus: () => true
})

if (!data?.status || !Array.isArray(data?.resultado) || !data.resultado.length) {
await reagir(from, '❌')
return reply('*❌ | ɴᴇɴʜᴜᴍ ᴠɪᴅᴇᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
}

const res = data.resultado.find(v => v?.type === 'video' && v?.url) || data.resultado[0]

if (!res?.url) {
await reagir(from, '❌')
return reply('*❌ | ɴᴀᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴘᴇɢᴀʀ ᴏ ʟɪɴᴋ ᴅᴏ ᴠɪᴅᴇᴏ.*')
}

const titulo = String(res?.title || 'YouTube')
const canal = String(res?.author?.name || 'Não informado')
const duracao = String(res?.timestamp || res?.duration?.timestamp || '0:00')
const views = Number(res?.views || 0).toLocaleString('pt-BR')
const url = String(res.url)

const videoApi = `${API_URL}/api/youtube-video?q=${encodeURIComponent(url)}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`

const texto = `⏤͟͟͞͞𝐕𝐢́𝐝𝐞𝐨 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐝𝐨! 𖤐⃝🎥
•
> ╭ ℹ️ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒
> *[✏️]* • *𝚝𝚒́𝚝𝚞𝚕𝚘:* *${titulo}*
> *[👨‍🎤]* • *ᴀᴜᴛᴏʀ:* ${canal}
> *[⏱️]* • *ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ:* ${duracao}
> *[👥]* • *ᴠɪᴇᴡs:* ${views}
> *[🔗]* • *ʟɪɴᴋ:* ${url}
•
> *[🎬]* • *𝙴𝚗𝚟𝚒𝚊𝚗𝚍𝚘 𝚘 𝚜𝚎𝚞 𝚟𝚒́𝚍𝚎𝚘* _@${sender.split('@')[0]}_`

await tokito.sendMessage(from, {
video: { url: videoApi },
mimetype: 'video/mp4',
fileName: 'video.mp4',
caption: texto,
contextInfo
}, { quoted: selo })

await reagir(from, '✅')

} catch (e) {
console.log('[PLAY VIDEO ERRO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {})
await reply(mess.erroApi(API_URL))
}
}
}
}