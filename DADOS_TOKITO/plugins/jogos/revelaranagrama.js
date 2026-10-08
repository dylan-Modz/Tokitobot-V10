const dylan = require('../../database/lib/comandos')
const jogo = require('./anagrama.js')

dylan.setCommand({
  nome: 'revelaranagrama',
  comandos: [
    'revelaranagrama',
    'ran'
  ],
  categoria: 'jogos',
  info: {
    descricao: 'Revela a resposta atual do Anagrama.',
    uso: 'revelaranagrama',
    categoria: 'jogos'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!ctx.isGroupAdmins)
      return ctx.reply(ctx.mess.soadm())

    if (!await jogo.revelar(ctx))
      return ctx.reply(
        'Não há Anagrama em andamento neste grupo.'
      )
  }
})
