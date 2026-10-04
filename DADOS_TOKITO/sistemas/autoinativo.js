/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Auto remoção de membros inativos.
 * Author: Dylan Modz
 * ============================================================
 */

const fs = require('fs')
const path = require('path')
const mess = require('../mensagens/mensagens.js')

const INTERVALO = 30 * 60 * 1000
const TEMPO_PADRAO = 3 * 24 * 60 * 60 * 1000
const TEMPO_MINIMO = 60 * 60 * 1000
const TEMPO_MAXIMO = 30 * 24 * 60 * 60 * 1000

let socket = null
let pastaGrupos = ''
let donos = []
let timer = null
let ocupado = false

const normalizar = valor => {
let texto = String(valor || '').trim()
if (!texto) return ''
if (texto.endsWith('@c.us')) texto = texto.replace('@c.us', '@s.whatsapp.net')
if (texto.includes(':') && texto.includes('@'))
texto = `${texto.split(':')[0]}@${texto.split('@')[1]}`
return texto
}

const numero = valor => String(normalizar(valor))
.split('@')[0]
.replace(/\D/g, '')

const mesmo = (a, b) => {
const x = normalizar(a)
const y = normalizar(b)
if (x && y && x === y) return true

const nx = numero(x)
const ny = numero(y)
return Boolean(nx && ny && nx === ny)
}

const jidMembro = membro => {
const candidatos = [
membro?.phoneNumber,
membro?.participantAlt,
membro?.participantPn,
membro?.jid,
membro?.id,
membro?.participant,
membro?.lid,
membro
].filter(Boolean)

return candidatos
.map(normalizar)
.find(jid => jid.endsWith('@s.whatsapp.net')) ||
candidatos.map(normalizar).find(Boolean) ||
''
}

const ler = arquivo => {
try {
const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'))
return Array.isArray(dados) ? dados : [dados]
} catch {
return null
}
}

const salvar = (arquivo, dados) => {
try {
const temporario = arquivo + '.tmp'
fs.writeFileSync(temporario, JSON.stringify(dados, null, 2) + '\n')
fs.renameSync(temporario, arquivo)
return true
} catch {
return false
}
}

const tempoSeguro = valor => {
const n = Number(valor)
if (!Number.isFinite(n)) return TEMPO_PADRAO
return Math.max(TEMPO_MINIMO, Math.min(TEMPO_MAXIMO, Math.floor(n)))
}

const textoTempo = ms => {
let total = Math.max(0, Math.floor(Number(ms || 0) / 1000))
const dias = Math.floor(total / 86400)
total %= 86400
const horas = Math.floor(total / 3600)
total %= 3600
const minutos = Math.floor(total / 60)

const partes = []
if (dias) partes.push(`${dias} dia${dias === 1 ? '' : 's'}`)
if (horas) partes.push(`${horas} hora${horas === 1 ? '' : 's'}`)
if (!dias && minutos) partes.push(`${minutos} minuto${minutos === 1 ? '' : 's'}`)
return partes.slice(0, 2).join(' e ') || 'menos de 1 minuto'
}

const donoProtegido = jid => {
const n = numero(jid)
return Boolean(n && donos.some(item => numero(item) === n))
}

const botDoGrupo = (participantes, tokito) => {
const idsBot = [tokito?.user?.id, tokito?.user?.lid].filter(Boolean)
return participantes.find(membro => {
const ids = [
membro?.phoneNumber,
membro?.participantAlt,
membro?.participantPn,
membro?.jid,
membro?.id,
membro?.participant,
membro?.lid
].filter(Boolean)

return ids.some(id => idsBot.some(bot => mesmo(id, bot)))
})
}

const processarGrupo = async (arquivo, dados) => {
if (!socket || !dados?.[0]) return

const grupo = dados[0]
const cfg = grupo?.funcoes?.autoinativo

if (!cfg || cfg.ativo !== true) return

const gid = String(grupo.groupId || path.basename(arquivo, '.json') || '').trim()
if (!gid.endsWith('@g.us')) return

const metadata = await socket.groupMetadata(gid).catch(() => null)
if (!metadata?.id) return

const participantes = Array.isArray(metadata.participants) ? metadata.participants : []
const bot = botDoGrupo(participantes, socket)

if (!bot || !['admin', 'superadmin'].includes(bot.admin)) return

if (!grupo.atividades || typeof grupo.atividades !== 'object' || Array.isArray(grupo.atividades))
grupo.atividades = {}

const agora = Date.now()
const limite = tempoSeguro(cfg.tempoMs)
const inicio = Number(cfg.iniciadoEm) > 0 ? Number(cfg.iniciadoEm) : agora
let mudou = false

if (!Number(cfg.iniciadoEm)) {
cfg.iniciadoEm = agora
mudou = true
}

if (Number(cfg.tempoMs) !== limite) {
cfg.tempoMs = limite
mudou = true
}

for (const membro of participantes) {
const jid = jidMembro(membro)
if (!jid) continue
if (['admin', 'superadmin'].includes(membro?.admin)) continue
if (donoProtegido(jid)) continue
if ([socket.user?.id, socket.user?.lid].some(botJid => mesmo(jid, botJid))) continue

const atividade = grupo.atividades[jid] && typeof grupo.atividades[jid] === 'object'
? grupo.atividades[jid]
: null

if (!atividade || !Number(atividade.ultima)) {
grupo.atividades[jid] = {
...(atividade || {}),
total: Number(atividade?.total || 0),
comandos: Number(atividade?.comandos || 0),
figus: Number(atividade?.figus || 0),
imagens: Number(atividade?.imagens || 0),
videos: Number(atividade?.videos || 0),
audios: Number(atividade?.audios || 0),
documentos: Number(atividade?.documentos || 0),
ultima: Math.max(inicio, agora)
}
mudou = true
continue
}

const ultima = Number(atividade.ultima)
const ausente = agora - ultima

if (ausente < limite) continue

let removido = false

try {
const retorno = await socket.groupParticipantsUpdate(gid, [jid], 'remove')
if (Array.isArray(retorno) && retorno.length) {
const status = Number(retorno[0]?.status || retorno[0]?.content?.status || 0)
removido = !status || (status >= 200 && status < 300)
} else {
removido = true
}
} catch {
removido = false
}

if (!removido) continue

delete grupo.atividades[jid]
mudou = true

await socket.sendMessage(gid, {
text: mess.autoInativoRemovido(
numero(jid),
textoTempo(limite),
textoTempo(ausente)
),
mentions: [jid],
contextInfo: {
mentionedJid: [jid]
}
}).catch(() => {})

await new Promise(resolve => setTimeout(resolve, 700))
}

if (mudou) salvar(arquivo, dados)
}

const processar = async () => {
if (!socket || !pastaGrupos || ocupado) return

ocupado = true

try {
if (!fs.existsSync(pastaGrupos)) return

const arquivos = fs.readdirSync(pastaGrupos)
.filter(nome => nome.endsWith('@g.us.json'))

for (const nome of arquivos) {
const arquivo = path.join(pastaGrupos, nome)
const dados = ler(arquivo)
if (!dados) continue

await processarGrupo(arquivo, dados).catch(() => {})
}
} finally {
ocupado = false
}
}

const iniciar = (tokito, opcoes = {}) => {
socket = tokito
pastaGrupos = String(opcoes.groupsDir || pastaGrupos || '')
donos = Array.isArray(opcoes.owners) ? opcoes.owners.filter(Boolean) : donos

setTimeout(() => {
processar().catch(() => {})
}, 15000).unref?.()

if (!timer) {
timer = setInterval(() => {
processar().catch(() => {})
}, INTERVALO)

timer.unref?.()
}
}

module.exports = {
iniciar,
processar,
tempoSeguro,
textoTempo,
TEMPO_PADRAO,
TEMPO_MINIMO,
TEMPO_MAXIMO
}
