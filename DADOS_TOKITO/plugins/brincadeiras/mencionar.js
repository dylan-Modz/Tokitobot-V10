module.exports = {
  nome: 'mencionar',
  comandos: ['mencionar'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Escolhe aleatoriamente alguém do grupo para a zoeira informada.',
    uso: 'mencionar corno',
    requisitos: 'Modo Brincadeiras'
  },
  async executar(ctx) {
    const q = String(ctx.q || '').trim()
    if (!q)
      return ctx.reply(`Você usou o comando de forma incorreta, use: *${ctx.prefix}mencionar corno*`)
    if (!ctx.isGroup)
      return ctx.reply('Esta brincadeira só funciona em grupos.')
    if (!ctx.isModobn)
      return ctx.reply(ctx.mess.onlyGroupFun(ctx.prefix))
    const membros = [...new Set((ctx.groupMembers || []).map(v => ctx.nJid(v)).filter(Boolean))]
    if (!membros.length)
      return ctx.reply('❌ Não encontrei membros no grupo.')
    const alvo = membros[Math.floor(Math.random() * membros.length)]
    return ctx.reply(`Estou mencionando o *${q}* do grupo: *@${alvo.split('@')[0]}*`, [alvo])
  }
}
