const base = require('./base.js')
const toggle = require('./toggle.js')
const mess = require('../database/lib/global.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'antifoto',
  emoji: '🖼️',
  titulo: '𝙰𝙽𝚃𝙸-𝙵𝙾𝚃𝙾',
  descricao: 'ᴀᴘᴀɢᴀ ɪᴍᴀɢᴇɴs ᴇɴᴠɪᴀᴅᴀs ᴘᴏʀ ᴍᴇᴍʙʀᴏs ɴᴏ ɢʀᴜᴘᴏ.'
})

const verificar = async (ctx) => {
  const { tokito, info, from, sender, mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, config, newsletter, selo } = ctx
  if (!isGroup || !config?.antifoto || isGroupAdmins || !base.desenrolar(mensagem)?.imageMessage)
    return false
  if (!isBotGroupAdmins)
    return false
  await base.apagar(tokito, info)
  await tokito.sendMessage(from, {
    text: mess.antiBloqueio('🖼️', '𝙰𝙽𝚃𝙸-𝙵𝙾𝚃𝙾', base.numero(sender), 'ᴀ ɪᴍᴀɢᴇᴍ ғᴏɪ ᴅᴇᴛᴇᴄᴛᴀᴅᴀ ᴇ ᴀᴘᴀɢᴀᴅᴀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.'),
    contextInfo: {
      ...newsletter,
      mentionedJid: [sender]
    }
  }, { quoted: selo }).catch(() => {
  })
  return true
}

module.exports = {
  configurar,
  verificar
}
