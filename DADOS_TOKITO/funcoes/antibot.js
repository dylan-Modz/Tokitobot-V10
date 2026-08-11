const base = require('./base.js')
const toggle = require('./toggle.js')
const mess = require('../database/lib/global.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'antibot',
  emoji: '🤖',
  titulo: '𝙰𝙽𝚃𝙸-𝙱𝙾𝚃',
  descricao: 'ᴅᴇᴛᴇᴄᴛᴀ ᴍᴇɴsᴀɢᴇɴs ᴄᴏᴍ ɪᴅᴇɴᴛɪғɪᴄᴀᴅᴏʀ ᴄᴏᴍᴜᴍ ᴅᴇ ʙᴏᴛ, ᴀᴘᴀɢᴀ ᴀ ᴍᴇɴsᴀɢᴇᴍ ᴇ ʀᴇᴍᴏᴠᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ.'
})

const detectar = info => {
  const id = String(info?.key?.id || '').toUpperCase()
  const participante = String(info?.key?.participantAlt ||
    info?.participantAlt ||
    info?.key?.participant ||
    info?.participant ||
    '').toLowerCase()
  const nome = String(info?.pushName || '').toLowerCase()
  return info?.key?.fromMe === false && (id.startsWith('BAE5') ||
    id.startsWith('3EB0') ||
    participante.includes('bot') ||
    /(^|[^a-z0-9])bot([^a-z0-9]|$)/i.test(nome))
}

const verificar = async (ctx) => {
  const { tokito, info, from, sender, isGroup, isGroupAdmins, isBotGroupAdmins, config, newsletter, selo } = ctx
  if (!isGroup || !config?.antibot || isGroupAdmins || !detectar(info))
    return false
  if (!isBotGroupAdmins)
    return false
  await base.apagar(tokito, info)
  let removido = false
  try {
    await tokito.groupParticipantsUpdate(from, [sender], 'remove')
    removido = true
  }
  catch (error) {
    console.log('[ANTIBOT]', error?.message || error)
  }
  await tokito.sendMessage(from, {
    text: mess.antiBloqueio('🤖', '𝙰𝙽𝚃𝙸-𝙱𝙾𝚃', base.numero(sender), removido
      ? 'ᴜᴍ ᴘᴏssɪ́ᴠᴇʟ ʙᴏᴛ ғᴏɪ ᴅᴇᴛᴇᴄᴛᴀᴅᴏ, ᴀ ᴍᴇɴsᴀɢᴇᴍ ғᴏɪ ᴀᴘᴀɢᴀᴅᴀ ᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ.'
      : 'ᴜᴍ ᴘᴏssɪ́ᴠᴇʟ ʙᴏᴛ ғᴏɪ ᴅᴇᴛᴇᴄᴛᴀᴅᴏ ᴇ ᴀ ᴍᴇɴsᴀɢᴇᴍ ғᴏɪ ᴀᴘᴀɢᴀᴅᴀ, ᴍᴀs ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ʀᴇᴍᴏᴠᴇʀ.'),
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
  verificar,
  detectar
}
