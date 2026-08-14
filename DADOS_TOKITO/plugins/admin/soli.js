module.exports = {
  nome: 'soli',
  comandos: ['soli', 'solicitacao', 'solicitacoes'],
  categoria: 'admin',

  info: {
    descricao: 'Mostra as solicitações pendentes e permite aprovar uma quantidade.',
    uso: 'soli | soli 20',
    permissao: 'ADM'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())

    if (!ctx.isBotGroupAdmins)
      return ctx.reply(ctx.mess.botadm())

    try {
      const pendentes = await ctx.funcoes.aprovacao.sincronizar(
        ctx.tokito,
        ctx.from
      )

      const total = pendentes.length
      const textoQuantidade = String(ctx.q || '').trim()

      if (!textoQuantidade) {
        return ctx.reply(
          ctx.mess.solicitacoesPendentes(
            total,
            ctx.prefix
          )
        )
      }

      if (!/^\d+$/.test(textoQuantidade)) {
        return ctx.reply(
          ctx.mess.solicitacoesQuantidadeInvalida(
            ctx.prefix
          )
        )
      }

      const quantidade = Number(textoQuantidade)

      if (!Number.isSafeInteger(quantidade) || quantidade <= 0) {
        return ctx.reply(
          ctx.mess.solicitacoesQuantidadeInvalida(
            ctx.prefix
          )
        )
      }

      if (!total) {
        return ctx.reply(
          ctx.mess.solicitacoesPendentes(
            0,
            ctx.prefix
          )
        )
      }

      const resultado = await ctx.funcoes.aprovacao.decidirQuantidade({
        tokito: ctx.tokito,
        grupo: ctx.from,
        quantidade,
        acao: 'approve'
      })

      return ctx.reply(
        ctx.mess.solicitacoesAprovadas(
          quantidade,
          resultado.processadas,
          resultado.restantes
        ),
        resultado.jids
      )
    }
    catch (error) {
      console.log('[SOLICITAÇÕES]', error)
      return ctx.reply(ctx.mess.error())
    }
  }
}
