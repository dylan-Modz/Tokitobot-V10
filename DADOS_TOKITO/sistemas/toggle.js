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

const base = require('./grupos.js')
const mess = require('../mensagens/mensagens.js')

module.exports = async ({ grupo, dataGp, setGp, campo, q, prefix, command, reply, emoji, titulo, descricao, desligado }) => {
const acao = String(q || '').trim()
if (!['0', '1'].includes(acao))
return reply(mess.funcaoUso(emoji, titulo, prefix, command, descricao))
if (Array.isArray(dataGp) && dataGp[0] && typeof setGp === 'function') {
if (!dataGp[0].funcoes || typeof dataGp[0].funcoes !== 'object')
dataGp[0].funcoes = {}
dataGp[0].funcoes[campo] = acao === '1'
setGp(dataGp)
}
else {
base.alterar(grupo, campo, acao === '1')
}
return reply(acao === '1'
? mess.funcaoAtivada(emoji, titulo, descricao)
: mess.funcaoDesativada(emoji, titulo, desligado || 'ᴇssᴀ ғᴜɴᴄ̧ᴀ̃ᴏ ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.'))
}
