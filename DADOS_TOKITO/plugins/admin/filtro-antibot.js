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

const base = require('../../sistemas/grupos.js')
const toggle = require('../../sistemas/toggle.js')
const mess = require('../../mensagens/mensagens.js')

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
