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
nome: 'modocoins',
comandos: ['modocoins'],
categoria: 'coins',
info: {
descricao: 'Ativa ou desativa a economia N-Coins no grupo.',
uso: 'modocoins 1|0',
permissao: 'ADM',
categoria: 'coins'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())
const a = String(ctx.q || '').trim()
if (!['0', '1'].includes(a))
return ctx.reply(ctx.mess.modoCoinsUso(ctx.prefix))
ctx.dataGp[0].funcoes.modocoins = a === '1'
ctx.setGp(ctx.dataGp)
return ctx.reply(ctx.mess.modoAlterado('𝙼𝙾𝙳𝙾 𝙲𝙾𝙸𝙽𝚂', a === '1'))
}
}
