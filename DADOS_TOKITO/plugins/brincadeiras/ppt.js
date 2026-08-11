module.exports = {
  nome: 'ppt',
  comandos: ['ppt'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Joga pedra, papel e tesoura contra o bot.',
    uso: 'ppt pedra|papel|tesoura',
    categoria: 'brincadeiras'
  },
  async executar(ctx) {
    const { q, reply, prefix } = ctx
    const u = String(q || '').trim().toLowerCase()
    if (!['pedra', 'papel', 'tesoura'].includes(u))
      return reply(`- ✊ ${prefix}ppt pedra | papel | tesoura`)
    const op = ['pedra', 'papel', 'tesoura'][Math.floor(Math.random() * 3)]
    const ganha = (u === 'pedra' && op === 'tesoura') || (u === 'papel' && op === 'pedra') || (u === 'tesoura' && op === 'papel')
    const r = u === op ? 'Empate 🤝' : ganha ? 'Você venceu 🎉' : 'O bot venceu 🤖'
    return reply(`- ✊ Você: *${u}*\n- 🤖 Bot: *${op}*\n\n> ${r}`)
  }
}
