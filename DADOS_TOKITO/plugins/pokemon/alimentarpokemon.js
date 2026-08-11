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
nome: 'alimentarpokemon',
comandos: ['alimentarpokemon', 'alimentarpoke'],
categoria: 'pokemon',
info: {
descricao: 'Alimenta seu Pokémon.',
uso: 'alimentarpokemon berry',
requisitos: 'RPG + Coins',
categoria: 'pokemon'
},
async executar(ctx) {
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
const p = r.user(ctx).pokemon
if (!p)
return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
const item = String(ctx.args?.[0] || 'berry').toLowerCase()
const c = r.POKEMON_COMIDA[item]
if (!c)
return ctx.reply(ctx.mess.pokemonComidas(r.POKEMON_COMIDA, ctx.prefix))
const e = r.eco(ctx)
if (e.coins < c.preco)
return ctx.reply(ctx.mess.coinsSemSaldo(c.preco, e.coins))
e.coins -= c.preco
p.fome = Math.min(100, Number(p.fome || 0) + c.fome)
p.xp = Number(p.xp || 0) + 15
p.afeto = Number(p.afeto || 0) + 2
p.nivel = 1 + Math.floor(p.xp / 100)
p.ultimaComida = Date.now()
r.salvar(ctx)
return ctx.reply(ctx.mess.pokemonAlimentado(c, p, e.coins))
}
}
