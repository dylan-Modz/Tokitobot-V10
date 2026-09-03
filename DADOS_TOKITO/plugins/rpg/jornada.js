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

const nomeClasse = aventura => {
  return r.CLASSES_RPG[aventura.classe]?.nome || 'Nenhuma'
}

const exigirClasse = (ctx, aventura) => {
  if (aventura.classe)
    return true

  ctx.reply(compacto(ctx, '🧭', 'Jornada não iniciada', [
    { emoji: '📌', texto: `Escolha sua classe com ${ctx.prefix}classe` }
  ]))

  return false
}

dylan.setCommand({
  nome: 'jornada',
  comandos: [
    'jornada',
    'classe',
    'escolherclasse',
    'aventura',
    'explorar',
    'descansarheroi',
    'historia'
  ],
  categoria: 'rpg',
  info: {
    descricao: 'Jornada com classes, aventuras, energia e história.',
    uso: 'classe guerreiro',
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

    if (['classe', 'escolherclasse'].includes(comando)) {
      const id = String(ctx.args?.[0] || '').toLowerCase()
      const classe = r.CLASSES_RPG[id]

      if (!classe) {
        const linhas = Object.entries(r.CLASSES_RPG).map(([chave, item]) => ({
          emoji: item.emoji,
          texto: `${item.nome} • Poder ${item.poder} • Defesa ${item.defesa} • ${ctx.prefix}classe ${chave}`
        }))

        if (aventura.classe) {
          linhas.unshift({
            emoji: r.CLASSES_RPG[aventura.classe]?.emoji || '🧭',
            texto: `Sua classe atual: ${nomeClasse(aventura)}`
          })
        }

        return enviarComImagem(
          ctx,
          r.imagemRpg('classes', aventura.classe || 'guerreiro'),
          compacto(ctx, '🧭', 'Classes da Jornada', linhas)
        )
      }

      if (aventura.classe) {
        return ctx.reply(compacto(ctx, '🔒', 'Classe definida', [
          { emoji: '🧭', texto: `Sua classe é ${nomeClasse(aventura)}` },
          { emoji: '⚠️', texto: 'A classe não pode ser trocada para proteger seu progresso' }
        ]))
      }

      aventura.classe = id
      aventura.vida = 100
      aventura.energia = 100
      r.salvar(ctx)

      return enviarComImagem(
        ctx,
        r.imagemRpg('classes', id),
        compacto(ctx, classe.emoji, 'Classe escolhida', [
          { emoji: classe.emoji, texto: classe.nome },
          { emoji: '⚔️', texto: `Poder inicial: ${classe.poder}` },
          { emoji: '🛡️', texto: `Defesa inicial: ${classe.defesa}` },
          { emoji: '📖', texto: classe.descricao },
          { emoji: '📌', texto: `Comece usando ${ctx.prefix}aventura` }
        ])
      )
    }

    if (comando === 'jornada') {
      const classe = r.CLASSES_RPG[aventura.classe] || {}
      const arma = r.ARMAS_RPG[aventura.armaEquipada]
      const guilda = r.guildaDoUsuario(ctx, usuario)

      return enviarComImagem(
        ctx,
        r.imagemRpg('classes', aventura.classe || 'guerreiro'),
        compacto(ctx, '🗺️', 'Sua Jornada', [
          { emoji: classe.emoji || '🧭', texto: `Classe: ${nomeClasse(aventura)}` },
          { emoji: '⚔️', texto: `Poder: ${r.poderAventureiro(usuario)}` },
          { emoji: '❤️', texto: `Vida: ${aventura.vida}%` },
          { emoji: '⚡', texto: `Energia: ${aventura.energia}%` },
          { emoji: '🗡️', texto: `Arma: ${arma?.nome || 'Nenhuma'}` },
          { emoji: '🏰', texto: `Guilda: ${guilda?.nome || 'Nenhuma'}` },
          { emoji: '🗼', texto: `Torre: andar ${aventura.andarTorre}` },
          { emoji: '🐉', texto: `Bosses derrotados: ${aventura.bosses}` },
          { emoji: '📖', texto: `História: capítulo ${aventura.capitulo}/${r.CAPITULOS_RPG.length}` }
        ])
      )
    }

    if (!exigirClasse(ctx, aventura))
      return

    if (comando === 'descansarheroi') {
      const falta = cooldown(aventura.ultimoDescanso, 30 * 60 * 1000)

      if (falta) {
        return ctx.reply(compacto(ctx, '⏳', 'Descanso', [
          { emoji: '⏱️', texto: `Tente novamente em ${tempo(falta)}` }
        ]))
      }

      aventura.energia = 100
      aventura.vida = 100
      aventura.ultimoDescanso = Date.now()
      aventura.ultimaRecuperacao = Date.now()
      r.salvar(ctx)

      return ctx.reply(compacto(ctx, '🏕️', 'Descanso concluído', [
        { emoji: '❤️', texto: 'Vida recuperada: 100%' },
        { emoji: '⚡', texto: 'Energia recuperada: 100%' }
      ]))
    }

    if (comando === 'historia') {
      const atual = Number(aventura.capitulo || 0)

      if (atual >= r.CAPITULOS_RPG.length) {
        return enviarComImagem(
          ctx,
          r.imagemRpg('historias'),
          compacto(ctx, '📖', 'História concluída', [
            { emoji: '👑', texto: 'Você concluiu todos os capítulos disponíveis' },
            { emoji: '✨', texto: 'Novos capítulos poderão chegar em atualizações futuras' }
          ])
        )
      }

      const necessario = atual * 3
      if (Number(aventura.aventuras || 0) < necessario) {
        return ctx.reply(compacto(ctx, '🔒', 'Capítulo bloqueado', [
          { emoji: '🗺️', texto: `Complete ${necessario} aventuras` },
          { emoji: '📊', texto: `Seu progresso: ${aventura.aventuras}/${necessario}` }
        ]))
      }

      const capitulo = r.CAPITULOS_RPG[atual]
      aventura.capitulo = atual + 1
      r.addXp(ctx, 25)

      return enviarComImagem(
        ctx,
        r.imagemRpg('historias'),
        compacto(ctx, '📖', `Capítulo ${atual + 1} • ${capitulo.titulo}`, [
          { emoji: '📜', texto: capitulo.texto },
          { emoji: '✨', texto: '+25 XP da jornada' },
          { emoji: '📊', texto: `Progresso: ${aventura.capitulo}/${r.CAPITULOS_RPG.length}` }
        ])
      )
    }

    if (['aventura', 'explorar'].includes(comando)) {
      const falta = cooldown(aventura.ultimaAventura, 5 * 60 * 1000)

      if (falta) {
        return ctx.reply(compacto(ctx, '⏳', 'Aventura em espera', [
          { emoji: '⏱️', texto: `Tente novamente em ${tempo(falta)}` }
        ]))
      }

      if (Number(aventura.energia || 0) < 12) {
        return ctx.reply(compacto(ctx, '⚡', 'Sem energia', [
          { emoji: '📊', texto: `Energia atual: ${aventura.energia}%` },
          { emoji: '🏕️', texto: `Use ${ctx.prefix}descansarheroi` }
        ]))
      }

      const evento = r.escolher(r.AVENTURAS_RPG)
      const poder = r.poderAventureiro(usuario)
      const sucesso = Math.random() * 100 < Math.min(92, 58 + poder / 5)
      const xp = sucesso ? r.aleatorio(18, 40) : r.aleatorio(5, 12)
      const ganho = sucesso ? r.aleatorio(120, 480) : 0
      const materiais = ['ferro', 'madeira', 'cristal', 'essencia']
      const material = r.escolher(materiais)
      const quantidade = sucesso ? r.aleatorio(1, material === 'essencia' ? 2 : 4) : 0

      aventura.energia = r.limitar(Number(aventura.energia || 0) - 12)
      aventura.vida = r.limitar(Number(aventura.vida || 0) - (sucesso ? r.aleatorio(0, 4) : r.aleatorio(5, 14)))
      aventura.aventuras = Number(aventura.aventuras || 0) + 1
      aventura.ultimaAventura = Date.now()

      if (sucesso) {
        aventura.vitorias = Number(aventura.vitorias || 0) + 1
        r.adicionarMaterial(usuario, material, quantidade)
        r.adicionarPontosGuilda(ctx, usuario, Math.max(1, Math.floor(xp / 2)))
      }
      else {
        aventura.derrotas = Number(aventura.derrotas || 0) + 1
      }

      r.addXp(ctx, xp)

      if (r.temCoins(ctx)) {
        const economia = r.eco(ctx)
        economia.coins = Number(economia.coins || 0) + ganho
      }

      r.salvar(ctx)

      return enviarComImagem(
        ctx,
        r.imagemRpg('aventuras'),
        compacto(ctx, evento.emoji, evento.nome, [
          { emoji: sucesso ? '✅' : '💥', texto: sucesso ? evento.texto : 'A exploração falhou, mas você ganhou experiência' },
          { emoji: '✨', texto: `+${xp} XP` },
          r.temCoins(ctx) ? { emoji: '🪙', texto: `+${dinheiro(ganho)}` } : null,
          sucesso ? { emoji: '🎒', texto: `+${quantidade} ${material}` } : null,
          { emoji: '❤️', texto: `Vida: ${aventura.vida}%` },
          { emoji: '⚡', texto: `Energia: ${aventura.energia}%` }
        ])
      )
    }
  }
})
