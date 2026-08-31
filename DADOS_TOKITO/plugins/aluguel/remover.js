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

const aluguel = require('../../sistemas/aluguel/index')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'delaluguel',
comandos: ['delaluguel'],
categoria: 'aluguel',
info: {
descricao: 'Remove um grupo do sistema de aluguel.',
uso: 'delaluguel [numero-da-lista]',
permissao: 'Dono',
categoria: 'aluguel'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
const lista = aluguel.ativos()
let id = ctx.isGroup ? ctx.from : ''
if (ctx.args[0] && /^\d+$/.test(ctx.args[0]))
id = lista[Number(ctx.args[0]) - 1]?.id || ''
if (!id || !aluguel.remover(id))
return ctx.reply(ctx.mess.aluguelNaoTem())
return ctx.reply(ctx.mess.aluguelRemovido(id))
}
}
)
