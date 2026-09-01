const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const { compacto, dinheiro } = require('../../sistemas/rpg/texto')

dylan.setCommand({
  nome: 'petshop',
  comandos: [
    'petshop',
    'lojapet',
    'mercadopet',
    'lojararos',
    'lojapetsraros'
  ],
  categoria: 'pets',
  info: {
    descricao: 'Mostra a loja de Pets, pets raros e o mercado de comidas.',
    uso: 'petshop',
    requisitos: 'RPG + Coins',
    categoria: 'pets'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const comando = String(ctx.command || '').toLowerCase()

    if (comando === 'mercadopet') {
      const itens = Object.entries(r.PET_COMIDAS).map(([id, item]) => ({
        emoji: item.emoji,
        texto: `${item.nome} • ${dinheiro(item.preco)} • +${item.fome}% fome • ${ctx.prefix}comprarcomida ${id}`
      }))

      return ctx.reply(compacto(ctx, '🛒', 'Mercado Pet', itens))
    }

    const raros = ['lojararos', 'lojapetsraros'].includes(comando)
    const lista = Object.fromEntries(
      Object.entries(r.PETS).filter(([, item]) => Boolean(item.raro) === raros)
    )

    return ctx.reply(ctx.mess.petShop(lista, ctx.prefix))
  }
})
