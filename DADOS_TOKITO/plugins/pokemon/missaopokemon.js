const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'missaopokemon',
  comandos: ['missaopokemon', 'missaopoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Envia seu Pokémon para uma missão e recebe N-Coins/XP.',
    uso: 'missaopokemon',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const p = r.user(ctx).pokemon
    if (!p)
      return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
    const cd = 10 * 60 * 1000
    const agora = Date.now()
    if (agora - Number(p.ultimaMissao || 0) < cd)
      return ctx.reply(ctx.mess.coinsCooldown(Math.ceil((cd - (agora - p.ultimaMissao)) / 1000)))
    const ganho = Math.floor(Math.random() * 1001) + 300
    const xp = Math.floor(Math.random() * 61) + 40
    const e = r.eco(ctx)
    e.coins += ganho
    p.xp = Number(p.xp || 0) + xp
    p.nivel = 1 + Math.floor(p.xp / 100)
    p.fome = Math.max(0, Number(p.fome || 100) - 20)
    p.ultimaMissao = agora
    r.salvar(ctx)
    return ctx.reply(ctx.mess.pokemonMissao(p, ganho, xp, e.coins))
  }
}
