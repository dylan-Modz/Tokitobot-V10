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
nome: 'missaopokemon',
comandos: ['missaopokemon', 'missaopoke'],
categoria: 'pokemon',
info: {
descricao: 'Envia seu Pokémon para uma missão e recebe N-Coins/XP.',
uso: 'missaopokemon',
requisitos: 'RPG + Coins',
categoria: 'pokemon'
},
async executar(ctx) {
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
const p = r.user(ctx).pokemon
if (!p)
return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
const cd = 10 * 60 * 1000
const agora = Date.now()
if (agora - Number(p.ultimaMissao || 0) < cd)
return ctx.reply(ctx.mess.coinsCooldown(Math.ceil((cd - (agora - p.ultimaMissao)) / 1000)))
const ganho = Math.floor(Math.random() * 1001) + 300
const xp = Math.floor(Math.random() * 61) + 40
const e = r.eco(ctx)
e.coins += ganho
p.xp = Number(p.xp || 0) + xp
p.nivel = 1 + Math.floor(p.xp / 100)
p.fome = Math.max(0, Number(p.fome || 100) - 20)
p.ultimaMissao = agora
r.salvar(ctx)
return ctx.reply(ctx.mess.pokemonMissao(p, ganho, xp, e.coins))
}
}
