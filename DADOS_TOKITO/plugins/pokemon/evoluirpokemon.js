const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'evoluirpokemon',
  comandos: ['evoluirpokemon', 'evoluirpoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Evolui seu Pokémon quando alcança o nível necessário.',
    uso: 'evoluirpokemon',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const p = r.user(ctx).pokemon
    if (!p)
      return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
    const d = r.POKEMON[p.tipo]
    if (!d?.evolui)
      return ctx.reply(ctx.mess.pokemonNaoEvolui())
    if (Number(p.nivel || 1) < Number(d.nivel || 999))
      return ctx.reply(ctx.mess.pokemonNivelEvoluir(d.nivel))
    const ant = d.nome
    p.tipo = d.evolui
    p.xp = Number(p.xp || 0) + 100
    p.nivel = 1 + Math.floor(p.xp / 100)
    r.salvar(ctx)
    return ctx.reply(ctx.mess.pokemonEvoluiu(ant, r.POKEMON[p.tipo]?.nome || p.tipo))
  }
}
