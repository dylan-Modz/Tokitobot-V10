const base = require('./base.js')
const toggle = require('./toggle.js')
const punir = require('./punir.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'anticontato',
  emoji: '📇',
  titulo: '𝙰𝙽𝚃𝙸-𝙲𝙾𝙽𝚃𝙰𝚃𝙾',
  descricao: 'ᴀᴘᴀɢᴀ ᴄᴏɴᴛᴀᴛᴏs ᴇɴᴠɪᴀᴅᴏs ɴᴏ ɢʀᴜᴘᴏ ᴇ ʀᴇᴍᴏᴠᴇ ᴏ ᴍᴇᴍʙʀᴏ.'
})

const verificar = async (ctx) => {
  const { mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, config } = ctx
  const msg = base.desenrolar(mensagem)
  if (!isGroup || !config?.anticontato || isGroupAdmins || !isBotGroupAdmins)
    return false
  if (!msg?.contactMessage && !msg?.contactsArrayMessage)
    return false
  return punir(ctx, {
    emoji: '📇',
    titulo: '𝙰𝙽𝚃𝙸-𝙲𝙾𝙽𝚃𝙰𝚃𝙾',
    descricao: 'ᴇɴᴠɪᴀʀ ᴄᴏɴᴛᴀᴛᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ'
  })
}

module.exports = {
  configurar,
  verificar
}
