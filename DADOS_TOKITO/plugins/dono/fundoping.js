/*
 * Tokito Bot V10 - Fundo do Ping
 * Author: Dylan Modz
 */

const donoSistema = require('../../sistemas/dono')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'fundoping',
comandos: ['fundoping'],
categoria: 'dono',
info: {
descricao: 'Altera o fundo usado no comando ping.',
uso: 'fundoping respondendo uma imagem',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

const q =
String(ctx.q || '').trim()

if (
['0', 'reset', 'padrao'].includes(
q.toLowerCase()
)
) {
donoSistema.set({
pingFundo: ''
})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🖼️',
titulo: 'FUNDO DO PING',
descricao: 'O fundo padrão do ping foi restaurado.'
})
)
}

if (/^https?:\/\//i.test(q)) {
donoSistema.set({
pingFundo: q
})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🖼️',
titulo: 'FUNDO DO PING',
descricao: 'O novo fundo do ping foi salvo.'
})
)
}

const imagem =
ctx.modulos.mediaAtual(ctx).image

if (!imagem) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🖼️',
titulo: 'FUNDO DO PING',
uso: `${ctx.prefix}fundoping`,
exemplos: [
`${ctx.prefix}fundoping https://site.com/imagem.jpg`,
`${ctx.prefix}fundoping 0`
],
descricao: 'Responda uma imagem ou informe uma URL.'
})
)
}

await ctx.reagir(
ctx.from,
'⏳'
).catch(() => {})

const buffer =
await ctx.getFileBuffer(
imagem,
'image'
)

const tipo =
String(
imagem.mimetype || ''
).includes('png')
? 'png'
: 'jpg'

// Armazena permanentemente no GitHub através da Tokito APIs.
// O upload temporário anterior apagava a imagem depois de alguns dias.
const axios = require('axios')
const FormData = require('form-data')
const key = String(ctx.API_KEY_TOKITO || '').trim()
if (!key) {
return ctx.reply('Não foi possível salvar o fundo: o token da Tokito APIs não está configurado no bot.')
}
if (!Buffer.isBuffer(buffer) || buffer.length < 12 || buffer.length > 12 * 1024 * 1024) {
return ctx.reply('Envie uma imagem válida de até 12 MB para definir o fundo do Ping.')
}

const form = new FormData()
form.append('file', buffer, {
filename: `fundoping-${Date.now()}.${tipo}`,
contentType: tipo === 'png' ? 'image/png' : 'image/jpeg'
})
let url = ''
try {
const resposta = await axios.post('https://tokito-apis.com.br/api/upload', form, {
headers: {
...form.getHeaders(),
'x-api-key': key,
Accept: 'application/json'
},
timeout: 65000,
maxRedirects: 0,
maxBodyLength: 16 * 1024 * 1024,
maxContentLength: 1024 * 1024,
validateStatus: () => true
})
if (resposta.status !== 200 || resposta.data?.sucesso !== true) {
const msg = String(resposta.data?.erro || resposta.data?.mensagem || 'O upload não foi confirmado.')
throw new Error(`HTTP ${resposta.status}: ${msg.slice(0, 130)}`)
}
url = String(resposta.data?.url || resposta.data?.link || '').trim()
const endereco = new URL(url)
if (endereco.protocol !== 'https:' || endereco.username || endereco.password) {
throw new Error('A API não retornou um link de imagem HTTPS válido.')
}
} catch (error) {
const motivo = String(error?.message || 'Falha de conexão').slice(0, 160)
return ctx.reply('Não foi possível salvar o fundo permanente do Ping: ' + motivo + '\nO fundo anterior foi preservado.')
}

donoSistema.set({
pingFundo: url
})

await ctx.reagir(
ctx.from,
'✅'
).catch(() => {})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🖼️',
titulo: 'FUNDO DO PING',
descricao: 'O novo fundo do ping foi salvo.'
})
)
}
})
