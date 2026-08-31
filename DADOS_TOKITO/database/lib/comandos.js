/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const registros = new Map()
let arquivoAtual = null

const normal = valor => String(valor || '').trim().toLowerCase()

const abrir = arquivo => {
arquivoAtual = arquivo
}

const fechar = arquivo => {
const item = registros.get(arquivo) || null
arquivoAtual = null
return item
}

const setCommand = config => {
if (!config || typeof config !== 'object')
throw new TypeError('dylan.setCommand recebeu uma configuração inválida.')

const nome = normal(config.nome || config.name || config.comandos?.[0] || config.commands?.[0])
const comandos = config.comandos || config.commands || (nome ? [nome] : [])

config.nome = nome
config.comandos = [...new Set(comandos.map(normal).filter(Boolean))]
config.categoria = config.categoria || config.category || config.info?.categoria || 'outros'

if (arquivoAtual)
registros.set(arquivoAtual, config)

return config
}

module.exports = {
setCommand,
abrir,
fechar
}
