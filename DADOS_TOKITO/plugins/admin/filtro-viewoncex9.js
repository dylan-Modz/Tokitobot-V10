/* Tokito Bot V10 — ViewOnce X9 (restrição de mídia comum em grupos). */
const base = require('../../sistemas/grupos.js')
const toggle = require('../../sistemas/toggle.js')
const antivisu = require('./filtro-antivisu.js')
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
const { tokito, info, from, sender, original, mensagem, isGroup, isBotGroupAdmins, config, newsletter } = ctx
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
await tokito.sendMessage(from, {
text: '🔐 *VIEW ONCE X9*\n\nAqui fotos, vídeos e áudios precisam ser enviados em visualização única. A mídia comum foi apagada.',
contextInfo: { ...(newsletter || {}), ...(autor ? { mentionedJid: [autor] } : {}) }
}).catch(() => {})
}
if (avisos.size > 2500) {
for (const [id, horario] of avisos)
if (agora - horario > ESPERA) avisos.delete(id)
}
return true
}
module.exports = { configurar, verificar }
