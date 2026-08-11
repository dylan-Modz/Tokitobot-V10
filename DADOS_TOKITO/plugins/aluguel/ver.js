const aluguel = require('../../sistemas/aluguel')

module.exports = {
  nome: 'veraluguel',
  comandos: ['veraluguel', 'ver_aluguel'],
  categoria: 'aluguel',
  info: {
    descricao: 'Mostra o tempo restante do aluguel.',
    uso: 'veraluguel',
    categoria: 'aluguel'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    const g = aluguel.ativos().find(x => x.id === ctx.from && x.ativo !== false)
    if (!g)
      return ctx.reply(ctx.mess.aluguelNaoTem())
    return ctx.reply(ctx.mess.aluguelVer(g))
  }
}
