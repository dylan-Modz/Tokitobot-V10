const emoji = '💳'
const titulo = '𝙰𝙽𝚃𝙸 𝙽𝙾𝚃𝙰𝚂'
const descricao = 'ʙʟᴏǫᴜᴇɪᴀ ᴍᴇɴsᴀɢᴇɴs ᴇ ɴᴏᴛᴀs ᴅᴇ ᴘᴀɢᴀᴍᴇɴᴛᴏ sᴜsᴘᴇɪᴛᴀs.'

module.exports = {
  nome: 'antinotas',

  comandos: [
    'antinotas'
  ],

  categoria: 'admin',

  info: {
    descricao: 'Bloqueia mensagens/notas de pagamento suspeitas.',
    uso: 'antinotas 1/0',
    permissao: 'ADM'
  },

  async executar(ctx) {
    if (!ctx.isGroup) {
      return ctx.reply(ctx.mess.sogrupo())
    }

    if (!ctx.isGroupAdmins && !ctx.SoDono) {
      return ctx.reply(ctx.mess.soadm())
    }

    if (!ctx.isBotGroupAdmins) {
      return ctx.reply(ctx.mess.botadm())
    }

    const acao = String(ctx.q || '').trim()

    if (!['0', '1'].includes(acao)) {
      return ctx.reply(
        ctx.mess.funcaoUso(
          emoji,
          titulo,
          ctx.prefix,
          ctx.command,
          descricao
        )
      )
    }

    const ativado = acao === '1'
    ctx.dataGp[0].funcoes.antinotas = ativado
    ctx.setGp(ctx.dataGp)

    await ctx.reagir(
      ctx.from,
      ativado ? '✅' : '❌'
    ).catch(() => {
    })

    return ctx.reply(
      ativado
        ? ctx.mess.funcaoAtivada(emoji, titulo, descricao)
        : ctx.mess.funcaoDesativada(emoji, titulo, descricao)
    )
  }
}
