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

const axios = require('axios')
const fs = require('fs')
const path = require('path')
const os = require('os')
const Crypto = require('crypto')
const { execFile } = require('child_process')

const base = 'https://www.pinterest.com'
const search = '/resource/BaseSearchResource/get/'
const MAX_FIGURINHAS = 30
const RESULTADOS_BUSCA = 60
const MAX_STICKER_BYTES = 1024 * 1024

const headers = {
accept: 'application/json, text/javascript, */*, q=0.01',
referer: 'https://www.pinterest.com/',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
'x-app-version': 'a9522f',
'x-pinterest-appstate': 'active',
'x-pinterest-pws-handler': 'www/[username]/[slug].js',
'x-requested-with': 'XMLHttpRequest'
}

const temporario = ext => {
return path.join(
os.tmpdir(),
`tokito-pack-${Date.now()}-${Crypto.randomBytes(6).toString('hex')}${ext}`
)
}

const apagar = arquivo => {
try {
if (arquivo && fs.existsSync(arquivo)) {
fs.unlinkSync(arquivo)
}
}
catch {
}
}

const executarFFmpeg = args => {
return new Promise((resolve, reject) => {
execFile(
'ffmpeg',
args,
{ maxBuffer: 50 * 1024 * 1024 },
(erro, stdout, stderr) => {
if (erro) {
return reject(new Error(String(stderr || erro.message || erro)))
}

resolve(stdout)
}
)
})
}

async function getCookies() {
try {
const response = await axios.get(base, {
headers: {
'user-agent': headers['user-agent']
},
timeout: 20000
})

const setHeaders = response.headers?.['set-cookie']

if (!setHeaders) {
return null
}

return setHeaders
.map(cookieString => String(cookieString).split(';')[0].trim())
.join('; ')
}
catch (error) {
console.log('[PACKFIG COOKIES]', error?.message || error)
return null
}
}

async function searchPinterest(query) {
if (!query) {
return {
status: false,
message: 'Por favor, insira um termo de pesquisa correto!'
}
}

try {
const cookies = await getCookies()

if (!cookies) {
return {
status: false,
message: 'Não foi possível recuperar os cookies. Tente novamente mais tarde.'
}
}

const params = {
source_url: `/search/pins/?q=${encodeURIComponent(query)}`,
data: JSON.stringify({
options: {
isPrefetch: false,
query,
scope: 'pins',
bookmarks: [''],
page_size: RESULTADOS_BUSCA
},
context: {}
}),
_: Date.now()
}

const { data } = await axios.get(
`${base}${search}`,
{
headers: {
...headers,
cookie: cookies
},
params,
timeout: 30000
}
)

const results = (
data?.resource_response?.data?.results || []
).filter(v => v?.images?.orig?.url)

if (!results.length) {
return {
status: false,
message: `Nenhum resultado foi encontrado para o termo de pesquisa: ${query}`
}
}

return {
status: true,
pins: results.map(result => ({
id: result.id,
title: result.title || 'Sem título',
description: result.description || 'Sem descrição',
pin_url: `https://pinterest.com/pin/${result.id}`,
image: result.images.orig.url,
uploader: {
username: result.pinner?.username || '',
full_name: result.pinner?.full_name || '',
profile_url: result.pinner?.username
? `https://pinterest.com/${result.pinner.username}`
: ''
}
}))
}
}
catch (error) {
console.log('[PACKFIG BUSCA]', error?.response?.status || error?.message || error)

return {
status: false,
message: 'Ocorreu um erro durante a pesquisa; tente novamente mais tarde.'
}
}
}

async function baixarImagem(url) {
const response = await axios.get(url, {
responseType: 'arraybuffer',
headers: {
accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
referer: 'https://www.pinterest.com/',
'user-agent': headers['user-agent']
},
timeout: 30000,
maxContentLength: 15 * 1024 * 1024,
maxBodyLength: 15 * 1024 * 1024
})

return Buffer.from(response.data)
}

async function imagemParaWebp(buffer) {
const entrada = temporario('.img')
const saida = temporario('.webp')

fs.writeFileSync(entrada, buffer)

try {
await executarFFmpeg([
'-y',
'-i', entrada,
'-vf', 'scale=512:512',
'-frames:v', '1',
'-vcodec', 'libwebp',
'-lossless', '0',
'-compression_level', '6',
'-q:v', '88',
'-preset', 'picture',
'-an',
saida
])

if (!fs.existsSync(saida) || !fs.statSync(saida).size) {
throw new Error('O FFmpeg não gerou o WebP.')
}

return fs.readFileSync(saida)
}
finally {
apagar(entrada)
apagar(saida)
}
}

async function criarThumbnail(buffer) {
const entrada = temporario('.webp')
const saida = temporario('.jpg')

fs.writeFileSync(entrada, buffer)

try {
await executarFFmpeg([
'-y',
'-i', entrada,
'-vf', 'scale=252:252',
'-frames:v', '1',
'-q:v', '5',
saida
])

if (!fs.existsSync(saida) || !fs.statSync(saida).size) {
throw new Error('O FFmpeg não gerou a miniatura.')
}

return fs.readFileSync(saida)
}
finally {
apagar(entrada)
apagar(saida)
}
}

const tabelaCRC = (() => {
const tabela = new Uint32Array(256)

for (let n = 0; n < 256; n++) {
let c = n

for (let k = 0; k < 8; k++) {
c = c & 1
? 0xedb88320 ^ (c >>> 1)
: c >>> 1
}

tabela[n] = c >>> 0
}

return tabela
})()

const crc32 = buffer => {
let crc = 0xffffffff

for (const byte of buffer) {
crc = tabelaCRC[(crc ^ byte) & 0xff] ^ (crc >>> 8)
}

return (crc ^ 0xffffffff) >>> 0
}

const dataHoraDos = () => {
const agora = new Date()
const ano = Math.max(1980, agora.getFullYear())
const mes = agora.getMonth() + 1
const dia = agora.getDate()
const hora = agora.getHours()
const minuto = agora.getMinutes()
const segundo = Math.floor(agora.getSeconds() / 2)

return {
data: ((ano - 1980) << 9) | (mes << 5) | dia,
hora: (hora << 11) | (minuto << 5) | segundo
}
}

const criarZip = arquivos => {
const locais = []
const centrais = []
let deslocamento = 0
const horario = dataHoraDos()

for (const arquivo of arquivos) {
const nome = Buffer.from(arquivo.nome, 'utf8')
const dados = Buffer.from(arquivo.dados)
const crc = crc32(dados)

const local = Buffer.alloc(30)
local.writeUInt32LE(0x04034b50, 0)
local.writeUInt16LE(20, 4)
local.writeUInt16LE(0, 6)
local.writeUInt16LE(0, 8)
local.writeUInt16LE(horario.hora, 10)
local.writeUInt16LE(horario.data, 12)
local.writeUInt32LE(crc, 14)
local.writeUInt32LE(dados.length, 18)
local.writeUInt32LE(dados.length, 22)
local.writeUInt16LE(nome.length, 26)
local.writeUInt16LE(0, 28)

locais.push(local, nome, dados)

const central = Buffer.alloc(46)
central.writeUInt32LE(0x02014b50, 0)
central.writeUInt16LE(20, 4)
central.writeUInt16LE(20, 6)
central.writeUInt16LE(0, 8)
central.writeUInt16LE(0, 10)
central.writeUInt16LE(horario.hora, 12)
central.writeUInt16LE(horario.data, 14)
central.writeUInt32LE(crc, 16)
central.writeUInt32LE(dados.length, 20)
central.writeUInt32LE(dados.length, 24)
central.writeUInt16LE(nome.length, 28)
central.writeUInt16LE(0, 30)
central.writeUInt16LE(0, 32)
central.writeUInt16LE(0, 34)
central.writeUInt16LE(0, 36)
central.writeUInt32LE(0, 38)
central.writeUInt32LE(deslocamento, 42)

centrais.push(central, nome)

deslocamento += local.length + nome.length + dados.length
}

const diretorio = Buffer.concat(centrais)
const fim = Buffer.alloc(22)

fim.writeUInt32LE(0x06054b50, 0)
fim.writeUInt16LE(0, 4)
fim.writeUInt16LE(0, 6)
fim.writeUInt16LE(arquivos.length, 8)
fim.writeUInt16LE(arquivos.length, 10)
fim.writeUInt32LE(diretorio.length, 12)
fim.writeUInt32LE(deslocamento, 16)
fim.writeUInt16LE(0, 20)

return Buffer.concat([
...locais,
diretorio,
fim
])
}

const prepararTiposStickerPack = async () => {
const defaults = await import('@whiskeysockets/baileys/lib/Defaults/index.js')

defaults.MEDIA_PATH_MAP['sticker-pack'] = '/mms/sticker-pack'
defaults.MEDIA_PATH_MAP['thumbnail-sticker-pack'] = '/mms/thumbnail-sticker-pack'
defaults.MEDIA_HKDF_KEY_MAPPING['sticker-pack'] = 'Sticker Pack'
defaults.MEDIA_HKDF_KEY_MAPPING['thumbnail-sticker-pack'] = 'Sticker Pack Thumbnail'
}

const getMediaKeysStickerPack = (mediaKey, tipo) => {
const info = tipo === 'thumbnail-sticker-pack'
? 'Sticker Pack Thumbnail'
: 'Sticker Pack'

const expandida = Buffer.from(
Crypto.hkdfSync(
'sha256',
Buffer.from(mediaKey),
Buffer.alloc(0),
Buffer.from(`WhatsApp ${info} Keys`),
112
)
)

return {
iv: expandida.subarray(0, 16),
cipherKey: expandida.subarray(16, 48),
macKey: expandida.subarray(48, 80)
}
}

const criptografarMedia = async (buffer, tipo, mediaKey) => {
const chave = mediaKey || Crypto.randomBytes(32)
const { cipherKey, iv, macKey } = getMediaKeysStickerPack(chave, tipo)
const cipher = Crypto.createCipheriv('aes-256-cbc', cipherKey, iv)
const criptografado = Buffer.concat([
cipher.update(buffer),
cipher.final()
])

const mac = Crypto.createHmac('sha256', macKey)
.update(iv)
.update(criptografado)
.digest()
.subarray(0, 10)

const final = Buffer.concat([
criptografado,
mac
])

return {
mediaKey: chave,
arquivo: final,
fileLength: buffer.length,
fileSha256: Crypto.createHash('sha256').update(buffer).digest(),
fileEncSha256: Crypto.createHash('sha256').update(final).digest()
}
}

const enviarUpload = async (tokito, criptografado, tipo) => {
const arquivo = temporario('.enc')

fs.writeFileSync(
arquivo,
criptografado.arquivo
)

try {
return await tokito.waUploadToServer(
arquivo,
{
fileEncSha256B64: criptografado.fileEncSha256.toString('base64'),
mediaType: tipo,
timeoutMs: 60000
}
)
}
finally {
apagar(arquivo)
}
}

async function criarStickerPackNativo(ctx, pins, pesquisa) {
const {
tokito,
from,
proto,
generateWAMessageFromContent,
selo,
sender,
NomeDoBot,
pushname
} = ctx

await prepararTiposStickerPack()
const arquivosZip = []
const stickers = []
const processadas = []
const hashes = new Set()

for (let i = 0; i < pins.length; i++) {
if (processadas.length >= MAX_FIGURINHAS) {
break
}

try {
const original = await baixarImagem(pins[i].image)
const webp = await imagemParaWebp(original)

if (!webp.length || webp.length > MAX_STICKER_BYTES) {
continue
}

const hash = Crypto.createHash('sha256').update(webp).digest('base64url')

if (hashes.has(hash)) {
continue
}

hashes.add(hash)

const fileName = `${String(processadas.length).padStart(2, '0')}_${hash}.webp`

arquivosZip.push({
nome: fileName,
dados: webp
})

stickers.push({
fileName,
isAnimated: false,
emojis: ['🧊'],
accessibilityLabel: '',
isLottie: false,
mimetype: 'image/webp'
})

processadas.push(webp)
}
catch (error) {
console.log(`[PACKFIG IMAGEM ${i + 1}]`, error?.message || error)
}
}

if (!processadas.length) {
throw new Error('Nenhuma imagem pôde ser convertida em figurinha.')
}

const stickerPackId = `TOKITO-${Crypto.randomBytes(12).toString('hex')}`
const trayIconFileName = `${stickerPackId}.webp`
const capa = processadas[0]

arquivosZip.push({
nome: trayIconFileName,
dados: capa
})

const zipBuffer = criarZip(arquivosZip)
const pacoteCriptografado = await criptografarMedia(
zipBuffer,
'sticker-pack',
null
)

const uploadPacote = await enviarUpload(
tokito,
pacoteCriptografado,
'sticker-pack'
)

const thumbnail = await criarThumbnail(capa)
const thumbCriptografado = await criptografarMedia(
thumbnail,
'thumbnail-sticker-pack',
pacoteCriptografado.mediaKey
)

const uploadThumb = await enviarUpload(
tokito,
thumbCriptografado,
'thumbnail-sticker-pack'
)

const pack = proto.Message.StickerPackMessage.fromObject({
stickerPackId,
name: pesquisa.slice(0, 64),
publisher: `${NomeDoBot || 'TokitoBot V10'} • ${pushname || 'dylan Modz'}`.slice(0, 64),
stickers,
fileLength: pacoteCriptografado.fileLength,
fileSha256: pacoteCriptografado.fileSha256,
fileEncSha256: pacoteCriptografado.fileEncSha256,
mediaKey: pacoteCriptografado.mediaKey,
directPath: uploadPacote.directPath,
contextInfo: {
mentionedJid: sender ? [sender] : []
},
packDescription: `Pack criado pelo ${NomeDoBot || 'TokitoBot V10'}.`,
mediaKeyTimestamp: Math.floor(Date.now() / 1000),
trayIconFileName,
thumbnailDirectPath: uploadThumb.directPath,
thumbnailSha256: thumbCriptografado.fileSha256,
thumbnailEncSha256: thumbCriptografado.fileEncSha256,
thumbnailHeight: 252,
thumbnailWidth: 252,
imageDataHash: Crypto.createHash('sha256').update(thumbnail).digest('base64'),
stickerPackSize: zipBuffer.length,
stickerPackOrigin: proto.Message.StickerPackMessage.StickerPackOrigin.USER_CREATED
})

const msg = generateWAMessageFromContent(
from,
{
stickerPackMessage: pack
},
{
quoted: selo,
userJid: tokito.user.id
}
)

await tokito.relayMessage(
from,
msg.message,
{
messageId: msg.key.id
}
)

return stickers.length
}

module.exports = {
nome: 'packfig',
comandos: ['packfig', 'pack', 'stickerpack', 'packsticker'],
categoria: 'figurinhas',
info: {
descricao: 'Cria e envia um pack nativo de figurinhas.',
uso: 'packfig muichiro tokito',
categoria: 'figurinhas'
},
async executar(ctx) {
with (ctx) {
try {
const pesquisa = String(q || '').trim()

if (!pesquisa) {
return reply(
`- 📦 \`𝙿𝙰𝙲𝙺 𝙳𝙴 𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂\`

> *『 ${prefix + command} ɴᴏᴍᴇ 』— ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴏᴜ ᴛᴇᴍᴀ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴛʀᴀɴsғᴏʀᴍᴀʀ ᴇᴍ ᴜᴍ ᴘᴀᴄᴋ. 🙇‍♂️*

> *『 𝙴𝚇𝙴𝙼𝙿𝙻𝙾 』— ${prefix + command} muichiro tokito*`
)
}

await reagir(from, '📦')
await reply(
`- ⏳ \`𝙲𝚁𝙸𝙰𝙽𝙳𝙾 𝙾 𝙿𝙰𝙲𝙺\`

> *『 𝙱𝚄𝚂𝙲𝙰 』— ${pesquisa}*
> *『 𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂 』— ᴠᴏᴜ ᴛᴇɴᴛᴀʀ ᴍᴏɴᴛᴀʀ ᴜᴍ ᴘᴀᴄᴋ ᴄᴏᴍ ᴀᴛᴇ́ ${MAX_FIGURINHAS} ғɪɢᴜʀɪɴʜᴀs, ᴀɢᴜᴀʀᴅᴇ. 🙇‍♂️*`
)

const resultado = await searchPinterest(pesquisa)

if (!resultado.status || !resultado.pins?.length) {
await reagir(from, '❌').catch(() => {})

return reply(
`- ❌ \`𝙽𝙴𝙽𝙷𝚄𝙼 𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾\`

> *『 𝙱𝚄𝚂𝙲𝙰 』— ɴᴀ̃ᴏ ᴄᴏɴsᴇɢᴜɪ ᴇɴᴄᴏɴᴛʀᴀʀ ɪᴍᴀɢᴇɴs ᴠᴀ́ʟɪᴅᴀs ᴘᴀʀᴀ "${pesquisa}". ᴛᴇɴᴛᴇ ᴏᴜᴛʀᴏ ɴᴏᴍᴇ. 🙇‍♂️*`
)
}

const vistos = new Set()
const pins = resultado.pins
.filter(pin => {
if (!pin?.image || vistos.has(pin.image)) {
return false
}

vistos.add(pin.image)
return true
})

await criarStickerPackNativo(ctx, pins, pesquisa)
return

}
catch (error) {
console.log('[PACKFIG]', error?.stack || error?.message || error)
await reagir(from, '❌').catch(() => {})

return reply(
`- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝙿𝙰𝙲𝙺\`

> *『 𝙵𝙰𝙻𝙷𝙰 』— ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄʀɪᴀʀ ᴏ ᴘᴀᴄᴋ ᴅᴇ ғɪɢᴜʀɪɴʜᴀs. ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️*`
)
}
}
}
}
