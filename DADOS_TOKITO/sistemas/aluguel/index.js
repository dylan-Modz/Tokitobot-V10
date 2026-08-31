/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const mess = require('../../mensagens/mensagens.js')
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
if (!fs.existsSync(p)) fs.writeFileSync(p, '[]\n')
}

const ler = (p, pad = []) => {
try {
return JSON.parse(fs.readFileSync(p, 'utf8'))
} catch {
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

if (mudou) salvar(arquivos.grupos, list)
return list
}

const autorizado = id => ativos().some(g =>
g.id === id &&
g.ativo !== false &&
(!g.expiraEm || new Date(g.expiraEm).getTime() > Date.now())
)

const registrar = (id, plano, comprador, link = '') => {
let list = ativos(), g = list.find(x => x.id === id)
const dias = Number(plano.dias) || 0, agora = Date.now()

if (g) {
const base = Math.max(agora, new Date(g.expiraEm || 0).getTime() || 0)

g.expiraEm = new Date(base + dias * 86400000).toISOString()
g.duracaoDias = Number(g.duracaoDias || 0) + dias
g.ativo = true
g.planoNome = plano.nome
g.linkGrupo = link || g.linkGrupo || ''
g.ultimoComprador = comprador
g.ultimaAtualizacao = new Date().toISOString()
} else {
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

const savegp = (id, dados = {}) => {
const grupoId = String(id || '').trim()
if (!grupoId) return null

let list = ativos()
let g = list.find(x => x.id === grupoId)
const agora = new Date().toISOString()
const expiraAtual = g?.expiraEm ? new Date(g.expiraEm).getTime() : 0
const aluguelPagoAtivo = Boolean(
g &&
g.ativo !== false &&
expiraAtual > Date.now()
)

const grupoNome = String(dados.nome || dados.grupoNome || '').trim()
const linkGrupo = String(dados.link || dados.linkGrupo || '').trim()
const salvoPor = String(dados.salvoPor || dados.comprador || '').trim()
const quantidade = Math.max(0, Number(dados.quantidade ?? dados.quantidadeMembros ?? 0) || 0)

if (!g) {
g = {
id: grupoId,
ativo: true,
planoNome: 'SaveGP',
duracaoDias: 0,
inicio: agora,
expiraEm: null,
linkGrupo,
comprador: salvoPor,
ultimoComprador: salvoPor,
grupoNome,
quantidadeMembros: quantidade,
tipoRegistro: 'savegp',
salvoEm: agora,
ultimaAtualizacao: agora
}

list.push(g)
} else {
g.grupoNome = grupoNome || g.grupoNome || ''
g.quantidadeMembros = quantidade || g.quantidadeMembros || 0
g.linkGrupo = linkGrupo || g.linkGrupo || ''
g.salvoPor = salvoPor || g.salvoPor || ''
g.salvoEm = agora
g.ultimaAtualizacao = agora

/*
 * Nunca transforma um aluguel pago e ainda válido em permanente.
 * Se o registro não estiver com aluguel pago ativo, o SaveGP deixa
 * o grupo autorizado sem vencimento e elimina a necessidade do rgaluguel.
 */
if (!aluguelPagoAtivo) {
g.ativo = true
g.planoNome = 'SaveGP'
g.duracaoDias = 0
g.expiraEm = null
g.tipoRegistro = 'savegp'
}
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

const pedidoUsuario = jid => ler(arquivos.pedidos, []).find(p =>
p.comprador === jid &&
p.status === 'pendente'
)

const salvarPedido = d => {
let l = ler(arquivos.pedidos, [])
const i = l.findIndex(p => p.comprador === d.comprador && p.status === 'pendente')

if (i >= 0) {
l[i] = {
...l[i],
...d,
atualizadoEm: new Date().toISOString()
}
} else {
l.push({
...d,
criadoEm: new Date().toISOString(),
atualizadoEm: new Date().toISOString()
})
}

salvar(arquivos.pedidos, l)
return i >= 0 ? l[i] : l[l.length - 1]
}

const atualizarPedido = (comprador, dados = {}) => {
let pedidos = ler(arquivos.pedidos, [])

const pedido = pedidos.find(p =>
p.comprador === comprador &&
['pendente', 'pago_aguardando_grupo'].includes(p.status)
)

if (!pedido) return null

Object.assign(pedido, dados, {
atualizadoEm: new Date().toISOString()
})

salvar(arquivos.pedidos, pedidos)
return pedido
}

const extrairPixCopiaCola = pix => {
if (!pix || typeof pix !== 'object') return ''

const candidatos = [
pix.qr_code, pix.qrCode, pix.pix_code, pix.pixCode,
pix.copia_e_cola, pix.copiaECola, pix.copia_cola,
pix.copiaCola, pix.code, pix.payload, pix.point_of_initiation_method
]

for (const valor of candidatos) {
const texto = String(valor || '').trim()
if (texto && (texto.startsWith('000201') || texto.length > 30)) return texto
}

return ''
}

const criarPix = async (comprador, valor) => {
if (!tokenConfigurado()) {
const e = new Error('MP_TOKEN_NAO_CONFIGURADO')
e.code = 'MP_TOKEN_NAO_CONFIGURADO'
throw e
}

const pedido = pedidoUsuario(comprador)
if (!pedido) throw new Error('PEDIDO_NAO_ENCONTRADO')

const plano = planos().find(p => Number(p.preco) === Number(valor))
if (!plano) throw new Error('PLANO_NAO_ENCONTRADO')

const idem = crypto.randomUUID()
const pix = await criarPagamentoPix(Number(plano.preco), `Aluguel ${plano.nome}`, idem)

const qrCodeBase64 = String(
pix?.qr_code_base64 ||
pix?.qrCodeBase64 ||
pix?.qr_code_image ||
''
)

const qrCode = extrairPixCopiaCola(pix)

let pend = ler(arquivos.pendencias, []).filter(x =>
!(x.comprador === comprador && x.status === 'pending')
)

const item = {
id: pix.id,
status: 'pending',
comprador,
plano,
pedido,
qr_code: qrCode,
qr_code_base64: qrCodeBase64,
pix_copia_e_cola: qrCode,
criadoEm: new Date().toISOString(),
expiraConsultaEm: Date.now() + 30 * 60 * 1000
}

pend.push(item)
salvar(arquivos.pendencias, pend)

return item
}

/*
 * ============================================================
 *                    SISTEMA DE ENTRADA
 * ============================================================
 */

let socket = null, intervalo = null, ocupado = false

const normalizarJid = jid => {
const texto = String(jid || '').trim()
if (!texto) return ''

const partes = texto.split('@')
const usuario = String(partes[0] || '').replace(/:\d+$/, '')
const servidor = partes[1] || ''

return servidor ? `${usuario}@${servidor}` : usuario
}

const numeroJid = jid => String(normalizarJid(jid))
.split('@')[0]
.replace(/\D/g, '')

const mesmoJid = (a, b) => {
const x = normalizarJid(a), y = normalizarJid(b)

if (x && y && x === y) return true

const nx = numeroJid(x), ny = numeroJid(y)
return Boolean(nx && ny && nx === ny)
}

const botEstaNoGrupo = async gid => {
if (!socket || !gid) return false

try {
const metadata = await socket.groupMetadata(gid)
const participantes = Array.isArray(metadata?.participants) ? metadata.participants : []

const bots = [
socket.user?.id,
socket.user?.lid
].filter(Boolean)

return participantes.some(p => {
const ids = [
p?.id,
p?.jid,
p?.phoneNumber,
p?.lid
].filter(Boolean)

return ids.some(id =>
bots.some(bot => mesmoJid(id, bot))
)
})
} catch {
return false
}
}

const resolverGrupoId = async item => {
let gid = String(
item?.grupoId ||
item?.pedido?.grupoId ||
''
).trim()

const inviteCode = String(
item?.pedido?.inviteCode ||
extrairInvite(item?.pedido?.linkGrupo || '')
).trim()

if (!gid && inviteCode && typeof socket?.groupGetInviteInfo === 'function') {
try {
const info = await socket.groupGetInviteInfo(inviteCode)

gid = String(
info?.id ||
info?.jid ||
info?.groupJid ||
''
).trim()

if (gid) {
item.grupoId = gid

if (item.pedido) {
item.pedido.grupoId = gid
item.pedido.inviteCode = inviteCode
}

atualizarPedido(item.comprador, {
grupoId: gid,
inviteCode
})
}
} catch {}
}

return gid
}

const tentarEntrarGrupo = async item => {
if (!socket || !item) return ''

const inviteCode = String(
item?.pedido?.inviteCode ||
extrairInvite(item?.pedido?.linkGrupo || '')
).trim()

let gid = await resolverGrupoId(item)

/*
 * Se já entrou no grupo, finaliza sem tentar convite novamente.
 */
if (gid && await botEstaNoGrupo(gid)) return gid

/*
 * Tenta entrar usando o convite.
 *
 * Se o grupo exigir aprovação, o WhatsApp poderá deixar
 * a entrada aguardando o administrador. Nesse caso não
 * registramos o aluguel ainda.
 */
if (inviteCode && typeof socket.groupAcceptInvite === 'function') {
try {
const resposta = await socket.groupAcceptInvite(inviteCode)

const recebido = typeof resposta === 'string'
? resposta
: resposta?.id || resposta?.jid || resposta?.groupJid || ''

if (recebido) {
gid = String(recebido)
item.grupoId = gid

if (item.pedido) item.pedido.grupoId = gid

atualizarPedido(item.comprador, {
grupoId: gid,
inviteCode
})
}
} catch (e) {
item.ultimaTentativaGrupoEm = new Date().toISOString()
}
}

/*
 * Confirma de verdade se o bot virou participante.
 * Retornar um ID do convite sozinho não ativa o aluguel.
 */
gid = gid || await resolverGrupoId(item)

if (gid && await botEstaNoGrupo(gid)) return gid

return ''
}

const finalizarAluguel = async (item, gid) => {
if (!item || !gid) return null

/*
 * Última confirmação antes de começar a contar os dias.
 */
if (!await botEstaNoGrupo(gid)) return null

const g = registrar(
gid,
item.plano,
item.comprador,
item.pedido?.linkGrupo || ''
)

item.status = 'approved'
item.grupoId = gid
item.aprovadoEm = item.pagamentoAprovadoEm || new Date().toISOString()
item.ativadoEm = new Date().toISOString()

atualizarPedido(item.comprador, {
status: 'concluido',
grupoId: gid,
concluidoEm: new Date().toISOString()
})

let grupoNome = ''

try {
const metadata = await socket.groupMetadata(gid)
grupoNome = metadata?.subject || ''
} catch {}

/*
 * A mensagem fica no global.js.
 * Depois eu vou te passar somente esse export para você colar lá.
 */
if (typeof mess.aluguelAtivadoGrupo === 'function') {
const texto = mess.aluguelAtivadoGrupo({
grupo: grupoNome,
grupoId: gid,
plano: item.plano?.nome || '',
dias: Number(item.plano?.dias || 0),
valor: Number(item.plano?.preco || 0),
expiraEm: g.expiraEm,
comprador: item.comprador
})

if (texto) {
await socket.sendMessage(gid, {
text: texto
}).catch(() => {})
}
}

return g
}

/*
 * ============================================================
 *                VERIFICAÇÃO AUTOMÁTICA
 * ============================================================
 */

const processar = async () => {
if (!socket || ocupado || !tokenConfigurado()) return

ocupado = true

try {
let pend = ler(arquivos.pendencias, [])
let mudou = false

for (const item of pend) {

/*
 * ----------------------------------------------------------
 * PAGAMENTO AINDA PENDENTE
 * ----------------------------------------------------------
 */
if (item.status === 'pending') {

if (Date.now() > Number(item.expiraConsultaEm || 0)) {
item.status = 'expired'
item.expiradoEm = new Date().toISOString()
mudou = true
continue
}

let st

try {
st = await verificarPix(item.id)
} catch {
continue
}

if (st?.status !== 'approved') continue

/*
 * O dinheiro foi aprovado, mas o aluguel AINDA NÃO começa.
 */
item.status = 'approved_waiting_group'
item.pagamentoAprovadoEm = new Date().toISOString()
mudou = true

atualizarPedido(item.comprador, {
status: 'pago_aguardando_grupo',
pagamentoId: item.id,
pagamentoAprovadoEm: item.pagamentoAprovadoEm
})
}

/*
 * ----------------------------------------------------------
 * PAGAMENTO APROVADO / AGUARDANDO ENTRADA
 * ----------------------------------------------------------
 */
if (item.status === 'approved_waiting_group') {
const gid = await tentarEntrarGrupo(item)

if (!gid) {
item.ultimaVerificacaoGrupoEm = new Date().toISOString()
mudou = true
continue
}

/*
 * Só chega aqui quando confirmou que o bot realmente
 * está dentro do grupo.
 */
const resultado = await finalizarAluguel(item, gid)

if (resultado) mudou = true
}
}

if (mudou) salvar(arquivos.pendencias, pend)

} finally {
ocupado = false
}
}

const iniciar = tokito => {
socket = tokito

if (!intervalo) {
intervalo = setInterval(() => {
processar().catch(() => {})
}, 10000)

intervalo.unref?.()
}

processar().catch(() => {})
}

module.exports = {
arquivos, ler, salvar, planos, extrairInvite, ativos, autorizado,
registrar, savegp, remover, pedidoUsuario, salvarPedido, atualizarPedido,
criarPix, processar, iniciar, tokenConfigurado, extrairPixCopiaCola,
normalizarJid, mesmoJid, botEstaNoGrupo, resolverGrupoId,
tentarEntrarGrupo, finalizarAluguel
}