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
nome: 'shipo',
comandos: ['shipo'],
categoria: 'brincadeiras',
info: {
descricao: 'Sorteia um par para a pessoa marcada.',
uso: 'shipo @usuario',
categoria: 'brincadeiras',
requisitos: 'Modo brincadeiras'
},
async executar(ctx) {
const { isGroup, isModobn, reply, mess, prefix, menc_os2, groupMembers, tokito, from, canalInfo, selo } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isModobn)
return reply(mess.onlyGroupFun(prefix))
if (!menc_os2)
return reply(`- 💘 Marque uma pessoa.\n> ${prefix}shipo @usuario`)
const membros = (groupMembers || []).map(x => x.id || x).filter(x => x && x !== menc_os2)
if (!membros.length)
return reply(mess.error())
const par = membros[Math.floor(Math.random() * membros.length)]
const n = Math.floor(Math.random() * 101)
return tokito.sendMessage(from, {
text: `💘 Eu shipo @${menc_os2.split('@')[0]} com @${par.split('@')[0]} em *${n}%*!`,
contextInfo: canalInfo([menc_os2, par])
}, { quoted: selo })
}
}
