/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Simih - aprendizado local por conversas.
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
'simih.json'
)

const LIMITE_GATILHO = 25
const LIMITE_RESPOSTA = 300
const LIMITE_RESPOSTAS_POR_GATILHO = 100

let memoria = {}
let sujo = false

const garantirArquivo = () => {
const pasta = path.dirname(ARQUIVO)

if (!fs.existsSync(pasta)) {
fs.mkdirSync(pasta, {
recursive: true
})
}

if (!fs.existsSync(ARQUIVO)) {
fs.writeFileSync(
ARQUIVO,
'{}\n'
)
}
}

const carregar = () => {
garantirArquivo()

try {
const dados = JSON.parse(
fs.readFileSync(
ARQUIVO,
'utf8'
)
)

return (
dados &&
typeof dados === 'object' &&
!Array.isArray(dados)
)
? dados
: {}
}
catch {
return {}
}
}

memoria = carregar()

const salvar = () => {
if (!sujo) return false

try {
garantirArquivo()

const temporario =
ARQUIVO + '.tmp'

fs.writeFileSync(
temporario,
JSON.stringify(
memoria,
null,
2
) + '\n'
)

fs.renameSync(
temporario,
ARQUIVO
)

sujo = false
return true
}
catch {
return false
}
}

if (!global.__TOKITO_SIMIH_SAVE_INTERVAL__) {
global.__TOKITO_SIMIH_SAVE_INTERVAL__ =
setInterval(
salvar,
10000
)

global.__TOKITO_SIMIH_SAVE_INTERVAL__.unref?.()
}

const normalizar = valor => {
return String(valor || '')
.replace(/\s+/g, ' ')
.trim()
.toLowerCase()
}

const desembrulhar = mensagem => {
let atual = mensagem || {}

for (let i = 0; i < 5; i++) {
if (atual?.ephemeralMessage?.message) {
atual = atual.ephemeralMessage.message
continue
}

if (atual?.viewOnceMessage?.message) {
atual = atual.viewOnceMessage.message
continue
}

if (atual?.viewOnceMessageV2?.message) {
atual = atual.viewOnceMessageV2.message
continue
}

if (atual?.viewOnceMessageV2Extension?.message) {
atual = atual.viewOnceMessageV2Extension.message
continue
}

if (atual?.documentWithCaptionMessage?.message) {
atual = atual.documentWithCaptionMessage.message
continue
}

break
}

return atual || {}
}

const textoMensagem = mensagem => {
const msg = desembrulhar(mensagem)

return String(
msg?.conversation ||
msg?.extendedTextMessage?.text ||
msg?.imageMessage?.caption ||
msg?.videoMessage?.caption ||
''
).trim()
}

const mensagemCitada = mensagem => {
const msg = desembrulhar(mensagem)
const tipos = [
'extendedTextMessage',
'imageMessage',
'videoMessage',
'documentMessage',
'audioMessage',
'stickerMessage'
]

for (const tipo of tipos) {
const quoted =
msg?.[tipo]?.contextInfo?.quotedMessage

if (quoted)
return quoted
}

return null
}

const textoCitado = mensagem => {
const quoted = mensagemCitada(mensagem)
return quoted ? textoMensagem(quoted) : ''
}

const garantirGatilho = frase => {
const chave = normalizar(frase)

if (
!chave ||
chave.length > LIMITE_GATILHO
) {
return null
}

if (
!memoria[chave] ||
typeof memoria[chave] !== 'object' ||
Array.isArray(memoria[chave])
) {
memoria[chave] = {
words: []
}

sujo = true
}

if (!Array.isArray(memoria[chave].words)) {
memoria[chave].words = []
sujo = true
}

return chave
}

const registrar = frase => {
return Boolean(
garantirGatilho(frase)
)
}

const aprender = (
pergunta,
resposta
) => {
const chave =
garantirGatilho(pergunta)

if (!chave)
return false

const respostaNormal =
normalizar(resposta)

if (
!respostaNormal ||
respostaNormal.length > LIMITE_RESPOSTA
) {
return false
}

const words =
memoria[chave].words

if (
!words.includes(
respostaNormal
)
) {
words.push(
respostaNormal
)

if (
words.length >
LIMITE_RESPOSTAS_POR_GATILHO
) {
words.splice(
0,
words.length -
LIMITE_RESPOSTAS_POR_GATILHO
)
}

sujo = true
return true
}

return false
}

const verificar = frase => {
const chave =
normalizar(frase)

if (
!chave ||
chave.length > LIMITE_GATILHO
) {
return null
}

const words =
memoria?.[chave]?.words

if (
!Array.isArray(words) ||
!words.length
) {
return null
}

if (words.length === 1)
return words[0]

return words[
Math.floor(
Math.random() *
words.length
)
]
}

const estatisticas = () => {
const entradas =
Object.values(memoria)
.filter(item =>
item &&
typeof item === 'object' &&
Array.isArray(item.words)
)

return {
frases:
entradas.length,
respostas:
entradas.reduce(
(total, item) =>
total + item.words.length,
0
),
arquivo:
ARQUIVO
}
}

module.exports = {
ARQUIVO,
LIMITE_GATILHO,
LIMITE_RESPOSTA,
normalizar,
textoMensagem,
textoCitado,
registrar,
aprender,
verificar,
estatisticas,
salvar
}
