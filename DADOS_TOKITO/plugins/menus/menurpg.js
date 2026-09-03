const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'menurpg',
  comandos: ['menurpg'],
  categoria: 'menus',
  info: {
    descricao: 'Mostra os comandos de jornada, Level, Pets e Pokémon.',
    uso: 'menurpg',
    categoria: 'menus'
  },

  async executar(ctx) {
    try {
      const menu = ctx.linguagem.menurpg(
        ctx.NomeDoBot,
        ctx.sender,
        ctx.isCargo,
        ctx.isChVip,
        ctx.horaBR,
        ctx.prefix,
        ctx.ownerName,
        ctx.baileysVersion
      )

      return await ctx.dylanModz(
        menu,
        '🧭',
        [
          {
            texto: ctx.mess.botaoMenu(),
            id: `${ctx.prefix}menu`
          }
        ]
      )
    }
    catch (error) {
      console.log('[MENU RPG]', error?.message || error)
      return ctx.reply(ctx.mess.error())
    }
  }
})
