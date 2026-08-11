const base = require('./base.js')
const toggle = require('./toggle.js')
const mess = require('../database/lib/global.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'antivideo',
  emoji: '🎥',
  titulo: '𝙰𝙽𝚃𝙸-𝚅𝙸́𝙳𝙴𝙾',
  descricao: 'ᴀᴘᴀɢᴀ ᴠɪ́ᴅᴇᴏs ᴇɴᴠɪᴀᴅᴏs ᴘᴏʀ ᴍᴇᴍʙʀᴏs ɴᴏ ɢʀᴜᴘᴏ.'
})

const verificar = async (ctx) => {
  const { tokito, info, from, sender, mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, config, newsletter, selo } = ctx
  if (!isGroup || !config?.antivideo || isGroupAdmins || !base.desenrolar(mensagem)?.videoMessage)
    return false
  if (!isBotGroupAdmins)
    return false
  await base.apagar(tokito, info)
  await tokito.sendMessage(from, {
    text: mess.antiBloqueio('🎥', '𝙰𝙽𝚃𝙸-𝚅𝙸́𝙳𝙴𝙾', base.numero(sender), 'ᴏ ᴠɪ́ᴅᴇᴏ ғᴏɪ ᴅᴇᴛᴇᴄᴛᴀᴅᴏ ᴇ ᴀᴘᴀɢᴀᴅᴏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.'),
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
