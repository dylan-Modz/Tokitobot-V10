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

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys')
const { fs, path, util, NodeCache, colors, pino, readline, Boom, estado, banner2, banner3, mess, nescessario } = require('./database/lib/exports.js')
const funcoes = require('./funcoes/index.js')
const detector = require('./detector.js')
const qrcodeTerminal = require('qrcode-terminal')
const dadosSistema = require('./sistemas/dados.js')

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
console.log(colors.magenta('╭━━━✦━━━✦━━━✦━━━╮'))
console.log(colors.white.bold(`┃ CÓDIGO: ${code}`))
console.log(colors.magenta('╰━━━✦━━━✦━━━✦━━━╯'))
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
console.log(colors.magenta('╭━━━✦━━━✦━━━✦━━━╮'))
console.log(colors.white.bold('┃   SUPORTE TOKITO   ┃'))
console.log(colors.magenta('╰━━━✦━━━✦━━━✦━━━╯'))
console.log(colors.cyan(`WhatsApp: https://wa.me/${numero || '5511975431163'}`))
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

const linhaPainel = (numero, icone, texto) => {
console.log(colors.blue('┃') + colors.magenta('❯ ') + colors.red(`( ${numero} ) `) + colors.cyan(`${icone} ${texto}`))
}

async function editarCampoBot(chave, titulo, opcoes = {}) {
const config = lerConfigBot()
const atual = config[chave] ?? ''
console.log('')
info(`${titulo} atual: ${String(atual || 'Não configurado')}`)
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
config[chave] = valor
salvarConfigBot(config)
sucesso(`${titulo} atualizado com sucesso.`)
return true
}

async function editarBot() {
while (true) {
const config = recarregarConfigBot()
console.log('')
console.log(colors.magenta('╭━━━✦━━━✦━━━✦━━━╮'))
console.log(colors.white.bold('┃     EDITAR BOT      ┃'))
console.log(colors.magenta('╰━━━✦━━━✦━━━✦━━━╯'))
console.log(colors.blue('┌─────────────────────────────────────┐'))
linhaPainel('1', '🤖', `Nome do bot       ${mostrarValor('NomeDoBot', config.NomeDoBot)}`)
linhaPainel('2', '👑', `Nome do dono      ${mostrarValor('ownerName', config.ownerName)}`)
linhaPainel('3', '📱', `Número do dono    ${mostrarValor('ownerNumber', config.ownerNumber)}`)
linhaPainel('4', '🔣', `Prefixo           ${mostrarValor('prefix', config.prefix)}`)
linhaPainel('5', '🔑', `Token da API      ${mostrarValor('API_KEY_TOKITO', config.API_KEY_TOKITO)}`)
linhaPainel('6', '🎮', `Token de salas    ${mostrarValor('TOKEN_SALA', config.TOKEN_SALA)}`)
linhaPainel('7', '👍', `Token de likes    ${mostrarValor('TOKEN_LIKE_FF', config.TOKEN_LIKE_FF)}`)
linhaPainel('0', '↩️', 'Voltar')
console.log(colors.blue('└─────────────────────────────────────┘'))
console.log(colors.gray('ᴇsᴄᴏʟʜᴀ ᴜᴍᴀ ᴏᴘᴄ̧ᴀ̃ᴏ ᴀʙᴀɪxᴏ'))
let option = await question(colors.white.bold('╰━━➤ '))
option = option.trim()
if (option === '0') return
if (option === '1') await editarCampoBot('NomeDoBot', 'Nome do bot')
else if (option === '2') await editarCampoBot('ownerName', 'Nome do dono')
else if (option === '3') await editarCampoBot('ownerNumber', 'Número do dono')
else if (option === '4') await editarCampoBot('prefix', 'Prefixo')
else if (option === '5') await editarCampoBot('API_KEY_TOKITO', 'Token da API')
else if (option === '6') await editarCampoBot('TOKEN_SALA', 'Token de salas', { ponto: true })
else if (option === '7') await editarCampoBot('TOKEN_LIKE_FF', 'Token de likes', { ponto: true })
else erro('Opção inválida. Escolha uma opção do painel.')
}
}

async function showMenu() {
console.log('')
console.log(colors.bgRed.white.bold(' INFO - TOKITO ') + colors.white(' - Escolha como deseja iniciar.'))
console.log('')
console.log(colors.magenta('╭━━━✦━━━✦━━━✦━━━╮'))
console.log(colors.white.bold('┃   PAINEL DE CONTROLE   ┃'))
console.log(colors.magenta('╰━━━✦━━━✦━━━✦━━━╯'))
console.log(colors.blue('┌──────────────────────────────┐'))
linhaPainel('1', '📱', 'Código de conexão')
linhaPainel('2', '🧊', 'QR-Code WhatsApp')
linhaPainel('3', '🌊', 'Suporte / Ajuda')
linhaPainel('4', '⚙️', 'Editar bot')
console.log(colors.blue('└──────────────────────────────┘'))
console.log(colors.gray('ᴇsᴄᴏʟʜᴀ ᴜᴍᴀ ᴏᴘᴄ̧ᴀ̃ᴏ ᴀʙᴀɪxᴏ'))
let option = await question(colors.white.bold('╰━━➤ '))
option = option.trim()
if (option === '1' || option === '2') {
recarregarConfigBot()
if (!API_KEY_TOKITO || !API_KEY_TOKITO.startsWith('tokito_')) {
aviso('Configure primeiro o Token da API na opção 4.')
return showMenu()
}
metodo = option === '1' ? 'codigo' : 'qr'
sucesso(option === '1' ? 'Conexão por código selecionada.' : 'Conexão por QR-Code selecionada.')
return metodo
}
if (option === '3') {
await openWhatsappSupport()
return showMenu()
}
if (option === '4') {
await editarBot()
return showMenu()
}
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
info(`WhatsApp: ${tokito.user?.id || 'desconhecido'}`)
info('Sistema de eventos iniciado.')
info('Detector Anti-Pay iniciado.')

console.log('')

await tokito.sendPresenceUpdate('available').catch(() => {})
await tokito.updateProfileStatus(`[ ${NomeDoBot} ONLINE 🧊 ]`).catch(() => {})
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
       */

if (events['messages.upsert']) {
const upsert = events['messages.upsert']
const starttokito = require('../tokito.js')

try {
await starttokito(tokito, upsert)
} catch (error) {
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
if (!sessaoRegistrada() || !API_KEY_TOKITO || process.argv.includes('painel')) await showMenu()
info('Validando acesso do Tokito Bot V10...')
const acesso = await dadosSistema.validarInicio()
if (!acesso.allowed) {
erro(`Acesso não autorizado: ${acesso.message || acesso.code || 'licença inválida'}`)
process.exit(24)
return
}
if (acesso.online) sucesso(acesso.message || 'Acesso validado pela Tokito APIs.')
else aviso(acesso.message || 'Servidor indisponível. Usando licença local válida.')
dadosSistema.iniciarSincronizacao(resultado => {
if (!resultado?.definitive) return
erro(`A licença foi recusada pelo servidor: ${resultado.message || resultado.code || 'acesso bloqueado'}`)
setTimeout(() => process.exit(24), 1200)
})
dadosSistema.verificarUpdate().then(check => {
if (check?.ok && check.available) aviso(`Nova versão disponível: ${check.remote?.version || 'desconhecida'}. Use ${prefix}update check para ver os detalhes.`)
}).catch(() => {})
startConnect()
}

iniciarTokito().catch(error => {
erroSistema('Falha ao validar o acesso do Tokito V10', error)
process.exit(24)
})
