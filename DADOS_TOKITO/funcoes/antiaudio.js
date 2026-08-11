const base = require('./base.js')
const toggle = require('./toggle.js')
const punir = require('./punir.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'antiaudio',
  emoji: '🎵',
  titulo: '𝙰𝙽𝚃𝙸-𝙰́𝚄𝙳𝙸𝙾',
  descricao: 'ᴀᴘᴀɢᴀ ᴀ́ᴜᴅɪᴏs ᴇɴᴠɪᴀᴅᴏs ɴᴏ ɢʀᴜᴘᴏ ᴇ ʀᴇᴍᴏᴠᴇ ᴏ ᴍᴇᴍʙʀᴏ.'
})

const verificar = async (ctx) => {
  const { mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, config } = ctx
  const msg = base.desenrolar(mensagem)
  if (!isGroup || !config?.antiaudio || isGroupAdmins || !isBotGroupAdmins)
    return false
  if (!msg?.audioMessage)
    return false
  return punir(ctx, {
    emoji: '🎵',
    titulo: '𝙰𝙽𝚃𝙸-𝙰́𝚄𝙳𝙸𝙾',
    descricao: 'ᴇɴᴠɪᴀʀ ᴀ́ᴜᴅɪᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ'
  })
}

module.exports = {
  configurar,
  verificar
}
