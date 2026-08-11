const fs = require('fs')
const path = require('path')

const banco = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/brincadeiras/vord.json'), 'utf8'))

module.exports = {
  nome: 'vord',
  comandos: ['vord'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Verdade ou Desafio com o banco original do Tokito V8.',
    uso: 'vord verdade | vord desafio',
    requisitos: 'Modo Brincadeiras'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isModobn)
      return ctx.reply(ctx.mess.onlyGroupFun(ctx.prefix))
    const escolha = String(ctx.q || '').trim().toLowerCase()
    if (!['verdade', 'desafio'].includes(escolha))
      return ctx.reply('• Escolha *verdade* ou *desafio*')
    const lista = escolha === 'verdade' ? banco.verdades : banco.desafios
    const item = lista[Math.floor(Math.random() * lista.length)]
    await ctx.reagir(ctx.from, escolha === 'verdade' ? '🤔' : '🔥').catch(() => {
    })
    return ctx.reply(escolha === 'verdade' ? `*⸺͟͞ꪶ𝐄 𝐕𝐄𝐑𝐃𝐀𝐃𝐄 𝐐𝐔𝐄↴*\n\n${item}` : `*⸺͟͞ꪶ𝐃𝐄𝐒𝐀𝐅𝐈𝐎 𝐕𝐎𝐂𝐄↴*\n\n${item}`)
  }
}
