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

const { 'default': makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('baileys')
const { fs, path, pino, NodeCache, Boom, colors } = require('./database/lib/exports.js')
const antipay = require('./plugins/admin/filtro-antipay.js')

const pasta = path.join(__dirname, 'database', 'detector')

const logger = pino({ level: 'silent' })

const retry = new NodeCache()

let socket = null

let salvar = null

let estado = null

let principal = null

let iniciando = false

let reconectando = false

let conectado = false

if (!fs.existsSync(pasta))
fs.mkdirSync(pasta, { recursive: true })

const numero = jid => String(jid || '').split('@')[0].split(':')[0].replace(/\D/g, '')

const status = () => ({
conectado,
registrado: Boolean(estado?.creds?.registered),
numero: numero(socket?.user?.id || estado?.creds?.me?.id || ''),
pasta
})

const capturar = async (upsert) => {
if (!principal || !upsert?.messages?.length)
return
for (const info of upsert.messages) {
try {
const from = info?.key?.remoteJid || ''
if (!from.endsWith('@g.us'))
continue
if (info?.key?.fromMe)
continue
if (!info?.message)
continue
if (!antipay.detectar(info.message))
continue
await antipay.externo({
tokito: principal,
info,
detector: socket
})
}
catch (error) {
console.log(colors.red('[DETECTOR ANTI-PAY]'), error?.message || error)
}
}
}

const iniciar = async (tokito) => {
if (tokito)
principal = tokito
if (iniciando || socket)
return socket
iniciando = true
try {
const { version } = await fetchLatestBaileysVersion()
const auth = await useMultiFileAuthState(pasta)
estado = auth.state
salvar = auth.saveCreds
socket = makeWASocket({
version,
logger,
browser: ['Linux', 'Opera', '10.0.22631'],
auth: {
creds: estado.creds,
keys: makeCacheableSignalKeyStore(estado.keys, logger)
},
msgRetryCounterCache: retry,
mobile: false,
fireInitQueries: true,
markOnlineOnConnect: false,
generateHighQualityLinkPreview: false,
connectTimeoutMs: 20000,
keepAliveIntervalMs: 40000,
defaultQueryTimeoutMs: 60000,
retryRequestDelayMs: 5000,
maxMsgRetryCount: 5,
syncFullHistory: false,
downloadHistory: false,
emitOwnEvents: false,
shouldSyncHistoryMessage: () => false,
getMessage: async () => ({ conversation: 'Tokito Detector' })
})
socket.ev.process(async (events) => {
if (events['messages.upsert'])
await capturar(events['messages.upsert'])
if (events['creds.update'] && salvar)
await salvar()
if (events['connection.update']) {
const update = events['connection.update']
const code = update?.lastDisconnect?.error ? new Boom(update.lastDisconnect.error).output.statusCode : 0
if (update.connection === 'open') {
conectado = true
reconectando = false
// conexão silenciosa do detector
}
if (update.connection === 'close') {
conectado = false
socket = null
if (code === DisconnectReason.loggedOut || code === 401) {
console.log(colors.red('👁️ Detector Anti-Pay desconectado. Use o comando detector para conectar novamente.'))
return
}
if (!reconectando) {
reconectando = true
setTimeout(() => {
reconectando = false
iniciar(principal).catch(() => {
})
}, 5000)
}
}
}
})
return socket
}
finally {
iniciando = false
}
}

const parear = async (fone, tokito) => {
if (tokito)
principal = tokito
if (!socket)
await iniciar(principal)
const atual = status()
if (atual.registrado)
return {
conectado: atual.conectado,
registrado: true,
numero: atual.numero,
codigo: ''
}
const limpo = String(fone || '').replace(/\D/g, '')
if (limpo.length < 11 || limpo.length > 15)
throw new Error('numero')
const codigo = await socket.requestPairingCode(limpo)
return {
conectado: false,
registrado: false,
numero: limpo,
codigo
}
}

const sair = async () => {
try {
if (socket)
await socket.logout().catch(() => {
})
}
catch {
}
socket = null
conectado = false
estado = null
salvar = null
try {
fs.rmSync(pasta, {
recursive: true,
force: true
})
fs.mkdirSync(pasta, { recursive: true })
}
catch {
}
return true
}

module.exports = {
iniciar,
parear,
status,
sair,
capturar
}
