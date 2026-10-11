/* TOKITO BOT V10 • robloxstalker • Author: Dylan Modz */
const dylan = require('../../database/lib/comandos')
const consultas = require('../../scrapers/downloads/consultas')

dylan.setCommand({
  nome: 'robloxstalker',
  comandos: ['robloxstalker'],
  categoria: 'info',
  info: {
    descricao: 'Consulta perfis do Roblox com avatar e dados.',
    uso: 'robloxstalker PixelYoshi',
    categoria: 'info'
  },
  async executar(ctx) {
    return consultas.executar(ctx, 'robloxstalker')
  }
})
