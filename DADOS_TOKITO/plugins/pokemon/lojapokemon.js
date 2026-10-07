const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const { compacto, dinheiro } = require('../../sistemas/rpg/texto')

dylan.setCommand({
  nome: 'lojapokemon',
  comandos: ['lojapokemon', 'lojapoke', 'pokeshop', 'lojararospokemon', 'lojararospoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Mostra a loja de Pokémon com paginação.',
    uso: 'lojapokemon 1 | lojararospokemon 1',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const cmd = String(ctx.command || '').toLowerCase()
    const raro = cmd.includes('raros')
    const pagina = Math.max(1, Number(ctx.args?.[0] || 1))
    const porPagina = 15

    const todos = Object.entries(r.POKEMON)
      .filter(([, x]) => raro ? x.raridade !== 'Comum' : x.raridade === 'Comum')
      .sort((a, b) => Number(a[1].id || 0) - Number(b[1].id || 0))

    const totalPaginas = Math.max(1, Math.ceil(todos.length / porPagina))
    const atual = Math.min(pagina, totalPaginas)
    const itens = todos.slice((atual - 1) * porPagina, atual * porPagina)

    const linhas = itens.map(([id, x]) => ({
      emoji: x.raridade === 'Lendário' ? '✨' : x.raridade === 'Raro' ? '💎' : x.raridade === 'Evoluído' ? '🔵' : '🔴',
      texto: '#' + x.id + ' ' + x.nome + ' • ' + x.tipo + ' • ' + x.raridade + ' • ' + dinheiro(x.preco) + ' • comprar: ' + ctx.prefix + 'comprarpokemon ' + id
    }))

    linhas.push({ emoji: '📄', texto: 'Página ' + atual + '/' + totalPaginas + ' • ' + todos.length + ' Pokémon nesta loja' })
    if (atual < totalPaginas)
      linhas.push({ emoji: '➡️', texto: 'Próxima: ' + ctx.prefix + (raro ? 'lojararospokemon ' : 'lojapokemon ') + (atual + 1) })

    return ctx.reply(compacto(ctx, raro ? '💎' : '🔴', raro ? 'Loja Pokémon Raros' : 'Loja Pokémon', linhas))
  }
})
