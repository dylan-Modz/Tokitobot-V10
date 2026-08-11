const fs = require('fs')
const path = require('path')

const banco = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/brincadeiras/eununca.json'), 'utf8'))

module.exports = {
  nome: 'eununca',
  comandos: ['eununca'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Eu Nunca com votação.',
    uso: 'eununca',
    requisitos: 'Modo Brincadeiras',
    categoria: 'brincadeiras'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isModobn)
      return ctx.reply(ctx.mess.onlyGroupFun(ctx.prefix))
    const pergunta = banco[Math.floor(Math.random() * banco.length)]
    if (!pergunta)
      return ctx.reply('❌ Banco de perguntas vazio.')
    await ctx.reagir(ctx.from, '🩸').catch(() => {
    })
    return ctx.tokito.sendMessage(ctx.from, {
      poll: {
        name: `*❓ᴘᴇʀɢᴜɴᴛᴀ ⧽*\n\n> ${pergunta}\n\n✅ ᴠᴏᴄᴇ ᴊᴀ ᴏᴜ ɴᴜɴᴄᴀ? ❎`,
        values: ['✰ ᴇᴜ ᴊᴀ 😳 ✰', '✰ ᴇᴜ ɴᴜɴᴄᴀ 👀 ✰'],
        selectableCount: 1
      }
    }, { quoted: ctx.selo })
  }
}
