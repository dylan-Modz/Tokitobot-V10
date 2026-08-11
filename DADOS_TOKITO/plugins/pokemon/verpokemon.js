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
nome: 'verpokemon',
comandos: ['verpokemon', 'verpoke', 'pokemon', 'meupokemon'],
categoria: 'pokemon',
info: {
descricao: 'Mostra seu Pokémon.',
uso: 'verpokemon',
requisitos: 'RPG + Coins',
categoria: 'pokemon'
},
async executar(ctx) {
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
const p = r.user(ctx).pokemon
if (!p)
return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
const texto = ctx.mess.pokemonPerfil(ctx.sender, p, r.POKEMON[p.tipo] || {})
const img = r.imagemPokemon(p.tipo)
if (img)
try {
return await ctx.tokito.sendMessage(ctx.from, {
image: { url: img },
caption: texto,
contextInfo: ctx.canalInfo([ctx.sender])
}, { quoted: ctx.selo })
}
catch {
}
return ctx.reply(texto, [ctx.sender])
}
}
