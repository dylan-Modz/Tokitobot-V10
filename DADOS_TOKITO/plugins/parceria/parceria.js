/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Dev: Dylan Modz
 * ============================================================
 */

const parcerias = require('../../sistemas/parcerias')
const dylan = require('../../database/lib/comandos')

const modoLiberado = async ctx => {
  if (parcerias.modoAtivo(ctx.from))
    return true

  await ctx.reply(ctx.mess.parceriaModoDesativado(ctx.prefix))
  return false
}

const mencionar = jid => `@${String(jid || '').split('@')[0]}`

dylan.setCommand({
  nome: 'parceria',
  comandos: [
    'parceria',
    'parcerias',
    'perfilparceria',
    'minhasparcerias',
    'divulgarparceria',
    'regrasparceria'
  ],
  categoria: 'admin',
  info: {
    descricao: 'Central do sistema de parcerias.',
    uso: 'parceria',
    categoria: 'admin'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!await modoLiberado(ctx))
      return

    const comandoAtual = String(ctx.command || '').toLowerCase()

    if (comandoAtual === 'parceria')
      return ctx.reply(ctx.mess.parceriaCentral(ctx.prefix))

    if (comandoAtual === 'regrasparceria') {
      const regras = [
        '> 🤝 ׄ ( ʀᴇsᴘᴇɪᴛᴇ ᴏs ᴍᴇᴍʙʀᴏs ᴇ ᴀ ᴀᴅᴍɪɴɪsᴛʀᴀᴄ̧ᴀ̃ᴏ ᴅᴏ ɢʀᴜᴘᴏ. )',
        '> 🔗 ׄ ( ᴘᴀʀᴄᴇɪʀᴏ ᴀᴛɪᴠᴏ ᴘᴏᴅᴇ ᴇɴᴠɪᴀʀ ʟɪɴᴋs sᴇᴍ ᴘᴜɴɪᴄ̧ᴀ̃ᴏ ᴅᴏ ᴀɴᴛɪ-ʟɪɴᴋ. )',
        '> 🚫 ׄ ( ᴀ ᴘᴇʀᴍɪssᴀ̃ᴏ ɴᴀ̃ᴏ ᴅᴇᴠᴇ sᴇʀ ᴜsᴀᴅᴀ ᴘᴀʀᴀ sᴘᴀᴍ ᴏᴜ ᴄᴏɴᴛᴇᴜ́ᴅᴏ ᴘʀᴏɪʙɪᴅᴏ. )',
        '> ⏳ ׄ ( ᴘᴀʀᴄᴇʀɪᴀ sᴜsᴘᴇɴsᴀ ᴏᴜ ᴇxᴘɪʀᴀᴅᴀ ᴘᴇʀᴅᴇ ᴏ ʙʏᴘᴀss ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ. )'
      ].join('\n')

      return ctx.reply(ctx.mess.parceriaRegras(regras))
    }

    if (comandoAtual === 'parcerias') {
      const lista = parcerias.listar(ctx.from, true)

      if (!lista.length)
        return ctx.reply(ctx.mess.parceriaSemCadastradas())

      const texto = lista
        .map(item =>
          `> 🤝 ׄ ( ${item.id} — ${item.nome} — ${mencionar(item.responsavel)} )`
        )
        .join('\n')

      return ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.parceriaLista(texto, lista.length),
        contextInfo: {
          ...ctx.newsletter,
          mentionedJid: lista.map(item => item.responsavel).filter(Boolean)
        }
      }, { quoted: ctx.selo })
    }

    if (comandoAtual === 'minhasparcerias') {
      const lista = parcerias.listar(ctx.from, false)
        .filter(item => parcerias.normalizarUsuario(item.responsavel) === parcerias.normalizarUsuario(ctx.sender))

      if (!lista.length)
        return ctx.reply(ctx.mess.parceriaSemMinhas())

      const texto = lista
        .map(item => `> 🤝 ׄ ( ${item.id} — ${item.nome} — ${item.status} )`)
        .join('\n')

      return ctx.reply(ctx.mess.parceriaMinhas(texto, lista.length))
    }

    if (comandoAtual === 'perfilparceria') {
      const termo = String(ctx.q || '').trim() || ctx.sender
      const parceria = parcerias.buscar(ctx.from, termo)

      if (!parceria)
        return ctx.reply(ctx.mess.parceriaNaoEncontrada())

      return ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.parceriaPerfil({
          id: parceria.id,
          nome: parceria.nome,
          tipo: parceria.tipo,
          responsavel: parceria.responsavel,
          nivel: parceria.nivel,
          status: parceria.status,
          bypass: parceria.bypass === true,
          validade: parcerias.validadeTexto(parceria)
        }),
        contextInfo: {
          ...ctx.newsletter,
          mentionedJid: [parceria.responsavel]
        }
      }, { quoted: ctx.selo })
    }

    if (comandoAtual === 'divulgarparceria') {
      const termo = String(ctx.q || '').trim() || ctx.sender
      const parceria = parcerias.buscar(ctx.from, termo)

      if (!parceria || parceria.status !== 'ativo')
        return ctx.reply(ctx.mess.parceriaNaoEncontrada())

      const ehResponsavel = parcerias.normalizarUsuario(parceria.responsavel) === parcerias.normalizarUsuario(ctx.sender)

      if (!ehResponsavel && !ctx.isGroupAdmins && !ctx.SoDono)
        return ctx.reply(ctx.mess.parceriaDivulgacaoNegada())

      parcerias.registrarDivulgacao(ctx.from, parceria.id)

      return ctx.reply(ctx.mess.parceriaDivulgacao({
        nome: parceria.nome,
        tipo: parceria.tipo,
        descricao: parceria.descricao,
        link: parceria.link
      }))
    }
  }
})
