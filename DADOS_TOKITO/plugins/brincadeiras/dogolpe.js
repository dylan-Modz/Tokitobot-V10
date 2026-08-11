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
nome: 'dogolpe',
comandos: ['dogolpe'],
categoria: 'brincadeiras',
info: {
descricao: 'Descobre em qual golpe a pessoa é especialista.',
uso: 'dogolpe @usuario',
categoria: 'brincadeiras',
requisitos: 'Modo brincadeiras'
},
async executar(ctx) {
const { isGroup, isModobn, reply, mess, prefix, menc_os2, tokito, from, canalInfo, selo } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isModobn)
return reply(mess.onlyGroupFun(prefix))
if (!menc_os2)
return reply(`- 👤 Marque alguém.\n> ${prefix}dogolpe @usuario`)
const g = ['iludir pessoas', 'ferir sentimentos', 'dar chifre', 'sumir e voltar como se nada tivesse acontecido']
const x = g[Math.floor(Math.random() * g.length)]
return tokito.sendMessage(from, {
text: `😵‍💫 @${menc_os2.split('@')[0]} é especialista em *${x}*.`,
contextInfo: canalInfo([menc_os2])
}, { quoted: selo })
}
}
