/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * ============================================================
 */

const x4 = require('./x4')

const normalizarNome = valor => String(valor || '')
.toLowerCase()
.normalize('NFD')
.replace(/[\u0300-\u036f]/g, '')
.replace(/\s+/g, ' ')
.trim()

const limparNome = valor => String(valor || '')
.replace(/^\s*(?:[-*•>]|\d{1,2}[.)-])\s*/, '')
.replace(/\s+/g, ' ')
.trim()
.slice(0, 60)

const funcoes = ctx => {
const f = x4.garantir(ctx)

if (!f)
return null

return f
}

const obter = ctx => {
const sessao = funcoes(ctx)?.salaFreeFire

if (!sessao || sessao.ativa !== true)
return null

return sessao
}

const salvar = (ctx, sessao) => {
const f = funcoes(ctx)

if (!f)
return false

f.salaFreeFire = sessao
ctx.setGp(ctx.dataGp)
return true
}

const remover = ctx => {
const f = funcoes(ctx)

if (!f)
return false

delete f.salaFreeFire
ctx.setGp(ctx.dataGp)
return true
}

const extrairModo = valor => {
const entrada = String(valor || '')
.toLowerCase()
.replace(/\s+/g, '')

const match = entrada.match(/^([1-6])[xv]\1$/)

if (!match)
return null

const porTime = Number(match[1])

return {
modo: `${porTime}x${porTime}`,
porTime,
total: porTime * 2
}
}

const separarNomes = valor => String(valor || '')
.replace(/\r/g, '')
.split(/\n|,|\|/)
.map(limparNome)
.filter(Boolean)

const novo = (ctx, configuracao) => ({
ativa: true,
modo: configuracao.modo,
porTime: configuracao.porTime,
total: configuracao.total,
criador: ctx.nJid(ctx.sender),
jogadores: [],
criadoEm: new Date().toISOString(),
atualizadoEm: new Date().toISOString()
})

const ehCriador = (ctx, sessao) => {
const criador = ctx.nJid(sessao?.criador)
const sender = ctx.nJid(ctx.sender)

return Boolean(criador && sender && criador === sender)
}

const completa = sessao => {
const total = Math.max(2, Number(sessao?.total || 0))
const jogadores = Array.isArray(sessao?.jogadores)
? sessao.jogadores
: []

return jogadores.length >= total
}

const adicionar = (sessao, nomes) => {
if (!Array.isArray(sessao.jogadores))
sessao.jogadores = []

const existentes = new Set(
sessao.jogadores
.map(item => normalizarNome(item?.nome))
.filter(Boolean)
)

const adicionados = []
const repetidos = []
const excedentes = []
const total = Math.max(2, Number(sessao.total || 0))

for (const nomeBruto of nomes) {
const nome = limparNome(nomeBruto)
const chave = normalizarNome(nome)

if (!nome || !chave)
continue

if (existentes.has(chave)) {
repetidos.push(nome)
continue
}

if (sessao.jogadores.length >= total) {
excedentes.push(nome)
continue
}

const jogador = {
nome,
slot: sessao.jogadores.length + 1,
adicionadoEm: new Date().toISOString()
}

sessao.jogadores.push(jogador)
existentes.add(chave)
adicionados.push(jogador)
}

sessao.atualizadoEm = new Date().toISOString()

return {
adicionados,
repetidos,
excedentes
}
}

const abrirGrupo = async ctx => {
if (!ctx.isBotGroupAdmins)
throw new Error('BOT_SEM_ADMIN')

await ctx.tokito.groupSettingUpdate(ctx.from, 'not_announcement')
}

const fecharGrupo = async ctx => {
if (!ctx.isBotGroupAdmins)
throw new Error('BOT_SEM_ADMIN')

await ctx.tokito.groupSettingUpdate(ctx.from, 'announcement')
}

const concluir = async (ctx, sessao, mostrarLista = true) => {
if (mostrarLista) {
await ctx.reply(
ctx.mess.salaFreeFireLista(sessao, true),
[sessao.criador]
).catch(() => {})
}

await abrirGrupo(ctx)
remover(ctx)

const mencoes = x4.membros(ctx)

await ctx.tokito.sendMessage(ctx.from, {
text: ctx.mess.salaFreeFireChamada(sessao),
mentions: mencoes
}, {
quoted: ctx.selo
})

await ctx.reagir(ctx.from, '📢').catch(() => {})
return true
}

module.exports = {
normalizarNome,
limparNome,
obter,
salvar,
remover,
extrairModo,
separarNomes,
novo,
ehCriador,
completa,
adicionar,
abrirGrupo,
fecharGrupo,
concluir
}
