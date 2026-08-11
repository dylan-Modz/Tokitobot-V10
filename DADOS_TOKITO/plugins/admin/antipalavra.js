const modulos = require('../../sistemas/modulos')

module.exports = {
  nome: 'antipalavra',
  comandos: ['antipalavra', 'addpalavra', 'delpalavra', 'listapalavra'],
  categoria: 'admin',
  info: {
    descricao: 'Bloqueia palavras/frases cadastradas no grupo.',
    uso: 'antipalavra 1/0 | addpalavra spam',
    permissao: 'ADM'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins)
      return ctx.reply(ctx.mess.soadm())
    if (!ctx.isBotGroupAdmins)
      return ctx.reply(ctx.mess.botadm())
    const f = ctx.dataGp[0].funcoes || (ctx.dataGp[0].funcoes = {})
    if (!Array.isArray(f.palavrasProibidas))
      f.palavrasProibidas = []
    if (ctx.command === 'antipalavra') {
      const acao = String(ctx.q || '').trim()
      const emoji = '🚫'
      const titulo = '𝙰𝙽𝚃𝙸 𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂'
      const descricao = 'ʙʟᴏǫᴜᴇɪᴀ ᴘᴀʟᴀᴠʀᴀs ᴇ ғʀᴀsᴇs ᴄᴀᴅᴀsᴛʀᴀᴅᴀs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.'

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

      f.antipalavra = acao === '1'
      ctx.setGp(ctx.dataGp)

      await ctx.reagir(
        ctx.from,
        f.antipalavra ? '✅' : '❌'
      ).catch(() => {
      })

      return ctx.reply(
        f.antipalavra
          ? ctx.mess.funcaoAtivada(emoji, titulo, descricao)
          : ctx.mess.funcaoDesativada(emoji, titulo, descricao)
      )
    }
    if (ctx.command === 'listapalavra')
      return ctx.reply(f.palavrasProibidas.length ? '🚫 *PALAVRAS BLOQUEADAS*\n\n' + f.palavrasProibidas.map((v, i) => `${i + 1}. ${v}`).join('\n') : 'Nenhuma palavra cadastrada.')
    const raw = String(ctx.q || '').trim()
    const n = modulos.norm(raw)
    if (!n)
      return ctx.reply(`Use *${ctx.prefix}${ctx.command} palavra*.`)
    if (ctx.command === 'addpalavra') {
      if (!f.palavrasProibidas.some(v => modulos.norm(v) === n))
        f.palavrasProibidas.push(raw)
      ctx.setGp(ctx.dataGp)
      return ctx.reply(`✅ *${raw}* adicionada.`)
    }
    f.palavrasProibidas = f.palavrasProibidas.filter(v => modulos.norm(v) !== n)
    ctx.setGp(ctx.dataGp)
    return ctx.reply(`✅ *${raw}* removida.`)
  }
}
