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

const scraper = require('../../../scrapers/downloads/happymod')

module.exports = {
nome: "happymod",
comandos: ["happymod"],
categoria: "downloads",
info: {
"descricao": "Executa o comando happymod.",
"uso": "happymod",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(`*❌ | ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴅᴏ ᴀᴘᴘ.*\n\n> ${prefix + command} ᴡʜᴀᴛsᴀᴘᴘ`)
await reagir(from, '📱')
await reply(mess.wait())
const dados = await scraper.buscar(q.trim())
const lista = itens(dados).slice(0, 5)
if (!lista.length)
return reply('*❌ | ɴᴇɴʜᴜᴍ ᴀᴘᴘ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
let texto = `*📱 | ʜᴀᴘᴘʏᴍᴏᴅ*\n\n- *🔎 | ʙᴜsᴄᴀ → ${q.trim()}*\n\n`
for (let i = 0; i < lista.length; i++) {
const item = lista[i]
texto += `*${i + 1}. ${item?.title || item?.nome || 'Aplicativo'}*\n- *🧩 | ᴠᴇʀsᴀᴏ → ${item?.version || 'Indisponível'}*\n- *💾 | ᴛᴀᴍᴀɴʜᴏ → ${item?.size || 'Indisponível'}*\n- *🔗 | ʟɪɴᴋ → ${item?.url || item?.link || 'Indisponível'}*\n\n`
}
await reply(texto)
await reagir(from, '✅')
}
catch (e) {
console.log('[HAPPYMOD]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
