/*
 * Tokito Bot V10 - Promoções temporárias
 * Author: Dylan Modz
 */

const fs = require('fs')
const path = require('path')
const runtime = require('../sub/runtime.js')

const ARQUIVO = path.join(runtime.baseDir, 'sistemas', 'promocoes.json')
let socket = null
let executando = false

const garantir = () => {
runtime.ensure(path.dirname(ARQUIVO))
if (!fs.existsSync(ARQUIVO))
fs.writeFileSync(ARQUIVO, '[]\n')
}

const ler = () => {
garantir()
try {
const dados = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'))
return Array.isArray(dados) ? dados : []
}
catch {
return []
}
}

const salvar = dados => {
garantir()
const tmp = `${ARQUIVO}.${process.pid}.tmp`
fs.writeFileSync(tmp, JSON.stringify(dados || [], null, 2) + '\n')
fs.renameSync(tmp, ARQUIVO)
}

const normalizar = jid => {
const texto = String(jid || '').trim()
if (!texto) return ''
if (texto.includes('@')) {
const [usuario, servidor] = texto.split('@')
return `${usuario.split(':')[0]}@${servidor}`
}
const numero = texto.replace(/\D/g, '')
return numero ? `${numero}@s.whatsapp.net` : ''
}

const partesBR = data => {
const partes = new Intl.DateTimeFormat('pt-BR', {
timeZone: 'America/Fortaleza',
year: 'numeric',
month: '2-digit',
day: '2-digit',
hour: '2-digit',
minute: '2-digit',
hourCycle: 'h23'
}).formatToParts(data)
const mapa = {}
for (const parte of partes)
if (parte.type !== 'literal')
mapa[parte.type] = parte.value
return {
ano: Number(mapa.year),
mes: Number(mapa.month),
dia: Number(mapa.day),
hora: Number(mapa.hour),
minuto: Number(mapa.minute)
}
}

const intervalo = (inicio, fim) => {
const regex = /^([01]\d|2[0-3]):([0-5]\d)$/
const a = String(inicio || '').match(regex)
const b = String(fim || '').match(regex)
if (!a || !b) return null

const agora = new Date()
const p = partesBR(agora)

let inicioAt = Date.UTC(
p.ano, p.mes - 1, p.dia,
Number(a[1]) + 3, Number(a[2]), 0, 0
)

let fimAt = Date.UTC(
p.ano, p.mes - 1, p.dia,
Number(b[1]) + 3, Number(b[2]), 0, 0
)

if (fimAt <= inicioAt)
fimAt += 86400000

if (agora.getTime() >= fimAt) {
inicioAt += 86400000
fimAt += 86400000
}

return { inicioAt, fimAt }
}

const agendar = ({ grupo, usuario, inicio, fim, autor }) => {
const tempos = intervalo(inicio, fim)
const gid = String(grupo || '').trim()
const alvo = normalizar(usuario)

if (!gid.endsWith('@g.us') || !alvo || !tempos)
return { ok: false, motivo: 'invalido' }

const dados = ler().filter(item =>
!(item.grupo === gid && item.usuario === alvo && item.finalizado !== true)
)

const item = {
id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
grupo: gid,
usuario: alvo,
autor: normalizar(autor),
inicio: String(inicio),
fim: String(fim),
inicioAt: tempos.inicioAt,
fimAt: tempos.fimAt,
promovido: false,
finalizado: false,
criadoEm: Date.now()
}

dados.push(item)
salvar(dados)
processar().catch(() => {})
return { ok: true, item }
}

const enviar = async (grupo, texto, mentions = []) => {
if (!socket) return
await socket.sendMessage(grupo, { text: texto, mentions }).catch(() => {})
}

const processar = async () => {
if (!socket || executando) return
executando = true

try {
const dados = ler()
const agora = Date.now()
let mudou = false

for (const item of dados) {
if (!item || item.finalizado) continue

if (!item.promovido && agora >= Number(item.inicioAt || 0) && agora < Number(item.fimAt || 0)) {
try {
await socket.groupParticipantsUpdate(item.grupo, [item.usuario], 'promote')
item.promovido = true
item.promovidoEm = Date.now()
mudou = true
await enviar(
item.grupo,
`- 👑 \`𝙿𝚁𝙾𝙼𝙾𝙲̧𝙰̃𝙾 𝚃𝙴𝙼𝙿𝙾𝚁𝙰́𝚁𝙸𝙰\`\n\n> 👤 ׄ ( @${item.usuario.split('@')[0]} — ᴘʀᴏᴍᴏᴠɪᴅᴏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ. )\n> ⏰ ׄ ( ʀᴇʙᴀɪxᴀᴍᴇɴᴛᴏ: ${item.fim}. )`,
[item.usuario]
)
}
catch {
item.finalizado = true
item.erro = 'promote'
mudou = true
}
}

if (agora >= Number(item.fimAt || 0)) {
if (item.promovido) {
await socket.groupParticipantsUpdate(item.grupo, [item.usuario], 'demote').catch(() => {})
await enviar(
item.grupo,
`- 📉 \`𝙿𝚁𝙾𝙼𝙾𝙲̧𝙰̃𝙾 𝙵𝙸𝙽𝙰𝙻𝙸𝚉𝙰𝙳𝙰\`\n\n> 👤 ׄ ( @${item.usuario.split('@')[0]} — ᴏ ᴛᴇᴍᴘᴏ ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ ᴛᴇʀᴍɪɴᴏᴜ. )`,
[item.usuario]
)
}
item.finalizado = true
item.finalizadoEm = Date.now()
mudou = true
}
}

const ativos = dados.filter(item =>
!item.finalizado || Date.now() - Number(item.finalizadoEm || 0) < 86400000
)

if (mudou || ativos.length !== dados.length)
salvar(ativos)
}
finally {
executando = false
}
}

const iniciar = tokito => {
socket = tokito
global.__TOKITO_PROMOCOES_SOCKET__ = tokito
if (!global.__TOKITO_PROMOCOES_TIMER__) {
global.__TOKITO_PROMOCOES_TIMER__ = setInterval(() => {
processar().catch(() => {})
}, 5000)
global.__TOKITO_PROMOCOES_TIMER__.unref?.()
}
processar().catch(() => {})
}

module.exports = {
ARQUIVO,
agendar,
processar,
iniciar,
intervalo
}
