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

module.exports = {
nome: "limparvip",
comandos: ["limparvip", "clearvip", "resetvip"],
categoria: "vip",
info: {
"descricao": "Executa o comando limparvip.",
"uso": "limparvip",
"categoria": "vip"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(mess.onlyOwner())
if (!vip.length)
return reply('*❌ | ᴀ ʟɪsᴛᴀ ᴠɪᴘ ᴊᴀ ᴇsᴛᴀ ᴠᴀᴢɪᴀ.*')
const totalVip = vip.length
vip.splice(0, vip.length)
fs.writeFileSync(caminhoVip, JSON.stringify(vip, null, 2))
await tokito.sendMessage(from, {
text: `*✅ | @${sender.split('@')[0]} ʟɪᴍᴘᴏᴜ ᴛᴏᴅᴀ ᴀ ʟɪsᴛᴀ ᴠɪᴘ!*\n\n*📊 | ᴛᴏᴛᴀʟ ʀᴇᴍᴏᴠɪᴅᴏ: ${totalVip} ᴜsᴜᴀʀɪᴏ${totalVip !== 1 ? 's' : ''}.*`,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
}
}
}
}
