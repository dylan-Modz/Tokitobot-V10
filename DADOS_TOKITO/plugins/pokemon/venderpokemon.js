const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'venderpokemon',
  comandos: ['venderpokemon', 'venderpoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Vende seu Pokémon por 50% do preço.',
    uso: 'venderpokemon',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const u = r.user(ctx)
    const p = u.pokemon
    if (!p)
      return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
    const valor = Math.floor((r.POKEMON[p.tipo]?.preco || 1000) / 2)
    const e = r.eco(ctx)
    e.coins += valor
    u.pokemon = null
    r.salvar(ctx)
    return ctx.reply(ctx.mess.pokemonVendido(valor, e.coins))
  }
}
