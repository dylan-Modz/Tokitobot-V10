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

const scraper = require('../../../scrapers/downloads/gitclone')

module.exports = {
nome: "gitclone",
comandos: ["gitclone"],
categoria: "downloads",
info: {
"descricao": "Executa o comando gitclone.",
"uso": "gitclone",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ɢɪᴛʜᴜʙ.*\n\n> ${prefix + command} https://github.com/usuario/repositorio`)
await reagir(from, '📦')
await reply(mess.wait())
const dados = await scraper.buscar(q.trim())
const res = dados?.data || dados?.resultado || dados?.result
if (!dados?.status || !res)
return reply('*❌ | ʀᴇᴘᴏsɪᴛᴏʀɪᴏ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
const nome = limpar(res?.name || 'repositorio')
const capa = achar(res?.image, res?.thumbnail)
const texto = `*📦 | ɢɪᴛᴄʟᴏɴᴇ*\n\n- *📌 | ɴᴏᴍᴇ → ${nome}*\n- *👨‍💻 | ᴄʀɪᴀᴅᴏʀ → ${res?.creator || 'Desconhecido'}*\n- *💻 | ʟɪɴɢᴜᴀɢᴇᴍ → ${res?.language || 'Desconhecida'}*\n- *⭐ | sᴛᴀʀs → ${res?.stargazers || 0}*`
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
if (res?.download)
await tokito.sendMessage(from, {
document: { url: res.download },
mimetype: 'application/zip',
fileName: `${nome}.zip`,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
await reagir(from, '✅')
}
catch (e) {
console.log('[GITCLONE]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
