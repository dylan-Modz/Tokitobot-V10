module.exports = {
  nome: 'menualt',
  comandos: ['menualt'],
  categoria: 'menus',
  info: {
    descricao: 'Mostra os alteradores de áudio e vídeo.',
    uso: 'menualt'
  },
  async executar(ctx) {
    try {
      return await ctx.dylanModz(ctx.linguagem.menualt(ctx.NomeDoBot, ctx.sender, ctx.isCargo, ctx.isChVip, ctx.horaBR, ctx.prefix, ctx.ownerName, ctx.baileysVersion), '🎚️', [{
        texto: ctx.mess.botaoMenu(),
        id: `${ctx.prefix}menu`
      }])
    }
    catch (e) {
      console.log('[MENU ALT]', e?.message || e)
      return ctx.reply(ctx.mess.error())
    }
  }
}
