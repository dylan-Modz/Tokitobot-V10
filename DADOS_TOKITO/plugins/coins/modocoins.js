module.exports = {
  nome: 'modocoins',
  comandos: ['modocoins'],
  categoria: 'coins',
  info: {
    descricao: 'Ativa ou desativa a economia N-Coins no grupo.',
    uso: 'modocoins 1|0',
    permissao: 'ADM',
    categoria: 'coins'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())
    const a = String(ctx.q || '').trim()
    if (!['0', '1'].includes(a))
      return ctx.reply(ctx.mess.modoCoinsUso(ctx.prefix))
    ctx.dataGp[0].funcoes.modocoins = a === '1'
    ctx.setGp(ctx.dataGp)
    return ctx.reply(ctx.mess.modoAlterado('𝙼𝙾𝙳𝙾 𝙲𝙾𝙸𝙽𝚂', a === '1'))
  }
}
