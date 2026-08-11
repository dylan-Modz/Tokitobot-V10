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
