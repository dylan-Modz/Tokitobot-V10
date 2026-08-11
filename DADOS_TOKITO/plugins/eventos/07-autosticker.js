const modulos = require('../../sistemas/modulos')

module.exports = {
  nome: 'evento-autosticker',
  categoria: 'eventos',
  async evento(ctx) {
    if (!ctx.isGroup || ctx.info?.key?.fromMe || ctx.isCmd || !ctx.dataGp?.[0]?.funcoes?.autosticker)
      return false
    const m = {
      image: ctx.mensagem?.imageMessage || null,
      video: ctx.mensagem?.videoMessage || null
    }
    const db = modulos.takes()
    const meta = db[ctx.normalizar(ctx.sender)] || {
      packname: `🧊 ${ctx.NomeDoBot}`,
      author: ctx.pushname || 'Dylan Modz'
    }
    try {
      if (m.image) {
        const b = await ctx.getFileBuffer(m.image, 'image')
        const a = await ctx.sendImageAsSticker2(ctx.tokito, ctx.from, b, ctx.selo, meta)
        ctx.DLT_FL(a)
        return true
      }
      if (m.video && Number(m.video.seconds || 0) < 11) {
        const b = await ctx.getFileBuffer(m.video, 'video')
        const a = await ctx.sendVideoAsSticker2(ctx.tokito, ctx.from, b, ctx.selo, meta)
        ctx.DLT_FL(a)
        return true
      }
    }
    catch (e) {
      console.log('[AUTOSTICKER]', e?.message || e)
    }
    return false
  }
}
