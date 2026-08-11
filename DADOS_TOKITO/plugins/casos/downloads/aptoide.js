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

const scraper = require('../../../scrapers/downloads/aptoide')

module.exports = {
nome: "aptoide",
comandos: ["aptoide"],
categoria: "downloads",
info: {
"descricao": "Executa o comando aptoide.",
"uso": "aptoide",
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
const res = dados?.data || dados?.resultado || dados?.result
if (!dados?.status || !res)
return reply('*❌ | ᴀᴘᴘ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
const nome = res?.name || res?.nome || 'Aplicativo'
const capa = achar(res?.image, res?.icon, res?.thumbnail)
const link = achar(res?.download, res?.url)
const texto = `*📱 | ᴀᴘᴛᴏɪᴅᴇ*\n\n- *📦 | ɴᴏᴍᴇ → ${nome}*\n- *👨‍💻 | ᴅᴇᴠ → ${res?.developer || 'Desconhecido'}*\n- *💾 | ᴛᴀᴍᴀɴʜᴏ → ${res?.size || 'Desconhecido'}*\n- *⬇️ | ᴅᴏᴡɴʟᴏᴀᴅs → ${res?.stats?.downloads || 0}*`
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
if (link)
await tokito.sendMessage(from, {
document: { url: link },
mimetype: 'application/vnd.android.package-archive',
fileName: `${limpar(nome)}.apk`,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
await reagir(from, '✅')
}
catch (e) {
console.log('[APTOIDE]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
