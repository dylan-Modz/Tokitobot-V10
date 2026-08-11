const regras = require('../../sistemas/permissoes')

module.exports = {
  nome: 'unblockcmd',
  comandos: ['unblockcmd'],
  categoria: 'admin',
  info: {
    descricao: 'Desbloqueia um comando no grupo atual.',
    uso: 'unblockcmd comando',
    permissao: 'ADM',
    categoria: 'admin'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())
    const nome = String(ctx.q || '').trim().split(/\s+/)[0]
    if (!nome)
      return ctx.reply(ctx.mess.blockCmdUso(ctx.prefix))
    const r = regras.unblock(ctx.nescessario, ctx.from, nome)
    if (!r.ok)
      return ctx.reply(ctx.mess.blockCmdNao(r.nome))
    return ctx.reply(ctx.mess.blockCmdRemovido(r.nome))
  }
}
