const aluguel = require('../../sistemas/aluguel')

module.exports = {
  nome: 'lista-aluguel',
  comandos: ['lista-aluguel'],
  categoria: 'aluguel',
  info: {
    descricao: 'Lista grupos registrados no aluguel.',
    uso: 'lista-aluguel',
    permissao: 'Dono',
    categoria: 'aluguel'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    return ctx.reply(ctx.mess.aluguelLista(aluguel.ativos()))
  }
}
