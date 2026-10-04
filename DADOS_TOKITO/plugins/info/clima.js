/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const axios = require('axios')
const dylan = require('../../database/lib/comandos')

const descricaoWmo = codigo => {
const mapa = {
0: 'Céu limpo',
1: 'Predominantemente limpo',
2: 'Parcialmente nublado',
3: 'Nublado',
45: 'Nevoeiro',
48: 'Nevoeiro com geada',
51: 'Garoa fraca',
53: 'Garoa moderada',
55: 'Garoa forte',
56: 'Garoa congelante fraca',
57: 'Garoa congelante forte',
61: 'Chuva fraca',
63: 'Chuva moderada',
65: 'Chuva forte',
66: 'Chuva congelante fraca',
67: 'Chuva congelante forte',
71: 'Neve fraca',
73: 'Neve moderada',
75: 'Neve forte',
77: 'Grãos de neve',
80: 'Pancadas de chuva fracas',
81: 'Pancadas de chuva moderadas',
82: 'Pancadas de chuva fortes',
85: 'Pancadas de neve fracas',
86: 'Pancadas de neve fortes',
95: 'Trovoadas',
96: 'Trovoadas com granizo',
99: 'Trovoadas fortes com granizo'
}

return mapa[Number(codigo)] || 'Condição não identificada'
}

const numero = valor => {
const n = Number(valor)
if (!Number.isFinite(n)) return '—'

return n.toLocaleString('pt-BR', {
minimumFractionDigits: Number.isInteger(n) ? 0 : 1,
maximumFractionDigits: 1
})
}

const hora = valor => {
const partes = String(valor || '').split('T')
return partes[1]?.slice(0, 5) || '—'
}

dylan.setCommand({
nome: 'clima',
comandos: ['clima', 'tempo'],
categoria: 'info',

info: {
descricao: 'Mostra o clima atual e a previsão do dia para uma cidade.',
uso: 'clima São Paulo',
categoria: 'info'
},

async executar(ctx) {
const busca = String(ctx.q || '').replace(/\s+/g, ' ').trim().slice(0, 120)

if (!busca) {
return ctx.reply(
ctx.mess.climaUso(ctx.prefix)
)
}

try {
const geo = await axios.get(
'https://geocoding-api.open-meteo.com/v1/search',
{
params: {
name: busca,
count: 1,
language: 'pt',
format: 'json'
},
timeout: 12000,
validateStatus: () => true
}
)

if (geo.status !== 200) {
throw new Error(`Geocoding HTTP ${geo.status}`)
}

const local = geo.data?.results?.[0]

if (!local) {
return ctx.reply(
ctx.mess.climaNaoEncontrado(busca)
)
}

const previsao = await axios.get(
'https://api.open-meteo.com/v1/forecast',
{
params: {
latitude: local.latitude,
longitude: local.longitude,
current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
timezone: 'auto',
forecast_days: 1,
temperature_unit: 'celsius',
wind_speed_unit: 'kmh',
precipitation_unit: 'mm'
},
timeout: 12000,
validateStatus: () => true
}
)

if (previsao.status !== 200 || !previsao.data?.current) {
throw new Error(`Weather HTTP ${previsao.status}`)
}

const atual = previsao.data.current
const diario = previsao.data.daily || {}
const nomeLocal = [
local.name,
local.admin1,
local.country
].filter(Boolean)
.filter((item, indice, lista) => lista.indexOf(item) === indice)
.join(', ')

return ctx.reply(
ctx.mess.climaResultado({
local: nomeLocal,
temperatura: numero(atual.temperature_2m),
sensacao: numero(atual.apparent_temperature),
maxima: numero(diario.temperature_2m_max?.[0]),
minima: numero(diario.temperature_2m_min?.[0]),
condicao: descricaoWmo(atual.weather_code),
umidade: numero(atual.relative_humidity_2m),
chuva: numero(diario.precipitation_probability_max?.[0]),
vento: numero(atual.wind_speed_10m),
nascer: hora(diario.sunrise?.[0]),
por: hora(diario.sunset?.[0])
})
)
} catch (error) {
console.log('[CLIMA]', error?.message || error)
return ctx.reply(
ctx.mess.climaErro()
)
}
}
})
