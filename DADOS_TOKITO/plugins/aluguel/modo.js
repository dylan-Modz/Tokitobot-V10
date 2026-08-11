const fs = require('fs')
const path = require('path')

module.exports = {
  nome: 'modoaluguel',
  comandos: ['modoaluguel'],
  categoria: 'aluguel',
  info: {
    descricao: 'Ativa ou desativa o bloqueio por aluguel.',
    uso: 'modoaluguel',
    permissao: 'Dono',
    categoria: 'aluguel'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    ctx.nescessario.aluguel = !ctx.nescessario.aluguel
    const arq = path.join(process.cwd(), 'DADOS_TOKITO', 'INFO_DADOS', 'nescessario.json')
    const t = arq + '.tmp'
    fs.writeFileSync(t, JSON.stringify(ctx.nescessario, null, 2) + '\n')
    fs.renameSync(t, arq)
    return ctx.reply(ctx.mess.aluguelModo(ctx.nescessario.aluguel))
  }
}
