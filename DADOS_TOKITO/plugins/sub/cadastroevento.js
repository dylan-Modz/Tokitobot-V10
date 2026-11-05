const cadastro = require('../../sub/cadastro')
const runtime = require('../../sub/runtime')

module.exports = {
  nome: 'sub-cadastro',
  categoria: 'sub',
  prioridade: 1,
  async evento(ctx) {
    if (runtime.isSubBot) return false
    return cadastro.handle(ctx)
  }
}