/* TOKITO BOT V10 • noticias • Author: Dylan Modz */
const dylan = require('../../database/lib/comandos')
const consultas = require('../../scrapers/downloads/consultas')

dylan.setCommand({
  nome: 'noticias',
  comandos: ['noticias'],
  categoria: 'info',
  info: {
    descricao: 'Mostra notícias do Brasil.',
    uso: 'noticias',
    categoria: 'info'
  },
  async executar(ctx) {
    return consultas.executar(ctx, 'noticias')
  }
})
