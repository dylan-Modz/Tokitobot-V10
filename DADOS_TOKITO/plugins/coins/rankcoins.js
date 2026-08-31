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

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'rankcoins',
comandos: ['rankcoins', 'rankingcoins'],
categoria: 'coins',
info: {
descricao: 'Mostra o ranking de N-Coins do grupo.',
uso: 'rankcoins',
requisitos: 'Modo Coins',
categoria: 'coins'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!r.temCoins(ctx))
return ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))
return ctx.reply(ctx.mess.coinsRank(r.rank(ctx, 'coins').slice(0, 10)), r.rank(ctx, 'coins').slice(0, 10).map(x => x.jid))
}
}
)
