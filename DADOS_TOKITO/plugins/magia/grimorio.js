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
  nome: 'grimoriomagico',
  comandos: [
    'grimoriomagico', 'feiticosmagicos', 'aprendermagia', 'conjurarmagia',
    'equiparmagia', 'melhorarmagia', 'fundirmagia', 'encantarmagia'
  ],
  categoria: 'magia',
  info: {
    descricao: 'Grimório, feitiços, conjuração, evolução e encantamentos.',
    uso: 'grimoriomagico',
    requisitos: 'Modo RPG + Magia desperta',
    categoria: 'magia'
  },
  async executar(ctx) {
    const estado = await a.guarda(ctx)
    if (!estado) return
    const cmd = ctx.command

    if (cmd === 'grimoriomagico') {
      const itens = (estado.grimorio || []).map(id => {
        const f = a.FEITICOS[id]
        if (!f) return id
        return `${f.nome} • Nv.${estado.niveisFeitico?.[id] || 1} • ${f.raridade}`
      })
      return a.enviarImagem(ctx, 'grimorio', m.magiaLista(
        '𝙶𝚁𝙸𝙼𝙾́𝚁𝙸𝙾',
        itens.length ? itens : ['Seu grimório está vazio.'],
        `> *『 🪄 𝙴𝚀𝚄𝙸𝙿𝙰𝙳𝙰𝚂 』— ${(estado.equipadas || []).map(id => a.FEITICOS[id]?.nome || id).join(', ')}*`
      ))
    }

    if (cmd === 'feiticosmagicos') {
      const itens = Object.entries(a.FEITICOS).map(([id, f]) => {
        const possui = estado.grimorio.includes(id) ? '✅' : '🔒'
        return `${possui} ${id} • ${f.nome} • ${f.raridade} • ${f.preco} cristais`
      })
      return a.enviarImagem(ctx, 'feiticos', m.magiaLista(
        '𝙵𝙴𝙸𝚃𝙸𝙲̧𝙾𝚂',
        itens,
        `> *『 📌 𝙰𝙿𝚁𝙴𝙽𝙳𝙴𝚁 』— ${ctx.prefix}aprendermagia bolafogo*`
      ))
    }

    if (cmd === 'aprendermagia') {
      const id = a.chave(ctx.args?.[0])
      const f = a.FEITICOS[id]
      if (!f) return ctx.reply(m.magiaErro(`ᴜsᴇ ${ctx.prefix}feiticosmagicos ᴘᴀʀᴀ ᴠᴇʀ ᴏs ғᴇɪᴛɪᴄ̧ᴏs.`))
      if (estado.grimorio.includes(id)) return ctx.reply(m.magiaErro('ᴇssᴇ ғᴇɪᴛɪᴄ̧ᴏ ᴊᴀ́ ᴇsᴛᴀ́ ɴᴏ sᴇᴜ ɢʀɪᴍᴏ́ʀɪᴏ.'))
      if (estado.cristais < f.preco) return ctx.reply(m.magiaErro(`ᴠᴏᴄᴇ̂ ᴘʀᴇᴄɪsᴀ ᴅᴇ ${f.preco} ᴄʀɪsᴛᴀɪs.`))

      estado.cristais -= f.preco
      estado.grimorio.push(id)
      estado.niveisFeitico[id] = 1
      a.salvar(ctx)
      return ctx.reply(m.magiaAprendida(f))
    }

    if (cmd === 'conjurarmagia') {
      const id = a.chave(ctx.args?.[0])
      const f = a.FEITICOS[id]
      if (!f || !estado.grimorio.includes(id))
        return ctx.reply(m.magiaErro(`ᴇsᴄᴏʟʜᴀ ᴜᴍ ғᴇɪᴛɪᴄ̧ᴏ ᴅᴏ ${ctx.prefix}grimoriomagico.`))

      if (!a.consumirMana(estado, f.custoMana))
        return ctx.reply(m.magiaErro('ᴍᴀɴᴀ ɪɴsᴜғɪᴄɪᴇɴᴛᴇ.'))

      const nv = Number(estado.niveisFeitico?.[id] || 1)
      const dano = Math.floor(f.poder * (1 + (nv - 1) * 0.12) + a.aleatorio(0, 14))
      const xp = a.aleatorio(6, 14)
      a.addXp(estado, xp)
      a.salvar(ctx)

      const alvo = a.marcado(ctx)
      return ctx.reply(m.magiaConjurada({
        f, dano, mana: estado.mana, xp,
        alvo: alvo ? `@${alvo.split('@')[0]}` : null
      }))
    }

    if (cmd === 'equiparmagia') {
      const id = a.chave(ctx.args?.[0])
      if (!id) {
        const lista = (estado.equipadas || []).map(x => a.FEITICOS[x]?.nome || x)
        return ctx.reply(m.magiaEquipadas(lista))
      }
      if (!a.FEITICOS[id] || !estado.grimorio.includes(id))
        return ctx.reply(m.magiaErro('ᴇssᴇ ғᴇɪᴛɪᴄ̧ᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ɴᴏ sᴇᴜ ɢʀɪᴍᴏ́ʀɪᴏ.'))

      const atual = Array.isArray(estado.equipadas) ? estado.equipadas : []
      if (!atual.includes(id)) {
        atual.push(id)
        while (atual.length > 4) atual.shift()
      }
      estado.equipadas = atual
      a.salvar(ctx)
      return ctx.reply(m.magiaEquipadas(atual.map(x => a.FEITICOS[x]?.nome || x)))
    }

    if (cmd === 'melhorarmagia') {
      const id = a.chave(ctx.args?.[0])
      const f = a.FEITICOS[id]
      if (!f || !estado.grimorio.includes(id))
        return ctx.reply(m.magiaErro('ғᴇɪᴛɪᴄ̧ᴏ ɪɴᴠᴀ́ʟɪᴅᴏ ᴏᴜ ɴᴀ̃ᴏ ᴀᴘʀᴇɴᴅɪᴅᴏ.'))

      const atual = Number(estado.niveisFeitico[id] || 1)
      if (atual >= 10) return ctx.reply(m.magiaErro('ᴇssᴇ ғᴇɪᴛɪᴄ̧ᴏ ᴊᴀ́ ᴇsᴛᴀ́ ɴᴏ ɴɪ́ᴠᴇʟ ᴍᴀ́xɪᴍᴏ.'))
      const custo = 45 + atual * 35
      if (estado.cristais < custo) return ctx.reply(m.magiaErro(`ғᴀʟᴛᴀᴍ ᴄʀɪsᴛᴀɪs. ᴄᴜsᴛᴏ: ${custo}.`))

      estado.cristais -= custo
      estado.niveisFeitico[id] = atual + 1
      a.salvar(ctx)
      return ctx.reply(m.magiaMelhorada(f, atual + 1, custo))
    }

    if (cmd === 'fundirmagia') {
      const id1 = a.chave(ctx.args?.[0])
      const id2 = a.chave(ctx.args?.[1])
      if (!id1 || !id2 || id1 === id2 || !estado.grimorio.includes(id1) || !estado.grimorio.includes(id2))
        return ctx.reply(m.magiaErro(`ᴜsᴇ ${ctx.prefix}fundirmagia faisca bolafogo ᴄᴏᴍ ᴅᴏɪs ғᴇɪᴛɪᴄ̧ᴏs ǫᴜᴇ ᴠᴏᴄᴇ̂ ᴘᴏssᴜɪ.`))
      if (estado.cristais < 75) return ctx.reply(m.magiaErro('ᴀ ғᴜsᴀ̃ᴏ ᴄᴜsᴛᴀ 75 ᴄʀɪsᴛᴀɪs.'))

      const bonus = Math.floor((a.FEITICOS[id1].poder + a.FEITICOS[id2].poder) * 0.18)
      estado.cristais -= 75
      estado.bonusFusao = bonus
      estado.bonusFusaoAte = Date.now() + 30 * 60 * 1000
      a.salvar(ctx)
      return ctx.reply(m.magiaFundida(a.FEITICOS[id1].nome, a.FEITICOS[id2].nome, bonus))
    }

    if (cmd === 'encantarmagia') {
      const id = estado.artefato || a.chave(ctx.args?.[0])
      const art = a.ARTEFATOS[id]
      if (!art || !estado.artefatos.includes(id))
        return ctx.reply(m.magiaErro(`ᴇǫᴜɪᴘᴇ ᴜᴍ ᴀʀᴛᴇғᴀᴛᴏ ᴄᴏᴍ ${ctx.prefix}equiparartefato.`))

      const atual = Number(estado.encantos[id] || 0)
      const custo = 60 + atual * 25
      if (estado.cristais < custo) return ctx.reply(m.magiaErro(`ᴏ ᴇɴᴄᴀɴᴛᴀᴍᴇɴᴛᴏ ᴄᴜsᴛᴀ ${custo} ᴄʀɪsᴛᴀɪs.`))
      estado.cristais -= custo
      estado.encantos[id] = atual + 5
      a.salvar(ctx)
      return ctx.reply(m.magiaEncantado(art, estado.encantos[id], custo))
    }
  }
})
