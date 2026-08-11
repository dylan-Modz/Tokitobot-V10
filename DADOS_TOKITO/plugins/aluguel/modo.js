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

const fs = require('fs')
const path = require('path')

module.exports = {
nome: 'modoaluguel',
comandos: ['modoaluguel'],
categoria: 'aluguel',
info: {
descricao: 'Ativa ou desativa o bloqueio por aluguel.',
uso: 'modoaluguel',
permissao: 'Dono',
categoria: 'aluguel'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
ctx.nescessario.aluguel = !ctx.nescessario.aluguel
const arq = path.join(process.cwd(), 'DADOS_TOKITO', 'INFO_DADOS', 'nescessario.json')
const t = arq + '.tmp'
fs.writeFileSync(t, JSON.stringify(ctx.nescessario, null, 2) + '\n')
fs.renameSync(t, arq)
return ctx.reply(ctx.mess.aluguelModo(ctx.nescessario.aluguel))
}
}
