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

const catalogo = a => [
  ...Object.entries(a.FEITICOS).filter(([id]) => id !== 'faisca').map(([id, x]) => ({
    tipo: 'feitico', id, nome: x.nome, preco: x.preco
  })),
  ...Object.entries(a.ARTEFATOS).map(([id, x]) => ({
    tipo: 'artefato', id, nome: x.nome, preco: x.preco
  })),
  ...Object.entries(a.POCOES).map(([id, x]) => ({
    tipo: 'pocao', id, nome: x.nome, preco: Math.max(25, x.cristais - 10)
  }))
]

dylan.setCommand({
  nome: 'lojamagia',
  comandos: ['lojamagia', 'mercadomagico', 'comprarmagia', 'vendermagia', 'leilaomagico'],
  categoria: 'magia',
  info: {
    descricao: 'Loja, compras, vendas e leilão do RPG de Magia.',
    uso: 'lojamagia',
    requisitos: 'Modo RPG + Magia desperta',
    categoria: 'magia'
  },
  async executar(ctx) {
    const estado = await a.guarda(ctx)
    if (!estado) return
    const cmd = ctx.command
    const itens = catalogo(a)

    if (cmd === 'lojamagia') {
      const linhas = itens.map(x => `${x.tipo} ${x.id} • ${x.nome} • ${x.preco} cristais`)
      return a.enviarImagem(ctx, 'loja', m.magiaLista(
        '𝙻𝙾𝙹𝙰 𝙳𝙴 𝙼𝙰𝙶𝙸𝙰',
        linhas,
        `> *『 🛍️ 𝙲𝙾𝙼𝙿𝚁𝙰𝚁 』— ${ctx.prefix}comprarmagia feitico bolafogo*`
      ))
    }

    if (cmd === 'mercadomagico') {
      const linhas = [
        `💎 Cristais: ${estado.cristais}`,
        `🪙 Ouro Arcano: ${estado.ouroArcano}`,
        `📚 Feitiços disponíveis: ${Object.keys(a.FEITICOS).length - 1}`,
        `🗿 Artefatos disponíveis: ${Object.keys(a.ARTEFATOS).length}`,
        `🧪 Poções disponíveis: ${Object.keys(a.POCOES).length}`
      ]
      return a.enviarImagem(ctx, 'loja', m.magiaLista(
        '𝙼𝙴𝚁𝙲𝙰𝙳𝙾 𝙰𝚁𝙲𝙰𝙽𝙾',
        linhas,
        `> *『 🏪 𝙲𝙰𝚃𝙰́𝙻𝙾𝙶𝙾 』— ${ctx.prefix}lojamagia*`
      ))
    }

    if (cmd === 'comprarmagia') {
      const tipo = a.chave(ctx.args?.[0])
      const id = a.chave(ctx.args?.[1])
      if (!tipo || !id)
        return ctx.reply(m.magiaErro(`ᴜsᴇ ${ctx.prefix}comprarmagia feitico bolafogo.`))

      let item = null
      let preco = 0

      if (tipo === 'feitico') {
        item = a.FEITICOS[id]
        if (!item) return ctx.reply(m.magiaErro('ғᴇɪᴛɪᴄ̧ᴏ ɪɴᴠᴀ́ʟɪᴅᴏ.'))
        if (estado.grimorio.includes(id)) return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴘᴏssᴜɪ ᴇssᴇ ғᴇɪᴛɪᴄ̧ᴏ.'))
        preco = item.preco
      } else if (tipo === 'artefato') {
        item = a.ARTEFATOS[id]
        if (!item) return ctx.reply(m.magiaErro('ᴀʀᴛᴇғᴀᴛᴏ ɪɴᴠᴀ́ʟɪᴅᴏ.'))
        if (estado.artefatos.includes(id)) return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ᴊᴀ́ ᴘᴏssᴜɪ ᴇssᴇ ᴀʀᴛᴇғᴀᴛᴏ.'))
        preco = item.preco
      } else if (tipo === 'pocao') {
        item = a.POCOES[id]
        if (!item) return ctx.reply(m.magiaErro('ᴘᴏᴄ̧ᴀ̃ᴏ ɪɴᴠᴀ́ʟɪᴅᴀ.'))
        preco = Math.max(25, item.cristais - 10)
      } else {
        return ctx.reply(m.magiaErro('ᴛɪᴘᴏ ɪɴᴠᴀ́ʟɪᴅᴏ. ᴜsᴇ feitico, artefato ᴏᴜ pocao.'))
      }

      if (estado.cristais < preco)
        return ctx.reply(m.magiaErro(`ᴠᴏᴄᴇ̂ ᴘʀᴇᴄɪsᴀ ᴅᴇ ${preco} ᴄʀɪsᴛᴀɪs.`))

      estado.cristais -= preco
      if (tipo === 'feitico') {
        estado.grimorio.push(id)
        estado.niveisFeitico[id] = 1
      }
      if (tipo === 'artefato') estado.artefatos.push(id)
      if (tipo === 'pocao') estado.pocoes[id] = Number(estado.pocoes[id] || 0) + 1
      a.salvar(ctx)
      return ctx.reply(m.magiaCompra(item.nome, preco, estado.cristais))
    }

    if (cmd === 'vendermagia') {
      const tipo = a.chave(ctx.args?.[0])
      const id = a.chave(ctx.args?.[1])
      let item = null
      let valor = 0

      if (tipo === 'artefato' && a.ARTEFATOS[id] && estado.artefatos.includes(id)) {
        item = a.ARTEFATOS[id]
        valor = Math.floor(item.preco * 0.55)
        estado.artefatos = estado.artefatos.filter(x => x !== id)
        if (estado.artefato === id) estado.artefato = null
      } else if (tipo === 'pocao' && a.POCOES[id] && Number(estado.pocoes[id] || 0) > 0) {
        item = a.POCOES[id]
        valor = Math.floor(Math.max(25, item.cristais - 10) * 0.55)
        estado.pocoes[id]--
      } else {
        return ctx.reply(m.magiaErro(`ᴜsᴇ ${ctx.prefix}vendermagia artefato cajado ᴏᴜ ${ctx.prefix}vendermagia pocao mana.`))
      }

      estado.cristais += valor
      a.salvar(ctx)
      return ctx.reply(m.magiaVenda(item.nome, valor, estado.cristais))
    }

    if (cmd === 'leilaomagico') {
      const espera = a.cooldown(estado, 'leilao', 2 * 60 * 60 * 1000)
      if (espera) return ctx.reply(m.magiaCooldown(espera))
      if (estado.ouroArcano < 100) {
        a.limparCooldown(estado, 'leilao')
        return ctx.reply(m.magiaErro('ᴠᴏᴄᴇ̂ ᴘʀᴇᴄɪsᴀ ᴅᴇ 100 ᴅᴇ ᴏᴜʀᴏ ᴀʀᴄᴀɴᴏ.'))
      }

      const pool = Object.entries(a.ARTEFATOS)
      const [id, item] = pool[a.aleatorio(0, pool.length - 1)]
      const lance = a.aleatorio(100, 350)
      const ganhou = estado.ouroArcano >= lance && Math.random() < 0.65

      if (ganhou) {
        estado.ouroArcano -= lance
        if (!estado.artefatos.includes(id)) estado.artefatos.push(id)
      } else {
        estado.ouroArcano -= 25
      }
      a.salvar(ctx)
      return ctx.reply(m.magiaLeilao(
        item.nome,
        ganhou ? `${lance} ouro` : 'Lance perdido • taxa 25 ouro',
        ganhou ? 'Você' : 'Outro mago'
      ))
    }
  }
})
