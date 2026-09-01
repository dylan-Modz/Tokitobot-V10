const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const { compacto } = require('../../sistemas/rpg/texto')

dylan.setCommand({
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
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const usuario = r.user(ctx)
    const pokemon = usuario.pokemon

    if (!pokemon)
      return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))

    r.normalizarPokemon(pokemon)

    if (pokemon.dormindo) {
      return ctx.reply(compacto(ctx, '😴', 'Pokémon dormindo', [
          { emoji: '📌', texto: `Use ${ctx.prefix}acordarpokemon primeiro` }
      ]))
    }

    const id = String(ctx.args?.[0] || 'berry').toLowerCase()
    const comida = r.POKEMON_COMIDA[id]

    if (!comida)
      return ctx.reply(ctx.mess.pokemonComidas(r.POKEMON_COMIDA, ctx.prefix))

    const economia = r.eco(ctx)
    let custo = 0

    if (Number(usuario.inventarioPokemon?.[id] || 0) > 0) {
      usuario.inventarioPokemon[id] -= 1
      if (usuario.inventarioPokemon[id] <= 0)
        delete usuario.inventarioPokemon[id]
    }
    else {
      custo = comida.preco
      if (Number(economia.coins || 0) < custo)
        return ctx.reply(ctx.mess.coinsSemSaldo(custo, economia.coins))

      economia.coins -= custo
    }

    pokemon.fome = r.limitar(Number(pokemon.fome || 0) + comida.fome)
    pokemon.energia = r.limitar(Number(pokemon.energia || 0) + Math.max(5, Math.floor(comida.fome / 4)))
    pokemon.saude = r.limitar(Number(pokemon.saude || 0) + Math.max(2, Math.floor(comida.fome / 12)))
    pokemon.xp = Number(pokemon.xp || 0) + 15
    pokemon.afeto = Number(pokemon.afeto || 0) + 2
    pokemon.nivel = 1 + Math.floor(pokemon.xp / 100)
    pokemon.ultimaComida = Date.now()

    if (!Array.isArray(pokemon.diario))
      pokemon.diario = []

    pokemon.diario.unshift({
      texto: `Comeu ${comida.nome}`,
      em: Date.now()
    })
    pokemon.diario = pokemon.diario.slice(0, 8)

    r.salvar(ctx)

    return ctx.reply(ctx.mess.pokemonAlimentado(comida, pokemon, economia.coins))
  }
})
