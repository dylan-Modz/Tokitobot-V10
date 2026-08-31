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

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'brat',
comandos: ['brat', 'bratvid'],
categoria: 'figurinhas',
info: {
descricao: 'Cria figurinha Brat em imagem ou vídeo.',
uso: 'brat texto'
},
async executar(ctx) {
const texto = String(ctx.q || '').trim()
if (!texto)
return ctx.reply(ctx.mess.padraoUso({
emoji: '🧊',
titulo: 'BRAT',
uso: `${ctx.prefix}${ctx.command} seu texto`,
descricao: 'Informe o texto que deseja transformar em figurinha.'
}))
try {
if (ctx.command === 'brat') {
const url = `${ctx.API_URL}/api/stickers/brat-img?text=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`
const a = await ctx.sendImageAsSticker2(ctx.tokito, ctx.from, url, ctx.selo, {
packname: `🧊 ${ctx.NomeDoBot}`,
author: ctx.pushname
})
return ctx.DLT_FL(a)
}
const url = `${ctx.API_URL}/api/stickers/brat-vid?text=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`
const a = await ctx.sendVideoAsSticker2(ctx.tokito, ctx.from, url, ctx.selo, {
packname: `🧊 ${ctx.NomeDoBot}`,
author: ctx.pushname
})
return ctx.DLT_FL(a)
}
catch (e) {
console.log('[BRAT]', ctx.modulos.sanitizarErro(e, [ctx.API_KEY_TOKITO]))
return ctx.reply(ctx.mess.erroApi(ctx.API_URL))
}
}
}
)
