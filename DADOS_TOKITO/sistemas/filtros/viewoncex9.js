/* Tokito Bot V10 — ViewOnce X9 (restrição de mídia comum em grupos). */
const base = require('../grupos.js')
const toggle = require('../toggle.js')
const mess = require('../../mensagens/mensagens.js')
const antivisu = require('./antivisu.js')
const avisos = new Map()
const ESPERA = 60000

const configurar = ctx => toggle({
...ctx,
campo: 'viewOncex9',
emoji: '🔐',
titulo: '𝚅𝙸𝙴𝚆 𝙾𝙽𝙲𝙴 𝚇𝟿',
descricao: 'ᴘᴇʀᴍɪᴛᴇ sᴏᴍᴇɴᴛᴇ ғᴏᴛᴏs, ᴠɪ́ᴅᴇᴏs ᴇ ᴀ́ᴜᴅɪᴏs ᴇᴍ ᴠɪsᴜᴀʟɪᴢᴀᴄ̧ᴀ̃ᴏ ᴜ́ɴɪᴄᴀ.'
})

const verificar = async ctx => {
const { tokito, info, from, sender, original, mensagem, isGroup, isBotGroupAdmins, config, newsletter, selo } = ctx
if (!isGroup || config?.viewOncex9 !== true || !isBotGroupAdmins || info?.key?.fromMe === true) return false
const raiz = original || info?.message || mensagem || {}
const msg = base.desenrolar(raiz)
if (!msg?.imageMessage && !msg?.videoMessage && !msg?.ptvMessage && !msg?.audioMessage) return false
if (antivisu.detectar(raiz, info)) return false
if (!await base.apagar(tokito, info)) return false
const agora = Date.now()
const chave = from + '|' + String(sender || info?.key?.participant || '')
if (agora - (avisos.get(chave) || 0) > ESPERA) {
avisos.set(chave, agora)
const autor = sender || info?.key?.participantAlt || info?.key?.participant || ''
const aviso = {
text: mess.antiBloqueio('🔐', '𝚅𝙸𝙴𝚆 𝙾𝙽𝙲𝙴 𝚇𝟿', base.numero(autor), 'ᴀ ᴍɪ́ᴅɪᴀ ᴄᴏᴍᴜᴍ ғᴏɪ ᴅᴇᴛᴇᴄᴛᴀᴅᴀ ᴇ ᴀᴘᴀɢᴀᴅᴀ. ᴇɴᴠɪᴇ ғᴏᴛᴏs, ᴠɪ́ᴅᴇᴏs ᴇ ᴀ́ᴜᴅɪᴏs ᴇᴍ ᴠɪsᴜᴀʟɪᴢᴀᴄ̧ᴀ̃ᴏ ᴜ́ɴɪᴄᴀ.'),
contextInfo: { ...(newsletter || {}), mentionedJid: autor ? [autor] : [] }
}
if (selo?.message)
await tokito.sendMessage(from, aviso, { quoted: selo }).catch(() => {})
else
await tokito.sendMessage(from, aviso).catch(() => {})
}
if (avisos.size > 2500) {
for (const [id, horario] of avisos)
if (agora - horario > ESPERA) avisos.delete(id)
}
return true
}
module.exports = { configurar, verificar }
