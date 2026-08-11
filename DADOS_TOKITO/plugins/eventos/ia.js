const ia = require('../../ia')

module.exports = {
  nome: 'evento-ia',
  categoria: 'eventos',
  async evento(ctx) {
    return ia.evento(ctx)
  }
}
