const r = require('../../sistemas/rpg/index')
const p = require('../../sistemas/rpg/pokemon-core')

module.exports = {
  nome: 'evento-pokemon-selvagem',
  categoria: 'eventos',
  fase: 'normal',
  prioridade: 25,

  async evento(ctx) {
    if (!ctx.isGroup || ctx.info?.key?.fromMe || ctx.isCmd || !ctx.body || !r.ambos(ctx))
      return false

    const m = p.mundo(ctx)

    const leilao = p.finalizarLeilao(ctx)
    if (leilao && leilao.texto)
      await ctx.reply(p.compacto(ctx, '🔨', 'Leilão Pokémon', [{ emoji: leilao.vendido ? '✅' : '📌', texto: leilao.texto }])).catch(() => {})

    if (m.raid && Number(m.raid.terminaEm || 0) <= Date.now()) {
      const nome = m.raid.nome
      m.raid = null
      r.salvar(ctx)
      await ctx.reply(p.compacto(ctx, '🐉', 'Raid encerrada', [{ emoji: '⏰', texto: nome + ' escapou porque o tempo da raid acabou' }])).catch(() => {})
    }

    if (m.selvagem && Number(m.selvagem.expiraEm || 0) <= Date.now()) {
      m.selvagem = null
      r.salvar(ctx)
    }

    if (m.selvagem)
      return false

    const intervalo = Date.now() - Number(m.ultimoSpawn || 0)
    if (intervalo < 8 * 60 * 1000)
      return false

    const lure = Number(m.lureAte || 0) > Date.now()
    const chance = lure ? 0.08 : 0.012
    if (Math.random() >= chance)
      return false

    const wild = p.spawn(ctx, { origem: lure ? 'lure' : 'selvagem' })
    if (!wild)
      return false

    const sp = p.especie(wild.id)
    const legenda = p.compacto(ctx, wild.shiny ? '✨' : '🌿', 'Pokémon selvagem', [
      { emoji: wild.shiny ? '✨' : '👀', texto: 'Um ' + wild.nome + (wild.shiny ? ' SHINY' : '') + ' apareceu no grupo' },
      { emoji: '⭐', texto: 'Nível: ' + wild.nivel },
      { emoji: '🧬', texto: 'Tipo: ' + p.tipos(sp).join(' / ') },
      { emoji: '🔴', texto: 'Use ' + ctx.prefix + 'capturar pokeball para tentar capturar' },
      { emoji: '⏱️', texto: 'Ele ficará por aproximadamente 2 minutos' }
    ])

    await p.enviarComImagem(ctx, p.imagem(sp), legenda).catch(() => {})
    return false
  }
}
