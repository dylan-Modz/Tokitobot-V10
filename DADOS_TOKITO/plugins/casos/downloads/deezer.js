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

const scraper = require('../../../scrapers/downloads/deezer')

module.exports = {
nome: "deezer",
comandos: ["deezer", "dplay"],
categoria: "downloads",
info: {
"descricao": "Executa o comando deezer.",
"uso": "deezer",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(`*❌ | ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴅᴀ ᴍᴜsɪᴄᴀ.*\n\n> ${prefix + command} ᴍᴄ ᴘᴏᴢᴇ`)
await reagir(from, '🎧')
const dados = await scraper.buscar(q.trim())
const res = dados?.resultado || dados?.result || dados?.data
if (!res)
return reply('*❌ | ᴍᴜsɪᴄᴀ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ.*')
const titulo = res?.tituloCompleto || res?.titulo || res?.titleFull || res?.title || 'Deezer'
const artista = res?.artista || res?.artist || 'Desconhecido'
const album = res?.album || 'Desconhecido'
const capa = achar(res?.capa, res?.thumbnail, res?.image)
const link = achar(res?.preview, res?.download_url, res?.downloadUrl, res?.audio)
if (!link)
return reply('*❌ | ᴀ ᴀᴘɪ ɴᴀᴏ ʀᴇᴛᴏʀɴᴏᴜ ᴏ ᴀᴜᴅɪᴏ.*')
const texto = `*🎧 | ᴅᴇᴇᴢᴇʀ*\n\n- *🎶 | ᴛɪᴛᴜʟᴏ → ${titulo}*\n- *🎤 | ᴀʀᴛɪsᴛᴀ → ${artista}*\n- *💿 | ᴀʟʙᴜᴍ → ${album}*`
if (capa)
await tokito.sendMessage(from, {
image: { url: capa },
caption: texto,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
else
await reply(texto)
await tokito.sendMessage(from, {
audio: { url: link },
mimetype: 'audio/mpeg',
fileName: `${limpar(titulo)}.mp3`,
ptt: false,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
await reagir(from, '✅')
}
catch (e) {
console.log('[DEEZER]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
