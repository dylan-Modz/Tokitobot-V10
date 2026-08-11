const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'coins',
  comandos: ['coins'],
  categoria: 'coins',
  info: {
    descricao: 'Mostra saldo e estatísticas de N-Coins.',
    uso: 'coins',
    requisitos: 'Modo Coins',
    categoria: 'coins'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!r.temCoins(ctx))
      return ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))
    const u = r.eco(ctx)
    r.salvar(ctx)
    let foto = 'https://raw.githubusercontent.com/dylanModz/uploads/main/midias/imagens/799qek6w4.jpg'
    try {
      foto = await ctx.tokito.profilePictureUrl(ctx.sender, 'image')
    }
    catch {
    }
    const minerar = Number(u.chances?.minerar || 0)
    const cassino = Number(u.chances?.cassino || 0)
    const banco = Number(u.cidade?.saldoBanco || 0)
    const url = `${ctx.API_URL}/canvas/coins?apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}&foto=${encodeURIComponent(foto)}&nome=${encodeURIComponent(String(ctx.pushname || ctx.sender.split('@')[0]).slice(0, 35))}&coins=${encodeURIComponent(Number(u.coins || 0))}&banco=${encodeURIComponent(banco)}&minerar=${encodeURIComponent(minerar)}&cassino=${encodeURIComponent(cassino)}`
    const caption = ctx.mess.coinsCard(ctx.sender, u.coins, banco, minerar, cassino, ctx.prefix)
    try {
      return await ctx.tokito.sendMessage(ctx.from, {
        image: { url },
        caption,
        contextInfo: ctx.canalInfo([ctx.sender])
      }, { quoted: ctx.selo })
    }
    catch (error) {
      console.log(
        '[COINS CARD API]',
        ctx.modulos.sanitizarErro(error, [ctx.API_KEY_TOKITO]) || 'Erro sem detalhes'
      )

      return ctx.reply(
        ctx.mess.erroApi(ctx.API_URL)
      )
    }
  }
}
