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
  nome: 'alquimiamagica',
  comandos: ['alquimiamagica', 'pocaomagica', 'receitasmagicas'],
  categoria: 'magia',
  info: {
    descricao: 'Cria e usa poções mágicas.',
    uso: 'alquimiamagica',
    requisitos: 'Modo RPG + Magia desperta',
    categoria: 'magia'
  },
  async executar(ctx) {
    const estado = await a.guarda(ctx)
    if (!estado) return
    const cmd = ctx.command

    if (cmd === 'receitasmagicas') {
      const itens = Object.entries(a.POCOES).map(([id, p]) =>
        `${id} • ${p.nome} • ${p.efeito} • ${p.cristais} cristais`
      )
      return a.enviarImagem(ctx, 'alquimia', m.magiaLista(
        '𝚁𝙴𝙲𝙴𝙸𝚃𝙰𝚂 𝙼𝙰́𝙶𝙸𝙲𝙰𝚂',
        itens,
        `> *『 📌 𝙲𝚁𝙸𝙰𝚁 』— ${ctx.prefix}alquimiamagica mana*`
      ))
    }

    if (cmd === 'alquimiamagica') {
      const id = a.chave(ctx.args?.[0])
      if (!id) return a.enviarImagem(ctx, 'alquimia', m.magiaLista(
        '𝙰𝙻𝚀𝚄𝙸𝙼𝙸𝙰',
        ['Crie poções usando cristais mágicos.', `Veja as receitas em ${ctx.prefix}receitasmagicas.`],
        `> *『 📌 𝚄𝚂𝙾 』— ${ctx.prefix}alquimiamagica mana*`
      ))

      const p = a.POCOES[id]
      if (!p) return ctx.reply(m.magiaErro('ʀᴇᴄᴇɪᴛᴀ ɪɴᴠᴀ́ʟɪᴅᴀ.'))
      if (estado.cristais < p.cristais) return ctx.reply(m.magiaErro(`ᴀ ʀᴇᴄᴇɪᴛᴀ ᴄᴜsᴛᴀ ${p.cristais} ᴄʀɪsᴛᴀɪs.`))

      estado.cristais -= p.cristais
      estado.pocoes[id] = Number(estado.pocoes[id] || 0) + 1
      a.salvar(ctx)
      return ctx.reply(m.magiaFabricou(p, estado.pocoes[id]))
    }

    if (cmd === 'pocaomagica') {
      const id = a.chave(ctx.args?.[0])
      const p = a.POCOES[id]
      if (!p) {
        const inv = Object.entries(estado.pocoes).map(([k,q]) => `${a.POCOES[k]?.nome || k}: ${q}`)
        return ctx.reply(m.magiaLista(
          '𝙿𝙾𝙲̧𝙾̃𝙴𝚂',
          inv,
          `> *『 📌 𝚄𝚂𝙾 』— ${ctx.prefix}pocaomagica mana*`
        ))
      }

      if (Number(estado.pocoes[id] || 0) <= 0)
        return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴇssᴀ ᴘᴏᴄ̧ᴀ̃ᴏ.'))

      estado.pocoes[id]--
      if (id === 'mana')
        estado.mana = Math.min(estado.manaMax, Number(estado.mana) + 45)
      if (id === 'foco') {
        estado.bonusFoco = 35
        estado.bonusFocoAte = Date.now() + 20 * 60 * 1000
      }
      if (id === 'experiencia')
        a.addXp(estado, 80)

      a.salvar(ctx)
      return ctx.reply(m.magiaPocao(p, estado.pocoes[id]))
    }
  }
})
