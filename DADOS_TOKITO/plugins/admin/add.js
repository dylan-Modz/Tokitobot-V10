/*
 * Tokito Bot V10 - Adicionar membro pelo número
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'add',
comandos: ['add', 'adicionar'],
categoria: 'admin',
info: {
descricao: 'Adiciona uma pessoa ao grupo pelo número.',
uso: 'add 5511999999999',
permissao: 'ADM'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())

if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

let numero =
String(ctx.q || '')
.replace(/\D/g, '')

if (
!numero.startsWith('55') &&
[10, 11].includes(numero.length)
) {
numero = `55${numero}`
}

if (
numero.length < 10 ||
numero.length > 15
) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '➕',
titulo: 'ADICIONAR MEMBRO',
uso: `${ctx.prefix}add 5511999999999`,
descricao: 'Informe o número com DDD. O DDI 55 pode ser omitido para números do Brasil.'
})
)
}

let jid =
ctx.jidNormalizedUser(
`${numero}@s.whatsapp.net`
)

if (
typeof ctx.tokito.onWhatsApp === 'function'
) {
const consulta =
await ctx.tokito.onWhatsApp(
jid
).catch(() => [])

const registro =
Array.isArray(consulta)
? consulta[0]
: null

if (
registro &&
registro.exists === false
) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '➕',
titulo: 'NÚMERO NÃO ENCONTRADO',
descricao: 'Esse número não foi encontrado no WhatsApp.'
})
)
}

if (registro?.jid)
jid =
ctx.jidNormalizedUser(
registro.jid
)
}

try {
const resultado =
await ctx.tokito.groupParticipantsUpdate(
ctx.from,
[jid],
'add'
)

const item =
Array.isArray(resultado)
? resultado[0]
: null

const status =
String(
item?.status || ''
)

if (
status &&
status !== '200'
) {
const privacidade =
['403', '408'].includes(status)

return ctx.reply(
ctx.mess.padraoAviso({
emoji: '➕',
titulo: 'NÃO FOI POSSÍVEL ADICIONAR',
descricao: privacidade
? 'O WhatsApp não permitiu a adição direta. A privacidade da pessoa pode exigir convite.'
: `O WhatsApp retornou o status ${status}.`
})
)
}

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '➕',
titulo: 'MEMBRO ADICIONADO',
descricao: `@${numero} foi adicionado ao grupo.`
}),
[jid]
)
}
catch (error) {
return ctx.reply(
ctx.mess.padraoErro({
titulo: 'ADICIONAR MEMBRO',
descricao: 'Não consegui adicionar esse número ao grupo.',
detalhe: error?.message || 'Erro desconhecido.'
})
)
}
}
})
