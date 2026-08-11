module.exports = {
  nome: 'anticanal',
  comandos: ['anticanal'],
  categoria: 'admin',
  info: {
    descricao: 'Bloqueia links e mensagens encaminhadas de canais do WhatsApp.',
    uso: 'anticanal 1|0',
    permissao: 'ADM',
    categoria: 'admin'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())
    if (!ctx.isBotGroupAdmins)
      return ctx.reply(ctx.mess.botadm())
    return ctx.funcoes.anticanal.configurar({
      grupo: ctx.from,
      dataGp: ctx.dataGp,
      setGp: ctx.setGp,
      q: ctx.q,
      prefix: ctx.prefix,
      command: ctx.command,
      reply: ctx.reply
    })
  }
}
