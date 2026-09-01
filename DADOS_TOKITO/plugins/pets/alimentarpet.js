const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')
const { compacto } = require('../../sistemas/rpg/texto')

dylan.setCommand({
  nome: 'alimentarpet',
  comandos: ['alimentarpet', 'darcomidapet'],
  categoria: 'pets',
  info: {
    descricao: 'Alimenta seu Pet.',
    uso: 'alimentarpet racao',
    requisitos: 'RPG + Coins',
    categoria: 'pets'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))

    const usuario = r.user(ctx)
    const pet = usuario.pet
    const economia = r.eco(ctx)

    if (!pet)
      return ctx.reply(ctx.mess.petNaoTem(ctx.prefix))

    r.normalizarPet(pet)

    if (pet.dormindo) {
      return ctx.reply(compacto(ctx, '😴', 'Pet dormindo', [
          { emoji: '🐾', texto: `${pet.apelido || pet.tipo} precisa acordar antes de comer` },
          { emoji: '📌', texto: `Use ${ctx.prefix}acordarpet` }
      ]))
    }

    const id = String(ctx.args?.[0] || '').toLowerCase()
    const item = r.PET_COMIDAS[id]

    if (id && !item) {
      return ctx.reply(compacto(ctx, '🍖', 'Comida inválida', [
          { emoji: '📌', texto: `Use ${ctx.prefix}mercadopet para ver as comidas` }
      ]))
    }

    let custo = 0
    let comida = item

    if (comida && Number(usuario.inventarioPet?.[id] || 0) > 0) {
      usuario.inventarioPet[id] -= 1
      if (usuario.inventarioPet[id] <= 0)
        delete usuario.inventarioPet[id]
    }
    else if (comida) {
      custo = comida.preco
      if (Number(economia.coins || 0) < custo)
        return ctx.reply(ctx.mess.coinsSemSaldo(custo, economia.coins))

      economia.coins -= custo
    }
    else {
      custo = pet.fome < 30 ? 220 : 150
      if (Number(economia.coins || 0) < custo)
        return ctx.reply(ctx.mess.coinsSemSaldo(custo, economia.coins))

      economia.coins -= custo
      comida = {
        nome: 'Ração básica',
        emoji: '🍖',
        fome: pet.fome < 30 ? 50 : 35,
        energia: 5,
        saude: 3,
        humor: 8
      }
    }

    pet.fome = r.limitar(Number(pet.fome || 0) + Number(comida.fome || 0))
    pet.energia = r.limitar(Number(pet.energia || 0) + Number(comida.energia || 0))
    pet.saude = r.limitar(Number(pet.saude || 0) + Number(comida.saude || 0))
    pet.humor = r.limitar(Number(pet.humor || 0) + Number(comida.humor || 0))
    pet.afeto = Number(pet.afeto || 0) + 2
    pet.xp = Number(pet.xp || 0) + 10
    pet.nivel = 1 + Math.floor(pet.xp / 100)
    pet.ultimaComida = Date.now()
    pet.ultimaAtualizacao = Date.now()

    if (!Array.isArray(pet.diario))
      pet.diario = []

    pet.diario.unshift({
      texto: `Comeu ${comida.nome}`,
      em: Date.now()
    })
    pet.diario = pet.diario.slice(0, 8)

    r.salvar(ctx)
    return ctx.reply(ctx.mess.petAlimentado(
      pet,
      custo,
      custo ? `${comida.nome} comprado e usado` : `${comida.nome} usado do inventário`
    ))
  }
})
