const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'venderpet',
  comandos: ['venderpet'],
  categoria: 'pets',
  info: {
    descricao: 'Vende o Pet atual por 50% do valor.',
    uso: 'venderpet',
    requisitos: 'RPG + Coins',
    categoria: 'pets'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const u = r.user(ctx)
    const p = u.pet
    if (!p)
      return ctx.reply(ctx.mess.petNaoTem(ctx.prefix))
    const valor = Math.floor((r.PETS[p.tipo]?.preco || 1000) / 2)
    const e = r.eco(ctx)
    e.coins += valor
    u.pet = null
    r.salvar(ctx)
    return ctx.reply(ctx.mess.petVendido(valor, e.coins))
  }
}
