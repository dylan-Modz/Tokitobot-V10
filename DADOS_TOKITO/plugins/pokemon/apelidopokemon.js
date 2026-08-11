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
nome: 'apelidopokemon',
comandos: ['apelidopokemon', 'apelidopoke', 'nomepokemon'],
categoria: 'pokemon',
info: {
descricao: 'Altera o apelido do Pokémon.',
uso: 'apelidopokemon nome',
requisitos: 'RPG + Coins',
categoria: 'pokemon'
},
async executar(ctx) {
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
const p = r.user(ctx).pokemon
if (!p)
return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
const nome = String(ctx.q || '').trim().slice(0, 30)
if (!nome)
return ctx.reply(ctx.mess.pokemonApelidoUso(ctx.prefix))
p.apelido = nome
r.salvar(ctx)
return ctx.reply(ctx.mess.pokemonApelido(nome))
}
}
