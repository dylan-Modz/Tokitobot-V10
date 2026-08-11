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
nome: 'alimentarpet',
comandos: ['alimentarpet', 'darcomidapet'],
categoria: 'pets',
info: {
descricao: 'Alimenta seu Pet.',
uso: 'alimentarpet',
requisitos: 'RPG + Coins',
categoria: 'pets'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
const p = r.user(ctx).pet
const e = r.eco(ctx)
if (!p)
return ctx.reply(ctx.mess.petNaoTem(ctx.prefix))
const custo = 150
if (e.coins < custo)
return ctx.reply(ctx.mess.coinsSemSaldo(custo, e.coins))
e.coins -= custo
p.fome = Math.min(100, Number(p.fome || 0) + 35)
p.afeto = Number(p.afeto || 0) + 2
p.xp = Number(p.xp || 0) + 10
p.nivel = 1 + Math.floor(p.xp / 100)
p.ultimaComida = Date.now()
r.salvar(ctx)
return ctx.reply(ctx.mess.petAlimentado(p, custo))
}
}
