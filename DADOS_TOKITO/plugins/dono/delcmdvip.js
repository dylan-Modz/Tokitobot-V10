const regras = require('../../sistemas/permissoes')

module.exports = {
  nome: 'delcmdvip',
  comandos: ['delcmdvip'],
  categoria: 'dono',
  info: {
    descricao: 'Retira um comando da lista VIP.',
    uso: 'delcmdvip comando',
    permissao: 'Dono',
    categoria: 'dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    const nome = String(ctx.q || '').trim().split(/\s+/)[0]
    if (!nome)
      return ctx.reply(ctx.mess.vipCmdUso(ctx.prefix))
    const r = regras.delVip(ctx.nescessario, nome)
    if (!r.ok)
      return ctx.reply(ctx.mess.vipCmdNao(r.nome))
    return ctx.reply(ctx.mess.vipCmdRemovido(r.nome))
  }
}
