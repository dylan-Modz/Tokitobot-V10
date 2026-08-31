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
campo: 'antivideo',
emoji: '🎥',
titulo: '𝙰𝙽𝚃𝙸-𝚅𝙸́𝙳𝙴𝙾',
descricao: 'ᴀᴘᴀɢᴀ ᴠɪ́ᴅᴇᴏs ᴇɴᴠɪᴀᴅᴏs ᴘᴏʀ ᴍᴇᴍʙʀᴏs ɴᴏ ɢʀᴜᴘᴏ.'
})

const verificar = async (ctx) => {
const { tokito, info, from, sender, mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, config, newsletter, selo } = ctx
if (!isGroup || !config?.antivideo || isGroupAdmins || !base.desenrolar(mensagem)?.videoMessage)
return false
if (!isBotGroupAdmins)
return false
await base.apagar(tokito, info)
await tokito.sendMessage(from, {
text: mess.antiBloqueio('🎥', '𝙰𝙽𝚃𝙸-𝚅𝙸́𝙳𝙴𝙾', base.numero(sender), 'ᴏ ᴠɪ́ᴅᴇᴏ ғᴏɪ ᴅᴇᴛᴇᴄᴛᴀᴅᴏ ᴇ ᴀᴘᴀɢᴀᴅᴏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.'),
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
verificar
}
