const aluguel = require('../../sistemas/aluguel')

module.exports = {
  nome: 'alugarbot',
  comandos: ['alugarbot', 'aluguelbot', 'lojinha', 'loja'],
  categoria: 'aluguel',
  info: {
    descricao: 'Inicia a compra do aluguel para um grupo.',
    uso: 'alugarbot link-do-grupo',
    categoria: 'aluguel'
  },
  async executar(ctx) {
    if (!ctx.nescessario.aluguel)
      return ctx.reply(ctx.mess.aluguelDesativado())
    if (['lojinha', 'loja'].includes(ctx.command)) {
      const ps = aluguel.planos()
      if (!ps.length)
        return ctx.reply(ctx.mess.aluguelSemPlanos())
      return ctx.reply(ctx.mess.aluguelPedido('Escolha um plano', '—', ps, ctx.prefix))
    }
    const link = String(ctx.q || '').trim()
    const code = aluguel.extrairInvite(link)
    if (!code)
      return ctx.reply(ctx.mess.aluguelUso(ctx.prefix))
    let nome = 'Grupo privado'
    let grupoId = ''
    try {
      const inf = await ctx.tokito.groupGetInviteInfo(code)
      nome = inf?.subject || nome
      grupoId = inf?.id || ''
    }
    catch {
    }
    aluguel.salvarPedido({
      comprador: ctx.sender,
      status: 'pendente',
      linkGrupo: link,
      inviteCode: code,
      grupoId,
      grupoNome: nome
    })
    const ps = aluguel.planos()
    if (!ps.length)
      return ctx.reply(ctx.mess.aluguelSemPlanos())
    return ctx.reply(ctx.mess.aluguelPedido(nome, link, ps, ctx.prefix))
  }
}
