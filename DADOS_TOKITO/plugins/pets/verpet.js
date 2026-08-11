const r = require('../../sistemas/rpg')

module.exports = {
  nome: 'verpet',
  comandos: ['verpet', 'pet', 'meupet'],
  categoria: 'pets',
  info: {
    descricao: 'Mostra o perfil do seu Pet.',
    uso: 'verpet',
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
    const horas = Math.floor((Date.now() - Number(p.ultimaComida || Date.now())) / 3600000)
    p.fome = Math.max(0, Number(p.fome ?? 100) - Math.floor(horas / 3) * 5)
    r.salvar(ctx)
    const texto = ctx.mess.petPerfil(ctx.sender, p)
    const img = r.imagemPet(p.tipo)
    if (img)
      try {
        return await ctx.tokito.sendMessage(ctx.from, {
          image: { url: img },
          caption: texto,
          contextInfo: ctx.canalInfo([ctx.sender])
        }, { quoted: ctx.selo })
      }
      catch {
      }
    return ctx.reply(texto, [ctx.sender])
  }
}
