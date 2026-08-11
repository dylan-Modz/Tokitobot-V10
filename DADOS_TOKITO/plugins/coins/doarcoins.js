const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'doarcoins',
  comandos: ['doarcoins'],
  categoria: 'coins',
  info: {
    descricao: 'Doa N-Coins para outro usuário.',
    uso: 'doarcoins 100 @usuario'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!r.temCoins(ctx))
      return ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))
    const d = await ctx.destino()
    if (!d)
      return ctx.reply(`Use *${ctx.prefix}doarcoins 100 @usuario*.`)
    const alvo = ctx.normalizar(d.mencao)
    const eu = ctx.normalizar(ctx.sender)
    if (!alvo)
      return ctx.reply('❌ Usuário inválido.')
    if (alvo === eu)
      return ctx.reply('❌ Você não pode doar N-Coins para si mesmo.')
    const nums = String(ctx.q || '').replace(/@\d+/g, ' ').match(/\d+/g) || []
    const valor = Number(nums[0] || 0)
    if (!Number.isFinite(valor) || valor <= 0)
      return ctx.reply(`Use *${ctx.prefix}doarcoins 100 @usuario*.`)
    r.garantir(ctx)
    const origem = r.eco(ctx, eu)
    const destino = r.eco(ctx, alvo)
    if (Number(origem.coins || 0) < valor)
      return ctx.reply(`❌ Você não tem coins suficientes para doar. Seu saldo: *${origem.coins || 0} N-Coins*.`)
    origem.coins = Number(origem.coins || 0) - valor
    destino.coins = Number(destino.coins || 0) + valor
    r.salvar(ctx)
    return ctx.reply(`🪙 *DOAÇÃO REALIZADA*\n\n@${eu.split('@')[0]} doou *${valor} N-Coins* para @${alvo.split('@')[0]}.\n💰 Seu saldo: *${origem.coins} N-Coins*`, [eu, alvo])
  }
}
