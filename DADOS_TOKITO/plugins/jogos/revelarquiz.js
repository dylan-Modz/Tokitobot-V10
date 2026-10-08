const dylan = require('../../database/lib/comandos')
const jogo = require('./quizanimais.js')

dylan.setCommand({
  nome: 'revelarquiz',
  comandos: [
    'revelarquiz',
    'rq',
    'revelarquizanimais'
  ],
  categoria: 'jogos',
  info: {
    descricao: 'Revela o animal atual do Quiz Animais.',
    uso: 'revelarquiz',
    categoria: 'jogos'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!ctx.isGroupAdmins)
      return ctx.reply(ctx.mess.soadm())

    if (!await jogo.revelar(ctx))
      return ctx.reply(
        'Não há Quiz Animais em andamento neste grupo.'
      )
  }
})
