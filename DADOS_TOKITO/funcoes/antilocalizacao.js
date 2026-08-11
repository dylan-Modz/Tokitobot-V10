const base = require('./base.js')
const toggle = require('./toggle.js')
const punir = require('./punir.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'antilocalizacao',
  emoji: '📍',
  titulo: '𝙰𝙽𝚃𝙸-𝙻𝙾𝙲𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾',
  descricao: 'ᴀᴘᴀɢᴀ ʟᴏᴄᴀʟɪᴢᴀᴄ̧ᴏ̃ᴇs ᴇɴᴠɪᴀᴅᴀs ɴᴏ ɢʀᴜᴘᴏ ᴇ ʀᴇᴍᴏᴠᴇ ᴏ ᴍᴇᴍʙʀᴏ.'
})

const verificar = async (ctx) => {
  const { mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, config } = ctx
  const msg = base.desenrolar(mensagem)
  if (!isGroup || !config?.antilocalizacao || isGroupAdmins || !isBotGroupAdmins)
    return false
  if (!msg?.locationMessage && !msg?.liveLocationMessage)
    return false
  return punir(ctx, {
    emoji: '📍',
    titulo: '𝙰𝙽𝚃𝙸-𝙻𝙾𝙲𝙰𝙻𝙸𝚉𝙰𝙲̧𝙰̃𝙾',
    descricao: 'ᴇɴᴠɪᴀʀ ʟᴏᴄᴀʟɪᴢᴀᴄ̧ᴀ̃ᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ'
  })
}

module.exports = {
  configurar,
  verificar
}
