const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'addxp',
  comandos: ['addxp', 'addlevel', 'tirarxp', 'removexp', 'tirarlevel'],
  categoria: 'dono',
  info: {
    descricao: 'Gerencia XP do sistema de Level.',
    uso: 'addxp @usuario quantidade',
    permissao: 'Dono',
    categoria: 'rpg'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    const alvo = ctx.normalizar((ctx.menc_jid2 || [])[0] || ctx.menc_prt || ctx.sender)
    const v = Number(String(ctx.q || '').replace(/@\S+/g, '').replace(/\D/g, ''))
    if (!v)
      return ctx.reply(ctx.mess.levelGerenciarUso(ctx.prefix, ctx.command))
    const u = r.user(ctx, alvo)
    const rem = /tirar|remove/.test(ctx.command)
    u.xp = Math.max(0, Number(u.xp || 0) + (rem ? -v : v))
    u.level = r.nivelPorXp(u.xp)
    u.patente = r.patente(u.xp)
    r.salvar(ctx)
    return ctx.reply(ctx.mess.levelGerenciado(alvo, u, rem), [alvo])
  }
}
