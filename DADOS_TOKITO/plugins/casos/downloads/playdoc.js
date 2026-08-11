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

const scraper = require('../../../scrapers/downloads/playdoc')

module.exports = {
nome: "playdoc",
comandos: ["playdoc"],
categoria: "downloads",
info: {
"descricao": "Executa o comando playdoc.",
"uso": "playdoc",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(`*❌ | ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴏᴜ ʟɪɴᴋ ᴅᴀ ᴍᴜsɪᴄᴀ.*\n\n*📌 | ᴇxᴇᴍᴘʟᴏ:*\n> ${prefix + command} ᴠᴇᴍ ᴄᴀ`)
await reagir(from, '📄')
await reply(mess.wait())
const busca = q.trim()
let link = busca
if (!/^https?:\/\//i.test(busca)) {
const dados = await scraper.buscar(busca)
const lista = itens(dados)
if (!lista.length)
return reply('*❌ | ɴᴇɴʜᴜᴍ ʀᴇsᴜʟᴛᴀᴅᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
link = lista[0]?.url || lista[0]?.link || busca
}
await tokito.sendMessage(from, {
document: { url: scraper.url(link) },
mimetype: 'audio/mpeg',
fileName: `${limpar(busca)}.mp3`,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
await reagir(from, '✅')
}
catch (e) {
console.log('[PLAYDOC]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
