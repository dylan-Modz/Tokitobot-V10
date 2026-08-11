module.exports = {
  nome: 'grupo',
  comandos: ['grupo', 'gp'],
  categoria: 'grupo',
  info: {
    descricao: 'Abre ou fecha o grupo imediatamente.',
    uso: 'grupo a|f',
    permissao: 'ADM',
    categoria: 'grupo'
  },
  async executar(ctx) {
    try {
      if (!ctx.isGroup)
        return ctx.reply(ctx.mess.grupo())
      if (!ctx.isGroupAdmins && !ctx.SoDono)
        return ctx.reply(ctx.mess.adm())
      if (!ctx.isBotGroupAdmins)
        return ctx.reply(ctx.mess.botadm())
      const acao = String(ctx.q || '').trim().toLowerCase()
      if (!['a', 'abrir', 'f', 'fechar'].includes(acao))
        return ctx.reply(ctx.mess.grupoUso(ctx.prefix))
      const abrir = ['a', 'abrir'].includes(acao)
      await ctx.reagir(ctx.from, abrir ? '🔓' : '🔒')
      await ctx.tokito.groupSettingUpdate(ctx.from, abrir ? 'not_announcement' : 'announcement')
      return ctx.reply(ctx.mess.grupoAlterado(abrir))
    }
    catch (e) {
      console.log('[GRUPO A/F]', e?.message || e)
      await ctx.reagir(ctx.from, '❌').catch(() => {
      })
      return ctx.reply(ctx.mess.error())
    }
  }
}
