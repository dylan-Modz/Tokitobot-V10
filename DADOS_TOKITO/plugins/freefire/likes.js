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

const h = require('./base')
const auto = require('../../sistemas/autolike')

const headers = ctx => ({
'x-api-key': h.tokenLikes(ctx),
'Content-Type': 'application/json'
})

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'likes',
comandos: ['likes', 'autolike'],
categoria: 'freefire',
info: {
descricao: 'Likes imediatos e Auto Like diário do Free Fire.',
uso: 'likes UID | autolike UID | autolike del UID'
},
async executar(ctx) {
try {
if (ctx.command === 'autolike') {
const p = String(ctx.q || '').trim().split(/\s+/)
if (p[0]?.toLowerCase() === 'del') {
const uid = String(p[1] || '').replace(/\D/g, '')
if (!uid)
return ctx.reply(ctx.mess.padraoUso({
emoji: '❤️',
titulo: 'REMOVER AUTO LIKE',
uso: `${ctx.prefix}autolike del UID`,
descricao: 'Informe o UID que deseja remover do Auto Like.'
}))
return ctx.reply(
auto.remover(ctx.sender, uid)
? ctx.mess.padraoSucesso({
emoji: '❤️',
titulo: 'AUTO LIKE REMOVIDO',
descricao: `O UID ${uid} foi removido do Auto Like.`
})
: ctx.mess.padraoAviso({
emoji: '❤️',
titulo: 'UID NÃO CADASTRADO',
descricao: 'Esse UID não estava no seu Auto Like.'
})
)
}
const uid = String(p[0] || '').replace(/\D/g, '')
if (!uid)
return ctx.reply(ctx.mess.padraoUso({
emoji: '❤️',
titulo: 'AUTO LIKE',
uso: `${ctx.prefix}autolike UID`,
descricao: 'Informe o UID que deseja cadastrar no Auto Like.'
}))
auto.registrar(ctx.sender, ctx.from, uid)
auto.processar().catch(() => {
})
return ctx.reply(ctx.mess.padraoSucesso({
emoji: '❤️',
titulo: 'AUTO LIKE ATIVADO',
descricao: `Auto Like ativado para o UID ${uid}.`,
detalhe: 'O sistema tenta enviar uma vez por dia e não duplica após reiniciar.'
}))
}
const player_id = String(ctx.q || '').trim()
if (!player_id)
return ctx.reply(ctx.mess.ffLikesUso(ctx.prefix))
await ctx.reagir(ctx.from, '❤️')
const { data } = await ctx.axios.post(`${ctx.API_URL}/api/v1/likes`, { player_id }, {
headers: headers(ctx),
timeout: 90000
})
if (!data?.success)
return ctx.reply(ctx.mess.ffErro(h.retornoErro(data)))
await ctx.reagir(ctx.from, '✅')
return ctx.reply(ctx.mess.ffLikesSucesso({
NomeDoBot: ctx.NomeDoBot,
pushname: ctx.pushname || 'Usuário',
player_id,
data
}), [ctx.sender])
}
catch (error) {
console.log('[FREE FIRE LIKES]', ctx.modulos.sanitizarErro(error, [ctx.API_KEY_TOKITO]))
await ctx.reagir(ctx.from, '❌').catch(() => {
})
return ctx.reply(ctx.mess.erroApi(ctx.API_URL))
}
}
}
)
