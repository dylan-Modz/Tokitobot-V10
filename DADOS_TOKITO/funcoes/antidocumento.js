const base = require('./base.js')
const toggle = require('./toggle.js')
const punir = require('./punir.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'antidocumento',
  emoji: '📄',
  titulo: '𝙰𝙽𝚃𝙸-𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃𝙾',
  descricao: 'ᴀᴘᴀɢᴀ ᴅᴏᴄᴜᴍᴇɴᴛᴏs ᴇɴᴠɪᴀᴅᴏs ɴᴏ ɢʀᴜᴘᴏ ᴇ ʀᴇᴍᴏᴠᴇ ᴏ ᴍᴇᴍʙʀᴏ.'
})

const verificar = async (ctx) => {
  const { mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, config } = ctx
  const msg = base.desenrolar(mensagem)
  if (!isGroup || !config?.antidocumento || isGroupAdmins || !isBotGroupAdmins)
    return false
  if (!msg?.documentMessage)
    return false
  return punir(ctx, {
    emoji: '📄',
    titulo: '𝙰𝙽𝚃𝙸-𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃𝙾',
    descricao: 'ᴇɴᴠɪᴀʀ ᴅᴏᴄᴜᴍᴇɴᴛᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ'
  })
}

module.exports = {
  configurar,
  verificar
}
