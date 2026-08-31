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
nome: 'minerar',
comandos: ['minerar', 'mine'],
categoria: 'coins',
info: {
descricao: 'Minera N-Coins com tempo de espera.',
uso: 'minerar',
requisitos: 'Modo Coins',
categoria: 'coins'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!r.temCoins(ctx))
return ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))
const u = r.eco(ctx)
const agora = Date.now()
const cd = 5 * 60 * 1000
if (agora - Number(u.ultimoMinerar || 0) < cd)
return ctx.reply(ctx.mess.coinsCooldown(Math.ceil((cd - (agora - u.ultimoMinerar)) / 1000)))
const ganho = Math.floor(Math.random() * 451) + 100
u.coins += ganho
u.ultimoMinerar = agora
u.chances.minerar = Number(u.chances.minerar || 0) + 1
r.salvar(ctx)
return ctx.reply(ctx.mess.coinsMinerado(ctx.sender, ganho, u.coins), [ctx.sender])
}
}
)
