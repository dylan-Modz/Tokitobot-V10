/*
 * Tokito Bot V10 - Anti Flood Sticker
 * Author: Dylan Modz
 */

const toggle = require('../../sistemas/toggle.js')

const usuarios = new Map()
const JANELA = 10000
const LIMITE = 5

const configurar = ctx => toggle({
...ctx,
campo: 'antifloodsticker',
emoji: '🚫',
titulo: '𝙰𝙽𝚃𝙸-𝙵𝙻𝙾𝙾𝙳 𝚂𝚃𝙸𝙲𝙺𝙴𝚁',
descricao: 'ʀᴇᴍᴏᴠᴇ ǫᴜᴇᴍ ᴇɴᴠɪᴀʀ ғɪɢᴜʀɪɴʜᴀs ᴇᴍ ғʟᴏᴏᴅ.'
})

const verificar = async ctx => {
const {
tokito, info, mensagem, from, sender,
isGroup, isGroupAdmins, isBotGroupAdmins,
dono, config, newsletter, selo
} = ctx

if (
!isGroup ||
config?.antifloodsticker !== true ||
isGroupAdmins ||
dono ||
!isBotGroupAdmins ||
!mensagem?.stickerMessage
) return false

const cfg = config?.limitefig && typeof config.limitefig === 'object' ? config.limitefig : {}
const janela = Number.isFinite(cfg.janelaMs) && cfg.janelaMs >= 5000 && cfg.janelaMs <= 120000 ? cfg.janelaMs : JANELA
const limite = Number.isInteger(cfg.max) && cfg.max >= 1 && cfg.max <= 20 ? cfg.max : LIMITE - 1
const chave = `${from}:${sender}`
const agora = Date.now()
const lista = (usuarios.get(chave) || [])
.filter(tempo => agora - tempo <= janela)

lista.push(agora)
usuarios.set(chave, lista)

if (lista.length <= limite)
return false

usuarios.delete(chave)

await tokito.sendMessage(from, {
delete: info.key
}).catch(() => {})

await tokito.groupParticipantsUpdate(
from,
[sender],
'remove'
).catch(() => {})

await tokito.sendMessage(from, {
text:
`- 🚫 \`𝙰𝙽𝚃𝙸-𝙵𝙻𝙾𝙾𝙳 𝚂𝚃𝙸𝙲𝙺𝙴𝚁\`\n\n> 👤 ׄ ( @${String(sender).split('@')[0]} — ʀᴇᴍᴏᴠɪᴅᴏ ᴘᴏʀ ғʟᴏᴏᴅ ᴅᴇ ғɪɢᴜʀɪɴʜᴀs. )\n> 🚫 ׄ ( ᴍᴀ́xɪᴍᴏ ${limite} ғɪɢᴜʀɪɴʜᴀs ᴇᴍ ${janela / 1000} sᴇɢᴜɴᴅᴏs. )`,
mentions: [sender],
contextInfo: {
...(newsletter || {}),
mentionedJid: [sender]
}
}, { quoted: selo }).catch(() => {})

return true
}

module.exports = {
configurar,
verificar,
JANELA,
LIMITE
}
