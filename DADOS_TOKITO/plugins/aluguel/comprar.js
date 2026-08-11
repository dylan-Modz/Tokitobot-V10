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

const aluguel = require('../../sistemas/aluguel')

module.exports = {
nome: 'alugarbot',
comandos: ['alugarbot', 'aluguelbot', 'lojinha', 'loja'],
categoria: 'aluguel',
info: {
descricao: 'Inicia a compra do aluguel para um grupo.',
uso: 'alugarbot link-do-grupo',
categoria: 'aluguel'
},
async executar(ctx) {
if (!ctx.nescessario.aluguel)
return ctx.reply(ctx.mess.aluguelDesativado())
if (['lojinha', 'loja'].includes(ctx.command)) {
const ps = aluguel.planos()
if (!ps.length)
return ctx.reply(ctx.mess.aluguelSemPlanos())
return ctx.reply(ctx.mess.aluguelPedido('Escolha um plano', '—', ps, ctx.prefix))
}
const link = String(ctx.q || '').trim()
const code = aluguel.extrairInvite(link)
if (!code)
return ctx.reply(ctx.mess.aluguelUso(ctx.prefix))
let nome = 'Grupo privado'
let grupoId = ''
try {
const inf = await ctx.tokito.groupGetInviteInfo(code)
nome = inf?.subject || nome
grupoId = inf?.id || ''
}
catch {
}
aluguel.salvarPedido({
comprador: ctx.sender,
status: 'pendente',
linkGrupo: link,
inviteCode: code,
grupoId,
grupoNome: nome
})
const ps = aluguel.planos()
if (!ps.length)
return ctx.reply(ctx.mess.aluguelSemPlanos())
return ctx.reply(ctx.mess.aluguelPedido(nome, link, ps, ctx.prefix))
}
}
