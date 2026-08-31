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

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('baileys')
const { fs, path, util, NodeCache, colors, pino, readline, Boom, estado, banner2, banner3, mess, nescessario } = require('./database/lib/exports.js')
const funcoes = require('./sistemas/funcoes.js')
const detector = require('./detector.js')
const qrcodeTerminal = require('qrcode-terminal')
const dadosSistema = require('./sistemas/dados.js')
const placar = require('./database/lib/placar.js')

const CONFIG_FILE = path.join(__dirname, 'INFO_DADOS', 'config-all.json')
const qrcode = path.join(__dirname, 'database', 'qrcode')
const grupos = path.join(__dirname, 'database', 'grupos', 'ATIVAÇÕES-TOKITO')
const logger = pino({ level: 'silent' })

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = text => new Promise(resolve => rl.question(text, resolve))

const msgRetryCounterCache = new NodeCache()
const fotos = new NodeCache({ stdTTL: 1800, checkperiod: 60 })
const correcoesAntirroubo = new Map()

let NomeDoBot = 'TokitoBot-MD'
let ownerName = 'Dylan Modz'
let prefix = '!'
let channel = ''
let channeldl = '0@newsletter'
let ownerNumber = ''
let CREDENTIALS_USER = {}
let API_URL = 'https://tokito-apis.com.br'
let API_KEY_TOKITO = ''
let TOKEN_SALA = ''
let TOKEN_LIKE_FF = ''
let iniciando = false, reconectando = false, metodo = null, ultimoQr = null
let processarMensagemTokito = null

if (!fs.existsSync(qrcode)) fs.mkdirSync(qrcode, { recursive: true })
if (!fs.existsSync(grupos)) fs.mkdirSync(grupos, { recursive: true })

const lerConfigBot = () => {
try {
return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
} catch {
return {}
}
}

const recarregarConfigBot = () => {
const config = lerConfigBot()
NomeDoBot = String(config.NomeDoBot || 'TokitoBot-MD')
ownerName = String(config.ownerName || 'Dylan Modz')
prefix = String(config.prefix || '!')
channel = String(config.channel || '')
channeldl = String(config.channeldl || '0@newsletter')
ownerNumber = String(config.ownerNumber || '')
CREDENTIALS_USER = config.CREDENTIALS_USER && typeof config.CREDENTIALS_USER === 'object' ? config.CREDENTIALS_USER : {}
API_URL = String(config.API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, '')
API_KEY_TOKITO = String(config.API_KEY_TOKITO || '')
TOKEN_SALA = String(config.TOKEN_SALA || '')
TOKEN_LIKE_FF = String(config.TOKEN_LIKE_FF || '')
return config
}

const salvarConfigBot = config => {
fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n')
recarregarConfigBot()
try { delete require.cache[require.resolve('./INFO_DADOS/config-all.json')] } catch {}
try { delete require.cache[require.resolve('./database/lib/exports.js')] } catch {}
return config
}

recarregarConfigBot()

function collectNumbers(inputString) {
return String(inputString || '').replace(/\D/g, '')
}

function normalizarJid(jid) {
let texto = String(jid || '').trim()
if (!texto) return ''
if (texto.endsWith('@c.us')) texto = texto.replace('@c.us', '@s.whatsapp.net')
if (texto.includes(':') && texto.includes('@')) texto = `${texto.split(':')[0]}@${texto.split('@')[1]}`
if (texto.includes('@')) return texto
const numero = collectNumbers(texto)
return numero ? `${numero}@s.whatsapp.net` : ''
}

function numeroDoJid(jid) {
return collectNumbers(String(jid || '').split('@')[0].split(':')[0])
}

function ocultarSegredos(texto) {
let final = String(texto || '')
final = final
.replace(/([?&]apikey=)[^&\s]+/gi, '$1***')
.replace(/([?&]api_key=)[^&\s]+/gi, '$1***')
.replace(/([?&]key=)[^&\s]+/gi, '$1***')
.replace(/([?&]token=)[^&\s]+/gi, '$1***')
.replace(/(authorization:\s*bearer\s+)[^\s]+/gi, '$1***')
if (API_KEY_TOKITO) final = final.split(String(API_KEY_TOKITO)).join('***')
if (TOKEN_SALA) final = final.split(String(TOKEN_SALA)).join('***')
if (TOKEN_LIKE_FF) final = final.split(String(TOKEN_LIKE_FF)).join('***')
return final
}

const info = texto => console.log(colors.bgRed.white.bold(' INFO - TOKITO ') + colors.white(` - ${texto}`))
const sucesso = texto => console.log(colors.bgGreen.black.bold(' OK - TOKITO ') + colors.white(` - ${texto}`))
const aviso = texto => console.log(colors.bgYellow.black.bold(' AVISO - TOKITO ') + colors.white(` - ${texto}`))
const erro = texto => console.log(colors.bgRed.white.bold(' ERRO - TOKITO ') + colors.white(` - ${ocultarSegredos(texto)}`))

const erroSistema = (titulo, error) => {
const mensagem = error?.message || error || 'Erro desconhecido'
erro(`${titulo}: ${ocultarSegredos(mensagem)}`)
}

const originalConsoleError = console.error
const originalConsoleWarn = console.warn
const originalConsoleInfo = console.info

const forbiddenStrings = [
'Failed to decrypt message with any known session',
'Bad MAC Error',
'Bad MAC',
'SessionCipher.decryptWithSessions',
'verifyMAC',
'Closing session: SessionEntry',
'Removing old closed session: SessionEntry {',
'Closing stale open session for new outgoing prekey bundle'
]

console.error = function() {
const message = ocultarSegredos(util.format(...arguments))
if (forbiddenStrings.some(str => message.includes(str))) return
originalConsoleError.call(console, message)
}

console.warn = function() {
const message = ocultarSegredos(util.format(...arguments))
if (forbiddenStrings.some(str => message.includes(str))) return
originalConsoleWarn.call(console, message)
}

console.info = function() {
const message = ocultarSegredos(util.format(...arguments))
if (forbiddenStrings.some(str => message.includes(str))) return
originalConsoleInfo.call(console, message)
}

const canalInfo = (mentions = []) => ({
mentionedJid: mentions,
...(channeldl && channeldl !== '0@newsletter' ? {
isForwarded: true,
forwardingScore: 1,
forwardedNewsletterMessageInfo: {
newsletterJid: channeldl,
newsletterName: NomeDoBot,
serverMessageId: ''
}
} : {})
})

const UPDATE_CHECK_MS = 3 * 60 * 60 * 1000

const textoAvisoUpdate = check => {
const remoto = check?.remote || {}
const mudancas = Array.isArray(remoto.changelog)
? remoto.changelog.slice(0, 8)
: []

const lista = mudancas.length
? mudancas.map(item => `> • ${String(item || '').trim()}`).join('\n')
: '> • Melhorias, correções e novidades da Tokito.'

const obrigatoria = remoto.required === true
? '\n\n> ⚠️ *Esta atualização foi marcada como importante.*'
: ''

return `- 🧊 \`𝚃𝙾𝙺𝙸𝚃𝙾 𝚄𝙿𝙳𝙰𝚃𝙴\`

> *Uma nova atualização da Tokito está disponível para você.*

*📦 | SUA VERSÃO:* ${check?.local?.version || '—'}
*✨ | NOVA VERSÃO:* ${remoto.version || '—'}
*📌 | ${String(remoto.title || remoto.notice || 'Nova atualização disponível').trim()}*

${lista}${obrigatoria}

> *Para ver os detalhes:* \`${prefix}update info\`
> *Para atualizar:* \`${prefix}update start\`

_Se preferir pelo terminal, use_ \`npm start up\`.`
}

const verificarAvisoUpdate = async tokito => {
try {
const check = await dadosSistema.verificarUpdate()

if (!check?.ok || !check.available) return false
if (check.remote?.notify === false) return false

const version = String(check.remote?.version || '').trim()
if (!version || !dadosSistema.deveAvisarUpdate(version)) return false

const dono = normalizarJid(ownerNumber)
if (!dono) return false

await tokito.sendMessage(dono, {
text: textoAvisoUpdate(check),
mentions: [dono],
contextInfo: canalInfo([dono])
})

dadosSistema.registrarAvisoUpdate(version)
return true
} catch {
return false
}
}

const iniciarAvisosUpdate = tokito => {
global.__TOKITO_UPDATE_SOCKET__ = tokito

setTimeout(() => {
verificarAvisoUpdate(global.__TOKITO_UPDATE_SOCKET__).catch(() => {})
}, 3500).unref?.()

if (global.__TOKITO_UPDATE_NOTICE_TIMER__) return

global.__TOKITO_UPDATE_NOTICE_TIMER__ = setInterval(() => {
const socketAtual = global.__TOKITO_UPDATE_SOCKET__
if (socketAtual) verificarAvisoUpdate(socketAtual).catch(() => {})
}, UPDATE_CHECK_MS)

global.__TOKITO_UPDATE_NOTICE_TIMER__.unref?.()
}

async function startPairing(tokito) {
console.log('')
const phoneNumber = await question(colors.white('╰━━➤ Digite o número com DDI: '))
const numerosColetados = collectNumbers(phoneNumber)
if (!numerosColetados || numerosColetados.length < 11) {
erro('Número inválido. Exemplo: 5511999999999')
return startPairing(tokito)
}
try {
info('Gerando código de conexão...')
const code = await tokito.requestPairingCode(numerosColetados)
console.log('')
topoPainel("❪🧊.ꯧ𝙲𝙾́𝙳𝙸𝙶𝙾 𝙳𝙴 𝙲𝙾𝙽𝙴𝚇𝙰̃𝙾ꯧ⸼🧊❫")
console.log(colors.cyan("├̟⊹ 🔐 ") + colors.white(`〔 ${code} 〕`))
fimPainel()
console.log('')
info('Abra o WhatsApp > Aparelhos conectados > Conectar com número de telefone.')
console.log('')
} catch (error) {
erroSistema('Não foi possível gerar o código de conexão', error)
}
}

async function openWhatsappSupport() {
const numero = collectNumbers(ownerNumber)
console.log('')
topoPainel("❪🧊.ꯧ𝚂𝚄𝙿𝙾𝚁𝚃𝙴 𝚃𝙾𝙺𝙸𝚃𝙾ꯧ⸼🧊❫")
console.log(colors.cyan("├̟⊹ 🌊 ") + colors.white(`https://wa.me/${numero || '5511975431163'}`))
fimPainel()
console.log('')
}

const mostrarValor = (chave, valor) => {
const texto = String(valor || '')
if (!texto) return colors.gray('Não configurado')
if (['API_KEY_TOKITO', 'TOKEN_SALA', 'TOKEN_LIKE_FF'].includes(chave)) {
if (texto === '.') return colors.gray('.')
if (texto.length <= 10) return colors.green('Configurado')
return colors.green(`${texto.slice(0, 6)}••••${texto.slice(-4)}`)
}
return colors.white(texto)
}

const tokenValido = token => /^tokito_/i.test(String(token || '').trim())

const topoPainel = titulo => {
console.log(colors.cyan(titulo))
console.log(colors.cyan("┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓"))
}

const fimPainel = () => console.log(colors.cyan("┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛"))

const linhaPainel = (numero, icone, texto) => {
console.log(colors.cyan(`├̟⊹ ${icone} `) + colors.white(`〔 ${numero} 〕`) + colors.red(" ➢ ") + colors.white(texto))
}

async function editarCampoBot(chave, titulo, opcoes = {}) {
const config = lerConfigBot()
const atual = config[chave] ?? ''
console.log('')
info(`${titulo} atual: ${mostrarValor(chave, atual)}`)
if (opcoes.ponto) console.log(colors.gray('Digite . caso não queira configurar este campo.'))
console.log(colors.gray('Apenas pressione Enter para manter o valor atual.'))
let valor = await question(colors.white.bold('╰━━➤ '))
valor = String(valor ?? '').trim()
if (!valor) {
aviso('Nenhuma alteração realizada.')
return false
}
if (chave === 'ownerNumber') {
valor = collectNumbers(valor)
if (valor.length < 10) {
erro('Número inválido. Digite com DDI e DDD.')
return false
}
}
if (chave === 'prefix' && valor.length > 4) {
erro('Prefixo muito grande. Use até 4 caracteres.')
return false
}
if (chave === 'API_KEY_TOKITO' && !tokenValido(valor)) {
erro('Token da API inválido. O token deve começar com tokito_.')
return false
}
config[chave] = valor
salvarConfigBot(config)
sucesso(`${titulo} atualizado com sucesso.`)
return true
}

async function editarBot() {
while (true) {
recarregarConfigBot()
console.log('')
topoPainel("❪🧊.ꯧ𝙴𝙳𝙸𝚃𝙰𝚁 𝙿𝙰𝙸𝙽𝙴𝙻ꯧ⸼🧊❫")
linhaPainel('1', '🤖', 'Nome do bot')
linhaPainel('2', '👑', 'Nome do dono')
linhaPainel('3', '📱', 'Número do dono')
linhaPainel('4', '🧩', 'Prefixo do Bot')
linhaPainel('5', '🎮', 'Token de salas')
linhaPainel('6', '👍', 'Token de likes')
linhaPainel('0', '🔙', 'Voltar')
fimPainel()
console.log(colors.gray("• Os dados principais podem ser alterados quando quiser."))
console.log(colors.gray("• Se não usar Salas ou Likes, digite . nesses campos."))
console.log(colors.gray("• O acesso Tokito é configurado automaticamente ao iniciar o bot."))
console.log(colors.gray("• Ao editar qualquer campo, pressione Enter para manter o valor atual."))
console.log(colors.gray("ᴇsᴄᴏʟʜᴀ ᴏ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴇᴅɪᴛᴀʀ"))
let option = await question(colors.white.bold("╰━━➤ "))
option = option.trim()
if (option === '0') return
if (option === '1') await editarCampoBot('NomeDoBot', 'Nome do bot')
else if (option === '2') await editarCampoBot('ownerName', 'Nome do dono')
else if (option === '3') await editarCampoBot('ownerNumber', 'Número do dono')
else if (option === '4') await editarCampoBot('prefix', 'Prefixo')
else if (option === '5') await editarCampoBot('TOKEN_SALA', 'Token de salas', { ponto: true })
else if (option === '6') await editarCampoBot('TOKEN_LIKE_FF', 'Token de likes', { ponto: true })
else erro('Opção inválida. Escolha uma opção do painel.')
}
}


const tokenMascarado = token => {
const valor = String(token || '').trim()
if (!valor) return 'Não configurado'
if (valor.length < 14) return `${valor.slice(0, 4)}••••`
return `${valor.slice(0, 7)}••••••${valor.slice(-5)}`
}

const detalhesAcesso = acesso => {
const plano = acesso?.plan || acesso?.license?.plan || null
const nomePlano = plano?.nome || plano?.name || acesso?.license?.planName || 'Plano ativo'
const expira = acesso?.license?.planExpiresAt || plano?.expiresAt || plano?.expires_at || null

sucesso('Token confirmado com sucesso.')
sucesso(`Acesso liberado · ${nomePlano}`)
if (expira) {
const data = new Date(expira)
if (!Number.isNaN(data.getTime())) info(`Validade do plano: ${data.toLocaleString('pt-BR')}`)
}
info(`Token salvo: ${tokenMascarado(API_KEY_TOKITO)}`)
}

async function solicitarToken() {
console.log('')
aviso('Não foi possível iniciar o bot porque nenhum Token Tokito válido foi encontrado.')
console.log(colors.yellow.bold('⚠️  Seu token é pessoal. Não envie, compartilhe ou publique ele.'))
console.log(colors.gray('Se você ainda não possui um token, crie sua conta e ative um plano em:'))
console.log(colors.cyan('https://tokito-apis.com.br'))
console.log('')
info('Cole seu Token Tokito abaixo para liberar o acesso ao bot.')

while (true) {
let token = String(await question(colors.white.bold('╰━━➤ ')) || '').trim()

if (!tokenValido(token)) {
erro('Token inválido. Confira o token copiado no painel Tokito e tente novamente.')
continue
}

const config = lerConfigBot()
config.API_KEY_TOKITO = token
salvarConfigBot(config)

info('Verificando token e plano no servidor...')
const acesso = await placar.entrada()

if (acesso.allowed) {
detalhesAcesso(acesso)
return acesso
}

config.API_KEY_TOKITO = ''
salvarConfigBot(config)

erro(acesso.message || 'O token não possui acesso ativo ao Tokito Bot V10.')
if (acesso.online === false) {
aviso('Não foi possível confirmar o acesso no servidor agora. Verifique sua conexão e tente novamente.')
}
console.log(colors.gray('Você pode obter ou renovar seu acesso em https://tokito-apis.com.br'))
}
}

async function prepararAcesso() {
recarregarConfigBot()

if (!tokenValido(API_KEY_TOKITO)) {
return solicitarToken()
}

info('Verificando acesso ao Tokito Bot V10...')
const acesso = await placar.entrada()

if (acesso.allowed) {
if (acesso.online) sucesso(acesso.message || 'Acesso confirmado.')
else aviso(acesso.message || 'Servidor indisponível. Usando acesso local válido.')
return acesso
}

if (acesso.online === true) {
erro(acesso.message || 'O token salvo não possui um plano ativo.')
const config = lerConfigBot()
config.API_KEY_TOKITO = ''
salvarConfigBot(config)
return solicitarToken()
}

return acesso
}

async function showMenu() {
console.log('')
info('Escolha como deseja iniciar.')
console.log('')
topoPainel("❪🧊.ꯧ𝙿𝙰𝙸𝙽𝙴𝙻 𝙳𝙴 𝙲𝙾𝙽𝚃𝚁𝙾𝙻𝙴ꯧ⸼🧊❫")
linhaPainel('1', '📱', 'Código de conexão')
linhaPainel('2', '🧊', 'QR-Code WhatsApp')
linhaPainel('3', '🌊', 'Suporte / Ajuda')
linhaPainel('4', '⚙️', 'Editar bot')
fimPainel()
console.log(colors.gray("ᴇsᴄᴏʟʜᴀ ᴜᴍᴀ ᴏᴘᴄ̧ᴀ̃ᴏ ᴀʙᴀɪxᴏ"))
let option = await question(colors.white.bold("╰━━➤ "))
option = option.trim()
if (option === '1' || option === '2') {
recarregarConfigBot()
metodo = option === '1' ? 'codigo' : 'qr'
sucesso(option === '1' ? 'Conexão por código selecionada.' : 'Conexão por QR-Code selecionada.')
return metodo
}
if (option === '3') { await openWhatsappSupport(); return showMenu() }
if (option === '4') { await editarBot(); return showMenu() }
erro('Opção inválida. Escolha 1, 2, 3 ou 4.')
return showMenu()
}

const sessaoRegistrada = () => {
try {
const credsFile = path.join(qrcode, 'creds.json')
if (!fs.existsSync(credsFile)) return false
const creds = JSON.parse(fs.readFileSync(credsFile, 'utf8'))
return creds?.registered === true
} catch {
return false
}
}

/*
 * CONEXÃO PRINCIPAL
 */

async function startConnect() {
if (iniciando) return
iniciando = true

try {
info('Iniciando conexão...')

const { version } = await fetchLatestBaileysVersion()
const { state, saveCreds } = await useMultiFileAuthState(qrcode)

const tokito = makeWASocket({
version,
logger,
browser: ['Linux', 'Opera', '10.0.22631'],

auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, logger)
},

msgRetryCounterCache,
mobile: false,
fireInitQueries: true,
markOnlineOnConnect: true,
generateHighQualityLinkPreview: true,
connectTimeoutMs: 20000,
keepAliveIntervalMs: 40000,
defaultQueryTimeoutMs: 60000,
retryRequestDelayMs: 5000,
maxMsgRetryCount: 5,
syncFullHistory: false,
downloadHistory: false,
emitOwnEvents: true,
shouldSyncHistoryMessage: () => false,
getMessage: async (key) => undefined })

global.tokito = tokito

detector.iniciar(tokito).catch(error => {
erroSistema('Erro ao iniciar detector Anti-Pay', error)
})

global.qrTokitoAtual = null
global.mostrarQrTokito = false

funcoes.iniciar(tokito, prefix)

if (!state.creds.registered && metodo === 'codigo') await startPairing(tokito)
if (!state.creds.registered && metodo === 'qr') info('Aguardando geração do QR-Code...')

tokito.ev.process(async events => {

/*
       * EVENTO DE GRUPO
       */

if (events['group-participants.update']) {
const update = events['group-participants.update']

try {
const caminhoGp = `${grupos}/${update.id}.json`
if (!fs.existsSync(caminhoGp)) return

let jsonGp

try {
jsonGp = JSON.parse(fs.readFileSync(caminhoGp, 'utf8'))
if (!Array.isArray(jsonGp)) jsonGp = [jsonGp]
if (!jsonGp[0]) jsonGp[0] = {}
} catch {
return
}

let metadata

try {
metadata = await tokito.groupMetadata(update.id)
} catch {
return
}

if (!metadata?.id?.endsWith('@g.us')) return

const membros = metadata.participants || []
const mapaJids = new Map()

for (const membro of membros) {
const candidatos = [
membro?.phoneNumber,
membro?.participantAlt,
membro?.participantPn,
membro?.jid,
membro?.id,
membro?.participant,
membro?.lid
].filter(Boolean)

const real = candidatos.map(normalizarJid).find(jid => jid.endsWith('@s.whatsapp.net')) || ''
if (!real) continue

for (const candidato of candidatos) mapaJids.set(String(candidato), real)
mapaJids.set(real, real)
}

const resolverJid = alvo => {
if (!alvo) return ''

if (typeof alvo === 'object') {
alvo = alvo?.phoneNumber || alvo?.participantAlt || alvo?.participantPn || alvo?.jid || alvo?.id || alvo?.participant || alvo?.lid || ''
}

const bruto = String(alvo || '').trim()

if (!bruto) return ''
if (mapaJids.has(bruto)) return mapaJids.get(bruto)

const normalizado = normalizarJid(bruto)

if (mapaJids.has(normalizado)) return mapaJids.get(normalizado)

return normalizado.includes('@lid') ? '' : normalizado
}

const botJid = normalizarJid(tokito?.user?.id || tokito?.user?.lid || '')
const donoGrupo = resolverJid(membros.find(membro => membro?.admin === 'superadmin'))

const donosBot = [ownerNumber]

for (let i = 1; i <= 6; i++) donosBot.push(nescessario?.[`numero_dono${i}`])

const donosBotJids = [
...new Set(
donosBot
.map(normalizarJid)
.filter(jid => jid.endsWith('@s.whatsapp.net'))
)
]

const botAdmin = membros.some(membro =>
resolverJid(membro) === botJid &&
['admin', 'superadmin'].includes(membro?.admin)
)

const funcoesGp = jsonGp[0].funcoes && typeof jsonGp[0].funcoes === 'object' ? jsonGp[0].funcoes : {}
const listaNegra = Array.isArray(jsonGp[0].listanegra) ? jsonGp[0].listanegra.map(normalizarJid).filter(Boolean) : []

const antiDDD = funcoesGp.antiddd && typeof funcoesGp.antiddd === 'object' ? funcoesGp.antiddd : {
ativo: false,
listaProibidos: []
}

const dddsProibidos = Array.isArray(antiDDD.listaProibidos)
? antiDDD.listaProibidos.map(v => collectNumbers(v).slice(0, 2)).filter(v => /^\d{2}$/.test(v))
: []

/*
           * ANTIROUBO
           */

if (funcoesGp.antirroubo && ['promote', 'demote'].includes(update.action) && botAdmin) {
const autorRaw = update.author || update.authorPn || update.authorLid || update.actor || update.initiator || ''
const autor = resolverJid(autorRaw)

const alvos = (Array.isArray(update.participants) ? update.participants : [])
.map(resolverJid)
.filter(Boolean)

const agora = Date.now()

for (const [chave, expira] of correcoesAntirroubo.entries()) {
if (expira <= agora) correcoesAntirroubo.delete(chave)
}

const alvosReais = alvos.filter(alvo => {
const chave = `${update.id}|${update.action}|${numeroDoJid(alvo)}`

if (!correcoesAntirroubo.has(chave)) return true

correcoesAntirroubo.delete(chave)
return false
})

const autorPermitido = [botJid, donoGrupo, ...donosBotJids].filter(Boolean).includes(autor)
const alvosProtegidos = alvosReais.filter(alvo => alvo !== botJid && alvo !== donoGrupo)

if (autor && !autorPermitido && alvosProtegidos.length) {
const alterarCargo = async (usuario, acao) => {
try {
correcoesAntirroubo.set(`${update.id}|${acao}|${numeroDoJid(usuario)}`, Date.now() + 12000)
await tokito.groupParticipantsUpdate(update.id, [usuario], acao)
return true
} catch {
return false
}
}

if (update.action === 'promote') {
for (const alvo of alvosProtegidos) {
await alterarCargo(alvo, 'demote')
await delay(350)
}

if (autor !== donoGrupo) await alterarCargo(autor, 'demote')

await tokito.sendMessage(update.id, {
text: mess.antirrouboPromocao(autor, alvosProtegidos),
contextInfo: canalInfo([autor, ...alvosProtegidos])
}).catch(() => {})
}

if (update.action === 'demote') {
for (const alvo of alvosProtegidos) {
await alterarCargo(alvo, 'promote')
await delay(350)
}

if (autor !== donoGrupo) await alterarCargo(autor, 'demote')

await tokito.sendMessage(update.id, {
text: mess.antirrouboRebaixamento(autor, alvosProtegidos),
contextInfo: canalInfo([autor, ...alvosProtegidos])
}).catch(() => {})
}
}
}

if (!['add', 'remove'].includes(update.action)) return

/*
           * ENTRADA / SAÍDA
           */

for (const participanteRaw of update.participants || []) {
const participante = resolverJid(participanteRaw)
if (!participante) continue

const numero = numeroDoJid(participante)
const protegido = [botJid, donoGrupo, ...donosBotJids].filter(Boolean).includes(participante)

/*
             * LISTA NEGRA
             */

if (update.action === 'add' && botAdmin && !protegido && listaNegra.includes(participante)) {
await tokito.sendMessage(update.id, {
text: mess.blackListEntrada(numero),
contextInfo: canalInfo([participante])
}).catch(() => {})

await delay(700)
await tokito.groupParticipantsUpdate(update.id, [participante], 'remove').catch(() => {})
continue
}

/*
             * ANTI-FAKE
             */

if (update.action === 'add' && botAdmin && !protegido && funcoesGp.antifake && !numero.startsWith('55')) {
await tokito.sendMessage(update.id, {
text: mess.antifakeEntrada(numero),
contextInfo: canalInfo([participante])
}).catch(() => {})

await delay(700)
await tokito.groupParticipantsUpdate(update.id, [participante], 'remove').catch(() => {})
continue
}

/*
             * ANTI-DDD
             */

const ddd = numero.startsWith('55') && numero.length >= 12 ? numero.slice(2, 4) : ''

if (update.action === 'add' && botAdmin && !protegido && antiDDD.ativo && ddd && dddsProibidos.includes(ddd)) {
await tokito.sendMessage(update.id, {
text: mess.antidddEntrada(numero, ddd),
contextInfo: canalInfo([participante])
}).catch(() => {})

await delay(700)
await tokito.groupParticipantsUpdate(update.id, [participante], 'remove').catch(() => {})
continue
}

/*
             * BEM-VINDOS
             */

const agora = new Date()
const grupoNome = metadata.subject || jsonGp[0].name || 'Grupo'
const groupDesc = metadata.desc || ''
const entrou = update.action === 'add'

const dadosLegenda = {
numero,
grupo: grupoNome,
membros: membros.length,
hora: agora.toLocaleTimeString('pt-BR', { timeZone: 'America/Fortaleza', hour: '2-digit', minute: '2-digit' }),
dia: agora.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza', weekday: 'long' }),
data: agora.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' }),
ano: agora.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza', year: 'numeric' })
}

const legendaBase = texto => {
const tags = {
'#numero#': `@${numero}`,
'#numerodele#': `@${numero}`,
'#nomegrupo#': grupoNome,
'#nomedogp#': grupoNome,
'#prefixo#': prefix,
'#nomedobot#': NomeDoBot,
'#hora#': dadosLegenda.hora,
'#dia#': dadosLegenda.dia,
'#data#': dadosLegenda.data,
'#ano#': dadosLegenda.ano,
'#year#': dadosLegenda.ano,
'#yeah#': dadosLegenda.ano,
'#estado#': estado(numero),
'#membros#': membros.length,
'#descrição#': groupDesc
}

let final = String(texto || '')

for (const [tag, valor] of Object.entries(tags)) final = final.split(tag).join(String(valor))

return final
}

const fotoPerfil = async jid => {
const fallback = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'

try {
const chave = `foto:${jid}`
const salva = fotos.get(chave)

if (salva) return salva

const foto = await tokito.profilePictureUrl(jid, 'image').catch(() => fallback)

fotos.set(chave, foto || fallback)

return foto || fallback
} catch {
return fallback
}
}

const wellcome = Array.isArray(jsonGp[0].wellcome) ? jsonGp[0].wellcome : []

/*
             * BEM-VINDO 1
             */

if (wellcome?.[0]?.bemvindo1) {
const config = wellcome[0]
const texto = legendaBase(entrou ? config.legendabv : config.legendasaiu)
const fundo = entrou ? config.fundobv : config.fundosaiu
const tipo = entrou ? config.fundobv_tipo : config.fundosaiu_tipo

if (fundo && tipo) {
const buffer = Buffer.from(fundo, 'base64')

if (tipo === 'video') {
await tokito.sendMessage(update.id, {
video: buffer,
mimetype: 'video/mp4',
gifPlayback: true,
caption: texto,
contextInfo: canalInfo([participante])
}).catch(() => {})
} else {
await tokito.sendMessage(update.id, {
image: buffer,
caption: texto,
contextInfo: canalInfo([participante])
}).catch(() => {})
}
} else {
const avatar = await fotoPerfil(participante)

await tokito.sendMessage(update.id, {
image: { url: avatar },
caption: texto,
contextInfo: canalInfo([participante])
}).catch(() => {})
}
}

/*
             * BEM-VINDO 2
             */

if (wellcome?.[1]?.bemvindo2) {
const config = wellcome[1]
const texto = legendaBase(entrou ? config.legendabv2 : config.legendasaiu2)
const avatar = await fotoPerfil(participante)
const fundo = 'https://raw.githubusercontent.com/dylanModz/uploads/main/midias/imagens/344hs4hph.jpg'
const titulo = entrou ? 'Bem-vindo(a)!' : 'Saída do Grupo'
const sub = entrou ? 'É um prazer ter você aqui. Fique à vontade' : 'Sentiremos sua falta, volte sempre!'

const imgURL = `${API_URL}/canvas/welcome?apikey=${encodeURIComponent(API_KEY_TOKITO)}&fundo=${encodeURIComponent(fundo)}&avatar=${encodeURIComponent(avatar)}&titulo=${encodeURIComponent(titulo)}&sub=${encodeURIComponent(sub)}`

await tokito.sendMessage(update.id, {
image: { url: imgURL },
caption: texto,
contextInfo: canalInfo([participante])
}).catch(() => {})
}

/*
             * BEM-VINDO 3
             */

if (wellcome?.[2]?.bemvindo3) {
const config = wellcome[2]
const texto = legendaBase(entrou ? config.legendabv3 : config.legendasaiu3)

await tokito.sendMessage(update.id, {
text: texto,
contextInfo: canalInfo([participante])
}).catch(() => {})
}

await delay(400)
}
} catch (error) {
erroSistema('Erro no evento do grupo', error)
}
}

/*
       * CONEXÃO
       */

if (events['connection.update']) {
const update = events['connection.update']
const { connection, lastDisconnect, qr } = update

if (qr) {
ultimoQr = qr
global.qrTokitoAtual = qr

if (metodo === 'qr' && !state.creds.registered) {
console.log('')
info('Escaneie o QR-Code abaixo para conectar.')
console.log('')

qrcodeTerminal.generate(qr, { small: true })

console.log('')
}
}

const shouldReconnect = lastDisconnect?.error
? new Boom(lastDisconnect.error).output.statusCode
: 0

switch (connection) {
case 'connecting':
info(`${NomeDoBot} está conectando ao WhatsApp...`)
break

case 'open':
global.startTime = Math.floor(Date.now() / 1000)

reconectando = false
metodo = null
ultimoQr = null
global.qrTokitoAtual = null
global.mostrarQrTokito = false

console.log(banner3?.string || colors.cyan('\nTOKITO | V10\n'))
console.log(banner2?.string || colors.blue('dylan Modz'))
console.log('')

sucesso(`${NomeDoBot} conectado com sucesso.`)

console.log('')

await tokito.sendPresenceUpdate('available').catch(() => {})
await tokito.updateProfileStatus(`[ ${NomeDoBot} ONLINE 🧊 ]`).catch(() => {})
iniciarAvisosUpdate(tokito)
break

case 'close':
if (shouldReconnect === DisconnectReason.loggedOut || shouldReconnect === 401) {
erro('Sessão encerrada. Apague a pasta qrcode e conecte novamente.')
process.exit(0)
}

if (!reconectando) {
reconectando = true

aviso(`Conexão fechada. Reconectando em 5 segundos. Código: ${shouldReconnect}`)

setTimeout(() => {
reconectando = false
iniciando = false
startConnect()
}, 5000)
}
break
}
}

/*
       * MENSAGENS
       * Mantido no mesmo fluxo da base original.
       */
if (events['messages.upsert']) {
const upsert = events['messages.upsert']

try {
if (!processarMensagemTokito)
processarMensagemTokito = require('../tokito.js')

if (process.env.TOKITO_DEBUG_RX === '1')
info(`RX messages.upsert recebido (${upsert?.type || 'sem tipo'})`)

await processarMensagemTokito(tokito, upsert)
}
catch (error) {
erroSistema('Erro no tokito.js', error)
}
}

if (events['creds.update']) await saveCreds()
})

iniciando = false
} catch (error) {
erroSistema('Ocorreu um erro ao iniciar a conexão', error)
aviso('Tentando iniciar novamente em 5 segundos...')

setTimeout(() => {
iniciando = false
startConnect()
}, 5000)
}
}

process.on('uncaughtException', error => erroSistema('uncaughtException detectado', error))
process.on('unhandledRejection', error => erroSistema('unhandledRejection detectado', error))

async function iniciarTokito() {
recarregarConfigBot()
const acesso = await prepararAcesso()
if (!acesso?.allowed) {
erro(`Não foi possível liberar o acesso: ${acesso?.message || acesso?.code || 'validação indisponível'}`)
process.exit(24)
return
}

if (!sessaoRegistrada() || process.argv.includes('painel')) await showMenu()

placar.ciclo(resultado => {
if (!resultado?.definitive) return
erro(`A licença foi recusada pelo servidor: ${resultado.message || resultado.code || 'acesso bloqueado'}`)
setTimeout(() => process.exit(24), 1200)
})
startConnect()
}

iniciarTokito().catch(error => {
erroSistema('Falha ao validar o acesso do Tokito V10', error)
process.exit(24)
})
