/*
 * Tokito Bot V10 - Sorteios de grupo
 * Author: Dylan Modz
 */

const fs = require('fs')
const path = require('path')

const ARQUIVO = path.join(
__dirname,
'..',
'database',
'sistemas',
'sorteios-grupo.json'
)

const garantir = () => {
const pasta = path.dirname(ARQUIVO)

if (!fs.existsSync(pasta))
fs.mkdirSync(pasta, { recursive: true })

if (!fs.existsSync(ARQUIVO))
fs.writeFileSync(ARQUIVO, '{}\n')
}

const ler = () => {
garantir()

try {
const dados = JSON.parse(
fs.readFileSync(ARQUIVO, 'utf8')
)

return dados && typeof dados === 'object'
? dados
: {}
}
catch {
return {}
}
}

const salvar = dados => {
garantir()

const tmp = `${ARQUIVO}.${process.pid}.tmp`

fs.writeFileSync(
tmp,
JSON.stringify(dados || {}, null, 2) + '\n'
)

fs.renameSync(tmp, ARQUIVO)
}

const normalizar = jid => {
const texto = String(jid || '').trim()

if (!texto)
return ''

if (texto.includes('@')) {
const [usuario, servidor] = texto.split('@')
return `${usuario.split(':')[0]}@${servidor}`
}

const numero = texto.replace(/\D/g, '')
return numero ? `${numero}@s.whatsapp.net` : ''
}

const partesBR = data => {
const partes =
new Intl.DateTimeFormat(
'pt-BR',
{
timeZone: 'America/Fortaleza',
year: 'numeric',
month: '2-digit',
day: '2-digit',
hour: '2-digit',
minute: '2-digit',
hourCycle: 'h23'
}
).formatToParts(data)

const mapa = {}

for (const parte of partes)
mapa[parte.type] = parte.value

return {
ano: Number(mapa.year),
mes: Number(mapa.month),
dia: Number(mapa.day),
hora: Number(mapa.hour),
minuto: Number(mapa.minute)
}
}

const horarioParaMs = horario => {
if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(horario || '')))
return null

const agora = new Date()
const p = partesBR(agora)
const [hora, minuto] =
String(horario).split(':').map(Number)

let alvo = Date.UTC(
p.ano,
p.mes - 1,
p.dia,
hora + 3,
minuto,
0,
0
)

if (alvo <= agora.getTime())
alvo += 86400000

return alvo
}

const ativo = grupo => {
const dados = ler()
const item = dados[String(grupo || '')]

return item && item.ativo === true
? item
: null
}

const criar = ({
grupo,
premio,
hora,
vencedores,
limite,
emoji,
criadoPor,
mensagemId
} = {}) => {
const id = String(grupo || '').trim()
const quando = horarioParaMs(hora)

if (
!id.endsWith('@g.us') ||
!quando ||
!String(premio || '').trim() ||
!Number.isInteger(Number(vencedores)) ||
Number(vencedores) < 1 ||
!String(emoji || '').trim() ||
!String(mensagemId || '').trim()
) {
return {
ok: false,
motivo: 'invalido'
}
}

const dados = ler()

if (dados[id]?.ativo === true) {
return {
ok: false,
motivo: 'ativo',
item: dados[id]
}
}

const limiteFinal =
limite === 'all'
? 'all'
: Number(limite)

if (
limiteFinal !== 'all' &&
(
!Number.isInteger(limiteFinal) ||
limiteFinal < Number(vencedores)
)
) {
return {
ok: false,
motivo: 'limite'
}
}

const item = {
ativo: true,
grupo: id,
premio: String(premio).slice(0, 4000),
hora: String(hora),
quando,
vencedores: Number(vencedores),
limite: limiteFinal,
emoji: String(emoji),
criadoPor: normalizar(criadoPor),
mensagemId: String(mensagemId),
participantes: [],
criadoEm: Date.now()
}

dados[id] = item
salvar(dados)

return {
ok: true,
item
}
}

const cancelar = grupo => {
const dados = ler()
const id = String(grupo || '')

if (!dados[id])
return false

delete dados[id]
salvar(dados)
return true
}

const reagir = ({
grupo,
mensagemId,
usuario,
emoji
} = {}) => {
const dados = ler()
const item = dados[String(grupo || '')]

if (
!item ||
item.ativo !== true ||
String(item.mensagemId) !== String(mensagemId || '')
) {
return {
ok: false,
motivo: 'nao'
}
}

const jid = normalizar(usuario)

if (!jid || !jid.endsWith('@s.whatsapp.net')) {
return {
ok: false,
motivo: 'jid'
}
}

const indice =
item.participantes.indexOf(jid)

if (!String(emoji || '')) {
if (indice >= 0) {
item.participantes.splice(indice, 1)
salvar(dados)
}

return {
ok: true,
removido: indice >= 0,
item
}
}

if (String(emoji) !== String(item.emoji)) {
return {
ok: false,
motivo: 'emoji'
}
}

if (indice >= 0) {
return {
ok: true,
ja: true,
item
}
}

if (
item.limite !== 'all' &&
item.participantes.length >= Number(item.limite)
) {
return {
ok: false,
motivo: 'lotado',
item
}
}

item.participantes.push(jid)
salvar(dados)

return {
ok: true,
adicionado: true,
item
}
}

const embaralhar = lista => {
const copia = [...lista]

for (let i = copia.length - 1; i > 0; i--) {
const j = Math.floor(
Math.random() * (i + 1)
)

;[copia[i], copia[j]] =
[copia[j], copia[i]]
}

return copia
}

const finalizar = async (
tokito,
grupo,
item
) => {
const participantes =
Array.isArray(item.participantes)
? [...new Set(item.participantes.map(normalizar).filter(Boolean))]
: []

const quantidade =
Math.min(
Number(item.vencedores || 1),
participantes.length
)

const vencedores =
embaralhar(participantes)
.slice(0, quantidade)

if (!vencedores.length) {
await tokito.sendMessage(
grupo,
{
text:
`- 🎁 \`𝚂𝙾𝚁𝚃𝙴𝙸𝙾 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙾\`

> 🎁 ׄ ( ᴘʀᴇ̂ᴍɪᴏ: ${item.premio} )
> 👥 ׄ ( ɴɪɴɢᴜᴇ́ᴍ ᴘᴀʀᴛɪᴄɪᴘᴏᴜ ᴅᴏ sᴏʀᴛᴇɪᴏ. )`
}
).catch(() => {})

return
}

const linhas =
vencedores
.map((jid, i) =>
`> 🏆 ׄ ( ${i + 1}. @${jid.split('@')[0]} )`
)
.join('\n')

await tokito.sendMessage(
grupo,
{
text:
`- 🎁 \`𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾 𝙳𝙾 𝚂𝙾𝚁𝚃𝙴𝙸𝙾\`

> 🎁 ׄ ( ᴘʀᴇ̂ᴍɪᴏ: ${item.premio} )
> 👥 ׄ ( ᴘᴀʀᴛɪᴄɪᴘᴀɴᴛᴇs: ${participantes.length} )

${linhas}`,
mentions: vencedores
}
).catch(() => {})
}

let executando = false

const processar = async tokito => {
if (executando || !tokito)
return

executando = true

try {
const dados = ler()
const agora = Date.now()
let mudou = false

for (const [grupo, item] of Object.entries(dados)) {
if (
!item ||
item.ativo !== true ||
Number(item.quando || 0) > agora
) {
continue
}

item.ativo = false
salvar(dados)

await finalizar(
tokito,
grupo,
item
)

delete dados[grupo]
mudou = true
}

if (mudou)
salvar(dados)
}
finally {
executando = false
}
}

const iniciar = tokito => {
global.__TOKITO_SORTEIO_SOCKET__ = tokito

if (global.__TOKITO_SORTEIO_INTERVAL__)
return

global.__TOKITO_SORTEIO_INTERVAL__ =
setInterval(
() => {
processar(
global.__TOKITO_SORTEIO_SOCKET__
).catch(() => {})
},
10000
)

global.__TOKITO_SORTEIO_INTERVAL__.unref?.()

processar(tokito).catch(() => {})
}

module.exports = {
ARQUIVO,
ativo,
criar,
cancelar,
reagir,
processar,
iniciar,
horarioParaMs
}
