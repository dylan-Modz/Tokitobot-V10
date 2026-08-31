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

module.exports = {
prioridade: 50,
nome: 'evento-antinotas',
categoria: 'eventos',
async evento(ctx) {
if (!ctx.isGroup || ctx.info?.key?.fromMe || ctx.isGroupAdmins || ctx.SoDono || !ctx.dataGp?.[0]?.funcoes?.antinotas || ctx.mensagem?.reactionMessage)
return false
const m = ctx.mensagem || {}
const texto = String(ctx.body || m.requestPaymentMessage?.noteMessage?.extendedTextMessage?.text || m.sendPaymentMessage?.noteMessage?.extendedTextMessage?.text || '')
const pagamento = Boolean(m.requestPaymentMessage || m.sendPaymentMessage || m.paymentInviteMessage)
const emoji = /(💳|💎|💸|💵|💷|💶|🪙|💰|🤑|⚖️)/u.test(texto)
const notaFake = emoji && texto.length >= 100
if (!pagamento && !notaFake)
return false
if (!ctx.isBotGroupAdmins)
return false
await ctx.tokito.sendMessage(ctx.from, { delete: ctx.info.key }).catch(() => {
})
const presente = (ctx.groupMembers || []).some(p => ctx.normalizar(p) === ctx.normalizar(ctx.sender))
if (presente)
await ctx.tokito.groupParticipantsUpdate(ctx.from, [ctx.sender], 'remove').catch(() => {
})
await ctx.tokito.sendMessage(ctx.from, {
text: ctx.mess.padraoAviso({
titulo: 'ANTI NOTAS',
descricao: `@${ctx.sender.split('@')[0]} foi removido automaticamente.`,
detalhe: pagamento ? 'Mensagem de pagamento detectada.' : 'Nota falsa detectada.'
}),
contextInfo: ctx.canalInfo([ctx.sender])
}, { quoted: ctx.selo }).catch(() => {
})
return true
}
}
