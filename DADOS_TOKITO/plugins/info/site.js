'use strict'
const dylan = require('../../database/lib/comandos')
const projetos = require('../../sistemas/divulgacao-projetos')

dylan.setCommand({
  nome: 'site',
  comandos: ['site', 'tokitoapis'],
  categoria: 'info',
  info: {
    descricao: 'Apresenta a Tokito APIs, serviços Free Fire e plataforma.',
    uso: 'site',
    categoria: 'info'
  },
  async executar(ctx) {
    return projetos.enviar(ctx, 'site')
  }
})
