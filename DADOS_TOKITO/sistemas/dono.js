/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Sistema de recursos globais do dono.
 * Author: Dylan Modz
 * ============================================================
 */

const fs = require('fs')
const path = require('path')

const ARQUIVO = path.join(
__dirname,
'..',
'database',
'sistemas',
'dono.json'
)

const PADRAO = {
anticall: false,
autoban: [],
vipGrupos: [],
agendamentos: [],
restart: {
ativo: false,
hora: null,
ultimaExecucao: null,
destino: null
},
pingFundo: ''
}

const garantir = () => {
const pasta = path.dirname(ARQUIVO)

if (!fs.existsSync(pasta))
fs.mkdirSync(pasta, { recursive: true })

if (!fs.existsSync(ARQUIVO))
fs.writeFileSync(
ARQUIVO,
JSON.stringify(PADRAO, null, 2) + '\n'
)
}

const lerBruto = () => {
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

const normalizarJid = valor => {
let texto = String(valor || '').trim()

if (!texto)
return ''

if (texto.endsWith('@g.us'))
return texto

if (texto.endsWith('@s.whatsapp.net'))
return texto

const numero = texto.replace(/\D/g, '')

if (!numero)
return ''

return `${numero}@s.whatsapp.net`
}

const normalizar = dados => {
const atual = dados && typeof dados === 'object'
? dados
: {}

return {
...PADRAO,
...atual,
anticall: atual.anticall === true,
autoban: [...new Set(
(Array.isArray(atual.autoban) ? atual.autoban : [])
.map(normalizarJid)
.filter(jid => jid.endsWith('@s.whatsapp.net'))
)],
vipGrupos: Array.isArray(atual.vipGrupos)
? atual.vipGrupos.filter(item =>
item &&
String(item.id || '').endsWith('@g.us')
)
: [],
agendamentos: Array.isArray(atual.agendamentos)
? atual.agendamentos.filter(item =>
item &&
Number.isFinite(Number(item.quando))
)
: [],
restart: {
...PADRAO.restart,
...(atual.restart && typeof atual.restart === 'object'
? atual.restart
: {})
},
pingFundo: String(atual.pingFundo || '')
}
}

const salvar = dados => {
garantir()

const final = normalizar(dados)
const tmp = `${ARQUIVO}.${process.pid}.tmp`

fs.writeFileSync(
tmp,
JSON.stringify(final, null, 2) + '\n'
)

fs.renameSync(tmp, ARQUIVO)

return final
}

const limparVipGrupos = dados => {
const agora = Date.now()
const antes = dados.vipGrupos.length

dados.vipGrupos = dados.vipGrupos.filter(item => {
if (item?.infinito === true)
return true

const expira = new Date(item?.expiraEm || 0).getTime()
return Number.isFinite(expira) && expira > agora
})

return antes !== dados.vipGrupos.length
}

const config = () => {
const dados = normalizar(lerBruto())

if (limparVipGrupos(dados))
salvar(dados)

return dados
}

const set = patch => {
const atual = config()

return salvar({
...atual,
...(patch || {})
})
}

const autobanTem = jid => {
const alvo = normalizarJid(jid)

if (!alvo)
return false

return config().autoban.includes(alvo)
}

const autobanAdicionar = jid => {
const alvo = normalizarJid(jid)
const dados = config()

if (!alvo || !alvo.endsWith('@s.whatsapp.net'))
return { ok: false, motivo: 'invalido' }

if (dados.autoban.includes(alvo))
return { ok: false, motivo: 'ja', alvo }

dados.autoban.push(alvo)
salvar(dados)

return { ok: true, alvo }
}

const autobanRemover = jid => {
const alvo = normalizarJid(jid)
const dados = config()
const antes = dados.autoban.length

dados.autoban = dados.autoban.filter(item => item !== alvo)

if (dados.autoban.length === antes)
return { ok: false, motivo: 'nao', alvo }

salvar(dados)

return { ok: true, alvo }
}

const listaAutoban = () => config().autoban

const vipGrupoAtivo = id => {
const grupo = String(id || '').trim()

if (!grupo.endsWith('@g.us'))
return false

return config().vipGrupos.some(item => item.id === grupo)
}

const adicionarVipGrupo = ({
id,
nome = 'Grupo',
dias = 0
} = {}) => {
const grupo = String(id || '').trim()
const quantidade = Number(dias)

if (!grupo.endsWith('@g.us'))
return { ok: false, motivo: 'grupo' }

if (!Number.isInteger(quantidade) || quantidade < 0)
return { ok: false, motivo: 'dias' }

const dados = config()
const agora = Date.now()
const infinito = quantidade === 0
let item = dados.vipGrupos.find(v => v.id === grupo)

if (!item) {
item = {
id: grupo,
nome: String(nome || 'Grupo'),
infinito,
dias: quantidade,
expiraEm: infinito
? null
: new Date(
agora + quantidade * 86400000
).toISOString()
}

dados.vipGrupos.push(item)
}
else {
item.nome = String(nome || item.nome || 'Grupo')

if (infinito) {
item.infinito = true
item.dias = 0
item.expiraEm = null
}
else if (item.infinito === true) {
return {
ok: false,
motivo: 'infinito',
item
}
}
else {
const atual = new Date(item.expiraEm || 0).getTime()
const inicio = atual > agora ? atual : agora

item.infinito = false
item.expiraEm = new Date(
inicio + quantidade * 86400000
).toISOString()

item.dias = Math.ceil(
(new Date(item.expiraEm).getTime() - agora) /
86400000
)
}
}

salvar(dados)

return {
ok: true,
item
}
}

const removerVipGrupo = id => {
const grupo = String(id || '').trim()
const dados = config()
const antes = dados.vipGrupos.length

dados.vipGrupos =
dados.vipGrupos.filter(
item => item.id !== grupo
)

if (dados.vipGrupos.length === antes)
return {
ok: false,
motivo: 'nao'
}

salvar(dados)

return { ok: true }
}

const listarVipGrupos = () => config().vipGrupos

const adicionarAgenda = ({
quando,
descricao,
destino
} = {}) => {
const tempo = Number(quando)
const texto = String(descricao || '').trim()
const jid = normalizarJid(destino)

if (
!Number.isFinite(tempo) ||
tempo <= Date.now() ||
!texto ||
!jid
) {
return {
ok: false,
motivo: 'invalido'
}
}

const dados = config()

const item = {
id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
quando: tempo,
descricao: texto.slice(0, 1000),
destino: jid,
criadoEm: Date.now()
}

dados.agendamentos.push(item)
salvar(dados)

return {
ok: true,
item
}
}

const listarAgendas = () => (
config().agendamentos
.slice()
.sort((a, b) =>
Number(a.quando) -
Number(b.quando)
)
)

const removerAgenda = referencia => {
const dados = config()
const lista = dados.agendamentos
.slice()
.sort((a, b) =>
Number(a.quando) -
Number(b.quando)
)

let item = null
const indice = Number(referencia)

if (
Number.isInteger(indice) &&
indice >= 1 &&
indice <= lista.length
) {
item = lista[indice - 1]
}
else {
item = lista.find(v =>
String(v.id) === String(referencia)
)
}

if (!item)
return {
ok: false,
motivo: 'nao'
}

dados.agendamentos =
dados.agendamentos.filter(
v => v.id !== item.id
)

salvar(dados)

return {
ok: true,
item
}
}

const setRestart = ({
ativo,
hora = null,
destino = null
} = {}) => {
const dados = config()

dados.restart = {
...dados.restart,
ativo: ativo === true,
hora: ativo === true ? String(hora || '') : null,
destino: destino ? normalizarJid(destino) : dados.restart.destino
}

if (!dados.restart.ativo)
dados.restart.ultimaExecucao = null

salvar(dados)

return dados.restart
}

const partesBrasil = data => {
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
)
.formatToParts(data)

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

const chaveDiaBrasil = data => {
const p = partesBrasil(data)
return `${p.ano}-${String(p.mes).padStart(2, '0')}-${String(p.dia).padStart(2, '0')}`
}

const proximoRestart = () => {
const dados = config()

if (
!dados.restart?.ativo ||
!/^([01]\d|2[0-3]):[0-5]\d$/.test(
String(dados.restart.hora || '')
)
) {
return null
}

const agora = new Date()
const p = partesBrasil(agora)
const [h, m] = dados.restart.hora
.split(':')
.map(Number)

let alvo = Date.UTC(
p.ano,
p.mes - 1,
p.dia,
h + 3,
m,
0,
0
)

if (alvo <= agora.getTime())
alvo += 86400000

return alvo
}

const processarAgendas = async tokito => {
const dados = config()
const agora = Date.now()
let mudou = false

for (const item of [...dados.agendamentos]) {
if (Number(item.quando) > agora)
continue

try {
await tokito.sendMessage(
item.destino,
{
text: `- ⏰ \`𝙰𝙶𝙴𝙽𝙳𝙰𝙼𝙴𝙽𝚃𝙾\`

> 🔔 ׄ ( ${item.descricao} )
> ✅ ׄ ( ᴏ ʜᴏʀᴀ́ʀɪᴏ ᴀɢᴇɴᴅᴀᴅᴏ ᴄʜᴇɢᴏᴜ. )`
}
)

dados.agendamentos =
dados.agendamentos.filter(
v => v.id !== item.id
)

mudou = true
}
catch {
}
}

if (mudou)
salvar(dados)
}

const processarRestart = async tokito => {
const dados = config()
const restart = dados.restart || {}

if (
!restart.ativo ||
!/^([01]\d|2[0-3]):[0-5]\d$/.test(
String(restart.hora || '')
)
) {
return
}

const agora = new Date()
const p = partesBrasil(agora)
const horaAtual =
`${String(p.hora).padStart(2, '0')}:${String(p.minuto).padStart(2, '0')}`

if (horaAtual !== restart.hora)
return

const hoje = chaveDiaBrasil(agora)

if (restart.ultimaExecucao === hoje)
return

dados.restart.ultimaExecucao = hoje
salvar(dados)

if (restart.destino) {
await tokito.sendMessage(
restart.destino,
{
text: `- 🔄 \`𝚁𝙴𝙸𝙽𝙸́𝙲𝙸𝙾 𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙰𝙳𝙾\`

> ⏰ ׄ ( ʜᴏʀᴀ́ʀɪᴏ: ${restart.hora} )
> 🔄 ׄ ( ʀᴇɪɴɪᴄɪᴀɴᴅᴏ ᴏ ʙᴏᴛ. )`
}
).catch(() => {})
}

setTimeout(() => {
process.exit(20)
}, 1200).unref?.()
}

const iniciar = tokito => {
global.__TOKITO_DONO_SOCKET__ = tokito

if (global.__TOKITO_DONO_INTERVAL__)
return

global.__TOKITO_DONO_INTERVAL__ =
setInterval(
async () => {
const socket =
global.__TOKITO_DONO_SOCKET__

if (!socket)
return

await processarAgendas(socket)
await processarRestart(socket)
},
30000
)

global.__TOKITO_DONO_INTERVAL__.unref?.()
}

const processarChamadas = async (
tokito,
chamadas,
donos = []
) => {
const dados = config()

if (!dados.anticall)
return false

const protegidos = new Set(
(donos || [])
.map(normalizarJid)
.filter(Boolean)
)

const bot = normalizarJid(
tokito?.user?.id || ''
)

if (bot)
protegidos.add(bot)

let bloqueou = false

for (const chamada of (
Array.isArray(chamadas)
? chamadas
: [chamadas]
)) {
const status =
String(chamada?.status || '').toLowerCase()

if (
!['offer', 'ringing'].includes(status)
) {
continue
}

const origem = normalizarJid(
chamada?.from ||
chamada?.chatId ||
chamada?.peerJid
)

if (
!origem ||
protegidos.has(origem)
) {
continue
}

try {
if (
typeof tokito.rejectCall === 'function' &&
chamada?.id
) {
await tokito.rejectCall(
chamada.id,
origem
).catch(() => {})
}

await tokito.sendMessage(
origem,
{
text: `- 📵 \`𝙰𝙽𝚃𝙸 𝙲𝙰𝙻𝙻\`

> ⚠️ ׄ ( ᴄʜᴀᴍᴀᴅᴀs ɴᴀ̃ᴏ sᴀ̃ᴏ ᴘᴇʀᴍɪᴛɪᴅᴀs ɴᴇsᴛᴇ ʙᴏᴛ. )
> 🔒 ׄ ( ᴇsᴛᴇ ɴᴜ́ᴍᴇʀᴏ sᴇʀᴀ́ ʙʟᴏǫᴜᴇᴀᴅᴏ. )`
}
).catch(() => {})

if (
typeof tokito.updateBlockStatus === 'function'
) {
await tokito.updateBlockStatus(
origem,
'block'
).catch(() => {})
}

bloqueou = true
}
catch {
}
}

return bloqueou
}

module.exports = {
ARQUIVO,
normalizarJid,
config,
set,
salvar,
autobanTem,
autobanAdicionar,
autobanRemover,
listaAutoban,
vipGrupoAtivo,
adicionarVipGrupo,
removerVipGrupo,
listarVipGrupos,
adicionarAgenda,
listarAgendas,
removerAgenda,
setRestart,
proximoRestart,
iniciar,
processarChamadas
}
