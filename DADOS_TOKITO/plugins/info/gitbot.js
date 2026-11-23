'use strict'
const dylan = require('../../database/lib/comandos')
const projetos = require('../../sistemas/divulgacao-projetos')

dylan.setCommand({
  nome: 'gitbot',
  comandos: ['gitbot'],
  categoria: 'info',
  info: {
    descricao: 'Apresenta o Tokito Bot, suas funções e GitHub oficial.',
    uso: 'gitbot',
    categoria: 'info'
  },
  async executar(ctx) {
    return projetos.enviar(ctx, 'gitbot')
  }
})
