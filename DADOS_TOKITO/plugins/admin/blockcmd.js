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

const regras = require('../../sistemas/permissoes')

module.exports = {
nome: 'blockcmd',
comandos: ['blockcmd'],
categoria: 'admin',
info: {
descricao: 'Bloqueia um comando somente no grupo atual.',
uso: 'blockcmd comando',
permissao: 'ADM',
categoria: 'admin'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())
const nome = String(ctx.q || '').trim().split(/\s+/)[0]
if (!nome)
return ctx.reply(ctx.mess.blockCmdUso(ctx.prefix))
const r = regras.block(ctx.nescessario, ctx.from, nome)
if (r.motivo === 'inexistente')
return ctx.reply(ctx.mess.vipCmdInexistente(nome))
if (r.motivo === 'ja')
return ctx.reply(ctx.mess.blockCmdJa(r.nome))
return ctx.reply(ctx.mess.blockCmdAdicionado(r.nome))
}
}
