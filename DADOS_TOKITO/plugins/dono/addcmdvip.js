const regras = require('../../sistemas/permissoes')

module.exports = {
  nome: 'addcmdvip',
  comandos: ['addcmdvip'],
  categoria: 'dono',
  info: {
    descricao: 'Torna um comando exclusivo para VIP.',
    uso: 'addcmdvip comando',
    permissao: 'Dono',
    categoria: 'dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    const nome = String(ctx.q || '').trim().split(/\s+/)[0]
    if (!nome)
      return ctx.reply(ctx.mess.vipCmdUso(ctx.prefix))
    const r = regras.addVip(ctx.nescessario, nome)
    if (r.motivo === 'inexistente')
      return ctx.reply(ctx.mess.vipCmdInexistente(nome))
    if (r.motivo === 'ja')
      return ctx.reply(ctx.mess.vipCmdJa(r.nome))
    return ctx.reply(ctx.mess.vipCmdAdicionado(r.nome))
  }
}
