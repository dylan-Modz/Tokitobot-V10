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
  nome: 'magia',
  comandos: [
    'magia', 'menumagia', 'magoperfil', 'despertarmagia',
    'classemagica', 'elementomagico', 'manamagica'
  ],
  categoria: 'magia',
  info: {
    descricao: 'Menu, perfil e configuração inicial do RPG de Magia.',
    uso: 'magia',
    requisitos: 'Modo RPG',
    categoria: 'magia'
  },
  async executar(ctx) {
    const cmd = ctx.command

    if (cmd === 'magia' || cmd === 'menumagia') {
      const estado = await a.guarda(ctx, false)
      if (!estado) return
      return a.enviarImagem(ctx, 'menu', m.magiaMenu(ctx.prefix))
    }

    if (cmd === 'despertarmagia') {
      const estado = await a.guarda(ctx, false)
      if (!estado) return
      if (estado.iniciado) return ctx.reply(m.magiaJaDesperta(ctx.prefix))

      estado.iniciado = true
      estado.classeId = 'arcano'
      estado.classe = a.CLASSES.arcano.nome
      estado.elementoId = 'arcano'
      estado.elemento = a.ELEMENTOS.arcano.nome
      estado.manaMax = 120
      estado.mana = 120
      estado.cristais = Math.max(250, Number(estado.cristais || 0))
      estado.ouroArcano = Math.max(500, Number(estado.ouroArcano || 0))
      a.salvar(ctx)

      return a.enviarImagem(ctx, 'mago', m.magiaDespertada(estado))
    }

    const estado = await a.guarda(ctx)
    if (!estado) return

    if (cmd === 'magoperfil') {
      const lista = a.rank(ctx)
      const pos = lista.findIndex(x => x.jid === ctx.normalizar(ctx.sender)) + 1
      const texto = m.magiaPerfil({
        jid: ctx.sender,
        m: estado,
        poder: a.poder(estado),
        pos
      })
      a.salvar(ctx)
      return a.enviarImagem(ctx, 'mago', texto)
    }

    if (cmd === 'classemagica') {
      const id = a.chave(ctx.args?.[0])
      if (!id) {
        const itens = Object.entries(a.CLASSES)
          .map(([k, v]) => `${k} • ${v.nome} • +${v.poder} poder • ${v.descricao}`)
        return ctx.reply(m.magiaLista(
          '𝙲𝙻𝙰𝚂𝚂𝙴𝚂 𝙼𝙰́𝙶𝙸𝙲𝙰𝚂',
          itens,
          `> *『 📌 𝚄𝚂𝙾 』— ${ctx.prefix}classemagica arcano*`
        ))
      }

      const classe = a.CLASSES[id]
      if (!classe) return ctx.reply(m.magiaErro('ᴄʟᴀssᴇ ᴍᴀ́ɢɪᴄᴀ ɪɴᴠᴀ́ʟɪᴅᴀ.'))

      estado.classeId = id
      estado.classe = classe.nome
      estado.manaMax = Math.max(100, 100 + classe.mana + (estado.nivel - 1) * 10)
      estado.mana = Math.min(estado.mana, estado.manaMax)
      a.salvar(ctx)
      return ctx.reply(m.magiaClasseAtualizada(classe.nome))
    }

    if (cmd === 'elementomagico') {
      const id = a.chave(ctx.args?.[0])
      if (!id) {
        const itens = Object.entries(a.ELEMENTOS)
          .map(([k, v]) => `${k} • ${v.nome} • +${v.poder} poder`)
        return ctx.reply(m.magiaLista(
          '𝙴𝙻𝙴𝙼𝙴𝙽𝚃𝙾𝚂 𝙼𝙰́𝙶𝙸𝙲𝙾𝚂',
          itens,
          `> *『 📌 𝚄𝚂𝙾 』— ${ctx.prefix}elementomagico fogo*`
        ))
      }

      const elemento = a.ELEMENTOS[id]
      if (!elemento) return ctx.reply(m.magiaErro('ᴇʟᴇᴍᴇɴᴛᴏ ɪɴᴠᴀ́ʟɪᴅᴏ.'))

      estado.elementoId = id
      estado.elemento = elemento.nome
      a.salvar(ctx)
      return ctx.reply(m.magiaElementoAtualizado(elemento.nome))
    }

    if (cmd === 'manamagica') {
      a.regenerarMana(estado)
      a.salvar(ctx)
      return ctx.reply(m.magiaMana(estado))
    }
  }
})
