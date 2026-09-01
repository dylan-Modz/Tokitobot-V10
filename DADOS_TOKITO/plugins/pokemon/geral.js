const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const { compacto, dinheiro } = require('../../sistemas/rpg/texto')

dylan.setCommand({
  nome: 'pokemoninventario',
  comandos: [
    'mercadopokemon',
    'mercadopoke',
    'comprarcomidapokemon',
    'comprarcomidapoke',
    'inventariopokemon',
    'inventariopoke'
  ],
  categoria: 'pokemon',
  info: {
    descricao: 'Mercado de comidas e inventário do sistema Pokémon.',
    uso: 'mercadopokemon',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const comando = String(ctx.command || '').toLowerCase()
    const usuario = r.user(ctx)
    const economia = r.eco(ctx)

    if (['mercadopokemon', 'mercadopoke'].includes(comando))
      return ctx.reply(ctx.mess.pokemonComidas(r.POKEMON_COMIDA, ctx.prefix))

    if (['comprarcomidapokemon', 'comprarcomidapoke'].includes(comando)) {
      const id = String(ctx.args?.[0] || '').toLowerCase()
      const comida = r.POKEMON_COMIDA[id]
      const quantidade = Math.min(
        20,
        Math.max(1, Number(ctx.args?.[1] || 1))
      )

      if (!comida)
        return ctx.reply(ctx.mess.pokemonComidas(r.POKEMON_COMIDA, ctx.prefix))

      const total = Number(comida.preco || 0) * quantidade

      if (Number(economia.coins || 0) < total)
        return ctx.reply(ctx.mess.coinsSemSaldo(total, economia.coins))

      economia.coins -= total
      usuario.inventarioPokemon[id] =
        Number(usuario.inventarioPokemon[id] || 0) + quantidade

      r.salvar(ctx)

      return ctx.reply(compacto(ctx, comida.emoji, 'Compra Pokémon', [
        {
          emoji: comida.emoji,
          texto: `${comida.nome} x${quantidade}`
        },
        {
          emoji: '💸',
          texto: `Custo: ${dinheiro(total)}`
        },
        {
          emoji: '🎒',
          texto: `Inventário: ${usuario.inventarioPokemon[id]} unidade(s)`
        },
        {
          emoji: '🪙',
          texto: `Saldo: ${dinheiro(economia.coins)}`
        }
      ]))
    }

    const itens = Object.entries(usuario.inventarioPokemon || {})
      .filter(([, quantidade]) => Number(quantidade) > 0)

    const linhas = itens.length
      ? itens.map(([id, quantidade]) => ({
          emoji: r.POKEMON_COMIDA[id]?.emoji || '📦',
          texto: `${r.POKEMON_COMIDA[id]?.nome || id} x${quantidade}`
        }))
      : [
          {
            emoji: '📭',
            texto: 'Seu inventário Pokémon está vazio'
          }
        ]

    return ctx.reply(compacto(ctx, '🎒', 'Inventário Pokémon', linhas))
  }
})
