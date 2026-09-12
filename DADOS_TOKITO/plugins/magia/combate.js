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
  nome: 'duelomagia',
  comandos: ['duelomagia', 'batalhamagia', 'arenamagica'],
  categoria: 'magia',
  info: {
    descricao: 'PvP e batalhas do RPG de Magia.',
    uso: 'duelomagia @usuario',
    requisitos: 'Modo RPG + Magia desperta',
    categoria: 'magia'
  },
  async executar(ctx) {
    const estado = await a.guarda(ctx)
    if (!estado) return
    const cmd = ctx.command

    if (cmd === 'arenamagica') {
      const top = a.rank(ctx).slice(0, 10)
      const itens = top.length
        ? top.map((x, i) => `${i + 1}º @${x.jid.split('@')[0]} • ${x.poder} poder`)
        : ['Ainda não há magos no ranking.']
      return a.enviarImagem(ctx, 'arena', m.magiaLista(
        '𝙰𝚁𝙴𝙽𝙰 𝙼𝙰́𝙶𝙸𝙲𝙰',
        itens,
        `> *『 ⚔️ 𝙳𝚄𝙴𝙻𝙾 』— ${ctx.prefix}duelomagia @usuario*`
      ), top.map(x => x.jid))
    }

    if (cmd === 'duelomagia') {
      const alvo = a.marcado(ctx)
      if (!alvo) return ctx.reply(m.magiaErro(`ᴍᴀʀǫᴜᴇ ᴜᴍ ᴍᴀɢᴏ. ᴜsᴇ ${ctx.prefix}duelomagia @usuario.`))
      const eu = ctx.normalizar(ctx.sender)
      const outro = ctx.normalizar(alvo)
      if (eu === outro) return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏᴅᴇ ᴅᴜᴇʟᴀʀ ᴄᴏɴsɪɢᴏ ᴍᴇsᴍᴏ.'))

      const alvoEstado = a.estado(ctx, outro)
      if (!alvoEstado.iniciado) return ctx.reply(m.magiaErro('ᴏ ᴜsᴜᴀ́ʀɪᴏ ᴍᴀʀᴄᴀᴅᴏ ᴀɪɴᴅᴀ ɴᴀ̃ᴏ ᴅᴇsᴘᴇʀᴛᴏᴜ ᴍᴀɢɪᴀ.'))

      const espera = a.cooldown(estado, 'duelo', 10 * 60 * 1000)
      if (espera) return ctx.reply(m.magiaCooldown(espera))
      if (!a.consumirMana(estado, 15)) {
        a.limparCooldown(estado, 'duelo')
        return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ᴘʀᴇᴄɪsᴀ ᴅᴇ 15 ᴅᴇ ᴍᴀɴᴀ.'))
      }

      const meuPoder = a.poder(estado) + a.aleatorio(0, 35)
      const poderAlvo = a.poder(alvoEstado) + a.aleatorio(0, 35)
      const venceu = meuPoder >= poderAlvo
      const vencedor = venceu ? eu : outro
      const recompensa = a.aleatorio(15, 35)

      if (venceu) {
        estado.vitorias++
        estado.cristais += recompensa
        a.addXp(estado, 35)
        alvoEstado.derrotas++
      } else {
        estado.derrotas++
        alvoEstado.vitorias++
        alvoEstado.cristais += recompensa
        a.addXp(alvoEstado, 35)
      }

      a.salvar(ctx)
      return a.enviarImagem(ctx, 'arena', m.magiaDuelo({
        eu, alvo: outro, meuPoder, poderAlvo, vencedor, recompensa
      }), [eu, outro])
    }

    if (cmd === 'batalhamagia') {
      const espera = a.cooldown(estado, 'batalha', 5 * 60 * 1000)
      if (espera) return ctx.reply(m.magiaCooldown(espera))
      if (!a.consumirMana(estado, 12)) {
        a.limparCooldown(estado, 'batalha')
        return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ᴘʀᴇᴄɪsᴀ ᴅᴇ 12 ᴅᴇ ᴍᴀɴᴀ.'))
      }

      const faixa = Math.min(a.INIMIGOS.length - 1, Math.floor((estado.nivel - 1) / 2))
      const inimigo = a.INIMIGOS[a.aleatorio(0, faixa)]
      const poderInimigo = inimigo.poder + a.aleatorio(0, estado.nivel * 8)
      const meuPoder = a.poder(estado)
      const venceu = a.chanceVitoria(meuPoder, poderInimigo)
      const rec = a.recompensaCombate(estado.nivel)

      if (venceu) {
        estado.vitorias++
        estado.cristais += rec.cristais
        estado.ouroArcano += rec.ouro
        a.addXp(estado, rec.xp)
      } else {
        estado.derrotas++
        rec.xp = Math.max(5, Math.floor(rec.xp / 3))
        rec.cristais = 0
        a.addXp(estado, rec.xp)
      }

      a.salvar(ctx)
      return ctx.reply(m.magiaBatalha({
        inimigo: inimigo.nome,
        meuPoder,
        poderInimigo,
        venceu,
        xp: rec.xp,
        cristais: rec.cristais
      }))
    }
  }
})
