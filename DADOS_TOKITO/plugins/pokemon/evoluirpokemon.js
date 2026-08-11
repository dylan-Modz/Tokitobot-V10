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
nome: 'evoluirpokemon',
comandos: ['evoluirpokemon', 'evoluirpoke'],
categoria: 'pokemon',
info: {
descricao: 'Evolui seu Pokémon quando alcança o nível necessário.',
uso: 'evoluirpokemon',
requisitos: 'RPG + Coins',
categoria: 'pokemon'
},
async executar(ctx) {
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
const p = r.user(ctx).pokemon
if (!p)
return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
const d = r.POKEMON[p.tipo]
if (!d?.evolui)
return ctx.reply(ctx.mess.pokemonNaoEvolui())
if (Number(p.nivel || 1) < Number(d.nivel || 999))
return ctx.reply(ctx.mess.pokemonNivelEvoluir(d.nivel))
const ant = d.nome
p.tipo = d.evolui
p.xp = Number(p.xp || 0) + 100
p.nivel = 1 + Math.floor(p.xp / 100)
r.salvar(ctx)
return ctx.reply(ctx.mess.pokemonEvoluiu(ant, r.POKEMON[p.tipo]?.nome || p.tipo))
}
}
