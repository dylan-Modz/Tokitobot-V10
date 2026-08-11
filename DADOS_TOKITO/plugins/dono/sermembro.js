module.exports = {
  nome: 'sermembro',
  comandos: ['sermembro'],
  categoria: 'dono',
  info: {
    descricao: 'Rebaixa o dono que executou o comando para membro comum.',
    uso: 'sermembro',
    permissao: 'Dono',
    categoria: 'dono'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    if (!ctx.isBotGroupAdmins)
      return ctx.reply(ctx.mess.botadm())
    await ctx.tokito.groupParticipantsUpdate(ctx.from, [ctx.sender], 'demote')
    return ctx.reply(ctx.mess.serMembroOk(ctx.sender), [ctx.sender])
  }
}
