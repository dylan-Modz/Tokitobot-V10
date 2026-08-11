module.exports = {
  nome: 'totalcmd',
  comandos: ['totalcmd', 'totalcomandos'],
  categoria: 'info',
  info: {
    descricao: 'Mostra a quantidade de módulos e aliases carregados pelo bot.',
    uso: 'totalcmd',
    categoria: 'info'
  },
  async executar(ctx) {
    const dados = ctx.plugins.contar()
    return ctx.reply(ctx.mess.totalcmd({
      ...dados,
      NomeDoBot: ctx.NomeDoBot,
      prefix: ctx.prefix
    }))
  }
}
