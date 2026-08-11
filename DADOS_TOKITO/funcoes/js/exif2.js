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

const fs = require('fs')
const path = require('path')
const os = require('os')
const Crypto = require('crypto')
const { execFile } = require('child_process')

const temporario = ext => {
return path.join(
os.tmpdir(),
`tokito-${Date.now()}-${Crypto.randomBytes(6).toString('hex')}${ext}`
)
}

const apagar = file => {
try {
if (
file &&
fs.existsSync(file)
) {
fs.unlinkSync(file)
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
{
maxBuffer: 50 * 1024 * 1024
},
(erro, stdout, stderr) => {
if (erro) {
return reject(
new Error(
String(
stderr ||
erro.message ||
erro
)
)
)
}

resolve(stdout)
}
)
})
}

const mediaBuffer = media => {
if (
Buffer.isBuffer(media)
) {
return media
}

if (
media instanceof Uint8Array
) {
return Buffer.from(media)
}

if (
typeof media === 'string' &&
fs.existsSync(media)
) {
return fs.readFileSync(media)
}

return Buffer.alloc(0)
}

async function converterWebp2(media, tipo = 'image') {
const entrada = temporario(
tipo === 'video'
? '.mp4'
: '.jpg'
)

const saida = temporario(
'.webp'
)

const buffer = mediaBuffer(
media
)

if (!buffer.length) {
throw new Error(
'Mídia vazia ou inválida.'
)
}

fs.writeFileSync(
entrada,
buffer
)

try {
const filtro = tipo === 'video'
? 'fps=10,scale=512:512'
: 'scale=512:512'

const args = tipo === 'video'
? [
'-y',

'-i',
entrada,

'-t',
'9.5',

'-vf',
filtro,

'-vcodec',
'libwebp',

'-lossless',
'0',

'-compression_level',
'6',

'-q:v',
'40',

'-loop',
'0',

'-preset',
'default',

'-an',

saida
]
: [
'-y',

'-i',
entrada,

'-vf',
filtro,

'-frames:v',
'1',

'-vcodec',
'libwebp',

'-lossless',
'0',

'-compression_level',
'6',

'-q:v',
'80',

'-preset',
'picture',

'-an',

saida
]

await executarFFmpeg(
args
)

if (
!fs.existsSync(saida) ||
!fs.statSync(saida).size
) {
throw new Error(
'O FFmpeg não gerou o arquivo WebP.'
)
}

return fs.readFileSync(
saida
)
}
finally {
apagar(entrada)
apagar(saida)
}
}

const criarChunk = (tipo, dados) => {
const cabecalho = Buffer.alloc(
8
)

const preenchimento = dados.length % 2
? Buffer.from([0])
: Buffer.alloc(0)

cabecalho.write(
tipo,
0,
4,
'ascii'
)

cabecalho.writeUInt32LE(
dados.length,
4
)

return Buffer.concat([
cabecalho,
dados,
preenchimento
])
}

const lerChunks = buffer => {
const chunks = []

let posicao = 12

while (
posicao + 8 <= buffer.length
) {
const tipo = buffer.toString(
'ascii',
posicao,
posicao + 4
)

const tamanho = buffer.readUInt32LE(
posicao + 4
)

const inicio = posicao + 8
const fim = inicio + tamanho

if (
fim > buffer.length
) {
break
}

chunks.push({
tipo,

dados: Buffer.from(
buffer.subarray(
inicio,
fim
)
)
})

posicao =
fim +
(tamanho % 2)
}

return chunks
}

const escrever24 = (
buffer,
valor,
posicao
) => {
buffer[posicao] =
valor & 255

buffer[posicao + 1] =
valor >> 8 & 255

buffer[posicao + 2] =
valor >> 16 & 255
}

const dimensoes = chunks => {
const vp8x = chunks.find(
c => c.tipo === 'VP8X'
)

if (
vp8x?.dados?.length >= 10
) {
return {
largura:
1 +
vp8x.dados.readUIntLE(
4,
3
),

altura:
1 +
vp8x.dados.readUIntLE(
7,
3
)
}
}

const vp8 = chunks.find(
c => c.tipo === 'VP8 '
)

if (
vp8?.dados?.length >= 10
) {
const marca = vp8.dados.indexOf(
Buffer.from([
0x9d,
0x01,
0x2a
])
)

if (
marca >= 0 &&
marca + 7 <= vp8.dados.length
) {
return {
largura:
vp8.dados.readUInt16LE(
marca + 3
) & 0x3fff,

altura:
vp8.dados.readUInt16LE(
marca + 5
) & 0x3fff
}
}
}

const vp8l = chunks.find(
c => c.tipo === 'VP8L'
)

if (
vp8l?.dados?.length >= 5 &&
vp8l.dados[0] === 0x2f
) {
const b1 = vp8l.dados[1]
const b2 = vp8l.dados[2]
const b3 = vp8l.dados[3]
const b4 = vp8l.dados[4]

return {
largura:
1 +
(
b1 |
((b2 & 0x3f) << 8)
),

altura:
1 +
(
(b2 >> 6) |
(b3 << 2) |
((b4 & 0x0f) << 10)
)
}
}

return {
largura: 512,
altura: 512
}
}

const criarExif = metadata => {
const json = {
'sticker-pack-id':
metadata?.packId ||
'TOKITOBOT-V10',

'sticker-pack-name':
metadata?.packname ||
'TokitoBot V10',

'sticker-pack-publisher':
metadata?.author ||
'dylan Modz',

'emojis':
Array.isArray(
metadata?.categories
)
? metadata.categories
: ['🧊']
}

const exifAttr = Buffer.from([
0x49,
0x49,
0x2a,
0x00,
0x08,
0x00,
0x00,
0x00,
0x01,
0x00,
0x41,
0x57,
0x07,
0x00,
0x00,
0x00,
0x00,
0x00,
0x16,
0x00,
0x00,
0x00
])

const jsonBuff = Buffer.from(
JSON.stringify(json),
'utf8'
)

const exif = Buffer.concat([
exifAttr,
jsonBuff
])

exif.writeUInt32LE(
jsonBuff.length,
14
)

return exif
}

const adicionarExif = (
buffer,
metadata = {}
) => {
if (
buffer.toString(
'ascii',
0,
4
) !== 'RIFF' ||
buffer.toString(
'ascii',
8,
12
) !== 'WEBP'
) {
throw new Error(
'Arquivo WebP inválido.'
)
}

const chunks = lerChunks(
buffer
).filter(
c => c.tipo !== 'EXIF'
)

let vp8x = chunks.find(
c => c.tipo === 'VP8X'
)

if (vp8x) {
vp8x.dados[0] |= 0x08
}

else {
const {
largura,
altura
} = dimensoes(
chunks
)

const dados = Buffer.alloc(
10
)

dados[0] = 0x08

if (
chunks.some(
c => c.tipo === 'ALPH'
)
) {
dados[0] |= 0x10
}

if (
chunks.some(
c => c.tipo === 'ANIM'
)
) {
dados[0] |= 0x02
}

escrever24(
dados,
Math.max(
0,
largura - 1
),
4
)

escrever24(
dados,
Math.max(
0,
altura - 1
),
7
)

chunks.unshift({
tipo: 'VP8X',
dados
})
}

const corpo = Buffer.concat([
...chunks.map(
c => criarChunk(
c.tipo,
c.dados
)
),

criarChunk(
'EXIF',
criarExif(
metadata
)
)
])

const cabecalho = Buffer.alloc(
12
)

cabecalho.write(
'RIFF',
0,
4,
'ascii'
)

cabecalho.writeUInt32LE(
corpo.length + 4,
4
)

cabecalho.write(
'WEBP',
8,
4,
'ascii'
)

return Buffer.concat([
cabecalho,
corpo
])
}

async function imageToWebp2(media) {
return converterWebp2(
media,
'image'
)
}

async function videoToWebp2(media) {
return converterWebp2(
media,
'video'
)
}

async function escreverExif2(
media,
metadata,
tipo
) {
const convertido =
tipo === 'video'
? await videoToWebp2(media)
: await imageToWebp2(media)

const saida = temporario(
'.webp'
)

fs.writeFileSync(
saida,
adicionarExif(
convertido,
metadata
)
)

return saida
}

async function writeExifImg2(
media,
metadata = {}
) {
return escreverExif2(
media,
metadata,
'image'
)
}

async function writeExifVid2(
media,
metadata = {}
) {
return escreverExif2(
media,
metadata,
'video'
)
}

async function writeExif2(
media,
metadata = {}
) {
const mimetype = String(
media?.mimetype ||
''
).toLowerCase()

const dados = mediaBuffer(
media?.data
)

if (!dados.length) {
throw new Error(
'Mídia vazia ou inválida.'
)
}

let convertido

if (
mimetype.includes('webp')
) {
convertido = dados
}

else if (
mimetype.includes('image')
) {
convertido =
await imageToWebp2(
dados
)
}

else if (
mimetype.includes('video')
) {
convertido =
await videoToWebp2(
dados
)
}

else {
throw new Error(
'Tipo de mídia não suportado.'
)
}

const saida = temporario(
'.webp'
)

fs.writeFileSync(
saida,
adicionarExif(
convertido,
metadata
)
)

return saida
}

module.exports = {
imageToWebp2,
videoToWebp2,
writeExifImg2,
writeExifVid2,
writeExif2
}
