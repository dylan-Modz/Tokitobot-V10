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
const base = require('./grupos.js')
const mess = require('../mensagens/mensagens.js')

const arquivoNecessario = path.join(__dirname, '..', 'INFO_DADOS', 'nescessario.json')

const botoesAtivos = () => {
try { return JSON.parse(fs.readFileSync(arquivoNecessario, 'utf8')).botoes !== false }
catch { return true }
}

const estadoGlobal = global.__TOKITO_APROVACAO_ESTADO__ ||= {
pendentes: new Map(), avisados: new Map(), processando: new Set(), concluidos: new Map(),
notificacoesGrupo: new Map(), respostas: new Map()
}

const { pendentes, avisados, processando, concluidos, notificacoesGrupo, respostas } = estadoGlobal

const mapa = grupo => {
if (!pendentes.has(grupo)) pendentes.set(grupo, new Map())
return pendentes.get(grupo)
}

const pegarJid = pedido => String(
pedido?.participantPn || pedido?.phoneNumber || pedido?.jid ||
pedido?.participant || pedido?.id || ''
).trim()

const candidatosMembro = m => [
m?.phoneNumber, m?.participantAlt, m?.participantPn, m?.jid,
m?.id, m?.participant, m?.lid
].filter(Boolean).map(String)

const numeroJid = j => base.numero(j)

const resolverMembro = (membros, alvo) => {
alvo = String(alvo || '').trim()
if (!alvo) return { jid: '', membro: null }

const n = numeroJid(alvo)
const membro = (membros || []).find(m => {
const c = candidatosMembro(m)
return c.includes(alvo) || (n && c.some(j => numeroJid(j) === n))
})

if (!membro) return { jid: alvo, membro: null }

const c = candidatosMembro(membro)
const jid = c.find(j => j.endsWith('@s.whatsapp.net')) ||
c.find(j => j.endsWith('@lid')) || c[0] || alvo

return { jid, membro }
}

const estado = grupo => {
const cfg = base.config(grupo)
return { ativo: Boolean(cfg.aprovacao), automatico: Boolean(cfg.autoaprovacao) }
}

const editar = (grupo, dataGp, setGp, alterar) => {
const local = Array.isArray(dataGp) && dataGp[0] && typeof setGp === 'function'
const dados = local ? dataGp : base.lerGrupo(grupo)
if (!dados[0].funcoes || typeof dados[0].funcoes !== 'object') dados[0].funcoes = {}
alterar(dados[0].funcoes)
if (local) setGp(dados)
else base.salvarGrupo(grupo, dados)
return { ativo: Boolean(dados[0].funcoes.aprovacao), automatico: Boolean(dados[0].funcoes.autoaprovacao) }
}

const ativar = (grupo, ativo, dataGp, setGp) => editar(grupo, dataGp, setGp, funcoes => {
funcoes.aprovacao = Boolean(ativo)
if (!ativo) funcoes.autoaprovacao = false
})

const automatico = (grupo, ativo, dataGp, setGp) => editar(grupo, dataGp, setGp, funcoes => {
funcoes.aprovacao = Boolean(ativo) || Boolean(funcoes.aprovacao)
funcoes.autoaprovacao = Boolean(ativo)
})

const listar = grupo => [...mapa(grupo).values()]
const primeiro = grupo => listar(grupo)[0] || null
const remover = (grupo, jid) => mapa(grupo).delete(jid)
const limpar = grupo => pendentes.delete(grupo)

const limparRespostas = () => {
const agora = Date.now()
for (const [chave, item] of respostas.entries()) if (!item || item.expira <= agora) respostas.delete(chave)
}

const sincronizar = async (tokito, grupo) => {
const pedidos = await tokito.groupRequestParticipantsList(grupo).catch(() => [])
const atual = mapa(grupo), vivos = new Set()

for (const pedido of pedidos || []) {
const jid = pegarJid(pedido)
if (!jid) continue
vivos.add(jid)
atual.set(jid, { ...pedido, jid })
}

for (const jid of atual.keys()) if (!vivos.has(jid)) atual.delete(jid)
return listar(grupo)
}

const aviso = async (tokito, grupo, pedido, prefix) => {
const jid = pedido.jid, numero = base.numero(jid)
const metadata = await tokito.groupMetadata(grupo).catch(() => ({}))
const nomeGrupo = metadata?.subject || 'Grupo'

if (!botoesAtivos()) {
const enviada = await tokito.sendMessage(grupo, {
text: mess.novaSolicitacaoSemBotoes(numero, nomeGrupo),
mentions: [jid]
})

const id = enviada?.key?.id
if (id) {
limparRespostas()
respostas.set(`${grupo}:${id}`, { grupo, jid, expira: Date.now() + (10 * 60 * 1000) })
}
return enviada
}

await tokito.relayMessage(grupo, {
interactiveMessage: {
header: { title: '📥 NOVA SOLICITAÇÃO', hasMediaAttachment: false },
body: { text: mess.novaSolicitacao(numero, nomeGrupo) },
footer: { text: 'Sistema de aprovação' },
nativeFlowMessage: {
buttons: [
{ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: mess.botaoAprovar(), id: `${prefix}aprovarpedido ${jid}` }) },
{ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: mess.botaoRecusar(), id: `${prefix}recusarpedido ${jid}` }) }
],
messageParamsJson: '{}'
},
contextInfo: { mentionedJid: [jid] }
}
}, {})
}

const processar = async (tokito, grupo, pedido, prefix) => {
const cfg = estado(grupo)
if (!cfg.ativo) return

const jid = pegarJid(pedido)
if (!jid) return

const chave = `${grupo}:${jid}`, concluidoEm = concluidos.get(chave) || 0
if (Date.now() - concluidoEm < 60000 || processando.has(chave)) return

processando.add(chave)

try {
if (cfg.automatico) {
await tokito.groupRequestParticipantsUpdate(grupo, [jid], 'approve')
remover(grupo, jid)
concluidos.set(chave, Date.now())
await tokito.sendMessage(grupo, { text: mess.aprovacaoAutomatica(1), mentions: [jid] }).catch(() => {})
return
}

const ultima = avisados.get(chave) || 0
if (Date.now() - ultima < 60000) return

mapa(grupo).set(jid, { ...pedido, jid })
await aviso(tokito, grupo, { ...pedido, jid }, prefix)
avisados.set(chave, Date.now())
}
finally { processando.delete(chave) }
}

const achar = (node, tag) => {
if (!node) return false
if (node.tag === tag) return true
const conteudo = Array.isArray(node.content) ? node.content : []
return conteudo.some(item => item && typeof item === 'object' && achar(item, tag))
}

const respostaNumerica = async (tokito, upsert) => {
try {
if (botoesAtivos()) return

for (const m of upsert?.messages || []) {
const grupo = m?.key?.remoteJid
if (!grupo?.endsWith('@g.us') || m?.key?.fromMe) continue

const msg = base.desenrolar(m?.message)
const texto = base.texto(m?.message).trim()
if (!['1', '2'].includes(texto)) continue

const citado = msg?.extendedTextMessage?.contextInfo?.stanzaId ||
msg?.imageMessage?.contextInfo?.stanzaId ||
msg?.videoMessage?.contextInfo?.stanzaId ||
msg?.documentMessage?.contextInfo?.stanzaId || ''

if (!citado) continue

limparRespostas()
const r = respostas.get(`${grupo}:${citado}`)
if (!r || r.expira <= Date.now()) continue

const metadata = await tokito.groupMetadata(grupo).catch(() => null)
if (!metadata) continue

const membros = metadata.participants || []
const autorRaw = m?.key?.participant || m?.participant || ''
const autorInfo = resolverMembro(membros, autorRaw)
const autor = autorInfo.jid
const adm = autorInfo.membro

if (!autor || !['admin', 'superadmin'].includes(adm?.admin)) continue

const pedidos = await tokito.groupRequestParticipantsList(grupo).catch(() => [])
const pedido = pedidos.find(p => pegarJid(p) === r.jid || numeroJid(pegarJid(p)) === numeroJid(r.jid))

if (!pedido) {
respostas.delete(`${grupo}:${citado}`)
remover(grupo, r.jid)

await tokito.sendMessage(grupo, {
text: mess.solicitacaoIndisponivel(base.numero(r.jid)),
mentions: [r.jid]
}, { quoted: m }).catch(() => {})

continue
}

const jidPedido = pegarJid(pedido) || r.jid
const acao = texto === '1' ? 'approve' : 'reject'

await tokito.groupRequestParticipantsUpdate(grupo, [jidPedido], acao)
remover(grupo, r.jid)
remover(grupo, jidPedido)
respostas.delete(`${grupo}:${citado}`)
concluidos.set(`${grupo}:${jidPedido}`, Date.now())

await tokito.sendMessage(grupo, {
text: mess.solicitacaoRespondida(base.numero(jidPedido), base.numero(autor), texto === '1'),
mentions: [jidPedido, autor]
}, { quoted: m }).catch(() => {})
}
}
catch (error) {
console.log('[APROVAÇÃO RESPOSTA]', error?.message || error)
}
}

const iniciar = (tokito, prefix = '!') => {
if (tokito?.ev?.on && !tokito.aprovacaoRespostaTokitoIniciada) {
tokito.aprovacaoRespostaTokitoIniciada = true
tokito.ev.on('messages.upsert', upsert => respostaNumerica(tokito, upsert))
}

if (!tokito?.ws?.on || tokito.aprovacaoTokitoIniciada) return
tokito.aprovacaoTokitoIniciada = true

tokito.ws.on('CB:notification', async node => {
try {
if (global.__TOKITO_SOCKET_ATUAL__ && global.__TOKITO_SOCKET_ATUAL__ !== tokito) return
const grupo = node?.attrs?.from
if (!grupo?.endsWith('@g.us') || !achar(node, 'created_membership_requests')) return

const agora = Date.now(), ultima = notificacoesGrupo.get(grupo) || 0
if (agora - ultima < 5000) return
notificacoesGrupo.set(grupo, agora)

const pedidos = await tokito.groupRequestParticipantsList(grupo).catch(() => [])
for (const pedido of pedidos || []) await processar(tokito, grupo, pedido, prefix)
}
catch (error) {
console.log('[APROVAÇÃO NOTIFICAÇÃO]', error?.message || error)
}
})
}

const configurar = async ({ grupo, dataGp, setGp, q, prefix, command, reply, automatico: auto = false }) => {
const acao = String(q || '').trim()
const titulo = auto ? '𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰' : '𝚂𝙸𝚂𝚃𝙴𝙼𝙰 𝙳𝙴 𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾'
const descricao = auto ? 'ᴀᴘʀᴏᴠᴀ ᴛᴏᴅᴀs ᴀs ɴᴏᴠᴀs sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.' : 'ᴀᴠɪsᴀ ᴇ ᴘᴇʀᴍɪᴛᴇ ᴀᴘʀᴏᴠᴀʀ ᴏᴜ ʀᴇᴄᴜsᴀʀ ɴᴏᴠᴏs ᴍᴇᴍʙʀᴏs.'
if (!['0', '1'].includes(acao)) return reply(mess.funcaoUso(auto ? '🤖' : '📥', titulo, prefix, command, descricao))
if (auto) automatico(grupo, acao === '1', dataGp, setGp)
else ativar(grupo, acao === '1', dataGp, setGp)
return reply(acao === '1'
? mess.funcaoAtivada(auto ? '🤖' : '📥', titulo, descricao)
: mess.funcaoDesativada(auto ? '🤖' : '📥', titulo, auto ? 'ᴀs sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ᴠᴏʟᴛᴀʀᴀ̃ᴏ ᴀ sᴇʀ ᴀɴᴀʟɪsᴀᴅᴀs ᴍᴀɴᴜᴀʟᴍᴇɴᴛᴇ.' : 'ᴏ ʙᴏᴛ ɴᴀ̃ᴏ ᴀᴠɪsᴀʀᴀ́ sᴏʙʀᴇ ɴᴏᴠᴀs sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs.'))
}

const decidir = async ({ tokito, grupo, alvo, acao }) => {
await sincronizar(tokito, grupo)
const jid = String(alvo || primeiro(grupo)?.jid || '').trim()
if (!jid) return { ok: false, vazio: true }

const pedidos = await tokito.groupRequestParticipantsList(grupo).catch(() => [])
const existe = pedidos.some(p => pegarJid(p) === jid)

if (!existe) {
remover(grupo, jid)
return { ok: false, indisponivel: true, jid }
}

await tokito.groupRequestParticipantsUpdate(grupo, [jid], acao)
remover(grupo, jid)
return { ok: true, jid }
}

const decidirTodos = async ({ tokito, grupo, acao }) => {
const pedidos = await sincronizar(tokito, grupo)
const jids = pedidos.map(p => p.jid).filter(Boolean)
if (!jids.length) return []

await tokito.groupRequestParticipantsUpdate(grupo, jids, acao)
for (const jid of jids) remover(grupo, jid)
return jids
}


const decidirQuantidade = async ({ tokito, grupo, quantidade, acao = 'approve' }) => {
const pedidos = await sincronizar(tokito, grupo)
const totalAntes = pedidos.length
const pedidoQtd = Math.max(0, Math.floor(Number(quantidade) || 0))
const limite = Math.min(pedidoQtd, totalAntes)

if (!limite) {
return {
ok: false,
totalAntes,
solicitadas: pedidoQtd,
processadas: 0,
restantes: totalAntes,
jids: []
}
}

const jids = pedidos
.slice(0, limite)
.map(p => p.jid)
.filter(Boolean)

const tamanhoLote = 50

for (let i = 0; i < jids.length; i += tamanhoLote) {
const lote = jids.slice(i, i + tamanhoLote)

try {
await tokito.groupRequestParticipantsUpdate(grupo, lote, acao)
}
catch {
for (const jid of lote) {
try {
await tokito.groupRequestParticipantsUpdate(grupo, [jid], acao)
}
catch {}
}
}
}

const restantesLista = await sincronizar(tokito, grupo)
const aindaPendentes = new Set(restantesLista.map(p => p.jid).filter(Boolean))
const processados = jids.filter(jid => !aindaPendentes.has(jid))

for (const jid of processados)
remover(grupo, jid)

return {
ok: processados.length > 0,
totalAntes,
solicitadas: pedidoQtd,
processadas: processados.length,
restantes: restantesLista.length,
jids: processados
}
}

module.exports = {
iniciar, estado, ativar, automatico, listar, primeiro, remover, limpar,
sincronizar, configurar, decidir, decidirTodos, decidirQuantidade
}
