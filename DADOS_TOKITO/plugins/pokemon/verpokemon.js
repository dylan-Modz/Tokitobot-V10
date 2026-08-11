const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'verpokemon',
  comandos: ['verpokemon', 'verpoke', 'pokemon', 'meupokemon'],
  categoria: 'pokemon',
  info: {
    descricao: 'Mostra seu Pokémon.',
    uso: 'verpokemon',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const p = r.user(ctx).pokemon
    if (!p)
      return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
    const texto = ctx.mess.pokemonPerfil(ctx.sender, p, r.POKEMON[p.tipo] || {})
    const img = r.imagemPokemon(p.tipo)
    if (img)
      try {
        return await ctx.tokito.sendMessage(ctx.from, {
          image: { url: img },
          caption: texto,
          contextInfo: ctx.canalInfo([ctx.sender])
        }, { quoted: ctx.selo })
      }
      catch {
      }
    return ctx.reply(texto, [ctx.sender])
  }
}
