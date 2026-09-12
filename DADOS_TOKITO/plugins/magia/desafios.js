/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Sistema : RPG de Magia
 *  Dev     : Dylan Modz
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')
const a = require('../../sistemas/rpg/arcano')
const m = a.mess

dylan.setCommand({
  nome: 'torremagia',
  comandos: [
    'torremagia', 'andarmagia', 'bossmagico', 'missaomagia',
    'aventuramagica', 'explorarmagia', 'masmorramagica', 'portalmagico', 'reinomagico'
  ],
  categoria: 'magia',
  info: {
    descricao: 'Torre, chefes, missões, exploração, masmorras, portais e reinos.',
    uso: 'torremagia',
    requisitos: 'Modo RPG + Magia desperta',
    categoria: 'magia'
  },
  async executar(ctx) {
    const estado = await a.guarda(ctx)
    if (!estado) return
    const cmd = ctx.command

    if (cmd === 'torremagia') {
      const andar = Number(estado.torre || 1)
      return a.enviarImagem(ctx, 'torre', m.magiaTorre(andar, 60 + andar * 28))
    }

    if (cmd === 'andarmagia') {
      const espera = a.cooldown(estado, 'torre', 8 * 60 * 1000)
      if (espera) return ctx.reply(m.magiaCooldown(espera))
      const andar = Number(estado.torre || 1)
      const poderInimigo = 60 + andar * 28 + a.aleatorio(0, 20)
      if (!a.consumirMana(estado, Math.min(40, 12 + Math.floor(andar / 3)))) {
        a.limparCooldown(estado, 'torre')
        return ctx.reply(m.magiaErro('ᴍᴀɴᴀ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ ᴘᴀʀᴀ ᴇɴᴛʀᴀʀ ɴᴏ ᴀɴᴅᴀʀ.'))
      }

      const venceu = a.chanceVitoria(a.poder(estado), poderInimigo)
      const xp = venceu ? 25 + andar * 5 : 8
      const cristais = venceu ? 12 + andar * 3 : 0
      if (venceu) {
        estado.torre = andar + 1
        estado.cristais += cristais
        estado.ouroArcano += 20 + andar * 6
        if (andar % 5 === 0) estado.baus = Number(estado.baus || 0) + 1
      }
      a.addXp(estado, xp)
      a.salvar(ctx)
      return ctx.reply(m.magiaAndar({ andar, venceu, poderInimigo, xp, cristais }))
    }

    if (cmd === 'bossmagico') {
      const espera = a.cooldown(estado, 'boss', 45 * 60 * 1000)
      if (espera) return ctx.reply(m.magiaCooldown(espera))
      if (!a.consumirMana(estado, 35)) {
        a.limparCooldown(estado, 'boss')
        return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ᴘʀᴇᴄɪsᴀ ᴅᴇ 35 ᴅᴇ ᴍᴀɴᴀ.'))
      }

      const indice = Math.min(a.BOSSES.length - 1, Math.floor((estado.nivel - 1) / 4))
      const boss = a.BOSSES[indice]
      const poderBoss = boss.poder + a.aleatorio(0, 60)
      const venceu = a.chanceVitoria(a.poder(estado), poderBoss)
      const xp = venceu ? 120 + indice * 60 : 20
      const cristais = venceu ? 80 + indice * 45 : 0
      if (venceu) {
        estado.cristais += cristais
        estado.ouroArcano += 150 + indice * 100
        estado.baus += 1
        estado.vitorias++
      } else estado.derrotas++
      a.addXp(estado, xp)
      a.salvar(ctx)
      return a.enviarImagem(ctx, 'boss', m.magiaBoss({
        boss: boss.nome, poderBoss, venceu, xp, cristais
      }))
    }

    const recompensar = (titulo, descricao, base, cooldownNome, cooldownMs, imagem = null) => {
      const espera = a.cooldown(estado, cooldownNome, cooldownMs)
      if (espera) return ctx.reply(m.magiaCooldown(espera))

      const rec = a.recompensaCombate(base)
      estado.cristais += rec.cristais
      estado.ouroArcano += rec.ouro
      a.addXp(estado, rec.xp)
      a.salvar(ctx)
      const texto = m.magiaRecompensa({
        titulo,
        descricao,
        xp: rec.xp,
        cristais: rec.cristais,
        ouro: rec.ouro
      })
      return imagem ? a.enviarImagem(ctx, imagem, texto) : ctx.reply(texto)
    }

    if (cmd === 'missaomagia')
      return recompensar('𝙼𝙸𝚂𝚂𝙰̃𝙾 𝙼𝙰́𝙶𝙸𝙲𝙰', 'Você concluiu uma missão da Academia Arcana.', estado.nivel, 'missao', 15 * 60 * 1000)

    if (cmd === 'aventuramagica')
      return recompensar('𝙰𝚅𝙴𝙽𝚃𝚄𝚁𝙰 𝙼𝙰́𝙶𝙸𝙲𝙰', 'Você atravessou terras encantadas e voltou com recursos.', estado.nivel + 1, 'aventura', 20 * 60 * 1000, 'reino')

    if (cmd === 'explorarmagia')
      return recompensar('𝙴𝚇𝙿𝙻𝙾𝚁𝙰𝙲̧𝙰̃𝙾', 'Você encontrou runas antigas escondidas no reino.', estado.nivel, 'explorar', 10 * 60 * 1000)

    if (cmd === 'masmorramagica') {
      const meuPoder = a.poder(estado)
      const poder = 90 + estado.nivel * 18 + a.aleatorio(0, 35)
      const espera = a.cooldown(estado, 'masmorra', 30 * 60 * 1000)
      if (espera) return ctx.reply(m.magiaCooldown(espera))
      if (!a.consumirMana(estado, 25)) {
        a.limparCooldown(estado, 'masmorra')
        return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ᴘʀᴇᴄɪsᴀ ᴅᴇ 25 ᴅᴇ ᴍᴀɴᴀ.'))
      }

      const venceu = a.chanceVitoria(meuPoder, poder)
      const xp = venceu ? a.aleatorio(70, 120) : 15
      const cristais = venceu ? a.aleatorio(45, 85) : 0
      if (venceu) {
        estado.cristais += cristais
        estado.ouroArcano += a.aleatorio(70, 150)
        if (Math.random() < 0.35) estado.baus++
      }
      a.addXp(estado, xp)
      a.salvar(ctx)
      return a.enviarImagem(ctx, 'masmorra', m.magiaBatalha({
        inimigo: 'Guardião da Masmorra',
        meuPoder,
        poderInimigo: poder,
        venceu,
        xp,
        cristais
      }))
    }

    if (cmd === 'reinomagico') {
      const atual = a.REINOS[estado.reino] || a.REINOS.academia
      const itens = Object.entries(a.REINOS).map(([id, x]) =>
        `${estado.reino === id ? '📍' : '🌌'} ${id} • ${x.nome} • Nv.${x.nivel} • ${x.custo} mana`
      )
      return a.enviarImagem(ctx, 'reino', m.magiaLista(
        '𝚁𝙴𝙸𝙽𝙾𝚂 𝙼𝙰́𝙶𝙸𝙲𝙾𝚂',
        itens,
        `> *『 📍 𝙰𝚃𝚄𝙰𝙻 』— ${atual.nome}*\n> *『 🌀 𝚅𝙸𝙰𝙹𝙰𝚁 』— ${ctx.prefix}portalmagico floresta*`
      ))
    }

    if (cmd === 'portalmagico') {
      const id = a.chave(ctx.args?.[0])
      const destino = a.REINOS[id]
      if (!destino) return ctx.reply(m.magiaErro(`ᴜsᴇ ${ctx.prefix}reinomagico ᴘᴀʀᴀ ᴠᴇʀ ᴏs ʀᴇɪɴᴏs.`))
      if (estado.nivel < destino.nivel) return ctx.reply(m.magiaErro(`ᴠᴏᴄᴇ̂ ᴘʀᴇᴄɪsᴀ ᴅᴏ ɴɪ́ᴠᴇʟ ${destino.nivel}.`))
      if (!a.consumirMana(estado, destino.custo)) return ctx.reply(m.magiaErro(`ᴠᴏᴄᴇ̂ ᴘʀᴇᴄɪsᴀ ᴅᴇ ${destino.custo} ᴅᴇ ᴍᴀɴᴀ.`))

      const origem = a.REINOS[estado.reino]?.nome || 'Desconhecido'
      estado.reino = id
      a.salvar(ctx)
      return a.enviarImagem(ctx, 'reino', m.magiaPortal(origem, destino.nome, destino.custo))
    }
  }
})
