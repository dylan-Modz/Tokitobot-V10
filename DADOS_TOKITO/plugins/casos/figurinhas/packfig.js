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
const Crypto = require('crypto')
const {
MAX_FIGURINHAS,
baixarImagem,
prepararImagem,
criarStickerPackNativo
} = require('./_packbase')

const base = 'https://www.pinterest.com'
const search = '/resource/BaseSearchResource/get/'
const RESULTADOS_BUSCA = 60

const headers = {
accept: 'application/json, text/javascript, */*, q=0.01',
referer: 'https://www.pinterest.com/',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
'x-app-version': 'a9522f',
'x-pinterest-appstate': 'active',
'x-pinterest-pws-handler': 'www/[username]/[slug].js',
'x-requested-with': 'XMLHttpRequest'
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
if (!setHeaders)
return null
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
const { data } = await axios.get(`${base}${search}`, {
headers: {
...headers,
cookie: cookies
},
params,
timeout: 30000
})
const results = (data?.resource_response?.data?.results || [])
.filter(v => v?.images?.orig?.url)
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
image: result.images.orig.url
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

module.exports = {
nome: 'packfig',
comandos: ['packfig', 'pack', 'stickerpack', 'packsticker'],
categoria: 'figurinhas',
info: {
descricao: 'Pesquisa imagens e cria um pack nativo de figurinhas.',
uso: 'packfig muichiro tokito',
categoria: 'figurinhas'
},
async executar(ctx) {
with (ctx) {
try {
const pesquisa = String(q || '').trim()
if (!pesquisa) {
return reply(
`- 📦 \`𝙿𝙰𝙲𝙺 𝙳𝙴 𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂\`\n\n` +
`> *『 ${prefix + command} ɴᴏᴍᴇ 』— ᴅɪɢɪᴛᴇ ᴏ ᴛᴇᴍᴀ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴘᴇsǫᴜɪsᴀʀ. 🙇‍♂️*\n\n` +
`> *『 𝙴𝚇𝙴𝙼𝙿𝙻𝙾 』— ${prefix + command} muichiro tokito*`
)
}
await reagir(from, '📦')
await reply(
`- ⏳ \`𝙲𝚁𝙸𝙰𝙽𝙳𝙾 𝙾 𝙿𝙰𝙲𝙺\`\n\n` +
`> *『 𝙱𝚄𝚂𝙲𝙰 』— ${pesquisa}*\n` +
`> *『 𝙻𝙸𝙼𝙸𝚃𝙴 』— ᴀᴛᴇ́ ${MAX_FIGURINHAS} ғɪɢᴜʀɪɴʜᴀs.*\n` +
`> *『 𝙰𝚂𝚂𝙸𝙽𝙰𝚃𝚄𝚁𝙰 』— Channel - Tokito Apis*`
)
const resultado = await searchPinterest(pesquisa)
if (!resultado.status || !resultado.pins?.length) {
await reagir(from, '❌').catch(() => {})
return reply(
`- ❌ \`𝙽𝙴𝙽𝙷𝚄𝙼 𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾\`\n\n` +
`> *ɴᴀ̃ᴏ ᴄᴏɴsᴇɢᴜɪ ᴇɴᴄᴏɴᴛʀᴀʀ ɪᴍᴀɢᴇɴs ᴠᴀ́ʟɪᴅᴀs ᴘᴀʀᴀ "${pesquisa}".*`
)
}
const vistos = new Set()
const pins = resultado.pins.filter(pin => {
if (!pin?.image || vistos.has(pin.image))
return false
vistos.add(pin.image)
return true
})
const prontas = []
const hashes = new Set()
for (let i = 0; i < pins.length; i++) {
if (prontas.length >= MAX_FIGURINHAS)
break
try {
const original = await baixarImagem(pins[i].image, {
accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
referer: 'https://www.pinterest.com/',
'user-agent': headers['user-agent']
})
const webp = await prepararImagem(original)
const hash = Crypto.createHash('sha256').update(webp).digest('base64url')
if (hashes.has(hash))
continue
hashes.add(hash)
prontas.push(webp)
}
catch (error) {
console.log(`[PACKFIG IMAGEM ${i + 1}]`, error?.message || error)
}
}
if (!prontas.length)
throw new Error('Nenhuma imagem pôde ser convertida em figurinha.')
const total = await criarStickerPackNativo(ctx, prontas, pesquisa)
await reagir(from, '✅').catch(() => {})
return reply(
`- ✅ \`𝙿𝙰𝙲𝙺 𝙲𝚁𝙸𝙰𝙳𝙾\`\n\n` +
`> *『 𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂 』— ${total}/${MAX_FIGURINHAS}*\n` +
`> *『 𝙰𝚂𝚂𝙸𝙽𝙰𝚃𝚄𝚁𝙰 』— Channel - Tokito Apis*`
)
}
catch (error) {
console.log('[PACKFIG]', error?.stack || error?.message || error)
await reagir(from, '❌').catch(() => {})
return reply(
`- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝙿𝙰𝙲𝙺\`\n\n` +
`> *ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄʀɪᴀʀ ᴏ ᴘᴀᴄᴋ. ᴛᴇɴᴛᴇ ɴᴏᴠᴀᴍᴇɴᴛᴇ. 🙇‍♂️*`
)
}
}
}
}
