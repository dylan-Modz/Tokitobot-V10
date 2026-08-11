/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

const base = require('./base.js')
const toggle = require('./toggle.js')
const adv = require('../sistemas/advertencias.js')
const mess = require('../database/lib/global.js')

const configurar = ctx => toggle({
...ctx,
campo: 'anticanal',
emoji: '📡',
titulo: '𝙰𝙽𝚃𝙸-𝙲𝙰𝙽𝙰𝙻',
descricao: 'ᴀᴘᴀɢᴀ ᴇ ᴘᴜɴᴇ ᴇɴᴠɪᴏ ᴅᴇ ʟɪɴᴋ ᴏᴜ ᴍᴇɴsᴀɢᴇᴍ ᴇɴᴄᴀᴍɪɴʜᴀᴅᴀ ᴅᴇ ᴄᴀɴᴀʟ.'
})

const contexto = mensagem => mensagem?.extendedTextMessage?.contextInfo || mensagem?.imageMessage?.contextInfo || mensagem?.videoMessage?.contextInfo || mensagem?.documentMessage?.contextInfo || mensagem?.audioMessage?.contextInfo || {}

const texto = (mensagem, body = '') => String(body || mensagem?.conversation || mensagem?.extendedTextMessage?.text || mensagem?.imageMessage?.caption || mensagem?.videoMessage?.caption || mensagem?.documentMessage?.caption || '')

const linkRegex = /https?:\/\/(?:www\.)?(?:whatsapp\.com\/channel|wa\.me\/channel)\/[0-9A-Za-z_-]+/i

const detectar = (mensagem, body = '') => Boolean(contexto(mensagem)?.forwardedNewsletterMessageInfo || linkRegex.test(texto(mensagem, body)))

const verificar = async (ctx) => {
const { tokito, info, from, sender, mensagem, body, isGroup, isGroupAdmins, isBotGroupAdmins, dono, config, newsletter, selo, dataGp, setGp } = ctx
if (!isGroup || !config?.anticanal || isGroupAdmins || dono || info?.key?.fromMe || !detectar(mensagem, body))
return false
if (!isBotGroupAdmins)
return false
await base.apagar(tokito, info)
const r = adv.adicionar({
dataGp,
setGp,
grupo: from,
jid: sender,
motivo: 'Envio/divulgação de canal do WhatsApp',
autor: 'anti-canal'
})
let removido = false
if (r.remove) {
try {
await tokito.groupParticipantsUpdate(from, [sender], 'remove')
removido = true
}
catch {
}
}
await tokito.sendMessage(from, {
text: mess.antiCanalAdv(sender, r.quantidade, removido),
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
detectar,
linkRegex
}
