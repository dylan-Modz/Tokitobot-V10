/*
 * Tokito Bot V10 - VIP de grupos
 * Author: Dylan Modz
 */

const donoSistema = require('../../sistemas/dono')
const dylan = require('../../database/lib/comandos')

const grupoInformado = valor => {
let id = String(valor || '').trim()

if (!id)
return ''

if (!id.endsWith('@g.us'))
id = `${id.replace(/\s+/g, '')}@g.us`

return id
}

dylan.setCommand({
nome: 'vipgp',
comandos: [
'addvipgp',
'delvipgp',
'vipgplist',
'listavipgp'
],
categoria: 'dono',
info: {
descricao: 'Gerencia VIP por grupo.',
uso: 'addvipgp 30',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

if (
['vipgplist', 'listavipgp'].includes(
ctx.command
)
) {
const lista =
donoSistema.listarVipGrupos()

if (!lista.length) {
return ctx.reply(
ctx.mess.padraoLista({
emoji: '💎',
titulo: 'VIP DE GRUPOS',
itens: [],
vazio: 'Nenhum grupo VIP cadastrado.'
})
)
}

const linhas =
lista.map((item, indice) => {
let tempo = 'VIP infinito'

if (item.infinito !== true) {
const restante =
Math.max(
0,
Math.ceil(
(
new Date(item.expiraEm).getTime() -
Date.now()
) /
86400000
)
)

tempo =
`${restante} dia${restante !== 1 ? 's' : ''}`
}

return `> 💎 ׄ ( ${indice + 1}. ${item.nome || 'Grupo'} )
> 🆔 ׄ ( ${item.id} )
> ⏳ ׄ ( ${tempo} )`
}).join('\n\n')

return ctx.reply(
`- 💎 \`𝚅𝙸𝙿 𝙳𝙴 𝙶𝚁𝚄𝙿𝙾𝚂\`

${linhas}`
)
}

if (ctx.command === 'delvipgp') {
const alvo = String(ctx.q || '').trim()
? grupoInformado(ctx.q)
: ctx.isGroup
? ctx.from
: ''

if (!alvo) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '💎',
titulo: 'REMOVER VIP DO GRUPO',
uso: `${ctx.prefix}delvipgp ID_DO_GRUPO`,
descricao: 'No próprio grupo, você também pode usar o comando sem informar o ID.'
})
)
}

const resultado =
donoSistema.removerVipGrupo(
alvo
)

if (!resultado.ok) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '💎',
titulo: 'GRUPO NÃO ENCONTRADO',
descricao: 'Esse grupo não possui VIP ativo.'
})
)
}

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '💎',
titulo: 'VIP DO GRUPO REMOVIDO',
descricao: 'O VIP do grupo foi removido com sucesso.'
})
)
}

const texto = String(ctx.q || '').trim()
let grupo = ''
let diasTexto = ''

if (
ctx.isGroup &&
/^\d+$/.test(texto)
) {
grupo = ctx.from
diasTexto = texto
}
else {
const pos = texto.lastIndexOf('/')

if (pos > 0) {
grupo = grupoInformado(
texto.slice(0, pos)
)
diasTexto =
texto.slice(pos + 1).trim()
}
}

const dias = Number(diasTexto)

if (
!grupo ||
!Number.isInteger(dias) ||
dias < 0
) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '💎',
titulo: 'VIP DE GRUPO',
uso: ctx.isGroup
? `${ctx.prefix}addvipgp 30`
: `${ctx.prefix}addvipgp ID_DO_GRUPO/30`,
exemplos: [
`${ctx.prefix}addvipgp ${ctx.isGroup ? '30' : '120363000000000000@g.us/30'}`,
ctx.isGroup
? `${ctx.prefix}addvipgp 0`
: `${ctx.prefix}addvipgp 120363000000000000@g.us/0`
],
descricao: 'Use 0 dias para VIP infinito.'
})
)
}

const metadata =
await ctx.tokito.groupMetadata(
grupo
).catch(() => null)

const nome =
metadata?.subject ||
(ctx.isGroup && grupo === ctx.from
? ctx.groupName
: 'Grupo')

const resultado =
donoSistema.adicionarVipGrupo({
id: grupo,
nome,
dias
})

if (
!resultado.ok &&
resultado.motivo === 'infinito'
) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '💎',
titulo: 'VIP INFINITO',
descricao: 'Esse grupo já possui VIP infinito.'
})
)
}

if (!resultado.ok) {
return ctx.reply(
ctx.mess.padraoErro({
titulo: 'VIP DE GRUPO',
descricao: 'Não foi possível cadastrar o VIP desse grupo.'
})
)
}

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '💎',
titulo: dias === 0
? 'VIP DE GRUPO INFINITO'
: 'VIP DE GRUPO ADICIONADO',
descricao: dias === 0
? `${nome} agora possui VIP infinito.`
: `${dias} dia${dias !== 1 ? 's' : ''} de VIP foram adicionados a ${nome}.`
})
)
}
})
