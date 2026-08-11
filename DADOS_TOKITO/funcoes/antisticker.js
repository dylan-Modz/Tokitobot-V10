const base = require('./base.js')
const toggle = require('./toggle.js')
const mess = require('../database/lib/global.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'antisticker',
  emoji: '🧩',
  titulo: '𝙰𝙽𝚃𝙸-𝚂𝚃𝙸𝙲𝙺𝙴𝚁',
  descricao: 'ᴀᴘᴀɢᴀ ғɪɢᴜʀɪɴʜᴀs ᴇɴᴠɪᴀᴅᴀs ᴘᴏʀ ᴍᴇᴍʙʀᴏs ɴᴏ ɢʀᴜᴘᴏ.'
})

const verificar = async (ctx) => {
  const { tokito, info, from, sender, mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, dono, config, newsletter, selo } = ctx
  const msg = base.desenrolar(mensagem)
  if (!isGroup || !config?.antisticker || isGroupAdmins || dono || info?.key?.fromMe || !msg?.stickerMessage)
    return false
  if (!isBotGroupAdmins)
    return false
  const autor = info?.key?.participantAlt || sender || info?.key?.participant
  if (!await base.apagar(tokito, info))
    return false
  const aviso = {
    text: mess.antiBloqueio('🧩', '𝙰𝙽𝚃𝙸-𝚂𝚃𝙸𝙲𝙺𝙴𝚁', base.numero(autor), 'ᴀ ғɪɢᴜʀɪɴʜᴀ ғᴏɪ ᴅᴇᴛᴇᴄᴛᴀᴅᴀ ᴇ ᴀᴘᴀɢᴀᴅᴀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.'),
    contextInfo: {
      ...newsletter,
      mentionedJid: autor ? [autor] : []
    }
  }
  if (selo?.message)
    await tokito.sendMessage(from, aviso, { quoted: selo }).catch(() => {
    })
  else
    await tokito.sendMessage(from, aviso).catch(() => {
    })
  return true
}

module.exports = {
  configurar,
  verificar
}
