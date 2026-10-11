/* TOKITO BOT V10 • filme • Author: Dylan Modz */
const dylan = require('../../database/lib/comandos')
const consultas = require('../../scrapers/downloads/consultas')

dylan.setCommand({
  nome: 'filme',
  comandos: ['filme'],
  categoria: 'downloads',
  info: {
    descricao: 'Pesquisa filmes e mostra pôster e dados.',
    uso: 'filme interestelar',
    categoria: 'downloads'
  },
  async executar(ctx) {
    return consultas.executar(ctx, 'filme')
  }
})
