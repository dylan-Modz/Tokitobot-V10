const fs = require('fs')
const path = require('path')

const banco = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/brincadeiras/vab.json'), 'utf8'))

module.exports = {
  nome: 'vab',
  comandos: ['vab'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Você Prefere com votação.',
    uso: 'vab',
    requisitos: 'Modo Brincadeiras',
    categoria: 'brincadeiras'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isModobn)
      return ctx.reply(ctx.mess.onlyGroupFun(ctx.prefix))
    const grupos = banco.filter(x => Array.isArray(x.questions) && x.questions.length)
    if (!grupos.length)
      return ctx.reply('❌ Banco de perguntas vazio.')
    const g = grupos[Math.floor(Math.random() * grupos.length)]
    const s = g.questions[Math.floor(Math.random() * g.questions.length)]
    await ctx.reagir(ctx.from, '🎭').catch(() => {
    })
    return ctx.tokito.sendMessage(ctx.from, {
      poll: {
        name: `*🤔 ᴠᴏᴄᴇ ᴘʀᴇғᴇʀᴇ ⧽*\n•\n> 1️⃣ - ${s.pergunta1}\n-\n> 2️⃣ - ${s.pergunta2}\n•\n⚡ ᴇsᴄᴏʟʜᴀ ʙᴇᴍ...`,
        values: ['✰ ᴏᴘᴄᴀᴏ 1 ✰', '✰ ᴏᴘᴄᴀᴏ 2 ✰'],
        selectableCount: 1
      }
    }, { quoted: ctx.selo })
  }
}
