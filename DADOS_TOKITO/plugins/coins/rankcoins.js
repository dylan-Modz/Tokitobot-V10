const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'rankcoins',
  comandos: ['rankcoins', 'rankingcoins'],
  categoria: 'coins',
  info: {
    descricao: 'Mostra o ranking de N-Coins do grupo.',
    uso: 'rankcoins',
    requisitos: 'Modo Coins',
    categoria: 'coins'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!r.temCoins(ctx))
      return ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))
    return ctx.reply(ctx.mess.coinsRank(r.rank(ctx, 'coins').slice(0, 10)), r.rank(ctx, 'coins').slice(0, 10).map(x => x.jid))
  }
}
