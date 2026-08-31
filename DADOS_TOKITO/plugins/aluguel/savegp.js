/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * ============================================================
 */

const aluguel = require('../../sistemas/aluguel/index')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'savegp',
comandos: ['savegp'],
categoria: 'aluguel',
info: {
descricao: 'Salva o grupo no sistema de aluguel sem vencimento.',
uso: 'savegp',
permissao: 'Dono',
categoria: 'aluguel'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

let metadata = null

try {
metadata = await ctx.tokito.groupMetadata(ctx.from)
} catch {}

const nome = String(metadata?.subject || ctx.groupName || 'Grupo').trim()
const quantidade = Array.isArray(metadata?.participants)
? metadata.participants.length
: Number(ctx.groupMembers?.length || 0)

const g = aluguel.savegp(ctx.from, {
nome,
quantidade,
salvoPor: ctx.sender
})

if (!g)
return ctx.reply(ctx.mess.padraoErro({
titulo: 'SAVEGP',
descricao: 'Não consegui salvar este grupo no sistema de aluguel.'
}))

return ctx.reply(ctx.mess.aluguelSaveGp({
nome,
quantidade,
id: ctx.from,
link: g.linkGrupo || ''
}))
}
})
