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
nome: 'grupo',
comandos: ['grupo', 'gp'],
categoria: 'grupo',
info: {
descricao: 'Abre ou fecha o grupo imediatamente.',
uso: 'grupo a|f',
permissao: 'ADM',
categoria: 'grupo'
},
async executar(ctx) {
try {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.grupo())
if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.adm())
if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())
const acao = String(ctx.q || '').trim().toLowerCase()
if (!['a', 'abrir', 'f', 'fechar'].includes(acao))
return ctx.reply(ctx.mess.grupoUso(ctx.prefix))
const abrir = ['a', 'abrir'].includes(acao)
await ctx.reagir(ctx.from, abrir ? '🔓' : '🔒')
await ctx.tokito.groupSettingUpdate(ctx.from, abrir ? 'not_announcement' : 'announcement')
return ctx.reply(ctx.mess.grupoAlterado(abrir))
}
catch (e) {
console.log('[GRUPO A/F]', e?.message || e)
await ctx.reagir(ctx.from, '❌').catch(() => {
})
return ctx.reply(ctx.mess.error())
}
}
}
