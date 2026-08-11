const r = require('../../sistemas/rpg')

const dataBR = () => {
  const p = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Fortaleza',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date())
  const d = {}
  for (const x of p)
    if (x.type !== 'literal')
      d[x.type] = x.value
  return `${d.year}-${d.month}-${d.day}`
}

module.exports = {
  nome: 'evento-coins-diario',
  categoria: 'eventos',
  async evento(ctx) {
    if (!ctx.isGroup || ctx.info?.key?.fromMe || ctx.mensagem?.reactionMessage || !r.temCoins(ctx))
      return false
    const u = r.eco(ctx)
    const hoje = dataBR()
    if (String(u.ultimoBonusDia || '') === hoje)
      return false
    u.ultimoBonusDia = hoje
    u.coins = Number(u.coins || 0) + 50
    if (!u.chances || typeof u.chances !== 'object')
      u.chances = {}
    u.chances.minerar = 0
    u.chances.cassino = 0
    r.salvar(ctx)
    let foto = 'https://raw.githubusercontent.com/dylanModz/uploads/main/midias/imagens/799qek6w4.jpg'
    try {
      foto = await ctx.tokito.profilePictureUrl(ctx.sender, 'image')
    }
    catch {
    }
    const banco = Number(u.cidade?.saldoBanco || 0)
    const url = `${ctx.API_URL}/canvas/coins?apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}&foto=${encodeURIComponent(foto)}&nome=${encodeURIComponent(String(ctx.pushname || ctx.sender.split('@')[0]).slice(0, 35))}&coins=${encodeURIComponent(u.coins)}&banco=${encodeURIComponent(banco)}&minerar=0&cassino=0`
    const caption = ctx.mess.coinsBonusDiario(ctx.sender, u.coins, ctx.prefix)
    try {
      await ctx.tokito.sendMessage(ctx.from, {
        image: { url },
        caption,
        contextInfo: ctx.canalInfo([ctx.sender])
      }, { quoted: ctx.selo })
    }
    catch {
      await ctx.reply(caption, [ctx.sender])
    }
    return false
  }
}
