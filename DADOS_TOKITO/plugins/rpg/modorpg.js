module.exports = {
  nome: 'modorpg',
  comandos: ['modorpg'],
  categoria: 'rpg',
  info: {
    descricao: 'Ativa ou desativa Level/RPG no grupo.',
    uso: 'modorpg 1|0',
    permissao: 'ADM',
    categoria: 'rpg'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())
    const a = String(ctx.q || '').trim()
    if (!['0', '1'].includes(a))
      return ctx.reply(ctx.mess.modoRpgUso(ctx.prefix))
    ctx.dataGp[0].funcoes.modorpg = a === '1'
    ctx.setGp(ctx.dataGp)
    return ctx.reply(ctx.mess.modoAlterado('𝙼𝙾𝙳𝙾 𝚁𝙿𝙶', a === '1'))
  }
}
