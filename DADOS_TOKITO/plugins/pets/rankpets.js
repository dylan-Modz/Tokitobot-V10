const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'rankpets',
  comandos: ['rankpets', 'rankpet'],
  categoria: 'pets',
  info: {
    descricao: 'Ranking de Pets por nível/XP.',
    uso: 'rankpets',
    requisitos: 'RPG + Coins',
    categoria: 'pets'
  },
  async executar(ctx) {
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    r.garantir(ctx)
    const l = Object.entries(ctx.dataGp[0].rpg.usuarios).filter(([, u]) => u.pet).map(([jid, u]) => ({
      jid,
      pet: u.pet
    })).sort((a, b) => (b.pet.xp || 0) - (a.pet.xp || 0)).slice(0, 10)
    return ctx.reply(ctx.mess.petRank(l), l.map(x => x.jid))
  }
}
