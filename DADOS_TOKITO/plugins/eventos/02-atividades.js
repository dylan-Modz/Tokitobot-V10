module.exports = {
  nome: 'evento-atividades',
  categoria: 'eventos',
  fase: 'pre',

  async evento(ctx) {
    if (!ctx.isGroup || ctx.info?.key?.fromMe || !ctx.sender)
      return false

    if (
      !ctx.dataGp?.[0]?.atividades ||
      typeof ctx.dataGp[0].atividades !== 'object' ||
      Array.isArray(ctx.dataGp[0].atividades)
    ) {
      ctx.dataGp[0].atividades = {}
    }

    const id = ctx.normalizar(ctx.sender)

    if (!id)
      return false

    const d = ctx.dataGp[0].atividades[id] || (ctx.dataGp[0].atividades[id] = {
      total: 0,
      comandos: 0,
      figus: 0,
      imagens: 0,
      videos: 0,
      audios: 0,
      documentos: 0,
      ultima: 0
    })

    const mensagem =
      ctx.mensagem?.documentWithCaptionMessage?.message ||
      ctx.mensagem ||
      {}

    d.total = Number(d.total || 0) + 1

    if (ctx.isCmd)
      d.comandos = Number(d.comandos || 0) + 1

    if (mensagem.stickerMessage)
      d.figus = Number(d.figus || 0) + 1

    if (mensagem.imageMessage)
      d.imagens = Number(d.imagens || 0) + 1

    if (mensagem.videoMessage)
      d.videos = Number(d.videos || 0) + 1

    if (mensagem.audioMessage)
      d.audios = Number(d.audios || 0) + 1

    if (mensagem.documentMessage)
      d.documentos = Number(d.documentos || 0) + 1

    d.ultima = Date.now()

    ctx.setGp(ctx.dataGp)

    return false
  }
}
