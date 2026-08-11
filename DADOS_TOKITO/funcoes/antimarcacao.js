const toggle = require('./toggle.js')
const punir = require('./punir.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'antimarcacao',
  emoji: '🏷️',
  titulo: '𝙰𝙽𝚃𝙸-𝙼𝙰𝚁𝙲𝙰𝙲̧𝙰̃𝙾',
  descricao: 'ʀᴇᴍᴏᴠᴇ ᴍᴇᴍʙʀᴏs ǫᴜᴇ ᴍᴀʀᴄᴀʀᴇᴍ ᴘʀᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ᴛᴏᴅᴏ ᴏ ɢʀᴜᴘᴏ.'
})

const verificar = async (ctx) => {
  const { isGroup, isGroupAdmins, isBotGroupAdmins, config, menc_jid2, groupMembers } = ctx
  if (!isGroup || !config?.antimarcacao || isGroupAdmins || !isBotGroupAdmins)
    return false
  const total = Array.isArray(groupMembers) ? groupMembers.length : 0
  const marcados = [...new Set(Array.isArray(menc_jid2) ? menc_jid2.filter(Boolean) : [])]
  if (total < 3 || marcados.length < total - 1)
    return false
  return punir(ctx, {
    emoji: '🏷️',
    titulo: '𝙰𝙽𝚃𝙸-𝙼𝙰𝚁𝙲𝙰𝙲̧𝙰̃𝙾',
    descricao: 'ᴍᴀʀᴄᴀʀ ᴘʀᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ᴛᴏᴅᴏs ᴏs ᴍᴇᴍʙʀᴏs'
  })
}

module.exports = {
  configurar,
  verificar
}
