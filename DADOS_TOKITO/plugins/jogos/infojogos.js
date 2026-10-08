const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'infojogos',
  comandos: ['infojogos'],
  categoria: 'jogos',
  info: {
    descricao: 'Mostra como resetar as partidas dos jogos.',
    uso: 'infojogos',
    categoria: 'jogos'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    return ctx.reply(
      ctx.mess.infoJogos(ctx.prefix)
    )
  }
})
