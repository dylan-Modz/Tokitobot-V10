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
nome: 'rgaluguel',
comandos: ['rgaluguel'],
categoria: 'aluguel',
info: {
descricao: 'Registra manualmente o grupo no aluguel.',
uso: 'rgaluguel dias [horas]',
permissao: 'Dono',
categoria: 'aluguel'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
const dias = parseInt(ctx.args[0]) || 0
const horas = parseInt(ctx.args[1]) || 0
if (dias <= 0 && horas <= 0)
return ctx.reply(ctx.mess.aluguelManualUso(ctx.prefix))
const plano = {
nome: 'Manual',
dias: dias + (horas / 24)
}
const g = aluguel.registrar(ctx.from, plano, ctx.sender, '')
return ctx.reply(ctx.mess.aluguelManualOk(new Date(g.expiraEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })))
}
}
