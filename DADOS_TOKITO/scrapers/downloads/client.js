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

/**
 * Cliente central da Tokito API para os scrapers de download.
 * Dev: Dylan Modz
 */
const axios = require('axios')
const fs = require('fs')
const path = require('path')

const CONFIG = path.join(__dirname, '..', '..', 'INFO_DADOS', 'config-all.json')

function config() {
try {
const json = JSON.parse(fs.readFileSync(CONFIG, 'utf8'))
return {
API_URL: String(json.API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, ''),
API_KEY_TOKITO: String(json.API_KEY_TOKITO || '').trim()
}
}
catch {
return {
API_URL: 'https://tokito-apis.com.br',
API_KEY_TOKITO: ''
}
}
}

function url(rota, params = {}) {
const { API_URL, API_KEY_TOKITO } = config()
const base = `${API_URL}${String(rota || '').startsWith('/') ? '' : '/'}${rota}`
const u = new URL(base)
for (const [chave, valor] of Object.entries({
...params,
apikey: API_KEY_TOKITO
})) {
if (valor === undefined || valor === null || valor === '')
continue
u.searchParams.set(chave, String(valor))
}
return u.toString()
}

async function get(rota, params = {}, options = {}) {
const response = await axios.get(url(rota, params), {
timeout: 120000,
headers: {
'User-Agent': 'Mozilla/5.0',
accept: 'application/json',
...(options.headers || {})
},
...options
})
return response.data
}

module.exports = {
axios,
config,
url,
get
}
