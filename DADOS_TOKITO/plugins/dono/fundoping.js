/*
 * Tokito Bot V10 - Fundo do Ping
 * Author: Dylan Modz
 */

const donoSistema = require('../../sistemas/dono')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'fundoping',
comandos: ['fundoping'],
categoria: 'dono',
info: {
descricao: 'Altera o fundo usado no comando ping.',
uso: 'fundoping respondendo uma imagem',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

const q =
String(ctx.q || '').trim()

if (
['0', 'reset', 'padrao'].includes(
q.toLowerCase()
)
) {
donoSistema.set({
pingFundo: ''
})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🖼️',
titulo: 'FUNDO DO PING',
descricao: 'O fundo padrão do ping foi restaurado.'
})
)
}

if (/^https?:\/\//i.test(q)) {
donoSistema.set({
pingFundo: q
})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🖼️',
titulo: 'FUNDO DO PING',
descricao: 'O novo fundo do ping foi salvo.'
})
)
}

const imagem =
ctx.modulos.mediaAtual(ctx).image

if (!imagem) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🖼️',
titulo: 'FUNDO DO PING',
uso: `${ctx.prefix}fundoping`,
exemplos: [
`${ctx.prefix}fundoping https://site.com/imagem.jpg`,
`${ctx.prefix}fundoping 0`
],
descricao: 'Responda uma imagem ou informe uma URL.'
})
)
}

await ctx.reagir(
ctx.from,
'⏳'
).catch(() => {})

const buffer =
await ctx.getFileBuffer(
imagem,
'image'
)

const tipo =
String(
imagem.mimetype || ''
).includes('png')
? 'png'
: 'jpg'

const url =
await ctx.modulos.uploadCatbox(
buffer,
tipo
)

donoSistema.set({
pingFundo: url
})

await ctx.reagir(
ctx.from,
'✅'
).catch(() => {})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🖼️',
titulo: 'FUNDO DO PING',
descricao: 'O novo fundo do ping foi salvo.'
})
)
}
})
