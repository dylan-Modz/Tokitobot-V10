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

/*
* Arquivo central de módulos, funções e mensagens da base.
* Author: dylan Modz.
*/
const baileys = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const os = require('os')
const crypto = require('crypto')
const util = require('util')
const P = require('pino')
const pino = require('pino')
const NodeCache = require('node-cache')
const linkfy = require('linkifyjs')
const qrterminal = require('qrcode-terminal')
const colors = require('colors')
const readline = require('readline')
const https = require('https')
const { exec, spawn, execSync } = require('child_process')
const { performance } = require('perf_hooks')
const { randomBytes } = require('crypto')
const { v4: uuidv4 } = require('uuid')
const { linguagem, mess } = require('./index.js')
const { menu } = require('./menus.js')
const { sendVideoAsSticker2, sendImageAsSticker2 } = require('../../funcoes/js/rename2.js')
const { sendImageAsSticker, sendVideoAsSticker } = require('../../funcoes/js/rename.js')

let cfonts

try {
cfonts = require('cfonts')
}
catch {
cfonts = { render: texto => ({ string: String(texto) }) }
}

const banner2 = cfonts.render('dylan Modz', {
font: 'console',
align: 'center',
gradient: ['blue', 'blue']
})

const banner3 = cfonts.render('TOKITO|V10', {
font: 'block',
align: 'center',
gradient: ['red', 'magenta']
})

const { default: makeWASocket, downloadContentFromMessage, fetchLatestBaileysVersion, useMultiFileAuthState, makeInMemoryStore, DisconnectReason, relayWAMessage, mentionedJid, processTime, MediaType, Browser, MessageType, Presence, Mimetype, Browsers, delay, getLastMessageInChat, downloadMediaMessage, generateWAMessageFromContent, proto, prepareWAMessageMedia, jidNormalizedUser, getContentType, makeCacheableSignalKeyStore } = baileys
//////////////////////////====//////////////////////////////////
const setting = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'INFO_DADOS', 'config-all.json'), 'utf8'))

const nescessario = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'INFO_DADOS', 'nescessario.json'), 'utf8'))

const vip = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'membros', 'vip.json'), 'utf8'))
//////////////////////////====//////////////////////////////////
const caminhoVip = path.join(__dirname, '..', 'membros', 'vip.json')

const arquivo = path.join(__dirname, '..', 'grupos', 'horario.json')

const pasta = path.join(__dirname, '..', 'midiabv')

const fuso = 'America/Fortaleza'

function getGroupAdmins(participants = []) {
return participants.filter(p => p?.admin === 'admin' || p?.admin === 'superadmin').map(p => {
let base = p?.phoneNumber || p?.participantPn || p?.jid || p?.id || p?.participant
if (!base)
return null
if (String(base).includes('@lid'))
base = p?.phoneNumber || p?.participantPn || p?.jid || base
return jidNormalizedUser(String(base))
}).filter(Boolean)
}

function getMembros(participants = []) {
return participants.filter(p => !p?.admin).map(p => {
let base = p?.phoneNumber || p?.participantPn || p?.jid || p?.id || p?.participant
if (!base)
return null
if (String(base).includes('@lid'))
base = p?.phoneNumber || p?.participantPn || p?.jid || base
return jidNormalizedUser(String(base))
}).filter(Boolean)
}

const getRandom = ext => `${Math.floor(Math.random() * 10000)}${ext}`

function estado(numero = '') {
let n = String(numero || '').replace(/\D/g, '')
if (n.startsWith('55') && n.length >= 12)
n = n.slice(2)
const ddd = n.slice(0, 2)
const estados = {
'11': 'São Paulo',
'12': 'São Paulo',
'13': 'São Paulo',
'14': 'São Paulo',
'15': 'São Paulo',
'16': 'São Paulo',
'17': 'São Paulo',
'18': 'São Paulo',
'19': 'São Paulo',
'21': 'Rio de Janeiro',
'22': 'Rio de Janeiro',
'24': 'Rio de Janeiro',
'27': 'Espírito Santo',
'28': 'Espírito Santo',
'31': 'Minas Gerais',
'32': 'Minas Gerais',
'33': 'Minas Gerais',
'34': 'Minas Gerais',
'35': 'Minas Gerais',
'37': 'Minas Gerais',
'38': 'Minas Gerais',
'41': 'Paraná',
'42': 'Paraná',
'43': 'Paraná',
'44': 'Paraná',
'45': 'Paraná',
'46': 'Paraná',
'47': 'Santa Catarina',
'48': 'Santa Catarina',
'49': 'Santa Catarina',
'51': 'Rio Grande do Sul',
'53': 'Rio Grande do Sul',
'54': 'Rio Grande do Sul',
'55': 'Rio Grande do Sul',
'61': 'Distrito Federal',
'62': 'Goiás',
'64': 'Goiás',
'63': 'Tocantins',
'65': 'Mato Grosso',
'66': 'Mato Grosso',
'67': 'Mato Grosso do Sul',
'68': 'Acre',
'69': 'Rondônia',
'71': 'Bahia',
'73': 'Bahia',
'74': 'Bahia',
'75': 'Bahia',
'77': 'Bahia',
'79': 'Sergipe',
'81': 'Pernambuco',
'87': 'Pernambuco',
'82': 'Alagoas',
'83': 'Paraíba',
'84': 'Rio Grande do Norte',
'85': 'Ceará',
'88': 'Ceará',
'86': 'Piauí',
'89': 'Piauí',
'91': 'Pará',
'93': 'Pará',
'94': 'Pará',
'92': 'Amazonas',
'97': 'Amazonas',
'95': 'Roraima',
'96': 'Amapá',
'98': 'Maranhão',
'99': 'Maranhão'
}
return estados[ddd] || 'Desconhecido'
}

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const time = new Date().toLocaleTimeString('pt-BR', {
timeZone: 'America/Fortaleza',
hour: '2-digit',
minute: '2-digit',
second: '2-digit'
})

const hora = time

const date = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' })

const getBuffer = async (url, options = {}) => {
const resposta = await axios.get(url, {
...options,
responseType: 'arraybuffer'
})
return Buffer.from(resposta.data)
}

const fetchJson = async (url, options = {}) => {
const resposta = await axios.get(url, options)
return resposta.data
}

const fetchText = async (url, options = {}) => {
const resposta = await axios.get(url, {
...options,
responseType: 'text'
})
return resposta.data
}

const getBase64 = async (url, options = {}) => {
const buffer = await getBuffer(url, options)
return buffer.toString('base64')
}

function DLT_FL(file) {
try {
if (file && fs.existsSync(file))
fs.unlinkSync(file)
}
catch {
}
}

const getFileBuffer = async (mediakey, mediaType) => {
const stream = await downloadContentFromMessage(mediakey, mediaType)
let buffer = Buffer.from([])
for await (const chunk of stream)
buffer = Buffer.concat([buffer, chunk])
return buffer
}

function DLT_FL(file) {
try {
if (file && fs.existsSync(file))
fs.unlinkSync(file)
}
catch {
}
}

function convertBytes(bytes) {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
if (!bytes)
return 'n/a'
const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
return i === 0 ? `${bytes} ${sizes[i]}` : `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

function ANT_LTR_MD_EMJ(str) {
for (let i = 0; i < String(str || '').length; i++)
if (String(str).charCodeAt(i) > 255)
return true
return false
}

function kyun(seconds) {
const pad = value => (value < 10 ? '0' : '') + value
const horas = Math.floor(seconds / 3600 % 24)
const minutos = Math.floor(seconds % 3600 / 60)
const segundos = Math.floor(seconds % 60)
return `${pad(horas)}h ${pad(minutos)}m ${pad(segundos)}s`
}

const sendPoll = (tokito, id, name = '', values = [], selectableCount = 1) => {
return tokito.sendMessage(id, {
poll: {
name,
values,
selectableCount
},
messageContextInfo: { messageSecret: randomBytes(32) }
}, {
id,
options: { userJid: tokito?.user?.id }
})
}

module.exports = {
...baileys,
makeWASocket,
downloadContentFromMessage,
fetchLatestBaileysVersion,
useMultiFileAuthState,
makeInMemoryStore,
DisconnectReason,
relayWAMessage,
mentionedJid,
processTime,
MediaType,
Browser,
MessageType,
Presence,
Mimetype,
Browsers,
delay,
getLastMessageInChat,
downloadMediaMessage,
generateWAMessageFromContent,
proto,
prepareWAMessageMedia,
jidNormalizedUser,
getContentType,
makeCacheableSignalKeyStore,
Boom,
axios,
fs,
path,
os,
crypto,
util,
P,
pino,
NodeCache,
linkfy,
qrterminal,
colors,
readline,
cfonts,
banner2,
banner3,
https,
exec,
spawn,
execSync,
performance,
randomBytes,
uuidv4,
fetch,
time,
hora,
date,
linguagem,
mess,
menu,
sleep,
getBuffer,
fetchJson,
fetchText,
getBase64,
getFileBuffer,
DLT_FL,
convertBytes,
ANT_LTR_MD_EMJ,
kyun,
sendPoll,
setting,
nescessario,
vip,
getGroupAdmins,
getMembros,
getRandom,
estado,
caminhoVip,
arquivo,
pasta,
fuso,
sendVideoAsSticker2,
sendImageAsSticker2,
sendVideoAsSticker,
sendImageAsSticker
}
