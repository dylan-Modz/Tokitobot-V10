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

const modulos = require('../../sistemas/modulos')

module.exports = {
prioridade: 40,
nome: 'evento-antipalavra',
categoria: 'eventos',
async evento(ctx) {
if (!ctx.isGroup || ctx.info?.key?.fromMe || ctx.isGroupAdmins || ctx.SoDono || !ctx.isBotGroupAdmins)
return false
const f = ctx.dataGp?.[0]?.funcoes || {}
if (!f.antipalavra || !Array.isArray(f.palavrasProibidas) || !f.palavrasProibidas.length)
return false
const texto = modulos.norm(ctx.body)
if (!texto)
return false
const bate = f.palavrasProibidas.find(p => {
const n = modulos.norm(p)
return n && (texto === n || (` ${texto} `).includes(` ${n} `))
})
if (!bate)
return false
await ctx.tokito.sendMessage(ctx.from, { delete: ctx.info.key }).catch(() => {
})
await ctx.tokito.groupParticipantsUpdate(ctx.from, [ctx.sender], 'remove').catch(() => {
})
await ctx.tokito.sendMessage(ctx.from, {
text: ctx.mess.padraoAviso({
emoji: '🚫',
titulo: 'PALAVRA PROIBIDA',
descricao: `@${ctx.sender.split('@')[0]} foi removido por usar uma palavra proibida.`,
detalhe: bate
}),
contextInfo: ctx.canalInfo([ctx.sender])
}, { quoted: ctx.selo }).catch(() => {
})
return true
}
}
