/* Tokito Bot V10 — comando ViewOnce X9. */
const dylan = require('../../database/lib/comandos')
const filtro = require('../../sistemas/filtros/viewoncex9.js')
dylan.setCommand({
nome: 'viewoncex9',
comandos: ['viewoncex9', 'vwx9'],
categoria: 'admin',
info: { descricao: 'Permite somente mídias de visualização única no grupo.', uso: 'viewoncex9 1 | viewoncex9 0', permissao: 'ADM', categoria: 'admin' },
async executar(ctx) {
if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm())
if (!ctx.isBotGroupAdmins) return ctx.reply(ctx.mess.botadm())
return filtro.configurar({
grupo: ctx.from, dataGp: ctx.dataGp, setGp: ctx.setGp,
q: ctx.q, prefix: ctx.prefix, command: ctx.command, reply: ctx.reply
})
}
})
