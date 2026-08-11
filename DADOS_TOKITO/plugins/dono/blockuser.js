const modulos = require('../../sistemas/modulos')

module.exports = {
  nome: 'blockuser',
  comandos: ['blockuser', 'unblockuser'],
  categoria: 'dono',
  info: {
    descricao: 'Bloqueia ou desbloqueia um usuário globalmente no bot.',
    uso: 'blockuser @usuario',
    permissao: 'Dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    const destino = await ctx.destino()
    if (!destino)
      return ctx.reply(ctx.mess.marque())
    const alvo = ctx.normalizar(destino.mencao)
    const bot = ctx.normalizar(ctx.botNumber)
    if (alvo === bot || ctx.numerodono.includes(alvo)) {
      return ctx.reply('❌ Não é possível bloquear o bot ou um dono.')
    }
    const config = modulos.globalCfg()
    if (ctx.command === 'blockuser') {
      if (!config.bloqueados.includes(alvo))
        config.bloqueados.push(alvo)
      modulos.salvarGlobal(config)
      return ctx.reply(`🚫 @${destino.numero} bloqueado de usar o bot.`, [alvo])
    }
    config.bloqueados = config.bloqueados.filter(item => ctx.normalizar(item) !== alvo)
    modulos.salvarGlobal(config)
    return ctx.reply(`✅ @${destino.numero} desbloqueado.`, [alvo])
  }
}
