const r = require('../../sistemas/rpg/index')
const p = require('../../sistemas/rpg/pokemon-core')
const dylan = require('../../database/lib/comandos')
const { compacto, dinheiro } = require('../../sistemas/rpg/texto')

dylan.setCommand({
  nome: 'comprarpokemon',
  comandos: ['comprarpokemon', 'comprarpoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Compra um Pokémon e adiciona à coleção.',
    uso: 'comprarpokemon pikachu',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    if (!r.ambos(ctx)) return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const ref = ctx.args?.join(' ') || ''
    const sp = p.especie(ref)
    if (!sp) return ctx.reply(ctx.mess.pokemonInvalido(ctx.prefix))

    const raridade = p.raridade(sp)
    if (['Raro','Lendário','Mítico'].includes(raridade) && !ctx.isVip)
      return ctx.reply(ctx.mess.onlyVipUser())

    const preco = Number(sp.preco || 3000)
    const eco = r.eco(ctx)
    if (Number(eco.coins || 0) < preco)
      return ctx.reply(ctx.mess.coinsSemSaldo(preco, eco.coins))

    eco.coins -= preco
    const inst = p.adicionar(ctx, sp, { origem: 'loja', nivel: 1 })
    r.salvar(ctx)

    return ctx.reply(compacto(ctx, '🔴', 'Pokémon comprado', [
      { emoji: '🔴', texto: sp.name + ' foi adicionado à sua coleção' },
      { emoji: '🆔', texto: 'ID: ' + inst.uid.slice(0, 8) },
      { emoji: '💎', texto: 'Raridade: ' + raridade },
      { emoji: '🪙', texto: 'Custo: ' + dinheiro(preco) },
      { emoji: '🪙', texto: 'Saldo: ' + dinheiro(eco.coins) }
    ]))
  }
})
