const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'lojapokemon',
  comandos: ['lojapokemon', 'lojapoke', 'pokeshop', 'lojararospokemon', 'lojararospoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Mostra a loja de Pokémon.',
    uso: 'lojapokemon',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const raro = ctx.command.includes('raro')
    const itens = Object.entries(r.POKEMON).filter(([, p]) => raro ? ['Raro', 'Lendário'].includes(p.raridade) : p.raridade === 'Comum')
    if (raro && !ctx.isVip)
      return ctx.reply(ctx.mess.onlyVipUser())
    return ctx.reply(ctx.mess.pokemonShop(itens, ctx.prefix, raro))
  }
}
