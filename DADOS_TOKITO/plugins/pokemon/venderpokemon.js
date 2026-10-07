const r = require('../../sistemas/rpg/index')
const p = require('../../sistemas/rpg/pokemon-core')
const dylan = require('../../database/lib/comandos')
const { compacto, dinheiro } = require('../../sistemas/rpg/texto')

dylan.setCommand({
  nome: 'venderpokemon',
  comandos: ['venderpokemon', 'venderpoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Vende um Pokémon da coleção por 50% do preço.',
    uso: 'venderpokemon ID',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    if (!r.ambos(ctx)) return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const e = p.estado(ctx)
    const poke = p.resolverDaColecao(e.st, ctx.args?.[0]) || p.resolverDaColecao(e.st, e.st.principalUid)
    if (!poke) return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))
    if (poke.favorito) return ctx.reply(compacto(ctx, '⭐', 'Pokémon favorito', [{ emoji: '📌', texto: 'Desfavorite antes de vender este Pokémon' }]))

    const sp = p.especie(poke.id)
    const valor = Math.floor(Number(sp?.preco || r.POKEMON[poke.tipo]?.preco || 1000) / 2)
    const eco = r.eco(ctx)
    eco.coins = Number(eco.coins || 0) + valor

    e.st.colecao = e.st.colecao.filter(x => x.uid !== poke.uid)
    e.st.equipe = e.st.equipe.filter(x => x !== poke.uid)
    if (e.st.principalUid === poke.uid)
      e.st.principalUid = e.st.colecao[0]?.uid || null

    p.sincronizarLegacy(e.u, e.st)
    r.salvar(ctx)

    return ctx.reply(compacto(ctx, '💰', 'Pokémon vendido', [
      { emoji: '🔴', texto: poke.nome },
      { emoji: '🪙', texto: 'Você recebeu ' + dinheiro(valor) },
      { emoji: '📦', texto: 'Coleção: ' + e.st.colecao.length + ' Pokémon' }
    ]))
  }
})
