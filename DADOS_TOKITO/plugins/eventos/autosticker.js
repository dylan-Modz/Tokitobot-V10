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

const modulos = require('../../sistemas/modulos')

module.exports = {
prioridade: 70,
nome: 'evento-autosticker',
categoria: 'eventos',
async evento(ctx) {
if (!ctx.isGroup || ctx.info?.key?.fromMe || ctx.isCmd || !ctx.dataGp?.[0]?.funcoes?.autosticker)
return false
const m = {
image: ctx.mensagem?.imageMessage || null,
video: ctx.mensagem?.videoMessage || null
}
const db = modulos.takes()
const meta = db[ctx.normalizar(ctx.sender)] || {
packname: `🧊 ${ctx.NomeDoBot}`,
author: ctx.pushname || 'Dylan Modz'
}
try {
if (m.image) {
const b = await ctx.getFileBuffer(m.image, 'image')
const a = await ctx.sendImageAsSticker2(ctx.tokito, ctx.from, b, ctx.selo, meta)
ctx.DLT_FL(a)
return true
}
if (m.video && Number(m.video.seconds || 0) < 11) {
const b = await ctx.getFileBuffer(m.video, 'video')
const a = await ctx.sendVideoAsSticker2(ctx.tokito, ctx.from, b, ctx.selo, meta)
ctx.DLT_FL(a)
return true
}
}
catch (e) {
console.log('[AUTOSTICKER]', e?.message || e)
}
return false
}
}
