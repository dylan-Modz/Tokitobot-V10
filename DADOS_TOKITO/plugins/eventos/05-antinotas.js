module.exports = {
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
      text: `💸 @${ctx.sender.split('@')[0]} removido pelo *Anti Notas* (${pagamento ? 'mensagem de pagamento' : 'nota falsa'}).`,
      contextInfo: ctx.canalInfo([ctx.sender])
    }, { quoted: ctx.selo }).catch(() => {
    })
    return true
  }
}
