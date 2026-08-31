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

/* Pesquisa direta no Pinterest + envio em albumMessage.
 * Dev: dylan Modz.
 */

const axios = require('axios')

const PINTEREST = 'https://www.pinterest.com'
const SEARCH_PATH = '/resource/BaseSearchResource/get/'
const LIMITE_ALBUM = 10

const headers = {
accept: 'application/json, text/javascript, */*, q=0.01',
referer: 'https://www.pinterest.com/',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
'x-app-version': 'a9522f',
'x-pinterest-appstate': 'active',
'x-pinterest-pws-handler': 'www/[username]/[slug].js',
'x-requested-with': 'XMLHttpRequest'
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function getCookies() {
try {
const response = await axios.get(PINTEREST, {
headers: {
'user-agent': headers['user-agent'],
accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
},
timeout: 20000,
maxRedirects: 5
})

const setCookies = response.headers?.['set-cookie']

if (!Array.isArray(setCookies) || !setCookies.length)
return null

return setCookies
.map(cookie => String(cookie).split(';')[0].trim())
.filter(Boolean)
.join('; ')
}
catch (error) {
console.log('[PINTEREST COOKIES]', error?.message || error)
return null
}
}

async function searchPinterest(query) {
const busca = String(query || '').trim()

if (!busca) {
return {
status: false,
message: 'Digite algo para pesquisar.',
pins: []
}
}

try {
const cookies = await getCookies()

if (!cookies) {
return {
status: false,
message: 'Não foi possível iniciar a pesquisa.',
pins: []
}
}

const params = {
source_url: `/search/pins/?q=${encodeURIComponent(busca)}`,
data: JSON.stringify({
options: {
isPrefetch: false,
query: busca,
scope: 'pins',
bookmarks: [''],
page_size: 25
},
context: {}
}),
_: Date.now()
}

const { data } = await axios.get(
`${PINTEREST}${SEARCH_PATH}`,
{
headers: {
...headers,
cookie: cookies
},
params,
timeout: 30000
}
)

const results = data?.resource_response?.data?.results || []
const vistos = new Set()
const pins = []

for (const item of results) {
const url = item?.images?.orig?.url

if (!url || vistos.has(url))
continue

vistos.add(url)
pins.push({
id: item?.id || '',
image: url,
title: item?.title || '',
description: item?.description || ''
})

if (pins.length >= LIMITE_ALBUM)
break
}

if (!pins.length) {
return {
status: false,
message: `Nenhuma imagem encontrada para: ${busca}`,
pins: []
}
}

return {
status: true,
pins
}
}
catch (error) {
console.log(
'[PINTEREST SEARCH]',
error?.response?.status || error?.message || error
)

return {
status: false,
message: 'Não foi possível concluir a pesquisa.',
pins: []
}
}
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'pinterest',

comandos: [
'pinterest',
'pin',
'buscarimagem'
],

categoria: 'downloads',

info: {
descricao: 'Pesquisa imagens e envia os resultados em álbum.',
uso: 'pinterest anime',
categoria: 'downloads'
},

async executar(ctx) {
with (ctx) {
try {
const busca = String(q || '').trim()

if (!busca) {
return reply(mess.downloadUso({ tipo: 'IMAGEM', prefix, command, exemplo: 'anime' }))
}

await reagir(from, '🔎')
await reply(mess.wait())

const resultado = await searchPinterest(busca)
const lista = resultado?.pins?.map(pin => pin.image).filter(Boolean) || []

if (!resultado.status || !lista.length) {
await reagir(from, '❌').catch(() => {})
return reply(mess.padraoAviso({
emoji: '🔎',
titulo: 'IMAGEM NÃO ENCONTRADA',
descricao: resultado.message || 'Nenhuma imagem encontrada.'
}))
}

/*
         * O campo `album` vira um albumMessage no protocolo do WhatsApp.
         * Cada mídia abaixo recebe albumParentKey apontando para essa mensagem-pai.
         */
const album = await tokito.sendMessage(
from,
{
album: {
expectedImageCount: lista.length,
expectedVideoCount: 0
},
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
},
{
quoted: selo
}
)

for (let i = 0; i < lista.length; i++) {
await tokito.sendMessage(
from,
{
image: {
url: lista[i]
},
caption: i === 0
? `*🖼️ | ʀᴇsᴜʟᴛᴀᴅᴏ ᴅᴀ ʙᴜsᴄᴀ*\n\n` +
`- *🔎 | ʙᴜsᴄᴀ → ${busca}*\n` +
`- *📸 | ɪᴍᴀɢᴇɴs → ${lista.length}*`
: undefined,
albumParentKey: album.key,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}
)

await sleep(120)
}

await reagir(from, '✅')
}
catch (e) {
console.log(
'[PINTEREST ALBUM]',
modulos.sanitizarErro(
e,
[API_KEY_TOKITO]
)
)

await reagir(from, '❌').catch(() => {})
await reply(mess.erroApi(API_URL))
}
}
}
}
)
