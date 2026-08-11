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
nome: 'venderpokemon',
comandos: ['venderpokemon', 'venderpoke'],
categoria: 'pokemon',
info: {
descricao: 'Vende seu Pokémon por 50% do preço.',
uso: 'venderpokemon',
requisitos: 'RPG + Coins',
categoria: 'pokemon'
},
async executar(ctx) {
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
const u = r.user(ctx)
const p = u.pokemon
if (!p)
return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
const valor = Math.floor((r.POKEMON[p.tipo]?.preco || 1000) / 2)
const e = r.eco(ctx)
e.coins += valor
u.pokemon = null
r.salvar(ctx)
return ctx.reply(ctx.mess.pokemonVendido(valor, e.coins))
}
}
