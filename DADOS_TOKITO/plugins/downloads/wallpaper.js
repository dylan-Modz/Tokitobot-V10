/* TOKITO BOT V10 • wallpaper • Author: Dylan Modz */
const dylan = require('../../database/lib/comandos')
const consultas = require('../../scrapers/downloads/consultas')

dylan.setCommand({
  nome: 'wallpaper',
  comandos: ['wallpaper'],
  categoria: 'downloads',
  info: {
    descricao: 'Pesquisa e envia wallpapers.',
    uso: 'wallpaper sukuna',
    categoria: 'downloads'
  },
  async executar(ctx) {
    return consultas.executar(ctx, 'wallpaper')
  }
})
