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
nome: "delvip",
comandos: ["delvip"],
categoria: "vip",
info: {
"descricao": "Executa o comando delvip.",
"uso": "delvip",
"categoria": "vip"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(mess.onlyOwner())
let alvo = menc_os2 || String(q || '').replace(/\D/g, '')
if (Array.isArray(alvo))
alvo = alvo[0]
alvo = normalizar(alvo)
if (!String(alvo).includes('@'))
alvo = `${String(alvo).replace(/\D/g, '')}@s.whatsapp.net`
if (!alvo || alvo === '@s.whatsapp.net')
return reply(`*❌ | ᴍᴀʀǫᴜᴇ ᴏ ᴜsᴜᴀʀɪᴏ ᴏᴜ ᴅɪɢɪᴛᴇ ᴏ ɴᴜᴍᴇʀᴏ.*\n\n> ${prefix + command} @usuario`)
const indiceVip = vip.map(i => i.id).indexOf(alvo)
if (indiceVip < 0)
return reply('*❌ | ᴇssᴇ ᴜsᴜᴀʀɪᴏ ɴᴀᴏ ᴇsᴛᴀ ɴᴀ ʟɪsᴛᴀ ᴠɪᴘ.*')
vip.splice(indiceVip, 1)
fs.writeFileSync(caminhoVip, JSON.stringify(vip, null, 2))
await tokito.sendMessage(from, {
text: `*✅ | @${alvo.split('@')[0]} ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ ᴅᴀ ʟɪsᴛᴀ ᴠɪᴘ ᴄᴏᴍ sᴜᴄᴇssᴏ!*`,
contextInfo: {
...newsletter,
mentionedJid: [alvo]
}
}, { quoted: selo })
}
}
}
}
