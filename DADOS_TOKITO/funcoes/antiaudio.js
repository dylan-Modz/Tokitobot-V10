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
campo: 'antiaudio',
emoji: '🎵',
titulo: '𝙰𝙽𝚃𝙸-𝙰́𝚄𝙳𝙸𝙾',
descricao: 'ᴀᴘᴀɢᴀ ᴀ́ᴜᴅɪᴏs ᴇɴᴠɪᴀᴅᴏs ɴᴏ ɢʀᴜᴘᴏ ᴇ ʀᴇᴍᴏᴠᴇ ᴏ ᴍᴇᴍʙʀᴏ.'
})

const verificar = async (ctx) => {
const { mensagem, isGroup, isGroupAdmins, isBotGroupAdmins, config } = ctx
const msg = base.desenrolar(mensagem)
if (!isGroup || !config?.antiaudio || isGroupAdmins || !isBotGroupAdmins)
return false
if (!msg?.audioMessage)
return false
return punir(ctx, {
emoji: '🎵',
titulo: '𝙰𝙽𝚃𝙸-𝙰́𝚄𝙳𝙸𝙾',
descricao: 'ᴇɴᴠɪᴀʀ ᴀ́ᴜᴅɪᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ'
})
}

module.exports = {
configurar,
verificar
}
