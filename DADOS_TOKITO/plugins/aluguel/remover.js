const aluguel = require('../../sistemas/aluguel')

module.exports = {
  nome: 'delaluguel',
  comandos: ['delaluguel'],
  categoria: 'aluguel',
  info: {
    descricao: 'Remove um grupo do sistema de aluguel.',
    uso: 'delaluguel [numero-da-lista]',
    permissao: 'Dono',
    categoria: 'aluguel'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    const lista = aluguel.ativos()
    let id = ctx.isGroup ? ctx.from : ''
    if (ctx.args[0] && /^\d+$/.test(ctx.args[0]))
      id = lista[Number(ctx.args[0]) - 1]?.id || ''
    if (!id || !aluguel.remover(id))
      return ctx.reply(ctx.mess.aluguelNaoTem())
    return ctx.reply(ctx.mess.aluguelRemovido(id))
  }
}
