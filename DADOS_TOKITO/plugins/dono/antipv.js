const modulos = require('../../sistemas/modulos')

const emoji = '🔒'
const titulo = '𝙰𝙽𝚃𝙸-𝙿𝚅'
const descricao = 'ɪɢɴᴏʀᴀ ᴛᴏᴅᴀs ᴀs ᴍᴇɴsᴀɢᴇɴs ᴘʀɪᴠᴀᴅᴀs ᴇɴǫᴜᴀɴᴛᴏ ᴇsᴛɪᴠᴇʀ ᴀᴛɪᴠᴏ.'

module.exports = {
  nome: 'antipv',

  comandos: [
    'antipv'
  ],

  categoria: 'dono',

  info: {
    descricao: 'Ativa ou desativa o bloqueio global de mensagens privadas.',
    uso: 'antipv 1/0',
    permissao: 'Dono'
  },

  async executar(ctx) {
    if (!ctx.SoDono) {
      return ctx.reply(ctx.mess.onlyOwner())
    }

    const valor = String(ctx.q || '').trim()

    if (!['0', '1'].includes(valor)) {
      return ctx.reply(
        ctx.mess.funcaoUso(
          emoji,
          titulo,
          ctx.prefix,
          ctx.command,
          descricao
        )
      )
    }

    const config = modulos.globalCfg()
    config.antipv = valor === '1'
    modulos.salvarGlobal(config)

    return ctx.reply(
      config.antipv
        ? ctx.mess.funcaoAtivada(emoji, titulo, descricao)
        : ctx.mess.funcaoDesativada(emoji, titulo, descricao)
    )
  }
}
