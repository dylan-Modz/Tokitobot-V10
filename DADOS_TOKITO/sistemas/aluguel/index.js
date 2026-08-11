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
const crypto = require('crypto')
const { criarPagamentoPix, verificarPix, tokenConfigurado } = require('../../src/pix')

const raiz = path.join(__dirname, '..', '..', 'database', 'aluguel')

const arquivos = {
grupos: path.join(raiz, 'aluguel.json'),
pedidos: path.join(raiz, 'pedidos.json'),
pendencias: path.join(raiz, 'pendencias.json'),
planos: path.join(__dirname, '..', '..', 'INFO_DADOS', 'LOGOS', 'planos.json')
}

for (const p of [arquivos.grupos, arquivos.pedidos, arquivos.pendencias]) {
fs.mkdirSync(path.dirname(p), { recursive: true })
if (!fs.existsSync(p))
fs.writeFileSync(p, '[]\n')
}

const ler = (p, pad = []) => {
try {
return JSON.parse(fs.readFileSync(p, 'utf8'))
}
catch {
return pad
}
}

const salvar = (p, d) => {
const t = p + '.tmp'
fs.writeFileSync(t, JSON.stringify(d, null, 2) + '\n')
fs.renameSync(t, p)
}

const planos = () => {
const l = ler(arquivos.planos, [])
return Array.isArray(l) ? l.filter(p => p && Number(p.preco) > 0 && Number(p.dias) > 0) : []
}

const extrairInvite = link => {
const m = String(link || '').match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]{8,})/i)
return m?.[1] || ''
}

const ativos = () => {
const agora = Date.now()
let list = ler(arquivos.grupos, [])
let mudou = false
for (const g of list) {
if (g.ativo !== false && g.expiraEm && new Date(g.expiraEm).getTime() <= agora) {
g.ativo = false
g.expiradoEm = new Date().toISOString()
mudou = true
}
}
if (mudou)
salvar(arquivos.grupos, list)
return list
}

const autorizado = id => ativos().some(g => g.id === id && g.ativo !== false && (!g.expiraEm || new Date(g.expiraEm).getTime() > Date.now()))

const registrar = (id, plano, comprador, link = '') => {
let list = ativos()
let g = list.find(x => x.id === id)
const dias = Number(plano.dias) || 0
const agora = Date.now()
if (g) {
const base = Math.max(agora, new Date(g.expiraEm || 0).getTime() || 0)
g.expiraEm = new Date(base + dias * 86400000).toISOString()
g.duracaoDias = Number(g.duracaoDias || 0) + dias
g.ativo = true
g.planoNome = plano.nome
g.linkGrupo = link || g.linkGrupo || ''
g.ultimoComprador = comprador
g.ultimaAtualizacao = new Date().toISOString()
}
else {
g = {
id,
ativo: true,
planoNome: plano.nome,
duracaoDias: dias,
inicio: new Date().toISOString(),
expiraEm: new Date(agora + dias * 86400000).toISOString(),
linkGrupo: link,
comprador,
ultimoComprador: comprador,
ultimaAtualizacao: new Date().toISOString()
}
list.push(g)
}
salvar(arquivos.grupos, list)
return g
}

const remover = id => {
let list = ler(arquivos.grupos, [])
const antes = list.length
list = list.filter(g => g.id !== id)
salvar(arquivos.grupos, list)
return antes !== list.length
}

const pedidoUsuario = jid => ler(arquivos.pedidos, []).find(p => p.comprador === jid && p.status === 'pendente')

const salvarPedido = d => {
let l = ler(arquivos.pedidos, [])
const i = l.findIndex(p => p.comprador === d.comprador && p.status === 'pendente')
if (i >= 0)
l[i] = {
...l[i],
...d,
atualizadoEm: new Date().toISOString()
}
else
l.push({
...d,
criadoEm: new Date().toISOString(),
atualizadoEm: new Date().toISOString()
})
salvar(arquivos.pedidos, l)
return i >= 0 ? l[i] : l[l.length - 1]
}

const criarPix = async (comprador, valor) => {
if (!tokenConfigurado()) {
const e = new Error('MP_TOKEN_NAO_CONFIGURADO')
e.code = 'MP_TOKEN_NAO_CONFIGURADO'
throw e
}
const pedido = pedidoUsuario(comprador)
if (!pedido)
throw new Error('PEDIDO_NAO_ENCONTRADO')
const plano = planos().find(p => Number(p.preco) === Number(valor))
if (!plano)
throw new Error('PLANO_NAO_ENCONTRADO')
const idem = crypto.randomUUID()
const pix = await criarPagamentoPix(Number(plano.preco), `Aluguel ${plano.nome}`, idem)
let pend = ler(arquivos.pendencias, []).filter(x => !(x.comprador === comprador && x.status === 'pending'))
const item = {
id: pix.id,
status: 'pending',
comprador,
plano,
pedido,
qr_code: pix.qr_code,
qr_code_base64: pix.qr_code_base64,
criadoEm: new Date().toISOString(),
expiraConsultaEm: Date.now() + 30 * 60 * 1000
}
pend.push(item)
salvar(arquivos.pendencias, pend)
return item
}

let socket = null

let intervalo = null

let ocupado = false

const processar = async () => {
if (!socket || ocupado || !tokenConfigurado())
return
ocupado = true
try {
let pend = ler(arquivos.pendencias, [])
let mudou = false
for (const item of pend) {
if (item.status !== 'pending')
continue
if (Date.now() > Number(item.expiraConsultaEm || 0)) {
item.status = 'expired'
mudou = true
continue
}
let st
try {
st = await verificarPix(item.id)
}
catch {
continue
}
if (st.status !== 'approved')
continue
let gid = item.pedido?.grupoId || ''
if (!gid && item.pedido?.inviteCode) {
try {
gid = await socket.groupAcceptInvite(item.pedido.inviteCode)
}
catch {
}
}
if (!gid) {
item.status = 'approved_waiting_group'
mudou = true
continue
}
const g = registrar(gid, item.plano, item.comprador, item.pedido?.linkGrupo || '')
item.status = 'approved'
item.grupoId = gid
item.aprovadoEm = new Date().toISOString()
mudou = true
let pedidos = ler(arquivos.pedidos, [])
for (const p of pedidos)
if (p.comprador === item.comprador && p.status === 'pendente')
p.status = 'concluido'
salvar(arquivos.pedidos, pedidos)
await socket.sendMessage(item.comprador, { text: `✅ Pagamento aprovado. O aluguel foi ativado até ${new Date(g.expiraEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.` }).catch(() => {
})
}
if (mudou)
salvar(arquivos.pendencias, pend)
}
finally {
ocupado = false
}
}

const iniciar = tokito => {
socket = tokito
if (!intervalo) {
intervalo = setInterval(() => processar().catch(() => {
}), 10000)
intervalo.unref?.()
}
processar().catch(() => {
})
}

module.exports = {
arquivos,
ler,
salvar,
planos,
extrairInvite,
ativos,
autorizado,
registrar,
remover,
pedidoUsuario,
salvarPedido,
criarPix,
processar,
iniciar,
tokenConfigurado
}
