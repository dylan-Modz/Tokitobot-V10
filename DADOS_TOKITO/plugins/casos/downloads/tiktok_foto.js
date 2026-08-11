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

const scraper = require('../../../scrapers/downloads/tiktok_foto')

module.exports = {
nome: "tiktok_foto",
comandos: ["tiktok_foto", "ttfoto"],
categoria: "downloads",
info: {
"descricao": "Executa o comando tiktok_foto.",
"uso": "tiktok_foto",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ᴛɪᴋᴛᴏᴋ ᴄᴏᴍ ғᴏᴛᴏs.*\n\n> ${prefix + command} https://tiktok.com/...`)
await reagir(from, '🖼️')
await reply(mess.wait())
const fotos = await scraper.fotos(q.trim())
for (let i = 0; i < fotos.length; i++) {
await tokito.sendMessage(from, {
image: { url: fotos[i] },
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: i === 0 ? selo : undefined })
}
await reagir(from, '✅')
}
catch (e) {
console.log('[TIKTOK FOTO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
