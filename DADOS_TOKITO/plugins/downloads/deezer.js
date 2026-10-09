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

const scraper = require('../../scrapers/downloads/deezer')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "deezer", comandos: ["deezer", "dplay"], categoria: "downloads",

info: {
descricao: "Executa o comando deezer.", uso: "deezer", categoria: "downloads"
},

async executar(ctx) {
with (ctx) {
try {
if (!q || !q.trim()) return reply(mess.downloadUso({ tipo: 'MÚSICA', prefix, command, exemplo: 'mc poze' }))

await reagir(from, '🎧')

const dados = await scraper.buscar(q.trim())
const res = dados?.resultado || dados?.result || dados?.data

if (!res) return reply(mess.downloadNaoEncontrado('MÚSICA'))

const titulo = String(res?.tituloCompleto || res?.titulo || 'Deezer')
const artista = String(res?.artista || 'Desconhecido')
const album = String(res?.album || 'Desconhecido')
const duracao = String(res?.duracao || '0:00')
const rank = String(res?.rank || 'Não informado')
const capa = res?.capa || null
const deezerLink = String(res?.link || '')

const audio = typeof res?.audio === 'string'
? res.audio
: res?.audio?.url || res?.download || res?.download_url || res?.downloadUrl || null

if (!audio || !/^https?:\/\//i.test(audio)) return reply(mess.downloadSemMidia('ÁUDIO'))

const numeroUsuario = sender.split('@')[0]
const contextInfo = { ...newsletter, mentionedJid: [sender] }

const texto = `• \`𝙼𝚄́𝚂𝙸𝙲𝙰 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰\` 🎧
> ℹ️ \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂\`
> ✏️ ᴛɪ́ᴛᴜʟᴏ: ${titulo}
> 👨‍🎤 ᴀʀᴛɪsᴛᴀ: ${artista}
> 💿 ᴀ́ʟʙᴜᴍ: ${album}
> ⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ${duracao}
> 🔥 ʀᴀɴᴋ: ${rank}
> 🔗 ʟɪɴᴋ: ${deezerLink}
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
console.log('[DEEZER]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {})
await reply(mess.erroApi(API_URL))
}
}
}
}
)
