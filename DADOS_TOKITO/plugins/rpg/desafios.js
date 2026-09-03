const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const {
  compacto,
  dinheiro,
  tempo,
  enviarComImagem
} = require('../../sistemas/rpg/texto')

const cooldown = (ultimo, duracao) => {
  const falta = duracao - (Date.now() - Number(ultimo || 0))
  return falta > 0 ? Math.ceil(falta / 1000) : 0
}

const exigirClasse = (ctx, aventura) => {
  if (aventura.classe)
    return true

  ctx.reply(compacto(ctx, '🧭', 'Escolha uma classe', [
    { emoji: '📌', texto: `Use ${ctx.prefix}classe` }
  ]))

  return false
}

const recompensar = (ctx, usuario, xp, coins, material, quantidade) => {
  r.addXp(ctx, xp)
  r.adicionarMaterial(usuario, material, quantidade)
  r.adicionarPontosGuilda(ctx, usuario, Math.max(1, Math.floor(xp / 2)))

  if (r.temCoins(ctx)) {
    const economia = r.eco(ctx)
    economia.coins = Number(economia.coins || 0) + Number(coins || 0)
  }
}

const alvo = async ctx => {
  const destino = await ctx.destino().catch(() => null)
  return destino?.mencao ? ctx.normalizar(destino.mencao) : null
}

dylan.setCommand({
  nome: 'desafios',
  comandos: ['torre', 'masmorra', 'boss', 'raid'],
  categoria: 'rpg',
  info: {
    descricao: 'Torre, masmorra, bosses e raids cooperativas.',
    uso: 'boss dragao',
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

    if (!exigirClasse(ctx, aventura))
      return

    if (comando === 'torre') {
      const falta = cooldown(aventura.ultimaTorre, 8 * 60 * 1000)

      if (falta) {
        return ctx.reply(compacto(ctx, '⏳', 'Torre em espera', [
          { emoji: '⏱️', texto: `Tente novamente em ${tempo(falta)}` }
        ]))
      }

      if (Number(aventura.energia || 0) < 15) {
        return ctx.reply(compacto(ctx, '⚡', 'Energia insuficiente', [
          { emoji: '📊', texto: `Energia: ${aventura.energia}%` },
          { emoji: '🏕️', texto: `Use ${ctx.prefix}descansarheroi` }
        ]))
      }

      const andar = Number(aventura.andarTorre || 0) + 1
      const poder = r.poderAventureiro(usuario)
      const dificuldade = 25 + andar * 7
      const venceu = poder + r.aleatorio(1, 70) >= dificuldade
      const xp = venceu ? 22 + andar * 3 : 8
      const coins = venceu ? 160 + andar * 35 : 0
      const material = andar % 5 === 0 ? 'cristal' : 'ferro'
      const quantidade = venceu ? Math.min(6, 1 + Math.floor(andar / 5)) : 0

      aventura.energia = r.limitar(Number(aventura.energia || 0) - 15)
      aventura.ultimaTorre = Date.now()

      if (venceu) {
        aventura.andarTorre = andar
        aventura.vitorias = Number(aventura.vitorias || 0) + 1
        recompensar(ctx, usuario, xp, coins, material, quantidade)
      }
      else {
        aventura.derrotas = Number(aventura.derrotas || 0) + 1
        aventura.vida = r.limitar(Number(aventura.vida || 0) - r.aleatorio(8, 18))
        r.addXp(ctx, xp)
      }

      r.salvar(ctx)

      return enviarComImagem(
        ctx,
        r.imagemRpg('torres'),
        compacto(ctx, venceu ? '🗼' : '💥', `Torre • Andar ${andar}`, [
          { emoji: venceu ? '🏆' : '⚠️', texto: venceu ? 'Guardião derrotado' : 'O guardião venceu esta tentativa' },
          { emoji: '⚔️', texto: `Seu poder: ${poder} • Dificuldade: ${dificuldade}` },
          { emoji: '✨', texto: `+${xp} XP` },
          r.temCoins(ctx) ? { emoji: '🪙', texto: `+${dinheiro(coins)}` } : null,
          venceu ? { emoji: '🎒', texto: `+${quantidade} ${material}` } : null,
          { emoji: '⚡', texto: `Energia: ${aventura.energia}%` }
        ])
      )
    }

    if (comando === 'masmorra') {
      const falta = cooldown(aventura.ultimaMasmorra, 20 * 60 * 1000)

      if (falta) {
        return ctx.reply(compacto(ctx, '⏳', 'Masmorra em espera', [
          { emoji: '⏱️', texto: `Tente novamente em ${tempo(falta)}` }
        ]))
      }

      if (Number(aventura.energia || 0) < 22 || Number(aventura.vida || 0) < 20) {
        return ctx.reply(compacto(ctx, '🕯️', 'Sem condições para entrar', [
          { emoji: '❤️', texto: `Vida: ${aventura.vida}%` },
          { emoji: '⚡', texto: `Energia: ${aventura.energia}%` },
          { emoji: '🏕️', texto: `Use ${ctx.prefix}descansarheroi` }
        ]))
      }

      const salas = [
        'Salão dos Esqueletos',
        'Galeria das Sombras',
        'Câmara do Cristal',
        'Covil das Serpentes'
      ]
      const sala = r.escolher(salas)
      const poder = r.poderAventureiro(usuario)
      const venceu = Math.random() * 100 < Math.min(88, 48 + poder / 4)
      const xp = venceu ? r.aleatorio(45, 85) : r.aleatorio(10, 22)
      const coins = venceu ? r.aleatorio(380, 920) : 0
      const material = r.escolher(['ferro', 'cristal', 'essencia'])
      const quantidade = venceu ? r.aleatorio(2, 5) : 0

      aventura.energia = r.limitar(Number(aventura.energia || 0) - 22)
      aventura.vida = r.limitar(Number(aventura.vida || 0) - (venceu ? r.aleatorio(3, 10) : r.aleatorio(12, 25)))
      aventura.ultimaMasmorra = Date.now()

      if (venceu) {
        aventura.masmorras = Number(aventura.masmorras || 0) + 1
        aventura.vitorias = Number(aventura.vitorias || 0) + 1
        recompensar(ctx, usuario, xp, coins, material, quantidade)
      }
      else {
        aventura.derrotas = Number(aventura.derrotas || 0) + 1
        r.addXp(ctx, xp)
      }

      r.salvar(ctx)

      return enviarComImagem(
        ctx,
        r.imagemRpg('masmorras'),
        compacto(ctx, venceu ? '🗝️' : '🕯️', sala, [
          { emoji: venceu ? '✅' : '💥', texto: venceu ? 'Masmorra concluída' : 'Você precisou abandonar a masmorra' },
          { emoji: '✨', texto: `+${xp} XP` },
          r.temCoins(ctx) ? { emoji: '🪙', texto: `+${dinheiro(coins)}` } : null,
          venceu ? { emoji: '🎒', texto: `+${quantidade} ${material}` } : null,
          { emoji: '❤️', texto: `Vida: ${aventura.vida}%` }
        ])
      )
    }

    if (comando === 'boss') {
      const id = String(ctx.args?.[0] || '').toLowerCase().replace(/[-\s]+/g, '_')
      const boss = r.BOSSES_RPG[id]

      if (!boss) {
        return ctx.reply(compacto(ctx, '🐉', 'Bosses disponíveis', Object.entries(r.BOSSES_RPG).map(([chave, item]) => ({
          emoji: item.emoji,
          texto: `${item.nome} • Poder ${item.poder} • ${ctx.prefix}boss ${chave}`
        }))))
      }

      const falta = cooldown(aventura.ultimoBoss, 60 * 60 * 1000)
      if (falta) {
        return ctx.reply(compacto(ctx, '⏳', 'Boss em espera', [
          { emoji: '⏱️', texto: `Tente novamente em ${tempo(falta)}` }
        ]))
      }

      if (Number(aventura.energia || 0) < 30 || Number(aventura.vida || 0) < 25) {
        return ctx.reply(compacto(ctx, boss.emoji, 'Você não está preparado', [
          { emoji: '❤️', texto: `Vida: ${aventura.vida}%` },
          { emoji: '⚡', texto: `Energia: ${aventura.energia}%` }
        ]))
      }

      const poder = r.poderAventureiro(usuario)
      const venceu = poder + r.aleatorio(20, 130) >= boss.poder
      const xp = venceu ? r.aleatorio(boss.xp[0], boss.xp[1]) : r.aleatorio(12, 28)
      const coins = venceu ? r.aleatorio(boss.coins[0], boss.coins[1]) : 0
      const quantidade = venceu ? r.aleatorio(2, 6) : 0

      aventura.energia = r.limitar(Number(aventura.energia || 0) - 30)
      aventura.vida = r.limitar(Number(aventura.vida || 0) - (venceu ? r.aleatorio(8, 18) : r.aleatorio(20, 38)))
      aventura.ultimoBoss = Date.now()

      if (venceu) {
        aventura.bosses = Number(aventura.bosses || 0) + 1
        aventura.vitorias = Number(aventura.vitorias || 0) + 1
        aventura.poderExtra = Number(aventura.poderExtra || 0) + 1
        recompensar(ctx, usuario, xp, coins, boss.material, quantidade)
      }
      else {
        aventura.derrotas = Number(aventura.derrotas || 0) + 1
        r.addXp(ctx, xp)
      }

      r.salvar(ctx)

      return enviarComImagem(
        ctx,
        r.imagemRpg('bosses', id),
        compacto(ctx, boss.emoji, boss.nome, [
          { emoji: venceu ? '🏆' : '💀', texto: venceu ? 'Boss derrotado' : 'O boss venceu a batalha' },
          { emoji: '⚔️', texto: `Seu poder: ${poder} • Boss: ${boss.poder}` },
          { emoji: '✨', texto: `+${xp} XP` },
          r.temCoins(ctx) ? { emoji: '🪙', texto: `+${dinheiro(coins)}` } : null,
          venceu ? { emoji: '🎒', texto: `+${quantidade} ${boss.material}` } : null,
          { emoji: '❤️', texto: `Vida: ${aventura.vida}%` }
        ])
      )
    }

    if (comando === 'raid') {
      const jid = await alvo(ctx)

      if (!jid || jid === ctx.normalizar(ctx.sender)) {
        return ctx.reply(compacto(ctx, '🤝', 'Raid cooperativa', [
          { emoji: '📌', texto: `${ctx.prefix}raid @usuario` }
        ]))
      }

      const aliado = r.user(ctx, jid)
      const aventuraAliado = r.normalizarAventura(aliado)

      if (!aventuraAliado.classe) {
        return ctx.reply(compacto(ctx, '🧭', 'Aliado sem classe', [
          { emoji: '👤', texto: `@${jid.split('@')[0]} precisa usar ${ctx.prefix}classe` }
        ]), [jid])
      }

      const falta = Math.max(
        cooldown(aventura.ultimaRaid, 2 * 60 * 60 * 1000),
        cooldown(aventuraAliado.ultimaRaid, 2 * 60 * 60 * 1000)
      )

      if (falta) {
        return ctx.reply(compacto(ctx, '⏳', 'Raid em espera', [
          { emoji: '⏱️', texto: `A equipe poderá tentar em ${tempo(falta)}` }
        ]), [jid])
      }

      if (Number(aventura.energia || 0) < 35 || Number(aventuraAliado.energia || 0) < 35) {
        return ctx.reply(compacto(ctx, '⚡', 'Equipe sem energia', [
          { emoji: '👤', texto: `Sua energia: ${aventura.energia}%` },
          { emoji: '🤝', texto: `Energia do aliado: ${aventuraAliado.energia}%` }
        ]), [jid])
      }

      const poderEquipe = r.poderAventureiro(usuario) + r.poderAventureiro(aliado)
      const dificuldade = r.aleatorio(145, 230)
      const venceu = poderEquipe + r.aleatorio(30, 120) >= dificuldade
      const xp = venceu ? r.aleatorio(90, 170) : r.aleatorio(20, 40)
      const coins = venceu ? r.aleatorio(900, 2200) : 0
      const material = r.escolher(['cristal', 'essencia'])
      const quantidade = venceu ? r.aleatorio(3, 7) : 0

      aventura.energia = r.limitar(Number(aventura.energia || 0) - 35)
      aventuraAliado.energia = r.limitar(Number(aventuraAliado.energia || 0) - 35)
      aventura.ultimaRaid = Date.now()
      aventuraAliado.ultimaRaid = Date.now()

      if (venceu) {
        aventura.raids = Number(aventura.raids || 0) + 1
        aventuraAliado.raids = Number(aventuraAliado.raids || 0) + 1
        aventura.vitorias = Number(aventura.vitorias || 0) + 1
        aventuraAliado.vitorias = Number(aventuraAliado.vitorias || 0) + 1
        r.adicionarMaterial(usuario, material, quantidade)
        r.adicionarMaterial(aliado, material, quantidade)
        r.adicionarPontosGuilda(ctx, usuario, Math.max(1, Math.floor(xp / 2)))
        r.adicionarPontosGuilda(ctx, aliado, Math.max(1, Math.floor(xp / 2)))
      }
      else {
        aventura.derrotas = Number(aventura.derrotas || 0) + 1
        aventuraAliado.derrotas = Number(aventuraAliado.derrotas || 0) + 1
        aventura.vida = r.limitar(Number(aventura.vida || 0) - 20)
        aventuraAliado.vida = r.limitar(Number(aventuraAliado.vida || 0) - 20)
      }

      r.addXp(ctx, xp, ctx.sender)
      r.addXp(ctx, xp, jid)

      if (r.temCoins(ctx)) {
        const minhaEconomia = r.eco(ctx)
        const economiaAliado = r.eco(ctx, jid)
        minhaEconomia.coins = Number(minhaEconomia.coins || 0) + coins
        economiaAliado.coins = Number(economiaAliado.coins || 0) + coins
      }

      r.salvar(ctx)

      return enviarComImagem(
        ctx,
        r.imagemRpg('raids'),
        compacto(ctx, venceu ? '🏆' : '💥', 'Raid Cooperativa', [
          { emoji: '🤝', texto: `@${ctx.normalizar(ctx.sender).split('@')[0]} + @${jid.split('@')[0]}` },
          { emoji: venceu ? '✅' : '💀', texto: venceu ? 'A equipe derrotou o guardião' : 'A equipe foi derrotada' },
          { emoji: '⚔️', texto: `Poder da equipe: ${poderEquipe} • Dificuldade: ${dificuldade}` },
          { emoji: '✨', texto: `+${xp} XP para cada jogador` },
          r.temCoins(ctx) ? { emoji: '🪙', texto: `+${dinheiro(coins)} para cada jogador` } : null,
          venceu ? { emoji: '🎒', texto: `+${quantidade} ${material} para cada jogador` } : null
        ]),
        [ctx.sender, jid]
      )
    }
  }
})
