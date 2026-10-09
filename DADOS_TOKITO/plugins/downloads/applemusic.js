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

const scraper = require('../../scrapers/downloads/applemusic')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "applemusic", comandos: ["applemusic", "am"], categoria: "downloads",

info: {
descricao: "Executa o comando applemusic.", uso: "applemusic", categoria: "downloads"
},

async executar(ctx) {
with (ctx) {
try {
if (!q || !q.trim()) return reply(mess.downloadUso({ tipo: 'MÚSICA', prefix, command, exemplo: 'vem ca' }))

await reagir(from, '🍎')

const dados = await scraper.buscar(q.trim())
const res = dados?.resultado || dados?.result || dados?.data

if (!res) return reply(mess.downloadNaoEncontrado('MÚSICA'))

const titulo = String(res?.titulo || 'Apple Music')
const artista = String(res?.artista || 'Desconhecido')
const album = String(res?.album || 'Desconhecido')
const genero = String(res?.genero || 'Não informado')
const duracao = String(res?.duracao || 'Não informado')
const lancamento = String(res?.lancamento || 'Não informado')
const explicit = String(res?.explicit || 'Não')
const pais = String(res?.pais || 'Não informado')
const preco = String(res?.preco || 'Não informado')
const appleLink = String(res?.link || '')
const capa = res?.capa || null

const audio = typeof res?.audio === 'string'
? res.audio
: res?.audio?.url || res?.download || res?.download_url || res?.downloadUrl || null

if (!audio || !/^https?:\/\//i.test(audio)) return reply(mess.downloadSemMidia('ÁUDIO'))

const numeroUsuario = sender.split('@')[0]
const contextInfo = { ...newsletter, mentionedJid: [sender] }

const texto = `• \`𝙼𝚄́𝚂𝙸𝙲𝙰 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰\` 🍎
> ℹ️ \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂\`
> ✏️ ᴛɪ́ᴛᴜʟᴏ: ${titulo}
> 👨‍🎤 ᴀʀᴛɪsᴛᴀ: ${artista}
> 💿 ᴀ́ʟʙᴜᴍ: ${album}
> 🎼 ɢᴇ̂ɴᴇʀᴏ: ${genero}
> ⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ${duracao}
> 📆 ʟᴀɴᴄ̧ᴀᴍᴇɴᴛᴏ: ${lancamento}
> 🔞 ᴇxᴘʟɪ́ᴄɪᴛᴏ: ${explicit}
> 🌎 ᴘᴀɪ́s: ${pais}
> 💰 ᴘʀᴇᴄ̧ᴏ: ${preco}
> 🔗 ʟɪɴᴋ: ${appleLink}
> 🎼 ᴇɴᴠɪᴀɴᴅᴏ ᴏ sᴇᴜ ᴀ́ᴜᴅɪᴏ para @${numeroUsuario}`

if (capa) {
await tokito.sendMessage(from, {
image: { url: capa }, caption: texto, contextInfo
}, { quoted: selo })
} else {
await tokito.sendMessage(from, { text: texto, contextInfo }, { quoted: selo })
}

await tokito.sendMessage(from, {
audio: { url: audio }, mimetype: 'audio/mpeg', ptt: false,
fileName: `${limpar(titulo)}.mp3`, contextInfo
}, { quoted: selo })

await reagir(from, '✅')

} catch (e) {
console.log('[APPLE MUSIC]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {})
await reply(mess.erroApi(API_URL))
}
}
}
}
)
