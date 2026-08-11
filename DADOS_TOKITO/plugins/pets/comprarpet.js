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
nome: 'comprarpet',
comandos: ['comprarpet', 'adotarpet'],
categoria: 'pets',
info: {
descricao: 'Compra/adota um Pet.',
uso: 'comprarpet gato',
requisitos: 'RPG + Coins',
categoria: 'pets'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!r.ambos(ctx))
return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
const tipo = String(ctx.args?.[0] || '').toLowerCase()
const p = r.PETS[tipo]
if (!p)
return ctx.reply(ctx.mess.petShop(r.PETS, ctx.prefix))
const ru = r.user(ctx)
const eu = r.eco(ctx)
if (ru.pet)
return ctx.reply(ctx.mess.petJaTem())
if (eu.coins < p.preco)
return ctx.reply(ctx.mess.coinsSemSaldo(p.preco, eu.coins))
eu.coins -= p.preco
ru.pet = {
tipo,
apelido: null,
fome: 100,
xp: 0,
nivel: 1,
afeto: 0,
criadoEm: Date.now(),
ultimaComida: Date.now(),
ultimoBanho: 0,
ultimoPasseio: 0
}
r.salvar(ctx)
return ctx.reply(ctx.mess.petComprado(tipo, p.preco, eu.coins))
}
}
