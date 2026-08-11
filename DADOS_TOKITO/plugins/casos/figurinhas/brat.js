module.exports = {
  nome: 'brat',
  comandos: ['brat', 'bratvid'],
  categoria: 'figurinhas',
  info: {
    descricao: 'Cria figurinha Brat em imagem ou vídeo.',
    uso: 'brat texto'
  },
  async executar(ctx) {
    const texto = String(ctx.q || '').trim()
    if (!texto)
      return ctx.reply(`Use *${ctx.prefix}${ctx.command} seu texto*.`)
    try {
      if (ctx.command === 'brat') {
        const url = `${ctx.API_URL}/api/stickers/brat-img?text=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`
        const a = await ctx.sendImageAsSticker2(ctx.tokito, ctx.from, url, ctx.selo, {
          packname: `🧊 ${ctx.NomeDoBot}`,
          author: ctx.pushname
        })
        return ctx.DLT_FL(a)
      }
      const url = `${ctx.API_URL}/api/stickers/brat-vid?text=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`
      const a = await ctx.sendVideoAsSticker2(ctx.tokito, ctx.from, url, ctx.selo, {
        packname: `🧊 ${ctx.NomeDoBot}`,
        author: ctx.pushname
      })
      return ctx.DLT_FL(a)
    }
    catch (e) {
      console.log('[BRAT]', ctx.modulos.sanitizarErro(e, [ctx.API_KEY_TOKITO]))
      return ctx.reply(ctx.mess.erroApi(ctx.API_URL))
    }
  }
}
