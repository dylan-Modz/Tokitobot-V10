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
  nome: 'guildamagica',
  comandos: ['guildamagica', 'criarguildamagica', 'entrarguildamagica', 'sairguildamagica', 'rankguildamagica'],
  categoria: 'magia',
  info: {
    descricao: 'Guildas exclusivas do RPG de Magia.',
    uso: 'guildamagica',
    requisitos: 'Modo RPG + Magia desperta',
    categoria: 'magia'
  },
  async executar(ctx) {
    const estado = await a.guarda(ctx)
    if (!estado) return
    const cmd = ctx.command
    const guildas = a.guildas(ctx)
    const meuId = estado.guilda
    const atual = meuId ? guildas[meuId] : null

    if (cmd === 'guildamagica') {
      if (!atual) {
        const itens = Object.entries(guildas).slice(0, 15).map(([id, g]) =>
          `${id} • ${g.nome} • ${g.membros?.length || 0} membros • ${a.guildaPoder(ctx, g)} poder`
        )
        return a.enviarImagem(ctx, 'guilda', m.magiaLista(
          '𝙶𝚄𝙸𝙻𝙳𝙰𝚂 𝙼𝙰́𝙶𝙸𝙲𝙰𝚂',
          itens.length ? itens : ['Nenhuma guilda mágica criada.'],
          `> *『 👑 𝙲𝚁𝙸𝙰𝚁 』— ${ctx.prefix}criarguildamagica Nome*`
        ))
      }
      return a.enviarImagem(ctx, 'guilda', m.magiaGuilda({
        nomeGuilda: atual.nome,
        membros: atual.membros?.length || 0,
        poder: a.guildaPoder(ctx, atual),
        dono: atual.dono
      }), atual.membros || [])
    }

    if (cmd === 'criarguildamagica') {
      if (atual) return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴇsᴛᴀ́ ᴇᴍ ᴜᴍᴀ ɢᴜɪʟᴅᴀ.'))
      const nome = String(ctx.q || ctx.args?.join(' ') || '').trim().slice(0, 28)
      if (nome.length < 3) return ctx.reply(m.magiaErro(`ᴜsᴇ ${ctx.prefix}criarguildamagica Nome da Guilda.`))
      const id = a.idGuilda(nome)
      if (!id || guildas[id]) return ctx.reply(m.magiaErro('ᴇssᴇ ɴᴏᴍᴇ/ɪᴅ ᴅᴇ ɢᴜɪʟᴅᴀ ᴊᴀ́ ᴇxɪsᴛᴇ.'))
      if (estado.cristais < 150) return ctx.reply(m.magiaErro('ᴄʀɪᴀʀ ᴜᴍᴀ ɢᴜɪʟᴅᴀ ᴄᴜsᴛᴀ 150 ᴄʀɪsᴛᴀɪs.'))

      estado.cristais -= 150
      guildas[id] = {
        nome,
        dono: ctx.normalizar(ctx.sender),
        membros: [ctx.normalizar(ctx.sender)],
        criadaEm: Date.now()
      }
      estado.guilda = id
      a.salvar(ctx)
      return ctx.reply(m.magiaGuildaCriada(nome, id))
    }

    if (cmd === 'entrarguildamagica') {
      if (atual) return ctx.reply(m.magiaErro('sᴀɪᴀ ᴅᴀ sᴜᴀ ɢᴜɪʟᴅᴀ ᴀᴛᴜᴀʟ ᴘʀɪᴍᴇɪʀᴏ.'))
      const id = a.chave(ctx.args?.[0])
      const g = guildas[id]
      if (!g) return ctx.reply(m.magiaErro(`ɢᴜɪʟᴅᴀ ɴᴀ̃ᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ. ᴠᴇᴊᴀ ${ctx.prefix}guildamagica.`))
      if ((g.membros || []).length >= 20) return ctx.reply(m.magiaErro('ᴇssᴀ ɢᴜɪʟᴅᴀ ᴇsᴛᴀ́ ʟᴏᴛᴀᴅᴀ.'))

      const jid = ctx.normalizar(ctx.sender)
      if (!g.membros.includes(jid)) g.membros.push(jid)
      estado.guilda = id
      a.salvar(ctx)
      return ctx.reply(m.magiaGuildaEntrou(g.nome))
    }

    if (cmd === 'sairguildamagica') {
      if (!atual) return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴇᴍ ᴜᴍᴀ ɢᴜɪʟᴅᴀ.'))
      const jid = ctx.normalizar(ctx.sender)
      if (atual.dono === jid && (atual.membros || []).length > 1)
        return ctx.reply(m.magiaErro('ᴏ ʟɪ́ᴅᴇʀ ɴᴀ̃ᴏ ᴘᴏᴅᴇ sᴀɪʀ ᴇɴǫᴜᴀɴᴛᴏ ʜᴏᴜᴠᴇʀ ᴏᴜᴛʀᴏs ᴍᴇᴍʙʀᴏs.'))

      atual.membros = (atual.membros || []).filter(x => x !== jid)
      const nome = atual.nome
      estado.guilda = null
      if (!atual.membros.length) delete guildas[meuId]
      a.salvar(ctx)
      return ctx.reply(m.magiaGuildaSaiu(nome))
    }

    if (cmd === 'rankguildamagica') {
      const lista = Object.entries(guildas)
        .map(([id, g]) => ({ id, g, poder: a.guildaPoder(ctx, g) }))
        .sort((x, y) => y.poder - x.poder)
        .slice(0, 10)
      const itens = lista.length
        ? lista.map((x, i) => `${i + 1}º ${x.g.nome} • ${x.poder} poder • ${x.g.membros?.length || 0} membros`)
        : ['Nenhuma guilda no ranking.']
      return ctx.reply(m.magiaLista('𝚁𝙰𝙽𝙺 𝙳𝙴 𝙶𝚄𝙸𝙻𝙳𝙰𝚂', itens))
    }
  }
})
