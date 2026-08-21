const axios = require('axios')
const fs = require('fs')
const path = require('path')
const os = require('os')
const Crypto = require('crypto')
const { execFile } = require('child_process')
const { writeExif2 } = require('../../../funcoes/js/exif2')

const MAX_FIGURINHAS = 30
const MAX_STICKER_BYTES = 1024 * 1024
const META = {
packId: 'TOKITO-APIS',
packname: 'Channel - Tokito Apis',
author: 'Channel - Tokito Apis',
categories: ['🧊']
}

const temporario = ext => path.join(
os.tmpdir(),
`tokito-pack-${Date.now()}-${Crypto.randomBytes(6).toString('hex')}${ext}`
)

const apagar = arquivo => {
try {
if (arquivo && fs.existsSync(arquivo))
fs.unlinkSync(arquivo)
}
catch {}
}

const executarFFmpeg = args => new Promise((resolve, reject) => {
execFile('ffmpeg', args, { maxBuffer: 50 * 1024 * 1024 }, (erro, stdout, stderr) => {
if (erro)
return reject(new Error(String(stderr || erro.message || erro)))
resolve(stdout)
})
})

async function baixarImagem(url, headers = {}) {
const response = await axios.get(url, {
responseType: 'arraybuffer',
headers,
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
'-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000',
'-frames:v', '1',
'-vcodec', 'libwebp',
'-lossless', '0',
'-compression_level', '6',
'-q:v', '86',
'-preset', 'picture',
'-an',
saida
])
if (!fs.existsSync(saida) || !fs.statSync(saida).size)
throw new Error('O FFmpeg não gerou o WebP.')
return fs.readFileSync(saida)
}
finally {
apagar(entrada)
apagar(saida)
}
}

async function colocarMetadata(buffer) {
let arquivo = null
try {
arquivo = await writeExif2({
data: buffer,
mimetype: 'image/webp'
}, META)
const final = fs.readFileSync(arquivo)
if (!final.length)
throw new Error('A figurinha ficou vazia após aplicar os metadados.')
return final
}
finally {
apagar(arquivo)
}
}

async function prepararImagem(buffer) {
const webp = await imagemParaWebp(buffer)
const final = await colocarMetadata(webp)
if (final.length > MAX_STICKER_BYTES)
throw new Error('Figurinha maior que 1 MB após conversão.')
return final
}

async function criarThumbnail(buffer) {
const entrada = temporario('.webp')
const saida = temporario('.jpg')
fs.writeFileSync(entrada, buffer)
try {
await executarFFmpeg([
'-y',
'-i', entrada,
'-vf', 'scale=252:252:force_original_aspect_ratio=decrease,pad=252:252:(ow-iw)/2:(oh-ih)/2:color=white',
'-frames:v', '1',
'-q:v', '5',
saida
])
if (!fs.existsSync(saida) || !fs.statSync(saida).size)
throw new Error('O FFmpeg não gerou a miniatura.')
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
for (let k = 0; k < 8; k++)
c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
tabela[n] = c >>> 0
}
return tabela
})()

const crc32 = buffer => {
let crc = 0xffffffff
for (const byte of buffer)
crc = tabelaCRC[(crc ^ byte) & 0xff] ^ (crc >>> 8)
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
return Buffer.concat([...locais, diretorio, fim])
}

const prepararTiposStickerPack = async () => {
const defaults = await import('@whiskeysockets/baileys/lib/Defaults/index.js')
defaults.MEDIA_PATH_MAP['sticker-pack'] = '/mms/sticker-pack'
defaults.MEDIA_PATH_MAP['thumbnail-sticker-pack'] = '/mms/thumbnail-sticker-pack'
defaults.MEDIA_HKDF_KEY_MAPPING['sticker-pack'] = 'Sticker Pack'
defaults.MEDIA_HKDF_KEY_MAPPING['thumbnail-sticker-pack'] = 'Sticker Pack Thumbnail'
}

const getMediaKeysStickerPack = (mediaKey, tipo) => {
const info = tipo === 'thumbnail-sticker-pack' ? 'Sticker Pack Thumbnail' : 'Sticker Pack'
const expandida = Buffer.from(Crypto.hkdfSync(
'sha256',
Buffer.from(mediaKey),
Buffer.alloc(0),
Buffer.from(`WhatsApp ${info} Keys`),
112
))
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
const criptografado = Buffer.concat([cipher.update(buffer), cipher.final()])
const mac = Crypto.createHmac('sha256', macKey)
.update(iv)
.update(criptografado)
.digest()
.subarray(0, 10)
const final = Buffer.concat([criptografado, mac])
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
fs.writeFileSync(arquivo, criptografado.arquivo)
try {
return await tokito.waUploadToServer(arquivo, {
fileEncSha256B64: criptografado.fileEncSha256.toString('base64'),
mediaType: tipo,
timeoutMs: 60000
})
}
finally {
apagar(arquivo)
}
}

async function criarStickerPackNativo(ctx, buffers, nomePack) {
const {
tokito,
from,
proto,
generateWAMessageFromContent,
selo,
sender,
NomeDoBot
} = ctx
const processadas = buffers.filter(v => Buffer.isBuffer(v) && v.length).slice(0, MAX_FIGURINHAS)
if (!processadas.length)
throw new Error('Nenhuma figurinha válida foi encontrada.')
await prepararTiposStickerPack()
const arquivosZip = []
const stickers = []
for (let i = 0; i < processadas.length; i++) {
const webp = processadas[i]
const hash = Crypto.createHash('sha256').update(webp).digest('base64url')
const fileName = `${String(i).padStart(2, '0')}_${hash}.webp`
arquivosZip.push({ nome: fileName, dados: webp })
stickers.push({
fileName,
isAnimated: false,
emojis: ['🧊'],
accessibilityLabel: '',
isLottie: false,
mimetype: 'image/webp'
})
}
const stickerPackId = `TOKITO-${Crypto.randomBytes(12).toString('hex')}`
const trayIconFileName = `${stickerPackId}.webp`
const capa = processadas[0]
arquivosZip.push({ nome: trayIconFileName, dados: capa })
const zipBuffer = criarZip(arquivosZip)
const pacoteCriptografado = await criptografarMedia(zipBuffer, 'sticker-pack', null)
const uploadPacote = await enviarUpload(tokito, pacoteCriptografado, 'sticker-pack')
const thumbnail = await criarThumbnail(capa)
const thumbCriptografado = await criptografarMedia(
thumbnail,
'thumbnail-sticker-pack',
pacoteCriptografado.mediaKey
)
const uploadThumb = await enviarUpload(tokito, thumbCriptografado, 'thumbnail-sticker-pack')
const nome = String(nomePack || 'Tokito Pack').trim().slice(0, 64) || 'Tokito Pack'
const pack = proto.Message.StickerPackMessage.fromObject({
stickerPackId,
name: nome,
publisher: 'Channel - Tokito Apis',
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
{ stickerPackMessage: pack },
{ quoted: selo, userJid: tokito.user.id }
)
await tokito.relayMessage(from, msg.message, { messageId: msg.key.id })
return stickers.length
}

module.exports = {
MAX_FIGURINHAS,
MAX_STICKER_BYTES,
META,
temporario,
apagar,
baixarImagem,
prepararImagem,
criarStickerPackNativo
}
