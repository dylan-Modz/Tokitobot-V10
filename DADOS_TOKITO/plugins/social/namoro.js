/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

const par = (lista, jid) =>
lista.find(x =>
x.a === jid ||
x.b === jid
)

const outro = (item, jid) =>
item.a === jid
? item.b
: item.a

const alvoDe = ctx =>
ctx.normalizar(
(ctx.menc_jid2 || [])[0] ||
ctx.menc_prt ||
''
)

const foto = async (ctx, jid) => {
try {
return await ctx.tokito.profilePictureUrl(
jid,
'image'
)
}
catch {
return 'https://files.catbox.moe/yet8m8.jpg'
}
}

const enviarPedido = async (ctx, de, para) => {
const f1 = await foto(ctx, de)
const f2 = await foto(ctx, para)

const url =
`${ctx.API_URL}/canvas/namoro` +
`?foto1=${encodeURIComponent(f1)}` +
`&foto2=${encodeURIComponent(f2)}` +
`&nome1=${encodeURIComponent(
ctx.pushname ||
de.split('@')[0]
)}` +
`&nome2=${encodeURIComponent(
para.split('@')[0]
)}`

const caption =
ctx.mess.namoroPedido(
de,
para,
ctx.prefix,
ctx.isBotoes
)

if (!ctx.isBotoes) {
try {
return await ctx.tokito.sendMessage(
ctx.from,
{
image: {
url
},
caption,
mentions: [
de,
para
],
contextInfo:
ctx.canalInfo([
de,
para
])
},
{
quoted: ctx.selo
}
)
}
catch {
return ctx.reply(
caption,
[
de,
para
]
)
}
}

try {
const media =
await ctx.prepareWAMessageMedia(
{
image: {
url
}
},
{
upload:
ctx.tokito.waUploadToServer
}
)

const botoes = [
{
texto:
ctx.mess.botaoAceitar(),
id:
`${ctx.prefix}aceitar ${de.split('@')[0]}`
},
{
texto:
ctx.mess.botaoRecusar(),
id:
`${ctx.prefix}recusar ${de.split('@')[0]}`
}
]

const msg =
ctx.generateWAMessageFromContent(
ctx.from,
{
interactiveMessage:
ctx.proto.Message.InteractiveMessage.create({
contextInfo: {
...ctx.canalInfo([
de,
para
]),
mentionedJid: [
de,
para
]
},
header:
ctx.proto.Message.InteractiveMessage.Header.create({
hasMediaAttachment: true,
imageMessage:
media.imageMessage
}),
body:
ctx.proto.Message.InteractiveMessage.Body.create({
text: caption
}),
footer:
ctx.proto.Message.InteractiveMessage.Footer.create({
text: ''
}),
nativeFlowMessage:
ctx.proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons:
ctx.enviarbuton(
botoes
)
})
})
},
{
quoted: ctx.selo,
userJid:
ctx.tokito.user.id
}
)

return ctx.tokito.relayMessage(
ctx.from,
msg.message,
{
messageId:
msg.key.id
}
)
}
catch (e) {
console.log(
'[NAMORO BOTÕES]',
e?.message || e
)

return ctx.botaozin(
caption,
[
{
texto:
ctx.mess.botaoAceitar(),
id:
`${ctx.prefix}aceitar ${de.split('@')[0]}`
},
{
texto:
ctx.mess.botaoRecusar(),
id:
`${ctx.prefix}recusar ${de.split('@')[0]}`
}
],
[
de,
para
]
)
}
}

const aceitar = async (ctx, de) => {
const d =
ctx.dataGp[0].namoro

const p =
d.pedidos.find(x =>
x.de === de &&
x.para === ctx.sender
)

if (!p)
return ctx.reply(
ctx.mess.namoroSemPedido()
)

if (
par(d.casais, ctx.sender) ||
par(d.casais, de)
)
return ctx.reply(
ctx.mess.namoroIndisponivel()
)

d.casais.push({
a: de,
b: ctx.sender,
desde: Date.now()
})

d.pedidos =
d.pedidos.filter(x =>
![de, ctx.sender].includes(x.de) &&
![de, ctx.sender].includes(x.para)
)

ctx.setGp(
ctx.dataGp
)

const f1 =
await foto(
ctx,
de
)

const f2 =
await foto(
ctx,
ctx.sender
)

const url =
`${ctx.API_URL}/canvas/namoro-aceito` +
`?foto1=${encodeURIComponent(f1)}` +
`&foto2=${encodeURIComponent(f2)}` +
`&nome1=${encodeURIComponent(
de.split('@')[0]
)}` +
`&nome2=${encodeURIComponent(
ctx.sender.split('@')[0]
)}`

const caption =
ctx.mess.namoroAceito(
de,
ctx.sender
)

try {
return await ctx.tokito.sendMessage(
ctx.from,
{
image: {
url
},
caption,
mentions: [
de,
ctx.sender
],
contextInfo:
ctx.canalInfo([
de,
ctx.sender
])
},
{
quoted: ctx.selo
}
)
}
catch {
return ctx.reply(
caption,
[
de,
ctx.sender
]
)
}
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'namorar',

comandos: [
'namorar',
'pedirnamoro',
'aceitar',
'recusar',
'cancelarpedido',
'cancelar',
'terminar',
'dupla',
'minhadupla',
'meunoivo',
'minhanoiva'
],

categoria: 'social',

info: {
descricao: 'Sistema completo de namoro com pedidos, cards e botões.',
uso: 'namorar @usuario',
categoria: 'social'
},

async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(
ctx.mess.sogrupo()
)

if (!ctx.dataGp[0].namoro) {
ctx.dataGp[0].namoro = {
pedidos: [],
casais: []
}
}

const d =
ctx.dataGp[0].namoro

if (
[
'namorar',
'pedirnamoro'
].includes(ctx.command)
) {
const alvo =
alvoDe(ctx)

if (!alvo)
return ctx.reply(
ctx.mess.namoroUso(
ctx.prefix,
ctx.command
)
)

if (alvo === ctx.sender)
return ctx.reply(
ctx.mess.namoroMesmo()
)

if (alvo === ctx.botNumber)
return ctx.reply(
ctx.mess.namoroBot()
)

if (
par(
d.casais,
ctx.sender
)
)
return ctx.reply(
ctx.mess.namoroOcupado(
ctx.sender
)
)

if (
par(
d.casais,
alvo
)
)
return ctx.reply(
ctx.mess.namoroOcupado(
alvo
)
)

if (
d.pedidos.some(x =>
x.para === alvo ||
x.de === ctx.sender
)
)
return ctx.reply(
ctx.mess.namoroPendente(
alvo
),
[
alvo
]
)

d.pedidos.push({
de: ctx.sender,
para: alvo,
hora: Date.now()
})

ctx.setGp(
ctx.dataGp
)

await ctx.reagir(
ctx.from,
'💍'
)

return enviarPedido(
ctx,
ctx.sender,
alvo
)
}

if (ctx.command === 'aceitar') {
const de =
ctx.normalizar(
String(
ctx.q ||
''
).replace(
/\D/g,
''
)
) ||
d.pedidos.find(
x =>
x.para === ctx.sender
)?.de

return aceitar(
ctx,
de
)
}

if (ctx.command === 'recusar') {
const de =
ctx.normalizar(
String(
ctx.q ||
''
).replace(
/\D/g,
''
)
) ||
d.pedidos.find(
x =>
x.para === ctx.sender
)?.de

const p =
d.pedidos.find(
x =>
x.de === de &&
x.para === ctx.sender
)

if (!p)
return ctx.reply(
ctx.mess.namoroSemPedido()
)

d.pedidos =
d.pedidos.filter(
x =>
x !== p
)

ctx.setGp(
ctx.dataGp
)

return ctx.reply(
ctx.mess.namoroRecusado(
de,
ctx.sender
),
[
de,
ctx.sender
]
)
}

if (
[
'cancelarpedido',
'cancelar'
].includes(
ctx.command
)
) {
const antes =
d.pedidos.length

d.pedidos =
d.pedidos.filter(
x =>
x.de !== ctx.sender
)

if (
antes ===
d.pedidos.length
)
return ctx.reply(
ctx.mess.namoroSemEnvio()
)

ctx.setGp(
ctx.dataGp
)

return ctx.reply(
ctx.mess.namoroCancelado()
)
}

if (
ctx.command ===
'terminar'
) {
const p =
par(
d.casais,
ctx.sender
)

if (!p)
return ctx.reply(
ctx.mess.namoroSolteiro()
)

const o =
outro(
p,
ctx.sender
)

d.casais =
d.casais.filter(
x =>
x !== p
)

ctx.setGp(
ctx.dataGp
)

await ctx.reply(
ctx.mess.namoroTerminou(
ctx.sender,
o
),
[
ctx.sender,
o
]
)

await ctx.tokito.sendMessage(
o,
{
text:
ctx.mess.namoroPrivadoTerminou(
ctx.sender
),
mentions: [
ctx.sender,
o
],
contextInfo:
ctx.canalInfo([
ctx.sender,
o
])
}
).catch(() => {
})

return
}

if (
[
'dupla',
'minhadupla',
'meunoivo',
'minhanoiva'
].includes(
ctx.command
)
) {
const p =
par(
d.casais,
ctx.sender
)

if (!p)
return ctx.reply(
ctx.mess.namoroSolteiro()
)

const o =
outro(
p,
ctx.sender
)

const tempo =
ctx.mess.tempoRelacao(
Date.now() -
Number(
p.desde ||
Date.now()
)
)

const f1 =
await foto(
ctx,
ctx.sender
)

const f2 =
await foto(
ctx,
o
)

const url =
`${ctx.API_URL}/canvas/minhadupla` +
`?foto1=${encodeURIComponent(f1)}` +
`&foto2=${encodeURIComponent(f2)}` +
`&nome1=${encodeURIComponent(
ctx.sender.split('@')[0]
)}` +
`&nome2=${encodeURIComponent(
o.split('@')[0]
)}` +
`&tempo=${encodeURIComponent(
tempo
)}`

const caption =
ctx.mess.minhaDupla(
ctx.sender,
o,
tempo
)

try {
return await ctx.tokito.sendMessage(
ctx.from,
{
image: {
url
},
caption,
mentions: [
ctx.sender,
o
],
contextInfo:
ctx.canalInfo([
ctx.sender,
o
])
},
{
quoted:
ctx.selo
}
)
}
catch {
return ctx.reply(
caption,
[
ctx.sender,
o
]
)
}
}
},

async evento(ctx) {
if (
!ctx.isGroup ||
!ctx.dataGp?.[0]?.namoro?.pedidos?.length
)
return false

const p =
ctx.dataGp[0].namoro.pedidos.find(
x =>
x.para === ctx.sender
)

if (!p)
return false

const t =
String(
ctx.body ||
''
)
.trim()
.toLowerCase()
.normalize('NFD')
.replace(
/[\u0300-\u036f]/g,
''
)

if (
[
's',
'sim'
].includes(t)
) {
await aceitar(
ctx,
p.de
)

return true
}

if (
[
'n',
'nao'
].includes(t)
) {
ctx.dataGp[0].namoro.pedidos =
ctx.dataGp[0].namoro.pedidos.filter(
x =>
x !== p
)

ctx.setGp(
ctx.dataGp
)

await ctx.reply(
ctx.mess.namoroRecusado(
p.de,
ctx.sender
),
[
p.de,
ctx.sender
]
)

return true
}

return false
}
}
)
