module.exports = {
  nome: 'menurpg',
  comandos: ['menurpg'],
  categoria: 'menus',
  info: {
    descricao: 'Mostra os comandos de RPG, Level, Pet e Pokémon.',
    uso: 'menurpg',
    categoria: 'menus'
  },
  async executar(ctx) {
    try {
      return await ctx.dylanModz(ctx.linguagem.menurpg(ctx.NomeDoBot, ctx.sender, ctx.isCargo, ctx.isChVip, ctx.horaBR, ctx.prefix, ctx.ownerName, ctx.baileysVersion), '🎮', [{
        texto: ctx.mess.botaoMenu(),
        id: `${ctx.prefix}menu`
      }])
    }
    catch (e) {
      console.log('[MENU RPG]', e?.message || e)
      return ctx.reply(ctx.mess.error())
    }
  }
}
