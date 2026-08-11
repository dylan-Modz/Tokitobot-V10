module.exports = {
  nome: 'menucoins',
  comandos: ['menucoins', 'menuncoins'],
  categoria: 'menus',
  info: {
    descricao: 'Mostra os comandos de N-Coins e Cidade.',
    uso: 'menucoins',
    categoria: 'menus'
  },
  async executar(ctx) {
    try {
      return await ctx.dylanModz(ctx.linguagem.menucoins(ctx.NomeDoBot, ctx.sender, ctx.isCargo, ctx.isChVip, ctx.horaBR, ctx.prefix, ctx.ownerName, ctx.baileysVersion), '🪙', [{
        texto: ctx.mess.botaoMenu(),
        id: `${ctx.prefix}menu`
      }])
    }
    catch (e) {
      console.log('[MENU COINS]', e?.message || e)
      return ctx.reply(ctx.mess.error())
    }
  }
}
