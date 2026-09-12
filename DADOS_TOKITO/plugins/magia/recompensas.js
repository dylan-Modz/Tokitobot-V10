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
  nome: 'diariomagico',
  comandos: ['diariomagico', 'bauarcano', 'roletamagica', 'rankmagia', 'topmagos'],
  categoria: 'magia',
  info: {
    descricao: 'Bônus diário, baús, roleta e rankings do RPG de Magia.',
    uso: 'diariomagico',
    requisitos: 'Modo RPG + Magia desperta',
    categoria: 'magia'
  },
  async executar(ctx) {
    const estado = await a.guarda(ctx)
    if (!estado) return
    const cmd = ctx.command

    if (cmd === 'diariomagico') {
      const dia = 24 * 60 * 60 * 1000
      const restante = Number(estado.ultimoDiario || 0) + dia - Date.now()
      if (restante > 0) return ctx.reply(m.magiaCooldown(restante))

      const cristais = a.aleatorio(60, 110)
      const ouro = a.aleatorio(120, 220)
      const xp = a.aleatorio(45, 80)
      estado.ultimoDiario = Date.now()
      estado.cristais += cristais
      estado.ouroArcano += ouro
      if (Math.random() < 0.35) estado.baus++
      a.addXp(estado, xp)
      a.salvar(ctx)
      return ctx.reply(m.magiaDiario({ cristais, ouro, xp }))
    }

    if (cmd === 'bauarcano') {
      if (Number(estado.baus || 0) <= 0)
        return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ʙᴀᴜ́s ᴀʀᴄᴀɴᴏs.'))

      estado.baus--
      const roll = Math.random()
      const raridade = roll < 0.05 ? 'Mítico' : roll < 0.18 ? 'Lendário' : roll < 0.45 ? 'Épico' : roll < 0.75 ? 'Raro' : 'Comum'
      const mult = { Comum:1, Raro:1.5, Épico:2.2, Lendário:3.2, Mítico:5 }[raridade]
      const cristais = Math.floor(a.aleatorio(20, 45) * mult)
      const ouro = Math.floor(a.aleatorio(40, 90) * mult)
      let item = null

      estado.cristais += cristais
      estado.ouroArcano += ouro

      if (roll < 0.25) {
        const disponiveis = Object.keys(a.ARTEFATOS).filter(id => !estado.artefatos.includes(id))
        if (disponiveis.length) {
          const id = disponiveis[a.aleatorio(0, disponiveis.length - 1)]
          estado.artefatos.push(id)
          item = a.ARTEFATOS[id].nome
        }
      }

      a.salvar(ctx)
      return a.enviarImagem(ctx, 'bau', m.magiaBau({ raridade, cristais, ouro, item }))
    }

    if (cmd === 'roletamagica') {
      const espera = a.cooldown(estado, 'roleta', 30 * 60 * 1000)
      if (espera) return ctx.reply(m.magiaCooldown(espera))
      if (estado.cristais < 25) {
        a.limparCooldown(estado, 'roleta')
        return ctx.reply(m.magiaErro('ᴄᴀᴅᴀ ɢɪʀᴏ ᴄᴜsᴛᴀ 25 ᴄʀɪsᴛᴀɪs.'))
      }

      estado.cristais -= 25
      const roll = a.aleatorio(1, 100)
      let premio = 'Cristais'
      let valor = 0
      if (roll <= 45) {
        valor = a.aleatorio(10, 55)
        estado.cristais += valor
      } else if (roll <= 75) {
        premio = 'Ouro Arcano'
        valor = a.aleatorio(70, 180)
        estado.ouroArcano += valor
      } else if (roll <= 92) {
        premio = 'XP'
        valor = a.aleatorio(40, 100)
        a.addXp(estado, valor)
      } else {
        premio = 'Baú Arcano'
        valor = 1
        estado.baus++
      }

      a.salvar(ctx)
      return ctx.reply(m.magiaRoleta({ premio, valor }))
    }

    if (cmd === 'rankmagia' || cmd === 'topmagos') {
      const lista = a.rank(ctx).slice(0, cmd === 'topmagos' ? 5 : 10)
      const itens = lista.length
        ? lista.map((x, i) => `${i + 1}º @${x.jid.split('@')[0]} • ${x.poder} poder • Nv.${x.m.nivel}`)
        : ['Ainda não há magos no ranking.']
      return ctx.reply(m.magiaLista(
        cmd === 'topmagos' ? '𝚃𝙾𝙿 𝙼𝙰𝙶𝙾𝚂' : '𝚁𝙰𝙽𝙺 𝙳𝙰 𝙼𝙰𝙶𝙸𝙰',
        itens
      ))
    }
  }
})
