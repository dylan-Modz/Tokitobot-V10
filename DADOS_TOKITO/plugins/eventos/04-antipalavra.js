const modulos = require('../../sistemas/modulos')

module.exports = {
  nome: 'evento-antipalavra',
  categoria: 'eventos',
  async evento(ctx) {
    if (!ctx.isGroup || ctx.info?.key?.fromMe || ctx.isGroupAdmins || ctx.SoDono || !ctx.isBotGroupAdmins)
      return false
    const f = ctx.dataGp?.[0]?.funcoes || {}
    if (!f.antipalavra || !Array.isArray(f.palavrasProibidas) || !f.palavrasProibidas.length)
      return false
    const texto = modulos.norm(ctx.body)
    if (!texto)
      return false
    const bate = f.palavrasProibidas.find(p => {
      const n = modulos.norm(p)
      return n && (texto === n || (` ${texto} `).includes(` ${n} `))
    })
    if (!bate)
      return false
    await ctx.tokito.sendMessage(ctx.from, { delete: ctx.info.key }).catch(() => {
    })
    await ctx.tokito.groupParticipantsUpdate(ctx.from, [ctx.sender], 'remove').catch(() => {
    })
    await ctx.tokito.sendMessage(ctx.from, {
      text: `🚫 @${ctx.sender.split('@')[0]} foi removido por usar palavra proibida: *${bate}*`,
      contextInfo: ctx.canalInfo([ctx.sender])
    }, { quoted: ctx.selo }).catch(() => {
    })
    return true
  }
}
