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

const r = require('../../sistemas/rpg/index')

module.exports = {
prioridade: 0,
nome: 'evento-level',
categoria: 'eventos',
async evento(ctx) {
if (!ctx.isGroup || ctx.info?.key?.fromMe || !ctx.body || ctx.mensagem?.reactionMessage || !r.temRpg(ctx))
return false
const u = r.user(ctx)
const antes = u.patente
r.addXp(ctx, 1)
if (u.patente !== antes) {
await ctx.tokito.sendMessage(ctx.from, {
text: ctx.mess.levelUp(ctx.sender, u),
contextInfo: ctx.canalInfo([ctx.sender])
}, { quoted: ctx.selo }).catch(() => {
})
}
return false
}
}
