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

const scraper = require('../../../scrapers/downloads/mediafire')

module.exports = {
nome: "mediafire",
comandos: ["mediafire", "mf"],
categoria: "downloads",
info: {
"descricao": "Executa o comando mediafire.",
"uso": "mediafire",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ᴍᴇᴅɪᴀғɪʀᴇ.*\n\n> ${prefix + command} https://www.mediafire.com/file/...`)
await reagir(from, '📦')
await reply(mess.wait())
const res = await scraper.buscar(q.trim())
if (!res?.status || !res?.download)
return reply(res?.resultado || '*❌ | ᴀʀǫᴜɪᴠᴏ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
const nome = limpar(res?.filename || decodeURIComponent(String(res.download).split('/').pop().split('?')[0]))
await reply(`*📦 | ᴍᴇᴅɪᴀғɪʀᴇ*\n\n- *📁 | ɴᴏᴍᴇ → ${nome}*\n- *📦 | ᴛᴀᴍᴀɴʜᴏ → ${res?.filesize || 'Desconhecido'}*`)
await tokito.sendMessage(from, {
document: { url: res.download },
mimetype: res?.mimetype || 'application/octet-stream',
fileName: nome,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
await reagir(from, '✅')
}
catch (e) {
console.log('[MEDIAFIRE]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
