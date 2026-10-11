/* TOKITO BOT V10 • serie • Author: Dylan Modz */
const dylan = require('../../database/lib/comandos')
const consultas = require('../../scrapers/downloads/consultas')

dylan.setCommand({
  nome: 'serie',
  comandos: ['serie'],
  categoria: 'downloads',
  info: {
    descricao: 'Pesquisa séries e mostra pôster e dados.',
    uso: 'serie breaking bad',
    categoria: 'downloads'
  },
  async executar(ctx) {
    return consultas.executar(ctx, 'serie')
  }
})
