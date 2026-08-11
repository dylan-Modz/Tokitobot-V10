const aluguel = require('../../sistemas/aluguel')

module.exports = {
  nome: 'pixcodigo',
  comandos: ['pixcodigo'],
  categoria: 'aluguel',
  info: {
    descricao: 'Mostra o código PIX de um pagamento pendente.',
    uso: 'pixcodigo id',
    categoria: 'aluguel'
  },
  async executar(ctx) {
    const id = String(ctx.q || '').trim()
    const item = aluguel.ler(aluguel.arquivos.pendencias, []).find(x => String(x.id) === id && x.comprador === ctx.sender)
    if (!item)
      return ctx.reply(ctx.mess.aluguelSemPedido(ctx.prefix))
    return ctx.reply(item.qr_code || ctx.mess.error())
  }
}
