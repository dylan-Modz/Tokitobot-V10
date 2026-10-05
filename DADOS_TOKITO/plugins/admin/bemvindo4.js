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
nome: 'bemvindo4',
comandos: ['bemvindo4'],
categoria: 'grupo',
info: {
descricao: 'Ativa ou desativa o Bem-vindo 4, dedicado a figurinhas.',
uso: 'bemvindo4',
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

const config = ctx.dataGp[0].wellcome[3] || {
bemvindo4: false,
stickerbv: null,
stickersaiu: null
}

config.bemvindo4 = !Boolean(config.bemvindo4)
ctx.dataGp[0].wellcome[3] = config
ctx.setGp(ctx.dataGp)

await ctx.reagir(ctx.from, config.bemvindo4 ? '✅' : '❌').catch(() => {})

return ctx.reply(
ctx.mess.bemvindoModo(4, config.bemvindo4)
)
}
})
