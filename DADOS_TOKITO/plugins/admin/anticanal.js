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
nome: 'anticanal',
comandos: ['anticanal'],
categoria: 'admin',
info: {
descricao: 'Bloqueia links e mensagens encaminhadas de canais do WhatsApp.',
uso: 'anticanal 1|0',
permissao: 'ADM',
categoria: 'admin'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())
if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())
return ctx.funcoes.anticanal.configurar({
grupo: ctx.from,
dataGp: ctx.dataGp,
setGp: ctx.setGp,
q: ctx.q,
prefix: ctx.prefix,
command: ctx.command,
reply: ctx.reply
})
}
}
