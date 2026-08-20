/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const x4 = require('./_x4')

module.exports = {
nome: 'xgp',
comandos: ['xgp', 'sala'],
categoria: 'freefire',

info: {
descricao: 'Executa o fluxo rápido de XGP/Sala no grupo.',
uso: 'xgp [novo nome do grupo] | sala [novo nome do grupo]',
permissao: 'ADM',
categoria: 'freefire'
},

async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!x4.ativo(ctx))
return ctx.reply(
`- ⚠️ \`𝙼𝙾𝙳𝙾 𝚇𝟺\`

> *ᴀᴛɪᴠᴇ ᴘʀɪᴍᴇɪʀᴏ ᴄᴏᴍ ${ctx.prefix}modox4 1.*`
)

if (!x4.adm(ctx))
return ctx.reply(ctx.mess.soadm())

if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

let nomeOriginal = ''

try {
const metadata = await ctx.tokito.groupMetadata(ctx.from)

nomeOriginal = String(
metadata?.subject ||
''
).trim()
} catch {}

const novoNome = String(
ctx.q ||
''
).trim() || (
ctx.command === 'sala'
? 'SALA'
: 'XGP'
)

/*
 * ============================================================
 * MARCA O GRUPO 6 VEZES
 * ============================================================
 */

for (let i = 0; i < 6; i++) {
await x4.marcacaoOculta(
ctx,
'\u200e'
)

if (i < 5)
await x4.esperar(1200)
}

/*
 * ============================================================
 * MUDA O NOME DO GRUPO
 * ============================================================
 */

try {
await ctx.tokito.groupUpdateSubject(
ctx.from,
novoNome.slice(0, 100)
)
} catch {}

/*
 * ============================================================
 * VOLTA PARA O NOME ORIGINAL APÓS 2 MINUTOS
 * ============================================================
 */

if (nomeOriginal) {
const grupo = ctx.from

setTimeout(async () => {
try {
await ctx.tokito.groupUpdateSubject(
grupo,
nomeOriginal.slice(0, 100)
)
} catch {}
}, 2 * 60 * 1000)
}

/*
 * ============================================================
 * ENQUETE
 * ============================================================
 */

await ctx.tokito.sendMessage(
ctx.from,
{
poll: {
name: 'on pro xgp?',
values: [
'on',
'off'
],
selectableCount: 1
}
},
{
quoted: ctx.selo
}
)

return true
}
}