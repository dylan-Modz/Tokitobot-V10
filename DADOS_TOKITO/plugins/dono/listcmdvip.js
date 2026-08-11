const regras = require('../../sistemas/permissoes')

module.exports = {
  nome: 'listcmdvip',
  comandos: ['listcmdvip'],
  categoria: 'dono',
  info: {
    descricao: 'Lista comandos exclusivos para VIP.',
    uso: 'listcmdvip',
    permissao: 'Dono',
    categoria: 'dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    regras.garantir(ctx.nescessario)
    return ctx.reply(ctx.mess.vipCmdLista(ctx.nescessario.vipcmd))
  }
}
