const r = require('../../sistemas/rpg/index')
const p = require('../../sistemas/rpg/pokemon-core')
const dylan = require('../../database/lib/comandos')
const { compacto } = require('../../sistemas/rpg/texto')

dylan.setCommand({
  nome: 'evoluirpokemon',
  comandos: ['evoluirpokemon', 'evoluirpoke'],
  categoria: 'pokemon',
  info: {
    descricao: 'Evolui o Pokémon principal quando alcança o nível necessário.',
    uso: 'evoluirpokemon',
    requisitos: 'RPG + Coins',
    categoria: 'pokemon'
  },
  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    if (!r.ambos(ctx)) return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const e = p.principal(ctx)
    const atual = e.pokemon
    if (!atual) return ctx.reply(ctx.mess.pokemonNaoTem(ctx.prefix))

    const sp = p.especie(atual.id)
    const evo = sp?.evoluiId ? p.especie(sp.evoluiId) : null
    if (!evo) return ctx.reply(ctx.mess.pokemonNaoEvolui())

    const nivel = Number(sp.nivelEvolucao || 16)
    if (Number(atual.nivel || 1) < nivel)
      return ctx.reply(ctx.mess.pokemonNivelEvoluir(nivel))

    const antigo = atual.nome
    atual.id = evo.id
    atual.tipo = p.norm(evo.name)
    atual.nome = evo.name
    atual.stats = { ...(evo.stats || atual.stats) }
    const novos = p.golpesPadrao(evo)
    for (const golpe of novos)
      if (!atual.golpes.includes(golpe) && atual.golpes.length < 4) atual.golpes.push(golpe)

    p.marcar(e.st, evo, true)
    p.sincronizarLegacy(e.u, e.st)
    r.salvar(ctx)

    return ctx.reply(compacto(ctx, '✨', 'Evolução Pokémon', [
      { emoji: '✨', texto: antigo + ' evoluiu para ' + evo.name },
      { emoji: '⭐', texto: 'Nível atual: ' + atual.nivel },
      { emoji: '🧬', texto: 'Tipo: ' + p.tipos(evo).join(' / ') }
    ]))
  }
})
