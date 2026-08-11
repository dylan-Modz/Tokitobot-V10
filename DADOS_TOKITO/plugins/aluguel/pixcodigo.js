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
nome: 'pixcodigo',
comandos: ['pixcodigo'],
categoria: 'aluguel',
info: {
descricao: 'Mostra o código PIX de um pagamento pendente.',
uso: 'pixcodigo id',
categoria: 'aluguel'
},
async executar(ctx) {
const id = String(ctx.q || '').trim()
const item = aluguel.ler(aluguel.arquivos.pendencias, []).find(x => String(x.id) === id && x.comprador === ctx.sender)
if (!item)
return ctx.reply(ctx.mess.aluguelSemPedido(ctx.prefix))
return ctx.reply(item.qr_code || ctx.mess.error())
}
}
