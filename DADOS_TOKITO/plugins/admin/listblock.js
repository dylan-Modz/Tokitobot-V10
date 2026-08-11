const regras = require('../../sistemas/permissoes')

module.exports = {
  nome: 'listblock',
  comandos: ['listblock', 'listblockcmd'],
  categoria: 'admin',
  info: {
    descricao: 'Lista comandos bloqueados no grupo.',
    uso: 'listblock',
    permissao: 'ADM',
    categoria: 'admin'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())
    regras.garantir(ctx.nescessario)
    return ctx.reply(ctx.mess.blockCmdLista(ctx.nescessario.blockcmd[ctx.from] || []))
  }
}
