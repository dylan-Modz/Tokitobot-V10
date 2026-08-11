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
