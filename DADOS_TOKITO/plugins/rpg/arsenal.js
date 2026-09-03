const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const {
  compacto,
  enviarComImagem
} = require('../../sistemas/rpg/texto')

const nomesMateriais = {
  ferro: 'Ferro',
  madeira: 'Madeira',
  cristal: 'Cristal',
  essencia: 'Essência'
}

const custoTexto = custo => {
  return Object.entries(custo)
    .map(([material, quantidade]) => `${quantidade} ${nomesMateriais[material] || material}`)
    .join(' • ')
}

dylan.setCommand({
  nome: 'arsenal',
  comandos: ['arsenal', 'forjar', 'equipar'],
  categoria: 'rpg',
  info: {
    descricao: 'Materiais, criação e equipamento de armas da jornada.',
    uso: 'forjar espada',
    requisitos: 'Modo RPG',
    categoria: 'rpg'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.temRpg(ctx))
      return ctx.reply(ctx.mess.rpgDesativado(ctx.prefix))

    const comando = String(ctx.command || '').toLowerCase()
    const usuario = r.user(ctx)
    const aventura = r.normalizarAventura(usuario)

    if (!aventura.classe) {
      return ctx.reply(compacto(ctx, '🧭', 'Jornada não iniciada', [
        { emoji: '📌', texto: `Escolha sua classe com ${ctx.prefix}classe` }
      ]))
    }

    if (comando === 'arsenal') {
      const armas = Object.entries(aventura.armas || {})
        .filter(([, quantidade]) => Number(quantidade) > 0)
        .map(([id, quantidade]) => {
          const arma = r.ARMAS_RPG[id]
          const equipada = aventura.armaEquipada === id ? ' • Equipada' : ''

          return {
            emoji: arma?.emoji || '🗡️',
            texto: `${arma?.nome || id} x${quantidade}${equipada}`
          }
        })

      const materiais = Object.entries(aventura.materiais || {}).map(([id, quantidade]) => ({
        emoji: id === 'cristal' ? '💎' : id === 'essencia' ? '✨' : id === 'madeira' ? '🪵' : '⛓️',
        texto: `${nomesMateriais[id] || id}: ${Number(quantidade || 0)}`
      }))

      const equipada = r.ARMAS_RPG[aventura.armaEquipada]

      return enviarComImagem(
        ctx,
        r.imagemRpg('armas', aventura.armaEquipada || 'espada'),
        compacto(ctx, '🎒', 'Arsenal', [
          { emoji: '⚔️', texto: `Poder total: ${r.poderAventureiro(usuario)}` },
          { emoji: '🗡️', texto: `Equipada: ${equipada?.nome || 'Nenhuma'}` },
          ...materiais,
          ...(armas.length ? armas : [{ emoji: '📭', texto: 'Nenhuma arma forjada' }]),
          { emoji: '📌', texto: `Use ${ctx.prefix}forjar para ver as receitas` }
        ])
      )
    }

    const id = String(ctx.args?.[0] || '').toLowerCase()
    const arma = r.ARMAS_RPG[id]

    if (!arma) {
      return ctx.reply(compacto(ctx, '⚒️', 'Armas disponíveis', Object.entries(r.ARMAS_RPG).map(([chave, item]) => ({
        emoji: item.emoji,
        texto: `${item.nome} • +${item.poder} poder • ${custoTexto(item.custo)} • ${ctx.prefix}forjar ${chave}`
      }))))
    }

    if (comando === 'forjar') {
      if (arma.classe !== aventura.classe) {
        return ctx.reply(compacto(ctx, '🔒', 'Arma incompatível', [
          { emoji: arma.emoji, texto: `${arma.nome} pertence à classe ${r.CLASSES_RPG[arma.classe]?.nome || arma.classe}` },
          { emoji: '🧭', texto: `Sua classe: ${r.CLASSES_RPG[aventura.classe]?.nome || aventura.classe}` }
        ]))
      }

      const faltando = Object.entries(arma.custo).filter(([material, quantidade]) => {
        return Number(aventura.materiais?.[material] || 0) < quantidade
      })

      if (faltando.length) {
        return ctx.reply(compacto(ctx, '📦', 'Materiais insuficientes', [
          { emoji: arma.emoji, texto: `${arma.nome}: ${custoTexto(arma.custo)}` },
          ...faltando.map(([material, quantidade]) => ({
            emoji: '❌',
            texto: `${nomesMateriais[material] || material}: possui ${Number(aventura.materiais?.[material] || 0)}, precisa ${quantidade}`
          })),
          { emoji: '🗺️', texto: `Consiga materiais em ${ctx.prefix}aventura, ${ctx.prefix}torre e ${ctx.prefix}masmorra` }
        ]))
      }

      for (const [material, quantidade] of Object.entries(arma.custo))
        r.adicionarMaterial(usuario, material, -quantidade)

      aventura.armas[id] = Number(aventura.armas[id] || 0) + 1

      if (!aventura.armaEquipada)
        aventura.armaEquipada = id

      r.addXp(ctx, 35)
      r.salvar(ctx)

      return enviarComImagem(
        ctx,
        r.imagemRpg('armas', id),
        compacto(ctx, arma.emoji, 'Arma forjada', [
          { emoji: arma.emoji, texto: arma.nome },
          { emoji: '⚔️', texto: `Bônus de poder: +${arma.poder}` },
          { emoji: '✨', texto: '+35 XP' },
          { emoji: '🎒', texto: `Quantidade: ${aventura.armas[id]}` },
          { emoji: '📌', texto: `Use ${ctx.prefix}equipar ${id}` }
        ])
      )
    }

    if (Number(aventura.armas?.[id] || 0) <= 0) {
      return ctx.reply(compacto(ctx, '📭', 'Arma não encontrada', [
        { emoji: '📌', texto: `Forje primeiro com ${ctx.prefix}forjar ${id}` }
      ]))
    }

    aventura.armaEquipada = id
    r.salvar(ctx)

    return enviarComImagem(
      ctx,
      r.imagemRpg('armas', id),
      compacto(ctx, arma.emoji, 'Arma equipada', [
        { emoji: arma.emoji, texto: arma.nome },
        { emoji: '⚔️', texto: `Poder total: ${r.poderAventureiro(usuario)}` }
      ])
    )
  }
})
