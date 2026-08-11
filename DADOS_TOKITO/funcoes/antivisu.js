const base = require('./base.js')
const toggle = require('./toggle.js')
const mess = require('../database/lib/global.js')

const configurar = ctx => toggle({
  ...ctx,
  campo: 'antivisu',
  emoji: '👁️',
  titulo: '𝙰𝙽𝚃𝙸-𝚅𝙸𝚂𝚄',
  descricao: 'ᴀᴘᴀɢᴀ ɪᴍᴀɢᴇɴs, ᴠɪ́ᴅᴇᴏs ᴇ ᴀ́ᴜᴅɪᴏs ᴅᴇ ᴠɪsᴜᴀʟɪᴢᴀᴄ̧ᴀ̃ᴏ ᴜ́ɴɪᴄᴀ.'
})

const detectar = (original, info) => {
  const raiz = original?.message || original || {}
  const msg = base.desenrolar(raiz)
  return Boolean(info?.key?.isViewOnce === true ||
    raiz?.viewOnceMessage ||
    raiz?.viewOnceMessageV2 ||
    raiz?.viewOnceMessageV2Extension ||
    raiz?.ephemeralMessage?.message?.viewOnceMessage ||
    raiz?.ephemeralMessage?.message?.viewOnceMessageV2 ||
    raiz?.ephemeralMessage?.message?.viewOnceMessageV2Extension ||
    msg?.imageMessage?.viewOnce === true ||
    msg?.videoMessage?.viewOnce === true ||
    msg?.audioMessage?.viewOnce === true ||
    msg?.ptvMessage?.viewOnce === true)
}

const verificar = async (ctx) => {
  const { tokito, info, from, sender, original, mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, dono, config, newsletter, selo } = ctx
  if (!isGroup || !config?.antivisu || isGroupAdmins || dono || info?.key?.fromMe || !detectar(original || mensagem, info))
    return false
  if (!isBotGroupAdmins)
    return false
  const autor = info?.key?.participantAlt || sender || info?.key?.participant
  if (!await base.apagar(tokito, info))
    return false
  const aviso = {
    text: mess.antiBloqueio('👁️', '𝙰𝙽𝚃𝙸-𝚅𝙸𝚂𝚄', base.numero(autor), 'ᴀ ᴍɪ́ᴅɪᴀ ᴅᴇ ᴠɪsᴜᴀʟɪᴢᴀᴄ̧ᴀ̃ᴏ ᴜ́ɴɪᴄᴀ ғᴏɪ ᴅᴇᴛᴇᴄᴛᴀᴅᴀ ᴇ ᴀᴘᴀɢᴀᴅᴀ.'),
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
  verificar,
  detectar
}
