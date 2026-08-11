module.exports = {
  nome: 'menuff',
  comandos: ['menuff', 'menufreefire'],
  categoria: 'menus',
  info: {
    descricao: 'Mostra os comandos de Free Fire, salas e likes.',
    uso: 'menuff',
    categoria: 'menus'
  },
  async executar(ctx) {
    try {
      return await ctx.dylanModz(ctx.linguagem.menuff(ctx.NomeDoBot, ctx.sender, ctx.isCargo, ctx.isChVip, ctx.horaBR, ctx.prefix, ctx.ownerName, ctx.baileysVersion), '🔥', [{
        texto: ctx.mess.botaoMenu(),
        id: `${ctx.prefix}menu`
      }])
    }
    catch (e) {
      console.log('[MENU FF]', e?.message || e)
      return ctx.reply(ctx.mess.error())
    }
  }
}
