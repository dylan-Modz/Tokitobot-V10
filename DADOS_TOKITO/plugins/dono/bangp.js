module.exports = {
  nome: 'bangp',
  comandos: ['bangp', 'unbangp'],
  categoria: 'dono',
  info: {
    descricao: 'Bloqueia/desbloqueia os comandos em um grupo.',
    uso: 'bangp',
    permissao: 'Dono'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    ctx.dataGp[0].funcoes.bangp = ctx.command === 'bangp'
    ctx.setGp(ctx.dataGp)
    return ctx.reply(`🧊 Grupo ${ctx.command === 'bangp' ? 'bloqueado para comandos' : 'desbloqueado'}.`)
  }
}
