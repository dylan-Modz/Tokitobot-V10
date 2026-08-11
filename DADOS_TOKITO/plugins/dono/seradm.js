module.exports = {
  nome: 'seradm',
  comandos: ['seradm'],
  categoria: 'dono',
  info: {
    descricao: 'Promove o dono que executou o comando a administrador do grupo.',
    uso: 'seradm',
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
    await ctx.tokito.groupParticipantsUpdate(ctx.from, [ctx.sender], 'promote')
    return ctx.reply(ctx.mess.serAdmOk(ctx.sender), [ctx.sender])
  }
}
