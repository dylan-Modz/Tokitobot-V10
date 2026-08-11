const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'comprarpokemon',
  comandos: ['comprarpokemon', 'comprarpoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Compra um Pokémon.',
    uso: 'comprarpokemon pikachu',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const tipo = String(ctx.args?.[0] || '').toLowerCase()
    const p = r.POKEMON[tipo]
    if (!p)
      return ctx.reply(ctx.mess.pokemonInvalido(ctx.prefix))
    if (['Raro', 'Lendário'].includes(p.raridade) && !ctx.isVip)
      return ctx.reply(ctx.mess.onlyVipUser())
    const u = r.user(ctx)
    const e = r.eco(ctx)
    if (u.pokemon)
      return ctx.reply(ctx.mess.pokemonJaTem())
    if (e.coins < p.preco)
      return ctx.reply(ctx.mess.coinsSemSaldo(p.preco, e.coins))
    e.coins -= p.preco
    u.pokemon = {
      tipo,
      apelido: null,
      fome: 100,
      xp: 0,
      nivel: 1,
      afeto: 0,
      criadoEm: Date.now(),
      ultimaComida: Date.now(),
      ultimaMissao: 0
    }
    r.salvar(ctx)
    return ctx.reply(ctx.mess.pokemonComprado(p, e.coins))
  }
}
