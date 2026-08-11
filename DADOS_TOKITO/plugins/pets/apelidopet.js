const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'apelidopet',
  comandos: ['apelidopet', 'nomepet'],
  categoria: 'pets',
  info: {
    descricao: 'Altera o apelido do seu Pet.',
    uso: 'apelidopet nome',
    requisitos: 'RPG + Coins',
    categoria: 'pets'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const p = r.user(ctx).pet
    if (!p)
      return ctx.reply(ctx.mess.petNaoTem(ctx.prefix))
    const nome = String(ctx.q || '').trim().slice(0, 30)
    if (!nome)
      return ctx.reply(ctx.mess.petApelidoUso(ctx.prefix))
    p.apelido = nome
    r.salvar(ctx)
    return ctx.reply(ctx.mess.petApelido(nome))
  }
}
