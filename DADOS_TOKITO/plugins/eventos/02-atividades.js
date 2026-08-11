module.exports = {
  nome: 'evento-atividades',
  categoria: 'eventos',
  fase: 'pre',
  async evento(ctx) {
    if (!ctx.isGroup || ctx.info?.key?.fromMe || !ctx.sender)
      return false
    if (!ctx.dataGp[0].atividades || typeof ctx.dataGp[0].atividades !== 'object')
      ctx.dataGp[0].atividades = {}
    const id = ctx.normalizar(ctx.sender)
    const d = ctx.dataGp[0].atividades[id] || (ctx.dataGp[0].atividades[id] = {
      total: 0,
      comandos: 0,
      figus: 0,
      ultima: 0
    })
    d.total = Number(d.total || 0) + 1
    if (ctx.isCmd)
      d.comandos = Number(d.comandos || 0) + 1
    if (ctx.mensagem?.stickerMessage)
      d.figus = Number(d.figus || 0) + 1
    d.ultima = Date.now()
    ctx.setGp(ctx.dataGp)
    return false
  }
}
