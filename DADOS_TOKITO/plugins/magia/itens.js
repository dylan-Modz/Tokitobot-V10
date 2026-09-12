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
  nome: 'artefatomagico',
  comandos: ['artefatomagico', 'equiparartefato', 'inventariomagico', 'cristaismagicos'],
  categoria: 'magia',
  info: {
    descricao: 'Artefatos, inventário e cristais do RPG de Magia.',
    uso: 'artefatomagico',
    requisitos: 'Modo RPG + Magia desperta',
    categoria: 'magia'
  },
  async executar(ctx) {
    const estado = await a.guarda(ctx)
    if (!estado) return
    const cmd = ctx.command

    if (cmd === 'artefatomagico') {
      const itens = Object.entries(a.ARTEFATOS).map(([id, x]) => {
        const possui = estado.artefatos.includes(id) ? '✅' : '🔒'
        const equipado = estado.artefato === id ? ' • EQUIPADO' : ''
        return `${possui} ${id} • ${x.nome} • ${x.raridade} • +${x.poder} poder${equipado}`
      })
      return ctx.reply(m.magiaLista(
        '𝙰𝚁𝚃𝙴𝙵𝙰𝚃𝙾𝚂',
        itens,
        `> *『 🏪 𝙲𝙾𝙼𝙿𝚁𝙰𝚁 』— ${ctx.prefix}comprarmagia artefato cajado*`
      ))
    }

    if (cmd === 'equiparartefato') {
      const id = a.chave(ctx.args?.[0])
      const art = a.ARTEFATOS[id]
      if (!art || !estado.artefatos.includes(id))
        return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ᴇssᴇ ᴀʀᴛᴇғᴀᴛᴏ.'))

      estado.artefato = id
      a.salvar(ctx)
      return ctx.reply(m.magiaArtefatoEquipado(art))
    }

    if (cmd === 'inventariomagico') {
      const artefatos = estado.artefatos.map(id => a.ARTEFATOS[id]?.nome || id)
      const familiares = Object.keys(estado.familiares || {}).map(id => a.FAMILIARES[id]?.nome || id)
      const pocoes = Object.entries(estado.pocoes || {}).filter(([,q]) => q > 0).map(([id,q]) => `${a.POCOES[id]?.nome || id} x${q}`)
      const itens = [
        `💎 Cristais: ${estado.cristais}`,
        `🪙 Ouro Arcano: ${estado.ouroArcano}`,
        `🗿 Artefatos: ${artefatos.join(', ') || 'Nenhum'}`,
        `🧪 Poções: ${pocoes.join(', ') || 'Nenhuma'}`,
        `🐉 Familiares: ${familiares.join(', ') || 'Nenhum'}`,
        `🎁 Baús: ${estado.baus || 0}`
      ]
      return ctx.reply(m.magiaLista('𝙸𝙽𝚅𝙴𝙽𝚃𝙰́𝚁𝙸𝙾 𝙼𝙰́𝙶𝙸𝙲𝙾', itens))
    }

    if (cmd === 'cristaismagicos') {
      return a.enviarImagem(ctx, 'cristais', m.magiaLista('𝙲𝚁𝙸𝚂𝚃𝙰𝙸𝚂 𝙼𝙰́𝙶𝙸𝙲𝙾𝚂', [
        `💎 Cristais: ${estado.cristais}`,
        `🪙 Ouro Arcano: ${estado.ouroArcano}`,
        '✨ Ganhe mais em missões, torre, arena, baús e bônus diário.'
      ]))
    }
  }
})
