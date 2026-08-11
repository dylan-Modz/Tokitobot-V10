const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'addcoins',
  comandos: ['addcoins', 'removecoins', 'tirarcoins'],
  categoria: 'dono',
  info: {
    descricao: 'Adiciona ou remove N-Coins de um usuário.',
    uso: 'addcoins @usuario valor',
    permissao: 'Dono',
    categoria: 'coins'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    const alvo = ctx.normalizar((ctx.menc_jid2 || [])[0] || ctx.menc_prt || ctx.sender)
    const valor = Number(String(ctx.q || '').replace(/@\S+/g, '').replace(/\D/g, ''))
    if (!valor)
      return ctx.reply(ctx.mess.coinsGerenciarUso(ctx.prefix, ctx.command))
    const u = r.eco(ctx, alvo)
    const rem = /remove|tirar/.test(ctx.command)
    u.coins = Math.max(0, Number(u.coins || 0) + (rem ? -valor : valor))
    r.salvar(ctx)
    return ctx.reply(ctx.mess.coinsGerenciado(alvo, u.coins, rem), [alvo])
  }
}
