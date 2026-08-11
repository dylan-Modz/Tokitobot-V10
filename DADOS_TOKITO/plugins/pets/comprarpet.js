const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'comprarpet',
  comandos: ['comprarpet', 'adotarpet'],
  categoria: 'pets',
  info: {
    descricao: 'Compra/adota um Pet.',
    uso: 'comprarpet gato',
    requisitos: 'RPG + Coins',
    categoria: 'pets'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const tipo = String(ctx.args?.[0] || '').toLowerCase()
    const p = r.PETS[tipo]
    if (!p)
      return ctx.reply(ctx.mess.petShop(r.PETS, ctx.prefix))
    const ru = r.user(ctx)
    const eu = r.eco(ctx)
    if (ru.pet)
      return ctx.reply(ctx.mess.petJaTem())
    if (eu.coins < p.preco)
      return ctx.reply(ctx.mess.coinsSemSaldo(p.preco, eu.coins))
    eu.coins -= p.preco
    ru.pet = {
      tipo,
      apelido: null,
      fome: 100,
      xp: 0,
      nivel: 1,
      afeto: 0,
      criadoEm: Date.now(),
      ultimaComida: Date.now(),
      ultimoBanho: 0,
      ultimoPasseio: 0
    }
    r.salvar(ctx)
    return ctx.reply(ctx.mess.petComprado(tipo, p.preco, eu.coins))
  }
}
