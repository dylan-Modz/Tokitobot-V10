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

const path = require('path')

const configPath = path.join(__dirname, '..', '..', 'INFO_DADOS', 'config-all.json')

const config = () => {
try {
delete require.cache[require.resolve(configPath)]
return require(configPath)
}
catch {
return {}
}
}

const tokenSala = ctx => {
const cfg = config()
return String(cfg.TOKEN_SALA || process.env.TOKEN_SALA || ctx.API_KEY_TOKITO || '').trim()
}

const tokenLikes = ctx => {
const cfg = config()
return String(cfg.TOKEN_LIKE_FF || process.env.TOKEN_LIKE_FF || ctx.API_KEY_TOKITO || '').trim()
}

// Preserva o motivo escrito pela API Tokito (campo "erro" no POST /api/v1/likes).
// Códigos técnicos em "error" só são mostrados quando a resposta não traz texto.
const mensagemRetorno = data => {
const opcoes = [
data?.erro, data?.mensagem, data?.message, data?.detail, data?.msg, data?.error,
data?.data?.erro, data?.data?.mensagem, data?.data?.message
]
const valor = opcoes.find(item => typeof item === 'string' && item.trim())
return valor ? valor.trim() : ''
}

const retornoErro = data => mensagemRetorno(data) || 'A API não informou o motivo da falha.'

const apiErro = (error, padrao = 'A API não informou o motivo da falha.') =>
mensagemRetorno(error?.response?.data) || String(error?.message || padrao)

const enviar = async (ctx, texto, botoes = [], mentions = []) => {
if (ctx.isBotoes && botoes.length)
return ctx.botaozin(texto, botoes, mentions)
return ctx.reply(texto, mentions)
}

const botoesSala = (ctx, sessionId, opcoes = ['ver', 'jogadores', 'iniciar', 'parar']) => {
if (!sessionId)
return []
const mapa = {
ver: {
texto: ctx.mess.botaoVerSala(),
id: `${ctx.prefix}versala ${sessionId}`
},
jogadores: {
texto: ctx.mess.botaoJogadoresSala(),
id: `${ctx.prefix}jogadoressala ${sessionId}`
},
iniciar: {
texto: ctx.mess.botaoIniciarSala(),
id: `${ctx.prefix}iniciarsala ${sessionId}`
},
parar: {
texto: ctx.mess.botaoPararSala(),
id: `${ctx.prefix}pararsala ${sessionId}`
}
}
return opcoes.map(x => mapa[x]).filter(Boolean)
}

const dataBR = valor => {
if (!valor)
return 'N/A'
try {
return new Intl.DateTimeFormat('pt-BR', {
timeZone: 'America/Sao_Paulo',
day: '2-digit',
month: '2-digit',
year: 'numeric',
hour: '2-digit',
minute: '2-digit',
second: '2-digit',
hour12: false
}).format(new Date(valor))
}
catch {
return 'N/A'
}
}

module.exports = {
config,
tokenSala,
tokenLikes,
apiErro,
retornoErro,
mensagemRetorno,
enviar,
botoesSala,
dataBR
}
