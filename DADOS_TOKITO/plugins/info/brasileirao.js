/* TOKITO BOT V10 • brasileirao • Author: Dylan Modz */
const dylan = require('../../database/lib/comandos')
const consultas = require('../../scrapers/downloads/consultas')

dylan.setCommand({
  nome: 'brasileirao',
  comandos: ['brasileirao'],
  categoria: 'info',
  info: {
    descricao: 'Mostra classificação, artilharia e jogos do Brasileirão.',
    uso: 'brasileirao',
    categoria: 'info'
  },
  async executar(ctx) {
    return consultas.executar(ctx, 'brasileirao')
  }
})
