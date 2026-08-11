const modulos = require('../../sistemas/modulos')

const emoji = '👁️'
const titulo = '𝚅𝙸𝚂𝚄𝙰𝙻𝙸𝚉𝙰𝚁 𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙽𝚂'
const descricao = 'ᴍᴀʀᴄᴀ ᴀs ᴍᴇɴsᴀɢᴇɴs ᴄᴏᴍᴏ ʟɪᴅᴀs ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.'

module.exports = {
  nome: 'visualizarmsg',

  comandos: [
    'visualizarmsg'
  ],

  categoria: 'dono',

  info: {
    descricao: 'Ativa ou desativa a leitura automática das mensagens.',
    uso: 'visualizarmsg 1/0',
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
    config.visualizarmsg = valor === '1'
    modulos.salvarGlobal(config)

    return ctx.reply(
      config.visualizarmsg
        ? ctx.mess.funcaoAtivada(emoji, titulo, descricao)
        : ctx.mess.funcaoDesativada(emoji, titulo, descricao)
    )
  }
}
