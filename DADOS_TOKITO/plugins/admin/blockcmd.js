const regras = require('../../sistemas/permissoes')

module.exports = {
  nome: 'blockcmd',
  comandos: ['blockcmd'],
  categoria: 'admin',
  info: {
    descricao: 'Bloqueia um comando somente no grupo atual.',
    uso: 'blockcmd comando',
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
    const r = regras.block(ctx.nescessario, ctx.from, nome)
    if (r.motivo === 'inexistente')
      return ctx.reply(ctx.mess.vipCmdInexistente(nome))
    if (r.motivo === 'ja')
      return ctx.reply(ctx.mess.blockCmdJa(r.nome))
    return ctx.reply(ctx.mess.blockCmdAdicionado(r.nome))
  }
}
