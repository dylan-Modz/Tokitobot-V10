const sistema = require('../../sistemas/dados')

module.exports = {
  nome: 'update',
  comandos: ['update'],
  categoria: 'dono',
  info: {
    descricao: 'Verifica, instala ou restaura atualizações oficiais do Tokito V10.',
    uso: 'update check | info | start | rollback',
    permissao: 'Dono'
  },

  async executar(ctx) {
    if (!ctx.SoDono && !ctx.info?.key?.fromMe) {
      return ctx.reply(ctx.mess.onlyOwner())
    }

    const acao = String(ctx.args?.[0] || ctx.q || 'check')
      .trim()
      .split(/\s+/)[0]
      .toLowerCase()

    if (acao === 'check' || acao === 'info') {
      const check = await sistema.verificarUpdate()

      if (!check.ok) {
        if (check.reason === 'not_published') {
          return ctx.reply(ctx.mess.updateNotPublished())
        }

        return ctx.reply(ctx.mess.updateCheckError())
      }

      return ctx.reply(ctx.mess.updateInfo({
        instalada: check.local.version || '—',
        disponivel: check.remote.version || '—',
        canal: check.remote.channel || 'stable',
        disponivelAgora: check.available,
        changelog: Array.isArray(check.remote?.changelog)
          ? check.remote.changelog
          : [],
        prefix: ctx.prefix
      }))
    }

    if (acao === 'start') {
      await ctx.reply(ctx.mess.updatePreparing())

      try {
        const result = await sistema.instalarUpdate(
          texto => console.log(`[ UPDATE • TOKITO ] ${texto}`)
        )

        if (!result.updated) {
          return ctx.reply(ctx.mess.updateAlreadyLatest(result.version))
        }

        await ctx.reply(ctx.mess.updateSuccess(result.from, result.version))

        return setTimeout(() => process.exit(0), 1500)
      } catch (error) {
        console.log('[ UPDATE • TOKITO ]', error.message || error)
        return ctx.reply(ctx.mess.updateError())
      }
    }

    if (acao === 'rollback') {
      try {
        const result = sistema.rollback()

        await ctx.reply(ctx.mess.updateRollbackSuccess(result.version))

        return setTimeout(() => process.exit(0), 1500)
      } catch (error) {
        console.log('[ ROLLBACK • TOKITO ]', error.message || error)
        return ctx.reply(ctx.mess.updateRollbackError())
      }
    }

    return ctx.reply(ctx.mess.updateUsage(ctx.prefix))
  }
}
