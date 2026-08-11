const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'evento-level',
  categoria: 'eventos',
  async evento(ctx) {
    if (!ctx.isGroup || ctx.info?.key?.fromMe || !ctx.body || ctx.mensagem?.reactionMessage || !r.temRpg(ctx))
      return false
    const u = r.user(ctx)
    const antes = u.patente
    r.addXp(ctx, 1)
    if (u.patente !== antes) {
      await ctx.tokito.sendMessage(ctx.from, {
        text: ctx.mess.levelUp(ctx.sender, u),
        contextInfo: ctx.canalInfo([ctx.sender])
      }, { quoted: ctx.selo }).catch(() => {
      })
    }
    return false
  }
}
