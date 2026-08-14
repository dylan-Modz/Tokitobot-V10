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

const { getContentType, jidNormalizedUser, proto, prepareWAMessageMedia, generateWAMessageFromContent, getFileBuffer, DLT_FL, getGroupAdmins, getMembros, getRandom, fs, path, os, colors, performance, linguagem, mess, axios, setting, nescessario, vip, caminhoVip, arquivo, pasta, fuso, sendVideoAsSticker, sendVideoAsSticker2, sendImageAsSticker2, sendImageAsSticker } = require('./DADOS_TOKITO/database/lib/exports.js')
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const funcoes = require('./DADOS_TOKITO/funcoes/index.js')
const detector = require('./DADOS_TOKITO/detector.js')
const plugins = require('./DADOS_TOKITO/plugins/index.js')
const regrasPlugins = require('./DADOS_TOKITO/sistemas/permissoes.js')
const aluguel = require('./DADOS_TOKITO/sistemas/aluguel/index.js')
const modulos = require('./DADOS_TOKITO/sistemas/modulos.js')
////////////////////////////////////////////////////////////////////////////////////
const similar = require('./DADOS_TOKITO/funcoes/js/similar.js')

const comandos = () => [...new Set([...similar.casos(__filename), ...plugins.comandos()])]
////////////////////////////////////////////////////////////////////////////////////
const { modoAtivo: modoJogosAtivo, getAdivinheGame, saveAdivinheGame, removeAdivinheGame, criarAdivinheGame, enviarAdivinhe, getQuizGame, saveQuizGame, removeQuizGame, criarQuizGame, enviarQuiz, getForcaGame, saveForcaGame, removeForcaGame, criarForcaGame, enviarForca, getCacaGame, saveCacaGame, removeCacaGame, criarCacaGame, enviarCaca, getMinesGame, saveMinesGame, removeMinesGame, criarMinesGame, enviarMines, getVelhaGame, saveVelhaGame, removeVelhaGame, criarTabuleiroVelha, getDamaGame, saveDamaGame, removeDamaGame, criarTabuleiroDama, sameJid: mesmoJid, mention: mencionarJogo, enviarTexto: enviarTextoJogos } = funcoes.jogos
////////////////////////////////////////////////////////////////////////////////////
const { NomeDoBot, ownerName, prefix: prefixGlobal, channel, channeldl, ownerNumber, CREDENTIALS_USER, API_URL, API_KEY_TOKITO } = require('./DADOS_TOKITO/INFO_DADOS/config-all.json')
////////////////////////////////////////////////////////////////////////////////////
if (!fs.existsSync(path.dirname(arquivo)))
fs.mkdirSync(path.dirname(arquivo), { recursive: true })

if (!fs.existsSync(pasta))
fs.mkdirSync(pasta, { recursive: true })

if (!fs.existsSync(arquivo))
fs.writeFileSync(arquivo, JSON.stringify({}, null, 2))

const ler = () => {
try {
const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'))
return dados && typeof dados === 'object' && !Array.isArray(dados) ? dados : {}
}
catch {
return {}
}
}

const salvar = dados => fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2))

const extrair = message => {
let atual = message || {}
for (let i = 0; i < 6; i++) {
const proxima = atual?.ephemeralMessage?.message || atual?.viewOnceMessage?.message || atual?.viewOnceMessageV2?.message || atual?.viewOnceMessageV2Extension?.message || atual
if (proxima === atual)
break
atual = proxima
}
return atual
}

const apagar = midia => {
try {
if (!midia?.arquivo)
return
const local = path.join(pasta, midia.arquivo)
if (fs.existsSync(local))
fs.unlinkSync(local)
}
catch {
}
}

const agora = () => {
const partes = new Intl.DateTimeFormat('pt-BR', {
timeZone: fuso,
year: 'numeric',
month: '2-digit',
day: '2-digit',
hour: '2-digit',
minute: '2-digit',
hourCycle: 'h23'
}).formatToParts(new Date())
const dados = {}
for (const parte of partes)
if (parte.type !== 'literal')
dados[parte.type] = parte.value
return {
data: `${dados.year}-${dados.month}-${dados.day}`,
hora: `${dados.hour}:${dados.minute}`
}
}

const enviar = async (tokito, jid, texto, midia) => {
try {
if (midia?.arquivo) {
const local = path.join(pasta, midia.arquivo)
if (fs.existsSync(local)) {
const buffer = fs.readFileSync(local)
if (midia.tipo === 'video')
return await tokito.sendMessage(jid, {
video: buffer,
mimetype: 'video/mp4',
gifPlayback: true,
caption: texto
})
if (midia.tipo === 'image')
return await tokito.sendMessage(jid, {
image: buffer,
caption: texto
})
}
}
return await tokito.sendMessage(jid, { text: texto })
}
catch (error) {
console.log(colors.red(`❌ Erro ao enviar aviso programado para ${jid}:`), modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes')
return tokito.sendMessage(jid, { text: texto }).catch(() => null)
}
}

const avisar = async (tokito, jid, grupo, tipo) => {
const meta = await tokito.groupMetadata(jid).catch(() => null)
const nome = meta?.subject || grupo?.nome || 'Grupo'
const total = meta?.participants?.length || 0
if (tipo === 'fechar') {
return enviar(tokito, jid, mess.fechado(grupo.fechar, nome), grupo.fecharmidia)
}
return enviar(tokito, jid, mess.aberto(grupo.abrir, nome, total), grupo.abrirmidia || grupo.midia)
}

const processar = async () => {
const tokito = global.socketGruposProgramadosTokito || global.tokito
if (!tokito || global.executandoGruposProgramadosTokito)
return
global.executandoGruposProgramadosTokito = true
try {
const grupos = ler()
const horario = agora()
const chave = `${horario.data}-${horario.hora}`
const tarefas = []
let mudou = false
for (const jid of Object.keys(grupos)) {
const grupo = grupos[jid]
if (!grupo?.ativo)
continue
const fechar = grupo.fechar === horario.hora && grupo.ultimoFechamento !== chave
const abrir = grupo.abrir === horario.hora && grupo.ultimaAbertura !== chave
if (!fechar && !abrir)
continue
tarefas.push((async () => {
try {
if (fechar) {
await tokito.groupSettingUpdate(jid, 'announcement')
grupo.ultimoFechamento = chave
mudou = true
console.log(colors.yellow(`🔒 Grupo fechado automaticamente: ${grupo.nome || jid}`))
avisar(tokito, jid, grupo, 'fechar').catch(error => {
console.log(colors.red(`❌ Erro no aviso de fechamento ${jid}:`), modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes')
})
}
if (abrir) {
await tokito.groupSettingUpdate(jid, 'not_announcement')
grupo.ultimaAbertura = chave
mudou = true
console.log(colors.green(`🔓 Grupo aberto automaticamente: ${grupo.nome || jid}`))
avisar(tokito, jid, grupo, 'abrir').catch(error => {
console.log(colors.red(`❌ Erro no aviso de abertura ${jid}:`), modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes')
})
}
}
catch (error) {
console.log(colors.red(`❌ Erro no grupo programado ${jid}:`), modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes')
}
})())
}
if (tarefas.length)
await Promise.allSettled(tarefas)
if (mudou)
salvar(grupos)
}
catch (error) {
console.log(colors.red('❌ Erro no sistema de grupos programados:'), modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes')
}
finally {
global.executandoGruposProgramadosTokito = false
}
}

global.processarGruposProgramadosTokito = processar

global.executandoGruposProgramadosTokito = false

if (!global.intervaloGruposProgramadosTokito) {
global.intervaloGruposProgramadosTokito = setInterval(() => {
const executar = global.processarGruposProgramadosTokito
if (typeof executar === 'function') {
executar().catch(() => {
})
}
}, 1000)
}

const iniciar = tokito => {
global.socketGruposProgramadosTokito = tokito
global.processarGruposProgramadosTokito = processar
processar().catch(() => {
})
}

const pastaGrupos = path.join(__dirname, 'DADOS_TOKITO', 'database', 'grupos', 'ATIVAÇÕES-TOKITO')

if (!fs.existsSync(pastaGrupos))
fs.mkdirSync(pastaGrupos, { recursive: true })

const pathgroupjson = jid => path.join(pastaGrupos, `${jid}.json`)

const salvarJson = (local, dados) => fs.writeFileSync(local, JSON.stringify(dados, null, 2) + '\n')

const lerJson = (local, padrao) => {
try {
const dados = JSON.parse(fs.readFileSync(local, 'utf8'))
return Array.isArray(dados) && dados.length ? dados : padrao
}
catch {
salvarJson(local, padrao)
return padrao
}
}

process.on('uncaughtException', function(err) {
console.error((new Date).toUTCString() + ' uncaughtException:', modulos.sanitizarErro(err, [API_KEY_TOKITO]) || 'Erro sem detalhes')
console.error(modulos.sanitizarErro(err?.stack || '', [API_KEY_TOKITO]))
})

async function starttokito(tokito, upsert) {
try {
aluguel.iniciar(tokito)
for (const info of upsert?.messages || []) {
const from = info.key?.remoteJid
const isGroup = from?.endsWith('@g.us')
const isStatus = from === 'status@broadcast'
if (!from)
continue

if (isStatus) {
if (modulos.globalCfg().visualizarmsg) {
try {
await tokito.readMessages([info.key])
}
catch {
}
}
continue
}
const stub = info?.key?.isViewOnce === true
if (!info.message && !stub)
continue
if (upsert.type === 'append' && !stub)
continue
const mensagem = info.message?.ephemeralMessage?.message || info.message?.viewOnceMessage?.message || info.message?.viewOnceMessageV2?.message || info.message?.viewOnceMessageV2Extension?.message || info.message || {}
const type = stub ? 'viewOnceStub' : getContentType(mensagem)
const content = JSON.stringify(mensagem)
const pushname = info.pushName || 'Usuário'
if (modulos.globalCfg().visualizarmsg) {
try {
await tokito.readMessages([info.key])
}
catch {
}
}
function extrairTexto(message) {
const paths = [
'conversation',
'viewOnceMessageV2.message.imageMessage.caption',
'viewOnceMessageV2.message.videoMessage.caption',
'imageMessage.caption',
'videoMessage.caption',
'extendedTextMessage.text',
'viewOnceMessage.message.videoMessage.caption',
'viewOnceMessage.message.imageMessage.caption',
'documentMessage.caption',
'documentWithCaptionMessage.message.documentMessage.caption',
'buttonsResponseMessage.selectedButtonId',
'listResponseMessage.singleSelectReply.selectedRowId',
'templateButtonReplyMessage.selectedId',
'interactiveResponseMessage.nativeFlowResponseMessage.paramsJson'
]
for (const caminho of paths) {
const value = caminho.split('.').reduce((obj, key) => obj?.[key], message)
if (value) {
if (caminho.includes('paramsJson')) {
try {
const resposta = JSON.parse(value)
return resposta?.id || resposta?.selectedId || resposta?.rowId || ''
}
catch {
return ''
}
}
return value
}
}
return ''
}
////////////////////////////////////////////////////////////////////////////////////
var body = String(extrairTexto(mensagem) || '').trim()
var Procurar_String = body
var budy2 = body.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
let prefix = prefixGlobal
if (isGroup) {
try {
const arqPrefix = path.join(__dirname, 'DADOS_TOKITO', 'database', 'grupos', 'ATIVAÇÕES-TOKITO', `${from}.json`)
if (fs.existsSync(arqPrefix)) {
const raw = JSON.parse(fs.readFileSync(arqPrefix, 'utf8'))
const gp = Array.isArray(raw) ? raw[0] : raw
const f = gp?.funcoes || {}
if (f.multiprefix === true && String(f.prefixGrupo || '').trim())
prefix = String(f.prefixGrupo).trim()
}
}
catch {
}
}
global.prefix = prefix
let isCmd = body.startsWith(prefix)
let args = isCmd ? body.slice(prefix.length).trim().split(/[ \t]+/) : body.split(/[ \t]+/)
let command = isCmd ? String(args.shift() || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ç/g, 'c') : null
let q = args.join(' ')
var budy = type === 'conversation' ? mensagem?.conversation : type === 'extendedTextMessage' ? mensagem?.extendedTextMessage?.text : ''
var PR_String = Procurar_String.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
let groupMetadata = ''
try {
groupMetadata = isGroup ? await tokito.groupMetadata(from) : ''
}
catch {
groupMetadata = ''
}
const groupName = isGroup ? groupMetadata?.subject || '' : ''
const groupDesc = isGroup ? groupMetadata?.desc || '' : ''
const groupMembers = isGroup ? groupMetadata?.participants || [] : []
const dirGroup = isGroup ? pathgroupjson(from) : ''
const data_IDGP = isGroup ? [
{
name: groupName || 'Grupo',
groupId: from,
funcoes: {
aprovacao: false,
autoaprovacao: false,
antilink: {
ativo: false,
nivel: null
},
x9: false,
antipay: false,
antibot: false,
antivideo: false,
antifoto: false,
antivisu: false,
antisticker: false,
anticontato: false,
antilocalizacao: false,
antidocumento: false,
antiaudio: false,
antispam: false,
antistatus: false,
antimarcacao: false,
antifake: false,
antirroubo: false,
anticanal: false,
soadm: false,
modorpg: false,
modocoins: false,
multiprefix: false,
prefixGrupo: null,
autodl: false,
autosticker: false,
autortext: false,
antinotas: false,
antipalavra: false,
palavrasProibidas: [],
bangp: false,
modoia: {
ativo: false,
tipo: 'texto'
},
antiddd: {
ativo: false,
listaProibidos: []
},
modojogos: false
},
listanegra: [],
ausentes: [],
advertencias: {},
silenciados: [],
atividades: {},
economia: { usuarios: {} },
rpg: { usuarios: {} },
namoro: {
pedidos: [],
casais: []
},
casamento: {
pedidos: [],
casais: []
},
jogos: false,
wellcome: [
{
bemvindo1: false,
legendabv: `「🧊」 #numero#
- *🧊 | ᴜᴍ ɴᴏᴠᴏ ᴍᴇᴍʙʀᴏ ᴇɴᴛʀᴏᴜ ɴᴏ ɢʀᴜᴘᴏ #nomegrupo#…* ↴

*ꜱᴇᴊᴀ ᴍᴜɪᴛᴏ ʙᴇᴍ-ᴠɪɴᴅᴏ(ᴀ), #numero#!* 💙

*ᴇ́ ᴜᴍᴀ ɢʀᴀɴᴅᴇ ᴀʟᴇɢʀɪᴀ ᴛᴇʀ ᴠᴏᴄᴇ̂ ᴄᴏɴᴏꜱᴄᴏ. ᴀɢᴏʀᴀ ᴏ ɢʀᴜᴘᴏ #nomegrupo# ᴄᴏɴᴛᴀ ᴄᴏᴍ #membros# ᴍᴇᴍʙʀᴏꜱ.*

*ᴇꜱᴘᴇʀᴀᴍᴏꜱ ǫᴜᴇ ᴠᴏᴄᴇ̂ ꜱᴇ ᴅɪᴠɪʀᴛᴀ, ꜰᴀᴄ̧ᴀ ɴᴏᴠᴀꜱ ᴀᴍɪᴢᴀᴅᴇꜱ ᴇ ᴀᴘʀᴏᴠᴇɪᴛᴇ ʙᴀꜱᴛᴀɴᴛᴇ ꜱᴜᴀ ᴇꜱᴛᴀᴅɪᴀ ᴀǫᴜɪ.* ✨

> *🧊 | ʟᴇɪᴀ ᴀꜱ ʀᴇɢʀᴀꜱ, ʀᴇꜱᴘᴇɪᴛᴇ ᴛᴏᴅᴏꜱ ᴇ ᴜꜱᴇ #prefixo#menu ᴘᴀʀᴀ ᴠᴇʀ ᴏꜱ ᴄᴏᴍᴀɴᴅᴏꜱ.*`,
legendasaiu: `「🧊」 #numero#
- *🧊 | ᴜᴍ ᴍᴇᴍʙʀᴏ ꜱᴀɪᴜ ᴅᴏ ɢʀᴜᴘᴏ #nomegrupo#…* ↴

*#numero# ɴᴀ̃ᴏ ꜰᴀᴢ ᴍᴀɪꜱ ᴘᴀʀᴛᴇ ᴅᴏ ɢʀᴜᴘᴏ.*

*ᴀɢᴏʀᴀ ᴏ ɢʀᴜᴘᴏ #nomegrupo# ᴄᴏɴᴛᴀ ᴄᴏᴍ #membros# ᴍᴇᴍʙʀᴏꜱ.*

*ᴀɢʀᴀᴅᴇᴄᴇᴍᴏꜱ ᴘᴇʟᴏ ᴛᴇᴍᴘᴏ ǫᴜᴇ ᴠᴏᴄᴇ̂ ᴘᴀꜱꜱᴏᴜ ᴄᴏɴᴏꜱᴄᴏ ᴇ ᴅᴇꜱᴇᴊᴀᴍᴏꜱ ᴛᴜᴅᴏ ᴅᴇ ʙᴏᴍ ᴘᴀʀᴀ ᴠᴏᴄᴇ̂.* 💙`,
fundobv: null,
fundobv_tipo: null,
fundosaiu: null,
fundosaiu_tipo: null
},
{
bemvindo2: false,
legendabv2: `「🧊」 #numero#

*ꜱᴇᴊᴀ ʙᴇᴍ-ᴠɪɴᴅᴏ(ᴀ) ᴀᴏ ɢʀᴜᴘᴏ #nomegrupo#!*

> *ᴀɢᴏʀᴀ ꜱᴏᴍᴏꜱ #membros# ᴍᴇᴍʙʀᴏꜱ. 💙*`,
legendasaiu2: `「🧊」 #numero#

*ᴏ ᴜꜱᴜᴀ́ʀɪᴏ ꜱᴀɪᴜ ᴅᴏ ɢʀᴜᴘᴏ #nomegrupo#.*

> *ᴀɢᴏʀᴀ ꜱᴏᴍᴏꜱ #membros# ᴍᴇᴍʙʀᴏꜱ.*`
},
{
bemvindo3: false,
legendabv3: `「🧊」 #numero#

*ʙᴇᴍ-ᴠɪɴᴅᴏ(ᴀ) ᴀᴏ #nomegrupo#!*

> *ᴜꜱᴇ #prefixo#menu ᴘᴀʀᴀ ᴠᴇʀ ᴍᴇᴜꜱ ᴄᴏᴍᴀɴᴅᴏꜱ.*`,
legendasaiu3: `「🧊」 #numero#

*ᴀᴛᴇ́ ᴍᴀɪꜱ! ᴏ ɢʀᴜᴘᴏ #nomegrupo# ꜰɪᴄᴀ ᴄᴏᴍ #membros# ᴍᴇᴍʙʀᴏꜱ.*`
}
]
}
] : undefined
const normalizarGrupo = dados => {
if (!isGroup)
return undefined
const padraoGp = data_IDGP[0]
const salvoGp = Array.isArray(dados) && dados[0] && typeof dados[0] === 'object' ? dados[0] : {}
const funcoesSalvas = salvoGp.funcoes && typeof salvoGp.funcoes === 'object' ? salvoGp.funcoes : {}
const antilinkSalvo = funcoesSalvas.antilink && typeof funcoesSalvas.antilink === 'object' ? funcoesSalvas.antilink : {}
const antidddSalvo = funcoesSalvas.antiddd && typeof funcoesSalvas.antiddd === 'object' ? funcoesSalvas.antiddd : {}
const welcomeSalvo = Array.isArray(salvoGp.wellcome) ? salvoGp.wellcome : []
return [
{
...padraoGp,
...salvoGp,
name: groupName || salvoGp.name || 'Grupo',
groupId: from,
funcoes: {
...padraoGp.funcoes,
...funcoesSalvas,
antilink: {
...padraoGp.funcoes.antilink,
...antilinkSalvo,
ativo: Boolean(antilinkSalvo.ativo),
nivel: ['easy', 'medium', 'hard'].includes(antilinkSalvo.nivel) ? antilinkSalvo.nivel : null
},
modoia: {
...padraoGp.funcoes.modoia,
...(funcoesSalvas.modoia && typeof funcoesSalvas.modoia === 'object' ? funcoesSalvas.modoia : {}),
ativo: Boolean(funcoesSalvas?.modoia?.ativo ?? funcoesSalvas?.modoia === true),
tipo: ['texto', 'audio'].includes(funcoesSalvas?.modoia?.tipo) ? funcoesSalvas.modoia.tipo : 'texto'
},
antiddd: {
...padraoGp.funcoes.antiddd,
...antidddSalvo,
ativo: Boolean(antidddSalvo.ativo),
listaProibidos: Array.isArray(antidddSalvo.listaProibidos) ? [
...new Set(antidddSalvo.listaProibidos.map(v => String(v).replace(/\D/g, '').slice(0, 2)).filter(v => /^\d{2}$/.test(v)))
] : []
}
},
listanegra: Array.isArray(salvoGp.listanegra) ? [...new Set(salvoGp.listanegra.map(v => String(v || '').trim()).filter(Boolean))] : [],
ausentes: Array.isArray(salvoGp.ausentes) ? salvoGp.ausentes.filter(item => item && item.id) : [],
advertencias: salvoGp.advertencias && typeof salvoGp.advertencias === 'object' && !Array.isArray(salvoGp.advertencias) ? salvoGp.advertencias : {},
silenciados: Array.isArray(salvoGp.silenciados) ? salvoGp.silenciados.filter(item => item && item.id) : [],
atividades: salvoGp.atividades && typeof salvoGp.atividades === 'object' && !Array.isArray(salvoGp.atividades) ? salvoGp.atividades : {},
economia: salvoGp.economia && typeof salvoGp.economia === 'object' ? salvoGp.economia : { usuarios: {} },
rpg: salvoGp.rpg && typeof salvoGp.rpg === 'object' ? salvoGp.rpg : { usuarios: {} },
namoro: {
pedidos: Array.isArray(salvoGp?.namoro?.pedidos) ? salvoGp.namoro.pedidos.filter(item => item && item.de && item.para) : [],
casais: Array.isArray(salvoGp?.namoro?.casais) ? salvoGp.namoro.casais.filter(item => item && item.a && item.b) : []
},
casamento: {
pedidos: Array.isArray(salvoGp?.casamento?.pedidos) ? salvoGp.casamento.pedidos.filter(item => item && item.de && item.para) : [],
casais: Array.isArray(salvoGp?.casamento?.casais) ? salvoGp.casamento.casais.filter(item => item && item.a && item.b) : []
},
jogos: typeof salvoGp.jogos === 'boolean' ? salvoGp.jogos : false,
wellcome: padraoGp.wellcome.map((padrao, indice) => ({
...padrao,
...(welcomeSalvo[indice] && typeof welcomeSalvo[indice] === 'object' ? welcomeSalvo[indice] : {})
}))
}
]
}
if (isGroup && !fs.existsSync(dirGroup))
salvarJson(dirGroup, data_IDGP)
let dataGp = isGroup ? normalizarGrupo(lerJson(dirGroup, data_IDGP)) : undefined
if (isGroup)
salvarJson(dirGroup, dataGp)
const setGp = dados => {
if (!isGroup)
return
const final = normalizarGrupo(dados)
dataGp = final
salvarJson(dirGroup, final)
}
const isWelkom = isGroup ? Boolean(dataGp?.[0]?.wellcome?.[0]?.bemvindo1) : undefined
const isWelkom2 = isGroup ? Boolean(dataGp?.[0]?.wellcome?.[1]?.bemvindo2) : undefined
const isWelkom3 = isGroup ? Boolean(dataGp?.[0]?.wellcome?.[2]?.bemvindo3) : undefined
const limpo = valor => {
let txt = String(valor || '').trim()
if (!txt)
return ''
if (txt.endsWith('@c.us'))
txt = txt.replace('@c.us', '@s.whatsapp.net')
const pos = txt.indexOf('@')
if (pos < 0) {
const numero = txt.replace(/\D/g, '')
return numero ? `${numero}@s.whatsapp.net` : txt
}
const usuario = txt.slice(0, pos).split(':')[0]
const servidor = txt.slice(pos + 1)
return usuario && servidor ? `${usuario}@${servidor}` : txt
}
const nJid = (alvo, extras = []) => {
let bruto = alvo
if (bruto && typeof bruto === 'object') {
bruto = bruto.phoneNumber || bruto.participantAlt || bruto.participantAlt || bruto.jid || bruto.id || bruto.participant || bruto.lid || ''
}
const lista = [...extras, bruto].map(limpo).filter(Boolean)
const numero = lista.find(v => v.endsWith('@s.whatsapp.net'))
if (numero)
return jidNormalizedUser(numero)
const atual = limpo(bruto)
if (!atual)
return ''
if (atual.endsWith('@lid') && groupMembers.length) {
const membro = groupMembers.find(v => {
const ids = [v?.lid, v?.id, v?.jid, v?.participant].map(limpo)
return ids.includes(atual)
})
const real = [membro?.phoneNumber, membro?.participantAlt, membro?.participantAlt, membro?.jid, membro?.id]
.map(limpo)
.find(v => v.endsWith('@s.whatsapp.net'))
if (real)
return jidNormalizedUser(real)
}
return jidNormalizedUser(atual)
}
const NumeroDoBot = String(tokito.user?.id || '').split(':')[0].split('@')[0]
const botNumber = jidNormalizedUser(`${NumeroDoBot}@s.whatsapp.net`)
let sender = info.key?.fromMe
? botNumber
: nJid(isGroup
? info?.key?.participantAlt || info?.key?.senderAlt || info?.participantAlt || info?.key?.participant || info?.participant || ''
: info?.key?.remoteJidAlt || info?.key?.senderAlt || info?.key?.participantAlt || info?.key?.remoteJid || from, [
info?.key?.participantAlt,
info?.key?.senderAlt,
info?.participantAlt,
info?.key?.remoteJidAlt
])
const messagesC = PR_String.slice(0).trim().split(/ +/).shift().toLowerCase()
const argss = body.split(/ +/g)
const numeroDonoLimpo = String(ownerNumber || '').replace(/\D/g, '')
const nmrdn = numeroDonoLimpo ? `${numeroDonoLimpo}@s.whatsapp.net` : ''
const donosExtras = [1, 2, 3, 4, 5, 6].map(i => String(nescessario[`numero_dono${i}`] || '').replace(/\D/g, '')).filter(numero => numero.length >= 10).map(numero => `${numero}@s.whatsapp.net`)
const numerodono = [...new Set([nmrdn, ...donosExtras].filter(Boolean))]
const isBotoff = nescessario.botoff
const isBotoes = nescessario.botoes !== false
const isModobn = isGroup ? dataGp?.[0]?.jogos === true : false
const isBot = info.key?.fromMe === true
const SoDono = numerodono.includes(sender) || isBot
const DonoOficial = nmrdn ? nmrdn === sender : false
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : []
const membrosGrupo = isGroup ? getMembros(groupMembers) : []
const adminsNormalizados = groupAdmins.map(admin => nJid(admin)).filter(Boolean)
const senderNormalizado = nJid(sender)
const botNormalizado = nJid(botNumber)
const isGroupAdmins = SoDono || adminsNormalizados.includes(senderNormalizado)
const isBotGroupAdmins = !isGroup || adminsNormalizados.includes(botNormalizado)
let vipAlterado = false
for (let i = vip.length - 1; i >= 0; i--) {
const membroVip = vip[i]
if (membroVip?.infinito === true || !membroVip?.expiraEm)
continue
const expiracao = new Date(membroVip.expiraEm).getTime()
if (!Number.isFinite(expiracao) || expiracao <= Date.now()) {
vip.splice(i, 1)
vipAlterado = true
}
}
if (vipAlterado)
fs.writeFileSync(caminhoVip, JSON.stringify(vip, null, 2))
const isVip = vip.map(i => nJid(i?.id)).includes(senderNormalizado) || SoDono
const isCargo = SoDono ? 'Mestre' : isGroupAdmins ? 'Administrador' : isVip ? 'VIP' : 'Membro'
const isChVip = isVip ? 'ꜱɪᴍ ✅' : 'ɴᴀᴏ ❌'
const Res_SoDono = mess.onlyOwner()
// FUNÇÕES DE MARCAÇÕES ESSENCIAL \\
const ctxMsg =
mensagem?.extendedTextMessage?.contextInfo ||
mensagem?.stickerMessage?.contextInfo ||
mensagem?.imageMessage?.contextInfo ||
mensagem?.videoMessage?.contextInfo ||
mensagem?.audioMessage?.contextInfo ||
mensagem?.documentMessage?.contextInfo ||
info.message?.extendedTextMessage?.contextInfo ||
info.message?.stickerMessage?.contextInfo ||
info.message?.imageMessage?.contextInfo ||
info.message?.videoMessage?.contextInfo ||
info.message?.audioMessage?.contextInfo ||
info.message?.documentMessage?.contextInfo ||
{}
const normalizar = alvo => nJid(alvo)
const quotedParticipant = nJid(ctxMsg.participantAlt || ctxMsg.participant || '', [ctxMsg.participantAlt])
const mentionedList = Array.isArray(ctxMsg.mentionedJid) ? ctxMsg.mentionedJid.map(v => nJid(v)).filter(Boolean) : []
const menc_sticker = mentionedList.length > 0 ? mentionedList[0] : quotedParticipant || null
let menc_prt = quotedParticipant || ''
const menc_jid2 = mentionedList
const qSeguro = String(q || '')
const temMention = qSeguro.includes('@')
const menc_os2 = temMention ? menc_jid2.length > 0 ? menc_jid2[0] : menc_sticker || null : menc_prt || menc_sticker
const menc_jid = normalizar(menc_os2 || sender)
const sender_ou_n = temMention ? menc_jid2?.[0] || menc_sticker || sender : menc_prt || menc_sticker || sender
const numClean = txt => String(txt || '').replace(/[()+\-\/\s]/g, '') + '@s.whatsapp.net'
const mrc_ou_numero = qSeguro.length > 6 && !temMention ? numClean(qSeguro) : normalizar(menc_prt || menc_sticker || sender)
const marc_tds = temMention ? normalizar(menc_jid) : qSeguro.length > 6 && !temMention ? numClean(qSeguro) : normalizar(menc_prt || menc_sticker || sender)
const menc_prt_nmr = qSeguro.length > 12 && !temMention ? numClean(qSeguro) : normalizar(menc_prt || menc_sticker || sender)

const alvoPorMarcacaoOuNumero = () => {
const marcado = mentionedList[0] || ''

if (marcado)
return nJid(marcado)

let numero = String(q || '').replace(/\D/g, '')

if (numero) {
if (!numero.startsWith('55') && [10, 11].includes(numero.length))
numero = `55${numero}`

if (numero.length < 10 || numero.length > 15)
return ''

return jidNormalizedUser(`${numero}@s.whatsapp.net`)
}

const ehResposta = Boolean(
ctxMsg?.stanzaId ||
ctxMsg?.quotedMessage
)

if (ehResposta) {
const respondido =
ctxMsg?.participantAlt ||
ctxMsg?.participant ||
quotedParticipant ||
''

if (respondido)
return nJid(respondido)
}

return ''
}

const destino = async () => {
const marcado = mentionedList[0] || ''
const respondido = quotedParticipant || ''
let numero = String(q || '').replace(/\D/g, '')
if (numero &&
!numero.startsWith('55') &&
[10, 11].includes(numero.length)) {
numero = `55${numero}`
}
const bruto = marcado ||
respondido ||
(numero ? `${numero}@s.whatsapp.net` : '')
if (!bruto)
return null
let alvo = nJid(bruto)
let consulta = alvo
if (String(consulta).endsWith('@lid')) {
const membro = isGroup
? groupMembers.find(m => {
const ids = [
m?.lid,
m?.id,
m?.jid,
m?.participant
]
.map(limpo)
.filter(Boolean)
return ids.includes(limpo(consulta))
})
: null
const real = [
membro?.phoneNumber,
membro?.participantPn,
membro?.participantAlt,
membro?.jid,
membro?.id
]
.map(limpo)
.find(jid => jid.endsWith('@s.whatsapp.net'))
if (real)
consulta = nJid(real)
if (String(consulta).endsWith('@lid') &&
typeof tokito.signalRepository?.lidMapping?.getPNForLID === 'function') {
const pn = await tokito.signalRepository.lidMapping
.getPNForLID(consulta)
.catch(() => null)
if (pn)
consulta = nJid(pn)
}
}
const mencao = consulta || alvo
return {
alvo,
consulta,
mencao,
numero: String(mencao)
.split('@')[0]
.split(':')[0]
}
}
//////////////////////////====//////////////////////////////////
const dataHoraBR = new Date().toLocaleString('pt-BR', { timeZone: fuso })
const horaBR = new Date().toLocaleTimeString('pt-BR', {
timeZone: fuso,
hour: '2-digit',
minute: '2-digit',
second: '2-digit'
})
let baileysVersion = 'desconhecida'
try {
const pkgPath = path.join(__dirname, 'node_modules', '@whiskeysockets', 'baileys', 'package.json')
baileysVersion = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))?.version || 'desconhecida'
}
catch {
baileysVersion = 'desconhecida'
}
const numeroSender = String(sender || '').split('@')[0].split(':')[0].replace(/\D/g, '')
const messageId = String(info.key?.id || '')
const whatIsPhone = messageId.substring(0, 2) === '3A' ? 'iPhone 🍎' : messageId.length > 21 ? 'Android 👤' : 'Whatsapp Web 🌐'
const canalInfo = (mentions = []) => {
const canal = channeldl
return {
...(canal && canal !== '0@newsletter' ? {
isForwarded: true,
forwardingScore: 1,
forwardedNewsletterMessageInfo: {
newsletterJid: canal,
newsletterName: NomeDoBot,
serverMessageId: ''
}
} : {}),
mentionedJid: mentions
}
}
const newsletter = canalInfo([])
const isVerificado = nescessario.verificado
const SeloMeta = {
key: {
participant: '13135550002@s.whatsapp.net',
remoteJid: 'status@broadcast',
fromMe: false,
id: 'TOKITO-VERIFICADO'
},
message: {
contactMessage: {
displayName: `${pushname}`,
vcard: `BEGIN:VCARD
VERSION:3.0
N:;${pushname};;;
FN:${pushname}
item1.TEL;waid=13135550002:13135550002
item1.X-ABLabel:Verificado
END:VCARD`,
contextInfo: {
forwardingScore: 1,
isForwarded: true
}
}
}
}
let selo = isVerificado ? SeloMeta : info
const reply = async (text, mentions = []) => {
if (!text)
text = ' '

const textoSeguro = modulos.sanitizarErro(
String(text),
[API_KEY_TOKITO]
) || ' '

return tokito.sendMessage(from, {
text: textoSeguro,
contextInfo: canalInfo(mentions)
}, {
quoted: selo
})
}
const enviarbuton = botoes => botoes.filter(item => item?.texto && item?.id).map(item => ({
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: String(item.texto),
id: String(item.id)
})
}))
const botaozin = async (texto, botoes = [], mentions = []) => {
if (!isBotoes || !botoes.length)
return reply(texto, mentions)
try {
const msg = generateWAMessageFromContent(from, {
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: canalInfo(mentions),
body: proto.Message.InteractiveMessage.Body.create({ text: modulos.sanitizarErro(String(texto || ' '), [API_KEY_TOKITO]) }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: `` }),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: enviarbuton(botoes) })
})
}, {
quoted: selo,
userJid: tokito.user.id
})
return tokito.relayMessage(from, msg.message, { messageId: msg.key.id })
}
catch (e) {
console.log('[BOTÕES TEXTO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]) || 'Erro sem detalhes')
return reply(texto, mentions)
}
}
const reagir = async (jid, emoji) => {
return tokito.sendMessage(jid, {
react: {
text: emoji,
key: info.key
}
})
}
const dylanModz = async (texto, emoji = '🧊', botoes = []) => {
await reagir(from, emoji)
const caminhoVideo = path.join(__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'fotomenu.mp4')
const caminhoImagem = path.join(__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'fotomenu.png')
const contextInfo = canalInfo([sender])
let resultado
if (!isBotoes || !botoes.length) {
if (fs.existsSync(caminhoVideo))
resultado = await tokito.sendMessage(from, {
video: fs.readFileSync(caminhoVideo),
mimetype: 'video/mp4',
gifPlayback: true,
caption: texto,
contextInfo
}, { quoted: selo })
else if (fs.existsSync(caminhoImagem))
resultado = await tokito.sendMessage(from, {
image: fs.readFileSync(caminhoImagem),
caption: texto,
contextInfo
}, { quoted: selo })
else
resultado = await tokito.sendMessage(from, {
text: texto,
contextInfo
}, { quoted: selo })
}
else {
try {
let header
if (fs.existsSync(caminhoVideo)) {
const media = await prepareWAMessageMedia({
video: fs.readFileSync(caminhoVideo),
gifPlayback: true
}, { upload: tokito.waUploadToServer })
header = proto.Message.InteractiveMessage.Header.create({
hasMediaAttachment: true,
videoMessage: media.videoMessage
})
}
else if (fs.existsSync(caminhoImagem)) {
const media = await prepareWAMessageMedia({ image: fs.readFileSync(caminhoImagem) }, { upload: tokito.waUploadToServer })
header = proto.Message.InteractiveMessage.Header.create({
hasMediaAttachment: true,
imageMessage: media.imageMessage
})
}
const dados = {
contextInfo,
body: proto.Message.InteractiveMessage.Body.create({ text: texto }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: `` }),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: enviarbuton(botoes) })
}
if (header)
dados.header = header
const msg = generateWAMessageFromContent(from, { interactiveMessage: proto.Message.InteractiveMessage.create(dados) }, {
quoted: selo,
userJid: tokito.user.id
})
resultado = await tokito.relayMessage(from, msg.message, { messageId: msg.key.id })
}
catch (e) {
console.log('[BOTÕES MENU]', modulos.sanitizarErro(e, [API_KEY_TOKITO]) || 'Erro sem detalhes')
if (fs.existsSync(caminhoVideo))
resultado = await tokito.sendMessage(from, {
video: fs.readFileSync(caminhoVideo),
mimetype: 'video/mp4',
gifPlayback: true,
caption: texto,
contextInfo
}, { quoted: selo })
else if (fs.existsSync(caminhoImagem))
resultado = await tokito.sendMessage(from, {
image: fs.readFileSync(caminhoImagem),
caption: texto,
contextInfo
}, { quoted: selo })
else
resultado = await tokito.sendMessage(from, {
text: texto,
contextInfo
}, { quoted: selo })
}
}
try {
const cfgAudio = modulos.globalCfg()
if (cfgAudio.audioMenu && cfgAudio.audioMenuArquivo) {
const localAudio = path.isAbsolute(cfgAudio.audioMenuArquivo) ? cfgAudio.audioMenuArquivo : path.join(__dirname, cfgAudio.audioMenuArquivo)
if (fs.existsSync(localAudio))
await tokito.sendMessage(from, {
audio: fs.readFileSync(localAudio),
mimetype: 'audio/mpeg',
ptt: false,
contextInfo: canalInfo([sender])
}, { quoted: selo })
}
}
catch (e) {
console.log('[ÁUDIO MENU]', modulos.sanitizarErro(e, [API_KEY_TOKITO]) || 'Erro sem detalhes')
}
return resultado
}
const limpar = valor => String(valor || 'arquivo').replace(/[\\/:*?"<>|]/g, '').trim().slice(0, 100) || 'arquivo'
const achar = (...lista) => lista.find(valor => typeof valor === 'string' && /^https?:\/\//i.test(valor)) || null
const itens = dados => {
const lista = dados?.resultado || dados?.resultados || dados?.result || dados?.data || dados?.videos || []
if (Array.isArray(lista))
return lista
if (Array.isArray(lista?.videos))
return lista.videos
if (Array.isArray(lista?.items))
return lista.items
return []
}
const contextoJogos = (comandoAtual = command) => ({
bot: tokito, tokito, info, from, sender, body, q, command: comandoAtual, prefix, isCmd,
isGroup, isGroupAdmins, isBotGroupAdmins, SoDono, dataGp, setGp,
mentions: menc_jid2.length ? menc_jid2 : menc_prt ? [menc_prt] : [],
reply, reagir, selo, newsletter, canalInfo, API_URL, API_KEY_TOKITO,
channeldl, NomeDoBot, isBotoes
})

const plug = (cmd = command) => {
const ctx = {
__dirname, __filename, tokito, upsert, info, mensagem, type, content, from, sender,
body, Procurar_String, budy2, budy, PR_String, q, args, command: cmd, prefix, isCmd,
isGroup, isStatus, stub, pushname, groupMetadata, groupName, groupDesc, groupMembers,
dirGroup, data_IDGP, dataGp, setGp, isWelkom, isWelkom2, isWelkom3, limpo, nJid,
NumeroDoBot, botNumber, messagesC, argss, nmrdn, numerodono, isBotoff, isBotoes,
isModobn, isBot, SoDono, DonoOficial, groupAdmins, membrosGrupo, adminsNormalizados,
senderNormalizado, botNormalizado, isGroupAdmins, isBotGroupAdmins, vip, isVip,
isCargo, isChVip, Res_SoDono, ctxMsg, normalizar, quotedParticipant, mentionedList,
menc_sticker, menc_prt, menc_jid2, qSeguro, temMention, menc_os2, menc_jid,
sender_ou_n, numClean, mrc_ou_numero, marc_tds, menc_prt_nmr, alvoPorMarcacaoOuNumero, destino, dataHoraBR,
horaBR, baileysVersion, numeroSender, messageId, whatIsPhone, canalInfo, newsletter,
isVerificado, SeloMeta, selo, reply, enviarbuton, botaozin, reagir, contextoJogos,
dylanModz, limpar, achar, itens, NomeDoBot, ownerName, channel, channeldl,
ownerNumber, CREDENTIALS_USER, API_URL, API_KEY_TOKITO, getContentType,
jidNormalizedUser, proto, prepareWAMessageMedia, generateWAMessageFromContent,
getFileBuffer, DLT_FL, getGroupAdmins, getMembros, getRandom, fs, path, os, colors,
performance, linguagem, mess, axios, setting, nescessario, caminhoVip, arquivo,
pasta, fuso, sendVideoAsSticker, sendVideoAsSticker2, sendImageAsSticker2,
sendImageAsSticker, funcoes, detector, plugins, regrasPlugins, aluguel, modulos,
similar, comandos, modoJogosAtivo, getAdivinheGame, saveAdivinheGame,
removeAdivinheGame, criarAdivinheGame, enviarAdivinhe, getQuizGame, saveQuizGame,
removeQuizGame, criarQuizGame, enviarQuiz, getForcaGame, saveForcaGame,
removeForcaGame, criarForcaGame, enviarForca, getCacaGame, saveCacaGame,
removeCacaGame, criarCacaGame, enviarCaca, getMinesGame, saveMinesGame,
removeMinesGame, criarMinesGame, enviarMines, getVelhaGame, saveVelhaGame,
removeVelhaGame, criarTabuleiroVelha, getDamaGame, saveDamaGame, removeDamaGame,
criarTabuleiroDama, mesmoJid, mencionarJogo, enviarTextoJogos, ler, salvar, extrair,
apagar, agora, enviar, avisar, processar, iniciar, pathgroupjson, salvarJson, lerJson
}

return ctx
}
// ===== COMANDOS SEM PREFIXO + FIGURINHA REGISTRADA =====
if (!isCmd) {
const mapaSemPrefixo = modulos.noPrefix()
const partesLivres = String(body || '').trim().split(/\s+/).filter(Boolean)
const gatilho = modulos.norm(partesLivres[0] || '')
const real = mapaSemPrefixo[gatilho]
if (real && plugins.resolver(real)) {
isCmd = true
command = real
args = partesLivres.slice(1)
q = args.join(' ')
}
}
if (!isCmd && mensagem?.stickerMessage?.fileSha256) {
const h = Buffer.from(mensagem.stickerMessage.fileSha256).toString('base64')
const real = modulos.figuras()[h]
if (real && plugins.resolver(real)) {
isCmd = true
command = real
args = []
q = ''
}
}
// ===== TRAVAS GLOBAIS =====
const cfgGlobal = modulos.globalCfg()
if (cfgGlobal.bloqueados.map(v => nJid(v)).includes(senderNormalizado) && !SoDono)
continue
if (!isGroup && cfgGlobal.antipv === true && !SoDono)
continue
if (isGroup && dataGp?.[0]?.funcoes?.bangp === true && !SoDono && isCmd)
continue
const chatType = isGroup ? 'GRUPO' : 'PRIVADO'
const groupInfo = isGroup ? `(${groupName || 'SEM NOME'})` : '(Privado)'
const msgType = isCmd ? 'COMANDO' : 'MENSAGEM'
const msgContent = isCmd
? `${prefix}${command}${q ? ` ${q}` : ''}`
: body ||
(mensagem?.imageMessage ? `[ IMAGEM${mensagem.imageMessage.caption ? `: ${mensagem.imageMessage.caption}` : ''} ]` :
mensagem?.videoMessage ? `[ VÍDEO${mensagem.videoMessage.caption ? `: ${mensagem.videoMessage.caption}` : ''} ]` :
mensagem?.audioMessage ? '[ ÁUDIO ]' :
mensagem?.stickerMessage ? '[ FIGURINHA ]' :
mensagem?.documentMessage ? `[ DOCUMENTO: ${mensagem.documentMessage.fileName || 'ARQUIVO'} ]` :
mensagem?.contactMessage ? '[ CONTATO ]' :
mensagem?.contactsArrayMessage ? '[ CONTATOS ]' :
mensagem?.locationMessage ? '[ LOCALIZAÇÃO ]' :
mensagem?.liveLocationMessage ? '[ LOCALIZAÇÃO AO VIVO ]' :
mensagem?.reactionMessage ? `[ REAÇÃO: ${mensagem.reactionMessage.text || 'SEM EMOJI'} ]` :
mensagem?.pollCreationMessage ? `[ ENQUETE: ${mensagem.pollCreationMessage.name || 'SEM TÍTULO'} ]` :
mensagem?.pollCreationMessageV2 ? `[ ENQUETE: ${mensagem.pollCreationMessageV2.name || 'SEM TÍTULO'} ]` :
mensagem?.pollCreationMessageV3 ? `[ ENQUETE: ${mensagem.pollCreationMessageV3.name || 'SEM TÍTULO'} ]` :
'[ MENSAGEM SEM TEXTO ]')
const branco = valor => colors.white(String(valor ?? ''))
console.log(`${colors.cyan('╭──. ݁ ⛧ ₊ ⊹ . ݁ ˖ ❆ິ̸ . ݁──╮')}
${colors.cyan('|')} ${branco(isGroup ? '👥 MENSAGEM NO GRUPO' : '👤 MENSAGEM NO PRIVADO')}
${colors.cyan('╰──. ݁ ⛧ ₊ ⊹ . ݁ ˖ ❆ິ̸ . ݁──╯')}
${colors.cyan('╭──. ݁ ⛧ ₊ ⊹ . ݁ ˖ ❆ິ̸ . ݁──╮')}
${colors.cyan('| 👤 USUÁRIO:')} ${branco(String(pushname || 'SEM NOME').toUpperCase())}
${colors.cyan('| 📱 NÚMERO:')} ${branco(numeroSender || 'NÃO IDENTIFICADO')}
${colors.cyan('| 📲 APARELHO:')} ${branco(whatIsPhone || 'DESCONHECIDO')}
${colors.cyan('| 💬 CHAT:')} ${branco(`${chatType} ${groupInfo}`)}
${colors.cyan('| 📨 TIPO:')} ${branco(msgType)}
${colors.cyan('| 📝 CONTEÚDO:')} ${branco(msgContent)}
${colors.cyan('| 🕒 HORA:')} ${branco(dataHoraBR)}
${colors.cyan('╰──. ݁ ⛧ ₊ ⊹ 🧊 . ݁ ˖ ❆ິ̸ . ݁──╯')}`)
if (budy2 === 'prefixo') {
if (isBotoff && !SoDono)
continue
await botaozin(mess.prefixChanged(prefix), [{
texto: mess.botaoMenu(),
id: `${prefix}menu`
}], [sender])
continue
}
if (isGroup && nescessario.aluguel === true && !SoDono && !aluguel.autorizado(from)) {
if (isCmd)
await reply(mess.aluguelBloqueado(prefix))
continue
}
const bloqueadoEventoPre = await plugins.evento(plug(), 'pre').catch(error => {
console.log('[PLUGIN EVENTO PRE]', modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes')
return false
})
if (bloqueadoEventoPre)
continue
const bloqueada = await funcoes.verificar({
tokito,
info,
original: info.message,
mensagem,
from,
sender,
body,
isGroup,
isGroupAdmins,
isBotGroupAdmins,
dono: SoDono,
isCmd,
pushname,
groupMembers,
menc_jid2,
dataGp,
setGp,
newsletter,
selo
}).catch(error => {
console.log('[FUNÇÕES AUTOMÁTICAS]', modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes')
return false
})
if (bloqueada)
continue
const respondeuJogo = await funcoes.jogos.verificar(contextoJogos()).catch(error => {
console.log('[JOGOS AUTOMÁTICOS]', modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes')
return false
})
if (respondeuJogo)
continue
const bloqueadoEventoPlugin = await plugins.evento(plug()).catch(error => {
console.log('[PLUGIN EVENTO]', modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes')
return false
})
if (bloqueadoEventoPlugin)
continue
if (!isCmd)
continue
if (isGroup && dataGp?.[0]?.funcoes?.soadm === true && !isGroupAdmins && !SoDono) {
await reply(mess.soadmBloqueado())
continue
}
if (isBotoff && !SoDono)
continue
const acessoPlugin = regrasPlugins.verificar({
cfg: nescessario,
command,
isGroup,
from,
SoDono,
isVip
})
if (acessoPlugin.bloqueado) {
await reply(acessoPlugin.tipo === 'vip' ? mess.onlyVipCmd(acessoPlugin.nome) : mess.blockCmdNegado(acessoPlugin.nome))
continue
}
////////////////////////////////////////////////////////////////////////////////////
let erroPlugin = null

const rodou = await plugins.executar(command, plug()).catch(error => {
erroPlugin = error

console.log(
'[PLUGIN]',
command,
modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes'
)

return false
})

if (erroPlugin) {
if (modulos.ehErroApi(erroPlugin, API_URL)) {
await reply(
mess.erroApi(modulos.siteApi(API_URL))
)
}
else {
await reply(
mess.error()
)
}

continue
}

if (rodou)
continue
const inicio = performance.now()

try {
const inicioSimilar = performance.now()
const achado = similar(comandos(), command)
const tempoSimilar = performance.now() - inicioSimilar
await botaozin(mess.commandNotFound({
prefix,
command,
nome: achado.nome ? `${prefix}${achado.nome}` : 'Nenhum',
porcentagem: `${Number(achado.porcentagem || 0).toFixed(1)}%`,
tempo: `${tempoSimilar.toFixed(3)} ms`
}), [{
texto: mess.botaoMenu(),
id: `${prefix}menu`
}], [sender])
}
catch (error) {
console.log(colors.red('❌ Erro na semelhança:'), modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes')
await botaozin(mess.commandNotFound({
prefix,
command,
nome: 'Nenhum',
porcentagem: '0.0%',
tempo: '0.000 ms'
}), [{
texto: mess.botaoMenu(),
id: `${prefix}menu`
}], [sender])
}
continue
}
}
catch (erro) {
console.log(colors.red('❌ erro ao reiniciar :('), modulos.sanitizarErro(erro, [API_KEY_TOKITO]) || 'Erro sem detalhes')
}
}

module.exports = starttokito
