const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'minerar',
  comandos: ['minerar', 'mine'],
  categoria: 'coins',
  info: {
    descricao: 'Minera N-Coins com tempo de espera.',
    uso: 'minerar',
    requisitos: 'Modo Coins',
    categoria: 'coins'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!r.temCoins(ctx))
      return ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))
    const u = r.eco(ctx)
    const agora = Date.now()
    const cd = 5 * 60 * 1000
    if (agora - Number(u.ultimoMinerar || 0) < cd)
      return ctx.reply(ctx.mess.coinsCooldown(Math.ceil((cd - (agora - u.ultimoMinerar)) / 1000)))
    const ganho = Math.floor(Math.random() * 451) + 100
    u.coins += ganho
    u.ultimoMinerar = agora
    u.chances.minerar = Number(u.chances.minerar || 0) + 1
    r.salvar(ctx)
    return ctx.reply(ctx.mess.coinsMinerado(ctx.sender, ganho, u.coins), [ctx.sender])
  }
}
