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
nome: 'rankpokemon',
comandos: ['rankpokemon', 'rankpoke'],
categoria: 'pokemon',
info: {
descricao: 'Ranking de Pokémon por XP.',
uso: 'rankpokemon',
requisitos: 'RPG + Coins',
categoria: 'pokemon'
},
async executar(ctx) {
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
r.garantir(ctx)
const l = Object.entries(ctx.dataGp[0].rpg.usuarios).filter(([, u]) => u.pokemon).map(([jid, u]) => ({
jid,
pokemon: u.pokemon
})).sort((a, b) => (b.pokemon.xp || 0) - (a.pokemon.xp || 0)).slice(0, 10)
return ctx.reply(ctx.mess.pokemonRank(l), l.map(x => x.jid))
}
}
)
