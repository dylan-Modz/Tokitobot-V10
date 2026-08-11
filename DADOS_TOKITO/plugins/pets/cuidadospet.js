const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'carinhopet',
  comandos: ['carinhopet', 'banhopet', 'passearpet', 'dormirpet', 'acordarpet'],
  categoria: 'pets',
  info: {
    descricao: 'Cuida do seu Pet: carinho, banho, passeio e descanso.',
    uso: 'carinhopet',
    requisitos: 'RPG + Coins',
    categoria: 'pets'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!r.ambos(ctx))
      return ctx.reply(ctx.mess.rpgCoinsDesativado(ctx.prefix))
    const p = r.user(ctx).pet
    if (!p)
      return ctx.reply(ctx.mess.petNaoTem(ctx.prefix))
    let acao = ctx.command
    let txt = ''
    if (acao === 'carinhopet') {
      p.afeto = Number(p.afeto || 0) + 5
      txt = 'recebeu carinho e ganhou +5 de afeto 💖'
    }
    if (acao === 'banhopet') {
      p.ultimoBanho = Date.now()
      p.afeto = Number(p.afeto || 0) + 3
      txt = 'tomou banho e ficou limpinho 🛁'
    }
    if (acao === 'passearpet') {
      p.ultimoPasseio = Date.now()
      p.afeto = Number(p.afeto || 0) + 4
      p.xp = Number(p.xp || 0) + 15
      txt = 'passeou e ganhou +15 XP 🐾'
    }
    if (acao === 'dormirpet') {
      p.dormindo = true
      txt = 'foi dormir 😴'
    }
    if (acao === 'acordarpet') {
      p.dormindo = false
      txt = 'acordou ☀️'
    }
    p.nivel = 1 + Math.floor(Number(p.xp || 0) / 100)
    r.salvar(ctx)
    return ctx.reply(ctx.mess.petCuidado(p, txt))
  }
}
