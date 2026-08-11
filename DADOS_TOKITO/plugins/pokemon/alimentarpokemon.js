const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'alimentarpokemon',
  comandos: ['alimentarpokemon', 'alimentarpoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Alimenta seu Pokémon.',
    uso: 'alimentarpokemon berry',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const p = r.user(ctx).pokemon
    if (!p)
      return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
    const item = String(ctx.args?.[0] || 'berry').toLowerCase()
    const c = r.POKEMON_COMIDA[item]
    if (!c)
      return ctx.reply(ctx.mess.pokemonComidas(r.POKEMON_COMIDA, ctx.prefix))
    const e = r.eco(ctx)
    if (e.coins < c.preco)
      return ctx.reply(ctx.mess.coinsSemSaldo(c.preco, e.coins))
    e.coins -= c.preco
    p.fome = Math.min(100, Number(p.fome || 0) + c.fome)
    p.xp = Number(p.xp || 0) + 15
    p.afeto = Number(p.afeto || 0) + 2
    p.nivel = 1 + Math.floor(p.xp / 100)
    p.ultimaComida = Date.now()
    r.salvar(ctx)
    return ctx.reply(ctx.mess.pokemonAlimentado(c, p, e.coins))
  }
}
