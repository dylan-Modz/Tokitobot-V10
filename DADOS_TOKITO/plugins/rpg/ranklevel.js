const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'ranklevel',
  comandos: ['ranklevel', 'rankpatente', 'rankinglevel'],
  categoria: 'rpg',
  info: {
    descricao: 'Ranking de XP/Level do grupo.',
    uso: 'ranklevel',
    requisitos: 'Modo RPG',
    categoria: 'rpg'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!r.temRpg(ctx))
      return ctx.reply(ctx.mess.rpgDesativado(ctx.prefix))
    const l = r.rank(ctx, 'xp').slice(0, 10)
    return ctx.reply(ctx.mess.levelRank(l), l.map(x => x.jid))
  }
}
