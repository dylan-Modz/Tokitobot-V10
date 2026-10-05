/*
 * Tokito Bot V10 - Gerenciamento global de grupos e transmissão
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

const gruposOrdenados = async ctx => {
const todos =
await ctx.tokito.groupFetchAllParticipating()

return Object.values(todos || {})
.sort((a, b) =>
String(a.subject || '')
.localeCompare(
String(b.subject || ''),
'pt-BR'
)
)
}

const normalizarDestino = valor => {
let alvo = String(valor || '').trim()

if (!alvo)
return ''

if (
alvo.endsWith('@g.us') ||
alvo.endsWith('@s.whatsapp.net')
) {
return alvo
}

const numero =
alvo.replace(/\D/g, '')

if (!numero)
return ''

let final = numero

if (
!final.startsWith('55') &&
[10, 11].includes(final.length)
) {
final = `55${final}`
}

if (
final.length < 10 ||
final.length > 15
) {
return ''
}

return `${final}@s.whatsapp.net`
}

const resolverGrupo = async (
ctx,
entrada
) => {
const lista =
await gruposOrdenados(ctx)

const valor =
String(entrada || '').trim()

if (!valor)
return {
grupo: null,
lista
}

if (/^\d+$/.test(valor)) {
const indice = Number(valor) - 1

if (
indice >= 0 &&
indice < lista.length
) {
return {
grupo: lista[indice],
lista
}
}
}

let id = valor

if (
!id.endsWith('@g.us') &&
/^[\d-]+$/.test(id)
) {
id = `${id}@g.us`
}

const grupo =
lista.find(item =>
item.id === id
) || null

return {
grupo,
lista
}
}

const midiaTransmissao = async ctx => {
const midias =
ctx.modulos.mediaAtual(ctx)

const tipos = [
['image', midias.image],
['video', midias.video],
['audio', midias.audio],
['document', midias.document],
['sticker', midias.sticker]
]

for (const [tipo, midia] of tipos) {
if (!midia)
continue

const buffer =
await ctx.getFileBuffer(
midia,
tipo
)

return {
tipo,
buffer,
mimetype: midia.mimetype || undefined,
fileName:
midia.fileName ||
midia.title ||
undefined,
ptt:
tipo === 'audio'
? midia.ptt === true
: undefined
}
}

return null
}

const payloadTransmissao = (
midia,
texto
) => {
if (!midia)
return {
text: texto
}

if (midia.tipo === 'image') {
return {
image: midia.buffer,
caption: texto || ''
}
}

if (midia.tipo === 'video') {
return {
video: midia.buffer,
caption: texto || '',
mimetype: midia.mimetype
}
}

if (midia.tipo === 'audio') {
return {
audio: midia.buffer,
mimetype:
midia.mimetype ||
'audio/ogg; codecs=opus',
ptt: midia.ptt === true
}
}

if (midia.tipo === 'document') {
return {
document: midia.buffer,
mimetype:
midia.mimetype ||
'application/octet-stream',
fileName:
midia.fileName ||
'arquivo',
caption: texto || ''
}
}

return {
sticker: midia.buffer
}
}

dylan.setCommand({
nome: 'gruposglobais',
comandos: [
'listagp',
'linkdogp',
'envmsg',
'transmitir'
],
categoria: 'dono',
info: {
descricao: 'Gerencia grupos e envia mensagens pelo bot.',
uso: 'listagp',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

if (ctx.command === 'listagp') {
const lista =
await gruposOrdenados(ctx)

if (!lista.length) {
return ctx.reply(
ctx.mess.padraoLista({
emoji: '👥',
titulo: 'GRUPOS DO BOT',
itens: [],
vazio: 'O bot não está em nenhum grupo.'
})
)
}

const blocos = []

for (
let inicio = 0;
inicio < lista.length;
inicio += 15
) {
const fatia =
lista.slice(
inicio,
inicio + 15
)

const corpo =
fatia.map((grupo, pos) => {
const participantes =
Array.isArray(grupo.participants)
? grupo.participants
: []

const admins =
participantes.filter(item =>
['admin', 'superadmin'].includes(
item?.admin
)
).length

return `> ${inicio + pos + 1}. 👥 ${grupo.subject || 'Grupo'}
> 👤 ׄ ( ${participantes.length} membros | ${admins} admins )
> 🆔 ׄ ( ${grupo.id} )`
}).join('\n\n')

blocos.push(
`- 👥 \`𝙶𝚁𝚄𝙿𝙾𝚂 𝙳𝙾 𝙱𝙾𝚃\`

> 📊 ׄ ( ᴛᴏᴛᴀʟ: ${lista.length} )

${corpo}`
)
}

for (const bloco of blocos)
await ctx.reply(bloco)

return
}

if (ctx.command === 'linkdogp') {
const {
grupo,
lista
} =
await resolverGrupo(
ctx,
ctx.q
)

if (!grupo) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🔗',
titulo: 'LINK DE OUTRO GRUPO',
uso: `${ctx.prefix}linkdogp 1`,
exemplos: [
`${ctx.prefix}linkdogp 120363000000000000@g.us`
],
descricao: `Use o número exibido em ${ctx.prefix}listagp ou informe o ID do grupo. Existem ${lista.length} grupos disponíveis.`
})
)
}

try {
const codigo =
await ctx.tokito.groupInviteCode(
grupo.id
)

const link =
`https://chat.whatsapp.com/${codigo}`

return ctx.reply(
`- 🔗 \`𝙻𝙸𝙽𝙺 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`

> 👥 ׄ ( ${grupo.subject || 'Grupo'} )
> 🆔 ׄ ( ${grupo.id} )

${link}`
)
}
catch {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '🔗',
titulo: 'LINK INDISPONÍVEL',
descricao: 'Não consegui obter o link. O bot provavelmente não é administrador desse grupo.'
})
)
}
}

if (ctx.command === 'envmsg') {
const partes =
String(ctx.q || '').split('|')

const alvoTexto =
String(
partes.shift() || ''
).trim()

const mensagem =
partes.join('|').trim()

const alvo =
normalizarDestino(
alvoTexto
)

if (
!alvo ||
!mensagem
) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '✉️',
titulo: 'ENVIAR MENSAGEM',
uso: `${ctx.prefix}envmsg 5511999999999 | Olá!`,
exemplos: [
`${ctx.prefix}envmsg 120363000000000000@g.us | Aviso do Tokito`
],
descricao: 'Informe o número ou ID do grupo, depois a mensagem.'
})
)
}

try {
await ctx.tokito.sendMessage(
alvo,
{
text: mensagem
}
)

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '✉️',
titulo: 'MENSAGEM ENVIADA',
descricao: `Destino: ${alvoTexto}`
})
)
}
catch (error) {
return ctx.reply(
ctx.mess.padraoErro({
titulo: 'ENVIAR MENSAGEM',
descricao: 'Não consegui enviar a mensagem.',
detalhe: error?.message || 'Erro desconhecido.'
})
)
}
}

const texto =
String(ctx.q || '').trim()

let midia = null

try {
midia =
await midiaTransmissao(ctx)
}
catch (error) {
return ctx.reply(
ctx.mess.padraoErro({
titulo: 'TRANSMISSÃO',
descricao: 'Não consegui preparar a mídia.',
detalhe: error?.message || 'Erro desconhecido.'
})
)
}

if (
!texto &&
!midia
) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '📢',
titulo: 'TRANSMITIR',
uso: `${ctx.prefix}transmitir Seu aviso aqui`,
descricao: 'Também é possível responder uma imagem, vídeo, áudio, documento ou figurinha com o comando.'
})
)
}

const grupos =
await gruposOrdenados(ctx)

if (!grupos.length) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '📢',
titulo: 'TRANSMISSÃO',
descricao: 'O bot não está em nenhum grupo.'
})
)
}

await ctx.reagir(
ctx.from,
'⏳'
).catch(() => {})

let enviados = 0
let falhas = 0

for (const grupo of grupos) {
try {
await ctx.tokito.sendMessage(
grupo.id,
payloadTransmissao(
midia,
texto
)
)

enviados++
}
catch {
falhas++
}

await new Promise(resolve =>
setTimeout(resolve, 1200)
)
}

await ctx.reagir(
ctx.from,
'✅'
).catch(() => {})

return ctx.reply(
ctx.mess.padraoInfo({
emoji: '📢',
titulo: 'TRANSMISSÃO FINALIZADA',
linhas: [
{
rotulo: '✅ 𝙴𝙽𝚅𝙸𝙰𝙳𝙾𝚂',
valor: enviados
},
{
rotulo: '❌ 𝙵𝙰𝙻𝙷𝙰𝚂',
valor: falhas
},
{
rotulo: '👥 𝚃𝙾𝚃𝙰𝙻',
valor: grupos.length
}
]
})
)
}
})
