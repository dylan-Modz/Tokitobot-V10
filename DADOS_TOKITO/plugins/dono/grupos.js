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
nome: 'entrar',
comandos: ['entrar', 'sairgp'],
categoria: 'dono',
info: {
descricao: 'Entra ou sai de grupos.',
uso: 'entrar link',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
if (ctx.command === 'sairgp') {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
await ctx.reply('👋 Saindo do grupo...')
return ctx.tokito.groupLeave(ctx.from)
}
const m = String(ctx.q || '').match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i)
if (!m)
return ctx.reply(`Use *${ctx.prefix}entrar https://chat.whatsapp.com/SEUCODIGO*.`)
try {
const jid = await ctx.tokito.groupAcceptInvite(m[1])
return ctx.reply(`✅ Entrei no grupo: ${jid}`)
}
catch (e) {
return ctx.reply(`❌ Não consegui entrar no grupo: ${e.message}`)
}
}
}
