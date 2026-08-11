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
nome: 'sermembro',
comandos: ['sermembro'],
categoria: 'dono',
info: {
descricao: 'Rebaixa o dono que executou o comando para membro comum.',
uso: 'sermembro',
permissao: 'Dono',
categoria: 'dono'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())
await ctx.tokito.groupParticipantsUpdate(ctx.from, [ctx.sender], 'demote')
return ctx.reply(ctx.mess.serMembroOk(ctx.sender), [ctx.sender])
}
}
