const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'rankpokemon',
  comandos: ['rankpokemon', 'rankpoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Ranking de Pokémon por XP.',
    uso: 'rankpokemon',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    r.garantir(ctx)
    const l = Object.entries(ctx.dataGp[0].rpg.usuarios).filter(([, u]) => u.pokemon).map(([jid, u]) => ({
      jid,
      pokemon: u.pokemon
    })).sort((a, b) => (b.pokemon.xp || 0) - (a.pokemon.xp || 0)).slice(0, 10)
    return ctx.reply(ctx.mess.pokemonRank(l), l.map(x => x.jid))
  }
}
