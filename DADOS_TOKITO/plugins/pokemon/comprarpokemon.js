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
nome: 'comprarpokemon',
comandos: ['comprarpokemon', 'comprarpoke'],
categoria: 'pokemon',
info: {
descricao: 'Compra um Pokémon.',
uso: 'comprarpokemon pikachu',
requisitos: 'RPG + Coins',
categoria: 'pokemon'
},
async executar(ctx) {
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
const tipo = String(ctx.args?.[0] || '').toLowerCase()
const p = r.POKEMON[tipo]
if (!p)
return ctx.reply(ctx.mess.pokemonInvalido(ctx.prefix))
if (['Raro', 'Lendário'].includes(p.raridade) && !ctx.isVip)
return ctx.reply(ctx.mess.onlyVipUser())
const u = r.user(ctx)
const e = r.eco(ctx)
if (u.pokemon)
return ctx.reply(ctx.mess.pokemonJaTem())
if (e.coins < p.preco)
return ctx.reply(ctx.mess.coinsSemSaldo(p.preco, e.coins))
e.coins -= p.preco
u.pokemon = {
tipo,
apelido: null,
fome: 100,
xp: 0,
nivel: 1,
afeto: 0,
criadoEm: Date.now(),
ultimaComida: Date.now(),
ultimaMissao: 0
}
r.salvar(ctx)
return ctx.reply(ctx.mess.pokemonComprado(p, e.coins))
}
}
)
