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

const r = require('../../sistemas/rpg')

module.exports = {
nome: 'lojapokemon',
comandos: ['lojapokemon', 'lojapoke', 'pokeshop', 'lojararospokemon', 'lojararospoke'],
categoria: 'pokemon',
info: {
descricao: 'Mostra a loja de Pokémon.',
uso: 'lojapokemon',
requisitos: 'RPG + Coins',
categoria: 'pokemon'
},
async executar(ctx) {
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
const raro = ctx.command.includes('raro')
const itens = Object.entries(r.POKEMON).filter(([, p]) => raro ? ['Raro', 'Lendário'].includes(p.raridade) : p.raridade === 'Comum')
if (raro && !ctx.isVip)
return ctx.reply(ctx.mess.onlyVipUser())
return ctx.reply(ctx.mess.pokemonShop(itens, ctx.prefix, raro))
}
}
