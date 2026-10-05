/*
 * Tokito Bot V10 - Anti-Nuke
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'antinuke',
comandos: ['antinuke'],
categoria: 'grupo',
info: {
descricao: 'Ativa ou desativa a proteção contra ações administrativas em massa.',
uso: 'antinuke 1/0',
permissao: 'ADM'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!ctx.isGroupAdmins)
return ctx.reply(ctx.mess.soadm())

if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

const acao = String(ctx.q || '').trim()

if (!['0', '1'].includes(acao))
return ctx.reply(
ctx.mess.funcaoUsoSimples(
ctx.prefix,
ctx.command
)
)

if (
!ctx.dataGp[0].funcoes ||
typeof ctx.dataGp[0].funcoes !== 'object'
) {
ctx.dataGp[0].funcoes = {}
}

ctx.dataGp[0].funcoes.antinuke =
acao === '1'

ctx.setGp(ctx.dataGp)

await ctx.reagir(
ctx.from,
acao === '1' ? '✅' : '❌'
)

return ctx.reply(
ctx.mess.funcaoAlterada(
'ANTI-NUKE',
acao === '1'
)
)
}
})
