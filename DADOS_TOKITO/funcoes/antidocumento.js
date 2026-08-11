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
const punir = require('./punir.js')

const configurar = ctx => toggle({
...ctx,
campo: 'antidocumento',
emoji: '📄',
titulo: '𝙰𝙽𝚃𝙸-𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃𝙾',
descricao: 'ᴀᴘᴀɢᴀ ᴅᴏᴄᴜᴍᴇɴᴛᴏs ᴇɴᴠɪᴀᴅᴏs ɴᴏ ɢʀᴜᴘᴏ ᴇ ʀᴇᴍᴏᴠᴇ ᴏ ᴍᴇᴍʙʀᴏ.'
})

const verificar = async (ctx) => {
const { mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, config } = ctx
const msg = base.desenrolar(mensagem)
if (!isGroup || !config?.antidocumento || isGroupAdmins || !isBotGroupAdmins)
return false
if (!msg?.documentMessage)
return false
return punir(ctx, {
emoji: '📄',
titulo: '𝙰𝙽𝚃𝙸-𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃𝙾',
descricao: 'ᴇɴᴠɪᴀʀ ᴅᴏᴄᴜᴍᴇɴᴛᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ'
})
}

module.exports = {
configurar,
verificar
}
