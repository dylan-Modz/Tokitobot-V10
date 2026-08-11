const base = require('./base.js')
const toggle = require('./toggle.js')
const punir = require('./punir.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'antistatus',
  emoji: '📢',
  titulo: '𝙰𝙽𝚃𝙸-𝚂𝚃𝙰𝚃𝚄𝚂',
  descricao: 'ʀᴇᴍᴏᴠᴇ ǫᴜᴇᴍ ᴍᴇɴᴄɪᴏɴᴀʀ ᴏ ɢʀᴜᴘᴏ ᴇᴍ ᴜᴍ sᴛᴀᴛᴜs.'
})

const verificar = async (ctx) => {
  const { mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, config } = ctx
  const msg = base.desenrolar(mensagem)
  if (!isGroup || !config?.antistatus || isGroupAdmins || !isBotGroupAdmins)
    return false
  if (!msg?.groupStatusMentionMessage)
    return false
  return punir(ctx, {
    emoji: '📢',
    titulo: '𝙰𝙽𝚃𝙸-𝚂𝚃𝙰𝚃𝚄𝚂',
    descricao: 'ᴍᴇɴᴄɪᴏɴᴀʀ ᴏ ɢʀᴜᴘᴏ ɴᴏs sᴛᴀᴛᴜs'
  })
}

module.exports = {
  configurar,
  verificar
}
