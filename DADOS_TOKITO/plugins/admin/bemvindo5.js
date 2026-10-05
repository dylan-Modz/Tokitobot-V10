/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'bemvindo5',
comandos: ['bemvindo5'],
categoria: 'grupo',
info: {
descricao: 'Ativa ou desativa o Bem-vindo 5, dedicado a áudios.',
uso: 'bemvindo5',
permissao: 'ADM'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())

if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

if (!Array.isArray(ctx.dataGp?.[0]?.wellcome))
ctx.dataGp[0].wellcome = []

const config = ctx.dataGp[0].wellcome[4] || {
bemvindo5: false,
audiobv: null,
audiosaiu: null
}

config.bemvindo5 = !Boolean(config.bemvindo5)
ctx.dataGp[0].wellcome[4] = config
ctx.setGp(ctx.dataGp)

await ctx.reagir(ctx.from, config.bemvindo5 ? '✅' : '❌').catch(() => {})

return ctx.reply(
ctx.mess.bemvindoModo(5, config.bemvindo5)
)
}
})
