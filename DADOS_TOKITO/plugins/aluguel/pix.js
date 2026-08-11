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

const aluguel = require('../../sistemas/aluguel')

module.exports = {
nome: 'pixalugar',
comandos: ['pixalugar', 'pixaluguel'],
categoria: 'aluguel',
info: {
descricao: 'Gera o PIX do plano e inicia verificação automática.',
uso: 'pixalugar valor',
categoria: 'aluguel'
},
async executar(ctx) {
if (!ctx.nescessario.aluguel)
return ctx.reply(ctx.mess.aluguelDesativado())
if (!aluguel.tokenConfigurado())
return ctx.reply(ctx.mess.tokenMpAusente())
const valor = Number(String(ctx.q || '').replace(',', '.'))
if (!Number.isFinite(valor) || valor <= 0)
return ctx.reply(ctx.mess.aluguelPlanoInvalido())
try {
const item = await aluguel.criarPix(ctx.sender, valor)
await ctx.reagir(ctx.from, '💵')
const caption = ctx.mess.aluguelPix(item)
if (item.qr_code_base64) {
const b64 = String(item.qr_code_base64).replace(/^data:image\/\w+;base64,/, '')
await ctx.tokito.sendMessage(ctx.from, {
image: Buffer.from(b64, 'base64'),
caption,
contextInfo: ctx.canalInfo([ctx.sender])
}, { quoted: ctx.selo })
}
else
await ctx.reply(`${caption}\n\n${item.qr_code}`)
if (item.qr_code)
return ctx.botaozin('💳 PIX copia e cola', [
{
texto: 'Copiar PIX',
id: `${ctx.prefix}pixcodigo ${item.id}`
}
], [ctx.sender])
}
catch (e) {
if (e.code === 'MP_TOKEN_NAO_CONFIGURADO' || e.message === 'MP_TOKEN_NAO_CONFIGURADO')
return ctx.reply(ctx.mess.tokenMpAusente())
if (e.message === 'PEDIDO_NAO_ENCONTRADO')
return ctx.reply(ctx.mess.aluguelSemPedido(ctx.prefix))
if (e.message === 'PLANO_NAO_ENCONTRADO')
return ctx.reply(ctx.mess.aluguelPlanoInvalido())
console.log('[PIX ALUGUEL]', e?.message || e)
return ctx.reply(ctx.mess.error())
}
}
}
