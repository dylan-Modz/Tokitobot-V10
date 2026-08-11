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

module.exports = {
nome: 'evento-mute',
categoria: 'eventos',
fase: 'pre',
async evento(ctx) {
const { isGroup, dataGp, sender, SoDono, isGroupAdmins, tokito, info, from, mess, canalInfo, selo } = ctx
if (!isGroup || SoDono || isGroupAdmins)
return false
const lista = Array.isArray(dataGp?.[0]?.silenciados) ? dataGp[0].silenciados : []
const item = lista.find(x => x.id === sender)
if (!item)
return false
try {
await tokito.sendMessage(from, { delete: info.key })
}
catch {
}
;
if (item.modo === 'ban') {
let removido = false
try {
await tokito.groupParticipantsUpdate(from, [sender], 'remove')
removido = true
}
catch {
}
;
dataGp[0].silenciados = lista.filter(x => x.id !== sender)
ctx.setGp(dataGp)
await tokito.sendMessage(from, {
text: mess.muteBanDisparado(sender, removido),
contextInfo: canalInfo([sender])
}, { quoted: selo }).catch(() => {
})
}
return true
}
}
