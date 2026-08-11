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
