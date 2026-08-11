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
nome: "viplist",
comandos: ["viplist", "listavip"],
categoria: "vip",
info: {
"descricao": "Executa o comando viplist.",
"uso": "viplist",
"categoria": "vip"
},
async executar(ctx) {
with (ctx) {
{
if (!vip.length)
return reply('*📋 | ᴇxɪsᴛᴇᴍ 0 ᴜsᴜᴀʀɪᴏs ᴠɪᴘ.*')
const mentionsVip = vip.map(v => v.id)
const listaVip = vip.map((v, index) => {
let expiracao = '*ᴠɪᴘ ɪɴғɪɴɪᴛᴏ*'
if (v.infinito !== true) {
const diasRestantes = v.expiraEm
? Math.max(0, Math.ceil((new Date(v.expiraEm).getTime() - Date.now()) / 86400000))
: Number(v.dias || 0)
const dataExpira = v.expiraEm
? new Date(v.expiraEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
: 'ɴᴀᴏ ɪɴғᴏʀᴍᴀᴅᴀ'
expiracao = `*${diasRestantes} ᴅɪᴀ${diasRestantes !== 1 ? 's' : ''}*\n• ᴅᴀᴛᴀ: ${dataExpira}`
}
return `*[${index + 1}]* - @${v.id.split('@')[0]}\n• ᴇxᴘɪʀᴀᴄᴀᴏ: ${expiracao}`
}).join('\n––\n')
await tokito.sendMessage(from, {
text: `*[ᴛᴏᴛᴀʟ: ${vip.length}]* - ʟɪsᴛᴀ ᴅᴇ ᴜsᴜᴀʀɪᴏs ᴠɪᴘ:\n–\n${listaVip}`,
contextInfo: {
...newsletter,
mentionedJid: mentionsVip
}
}, { quoted: selo })
}
}
}
}
