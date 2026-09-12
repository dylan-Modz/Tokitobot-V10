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
  nome: 'familiarmagico',
  comandos: ['familiarmagico', 'invocarmagia', 'evoluirfamiliar', 'bestiamagica', 'capturabestia'],
  categoria: 'magia',
  info: {
    descricao: 'Invocação, captura e evolução de familiares mágicos.',
    uso: 'familiarmagico',
    requisitos: 'Modo RPG + Magia desperta',
    categoria: 'magia'
  },
  async executar(ctx) {
    const estado = await a.guarda(ctx)
    if (!estado) return
    const cmd = ctx.command

    if (cmd === 'bestiamagica') {
      const itens = Object.entries(a.FAMILIARES).map(([id, f]) =>
        `${id} • ${f.nome} • ${f.raridade} • +${f.poder} poder`
      )
      return a.enviarImagem(ctx, 'familiar', m.magiaLista(
        '𝙱𝙴𝚂𝚃𝙸𝙰́𝚁𝙸𝙾 𝙼𝙰́𝙶𝙸𝙲𝙾',
        itens,
        `> *『 📌 𝙲𝙰𝙿𝚃𝚄𝚁𝙰 』— ${ctx.prefix}capturabestia lobo*`
      ))
    }

    if (cmd === 'familiarmagico') {
      const id = estado.familiarAtivo
      if (!id || !a.FAMILIARES[id]) {
        const possui = Object.keys(estado.familiares || {})
        return a.enviarImagem(ctx, 'familiar', m.magiaLista(
          '𝙵𝙰𝙼𝙸𝙻𝙸𝙰𝚁 𝙼𝙰́𝙶𝙸𝙲𝙾',
          possui.length
            ? possui.map(x => `${x} • ${a.FAMILIARES[x]?.nome || x}`)
            : ['Você ainda não possui um familiar.'],
          `> *『 🌀 𝙸𝙽𝚅𝙾𝙲𝙰𝚁 』— ${ctx.prefix}invocarmagia*`
        ))
      }

      return a.enviarImagem(ctx, 'familiar', m.magiaFamiliar({
        f: a.FAMILIARES[id],
        nivel: estado.familiares[id]?.nivel || 1,
        ativo: true
      }))
    }

    if (cmd === 'invocarmagia') {
      const espera = a.cooldown(estado, 'invocar', 60 * 60 * 1000)
      if (espera) return ctx.reply(m.magiaCooldown(espera))
      if (estado.cristais < 40) {
        a.limparCooldown(estado, 'invocar')
        return ctx.reply(m.magiaErro('ᴜᴍᴀ ɪɴᴠᴏᴄᴀᴄ̧ᴀ̃ᴏ ᴄᴜsᴛᴀ 40 ᴄʀɪsᴛᴀɪs.'))
      }

      estado.cristais -= 40
      const pool = Object.keys(a.FAMILIARES)
      const pesos = ['corvo','corvo','raposa','raposa','lobo','fada','golem','grifo','fenix','dragao']
      const id = pesos[a.aleatorio(0, pesos.length - 1)] || pool[0]
      if (!estado.familiares[id]) estado.familiares[id] = { nivel: 1, xp: 0 }
      else estado.familiares[id].xp = Number(estado.familiares[id].xp || 0) + 20
      estado.familiarAtivo = id
      a.salvar(ctx)
      return a.enviarImagem(ctx, 'familiar', m.magiaInvocou(a.FAMILIARES[id]))
    }

    if (cmd === 'evoluirfamiliar') {
      const id = estado.familiarAtivo || a.chave(ctx.args?.[0])
      const f = a.FAMILIARES[id]
      if (!f || !estado.familiares[id])
        return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴜᴍ ғᴀᴍɪʟɪᴀʀ ᴀᴛɪᴠᴏ.'))

      const nv = Number(estado.familiares[id].nivel || 1)
      const custo = 60 + nv * 30
      if (estado.cristais < custo) return ctx.reply(m.magiaErro(`ᴀ ᴇᴠᴏʟᴜᴄ̧ᴀ̃ᴏ ᴄᴜsᴛᴀ ${custo} ᴄʀɪsᴛᴀɪs.`))
      estado.cristais -= custo
      estado.familiares[id].nivel = nv + 1
      a.salvar(ctx)
      return ctx.reply(m.magiaFamiliarEvoluiu(f, nv + 1))
    }

    if (cmd === 'capturabestia') {
      const id = a.chave(ctx.args?.[0])
      const f = a.FAMILIARES[id]
      if (!f) return ctx.reply(m.magiaErro(`ᴜsᴇ ${ctx.prefix}bestiamagica ᴘᴀʀᴀ ᴠᴇʀ ᴀs ᴄʀɪᴀᴛᴜʀᴀs.`))

      const espera = a.cooldown(estado, 'captura', 20 * 60 * 1000)
      if (espera) return ctx.reply(m.magiaCooldown(espera))
      if (!a.consumirMana(estado, 18)) {
        a.limparCooldown(estado, 'captura')
        return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ᴘʀᴇᴄɪsᴀ ᴅᴇ 18 ᴅᴇ ᴍᴀɴᴀ.'))
      }

      const bonus = Math.min(0.18, estado.nivel * 0.008)
      const sucesso = Math.random() < Math.min(0.9, f.chance + bonus)
      if (sucesso) {
        if (!estado.familiares[id]) estado.familiares[id] = { nivel: 1, xp: 0 }
        estado.familiarAtivo = id
        a.addXp(estado, 25)
      }
      a.salvar(ctx)
      return ctx.reply(m.magiaCapturou(f, sucesso))
    }
  }
})
