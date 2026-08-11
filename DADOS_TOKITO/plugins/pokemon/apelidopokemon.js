const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'apelidopokemon',
  comandos: ['apelidopokemon', 'apelidopoke', 'nomepokemon'],
  categoria: 'pokemon',
  info: {
    descricao: 'Altera o apelido do Pokémon.',
    uso: 'apelidopokemon nome',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const p = r.user(ctx).pokemon
    if (!p)
      return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
    const nome = String(ctx.q || '').trim().slice(0, 30)
    if (!nome)
      return ctx.reply(ctx.mess.pokemonApelidoUso(ctx.prefix))
    p.apelido = nome
    r.salvar(ctx)
    return ctx.reply(ctx.mess.pokemonApelido(nome))
  }
}
