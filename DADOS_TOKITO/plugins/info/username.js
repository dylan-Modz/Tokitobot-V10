/* TOKITO BOT V10 • username • Author: Dylan Modz */
const dylan = require('../../database/lib/comandos')
const consultas = require('../../scrapers/downloads/consultas')

dylan.setCommand({
  nome: 'username',
  comandos: ['username'],
  categoria: 'info',
  info: {
    descricao: 'Gera sugestões de nomes por tema.',
    uso: 'username Yoshi fantasia',
    categoria: 'info'
  },
  async executar(ctx) {
    return consultas.executar(ctx, 'username')
  }
})
