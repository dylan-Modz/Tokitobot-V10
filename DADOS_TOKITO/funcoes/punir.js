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
const mess = require('../database/lib/global.js')
const adv = require('../sistemas/advertencias.js')

module.exports = async (ctx, { emoji, titulo, descricao }) => {
const { tokito, info, from, sender, newsletter, selo, dataGp, setGp } = ctx
await base.esperar(300)
await base.apagar(tokito, info)
const r = adv.adicionar({
dataGp,
setGp,
grupo: from,
jid: sender,
motivo: `${titulo}: ${descricao}`,
autor: 'proteção automática'
})
let removido = false
if (r.remove) {
try {
await tokito.groupParticipantsUpdate(from, [sender], 'remove')
removido = true
}
catch (error) {
console.log(`[${titulo}]`, error?.message || error)
}
}
await tokito.sendMessage(from, {
text: mess.protecaoAdv(emoji, titulo, sender, r.quantidade, descricao, removido),
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo }).catch(() => {
})
return true
}
