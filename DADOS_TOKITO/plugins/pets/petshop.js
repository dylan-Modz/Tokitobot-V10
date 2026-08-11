const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'petshop',
  comandos: ['petshop', 'lojapet', 'mercadopet'],
  categoria: 'pets',
  info: {
    descricao: 'Mostra a loja de Pets.',
    uso: 'petshop',
    requisitos: 'RPG + Coins',
    categoria: 'pets'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    return ctx.reply(ctx.mess.petShop(r.PETS, ctx.prefix))
  }
}
