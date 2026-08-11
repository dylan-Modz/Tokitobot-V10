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
nome: 'evento-atividades',
categoria: 'eventos',
fase: 'pre',
async evento(ctx) {
if (!ctx.isGroup || ctx.info?.key?.fromMe || !ctx.sender)
return false
if (!ctx.dataGp[0].atividades || typeof ctx.dataGp[0].atividades !== 'object')
ctx.dataGp[0].atividades = {}
const id = ctx.normalizar(ctx.sender)
const d = ctx.dataGp[0].atividades[id] || (ctx.dataGp[0].atividades[id] = {
total: 0,
comandos: 0,
figus: 0,
ultima: 0
})
d.total = Number(d.total || 0) + 1
if (ctx.isCmd)
d.comandos = Number(d.comandos || 0) + 1
if (ctx.mensagem?.stickerMessage)
d.figus = Number(d.figus || 0) + 1
d.ultima = Date.now()
ctx.setGp(ctx.dataGp)
return false
}
}
