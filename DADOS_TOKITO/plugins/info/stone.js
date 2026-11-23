'use strict'
const dylan = require('../../database/lib/comandos')
const projetos = require('../../sistemas/divulgacao-projetos')

dylan.setCommand({
  nome: 'stone',
  comandos: ['stone', 'stonewpp'],
  categoria: 'info',
  info: {
    descricao: 'Apresenta Stone WPP, biblioteca, npm, gateway e Studio.',
    uso: 'stone',
    categoria: 'info'
  },
  async executar(ctx) {
    return projetos.enviar(ctx, 'stone')
  }
})
