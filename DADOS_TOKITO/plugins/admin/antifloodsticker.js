/*
 * Tokito Bot V10 - Anti Flood Sticker
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'antifloodsticker',
comandos: ['antifloodsticker'],
categoria: 'grupo',
info: {
descricao: 'Ativa ou desativa a proteção contra flood de figurinhas.',
uso: 'antifloodsticker 1/0',
permissao: 'ADM'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())

if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

return ctx.funcoes.antifloodsticker.configurar({
grupo: ctx.from,
dataGp: ctx.dataGp,
setGp: ctx.setGp,
q: ctx.q,
prefix: ctx.prefix,
command: ctx.command,
reply: ctx.reply
})
}
})
