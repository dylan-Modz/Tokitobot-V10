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
const base = require('./base.js')
const mess = require('../database/lib/global.js')

const arquivoNecessario = path.join(__dirname, '..', 'INFO_DADOS', 'nescessario.json')

const botoesAtivos = () => {
try {
return JSON.parse(fs.readFileSync(arquivoNecessario, 'utf8')).botoes !== false
}
catch {
return true
}
}

const estadoGlobal = global.__TOKITO_APROVACAO_ESTADO__ ||= {
pendentes: new Map(),
avisados: new Map(),
processando: new Set(),
concluidos: new Map(),
notificacoesGrupo: new Map()
}

const { pendentes, avisados, processando, concluidos, notificacoesGrupo } = estadoGlobal

const mapa = grupo => {
if (!pendentes.has(grupo))
pendentes.set(grupo, new Map())
return pendentes.get(grupo)
}

const pegarJid = pedido => String(pedido?.participantPn ||
pedido?.phoneNumber ||
pedido?.jid ||
pedido?.participant ||
pedido?.id ||
'').trim()

const estado = grupo => {
const cfg = base.config(grupo)
return {
ativo: Boolean(cfg.aprovacao),
automatico: Boolean(cfg.autoaprovacao)
}
}

const editar = (grupo, dataGp, setGp, alterar) => {
const local = Array.isArray(dataGp) && dataGp[0] && typeof setGp === 'function'
const dados = local ? dataGp : base.lerGrupo(grupo)
if (!dados[0].funcoes || typeof dados[0].funcoes !== 'object')
dados[0].funcoes = {}
alterar(dados[0].funcoes)
if (local)
setGp(dados)
else
base.salvarGrupo(grupo, dados)
return {
ativo: Boolean(dados[0].funcoes.aprovacao),
automatico: Boolean(dados[0].funcoes.autoaprovacao)
}
}

const ativar = (grupo, ativo, dataGp, setGp) => editar(grupo, dataGp, setGp, funcoes => {
funcoes.aprovacao = Boolean(ativo)
if (!ativo)
funcoes.autoaprovacao = false
})

const automatico = (grupo, ativo, dataGp, setGp) => editar(grupo, dataGp, setGp, funcoes => {
funcoes.aprovacao = Boolean(ativo) || Boolean(funcoes.aprovacao)
funcoes.autoaprovacao = Boolean(ativo)
})

const listar = grupo => [...mapa(grupo).values()]

const primeiro = grupo => listar(grupo)[0] || null

const remover = (grupo, jid) => mapa(grupo).delete(jid)

const limpar = grupo => pendentes.delete(grupo)

const sincronizar = async (tokito, grupo) => {
const pedidos = await tokito.groupRequestParticipantsList(grupo).catch(() => [])
const atual = mapa(grupo)
const vivos = new Set()
for (const pedido of pedidos || []) {
const jid = pegarJid(pedido)
if (!jid)
continue
vivos.add(jid)
atual.set(jid, {
...pedido,
jid
})
}
for (const jid of atual.keys())
if (!vivos.has(jid))
atual.delete(jid)
return listar(grupo)
}

const aviso = async (tokito, grupo, pedido, prefix) => {
const jid = pedido.jid
const numero = base.numero(jid)
const metadata = await tokito.groupMetadata(grupo).catch(() => ({}))
const nomeGrupo = metadata?.subject || 'Grupo'
if (!botoesAtivos()) {
return tokito.sendMessage(grupo, {
text: mess.novaSolicitacaoSemBotoes(numero, nomeGrupo, prefix, jid),
contextInfo: { mentionedJid: [jid] }
})
}
await tokito.relayMessage(grupo, {
interactiveMessage: {
header: {
title: '📥 NOVA SOLICITAÇÃO',
hasMediaAttachment: false
},
body: { text: mess.novaSolicitacao(numero, nomeGrupo) },
footer: { text: 'Sistema de aprovação' },
nativeFlowMessage: {
buttons: [
{
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: mess.botaoAprovar(),
id: `${prefix}aprovarpedido ${jid}`
})
},
{
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: mess.botaoRecusar(),
id: `${prefix}recusarpedido ${jid}`
})
}
],
messageParamsJson: '{}'
},
contextInfo: { mentionedJid: [jid] }
}
}, {})
}

const processar = async (tokito, grupo, pedido, prefix) => {
const cfg = estado(grupo)
if (!cfg.ativo)
return
const jid = pegarJid(pedido)
if (!jid)
return
const chave = `${grupo}:${jid}`
const concluidoEm = concluidos.get(chave) || 0
if (Date.now() - concluidoEm < 60000)
return
if (processando.has(chave))
return
processando.add(chave)
try {
if (cfg.automatico) {
await tokito.groupRequestParticipantsUpdate(grupo, [jid], 'approve')
remover(grupo, jid)
concluidos.set(chave, Date.now())
await tokito.sendMessage(grupo, {
text: mess.aprovacaoAutomatica(1),
mentions: [jid]
}).catch(() => {
})
return
}
const ultima = avisados.get(chave) || 0
if (Date.now() - ultima < 60000)
return
mapa(grupo).set(jid, {
...pedido,
jid
})
await aviso(tokito, grupo, {
...pedido,
jid
}, prefix)
avisados.set(chave, Date.now())
}
finally {
processando.delete(chave)
}
}

const achar = (node, tag) => {
if (!node)
return false
if (node.tag === tag)
return true
const conteudo = Array.isArray(node.content) ? node.content : []
return conteudo.some(item => item && typeof item === 'object' && achar(item, tag))
}

const iniciar = (tokito, prefix = '!') => {
if (!tokito?.ws?.on || tokito.aprovacaoTokitoIniciada)
return
tokito.aprovacaoTokitoIniciada = true
// Usa somente a notificação crua do WhatsApp para não disparar o mesmo pedido duas vezes.
tokito.ws.on('CB:notification', async (node) => {
try {
if (global.__TOKITO_SOCKET_ATUAL__ && global.__TOKITO_SOCKET_ATUAL__ !== tokito)
return
const grupo = node?.attrs?.from
if (!grupo?.endsWith('@g.us'))
return
if (!achar(node, 'created_membership_requests'))
return
const agora = Date.now()
const ultima = notificacoesGrupo.get(grupo) || 0
if (agora - ultima < 5000)
return
notificacoesGrupo.set(grupo, agora)
const pedidos = await tokito.groupRequestParticipantsList(grupo).catch(() => [])
for (const pedido of pedidos || [])
await processar(tokito, grupo, pedido, prefix)
}
catch (error) {
console.log('[APROVAÇÃO NOTIFICAÇÃO]', error?.message || error)
}
})
}

const configurar = async ({ grupo, dataGp, setGp, q, prefix, command, reply, automatico: auto = false }) => {
const acao = String(q || '').trim()
const titulo = auto ? '𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰' : '𝚂𝙸𝚂𝚃𝙴𝙼𝙰 𝙳𝙴 𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾'
const descricao = auto ? 'ᴀᴘʀᴏᴠᴀ ᴛᴏᴅᴀs ᴀs ɴᴏᴠᴀs sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.' : 'ᴀᴠɪsᴀ ᴇ ᴍᴏsᴛʀᴀ ʙᴏᴛᴏ̃ᴇs ᴘᴀʀᴀ ᴀᴘʀᴏᴠᴀʀ ᴏᴜ ʀᴇᴄᴜsᴀʀ ɴᴏᴠᴏs ᴍᴇᴍʙʀᴏs.'
if (!['0', '1'].includes(acao))
return reply(mess.funcaoUso(auto ? '🤖' : '📥', titulo, prefix, command, descricao))
if (auto)
automatico(grupo, acao === '1', dataGp, setGp)
else
ativar(grupo, acao === '1', dataGp, setGp)
return reply(acao === '1'
? mess.funcaoAtivada(auto ? '🤖' : '📥', titulo, descricao)
: mess.funcaoDesativada(auto ? '🤖' : '📥', titulo, auto ? 'ᴀs sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ᴠᴏʟᴛᴀʀᴀ̃ᴏ ᴀ sᴇʀ ᴀɴᴀʟɪsᴀᴅᴀs ᴍᴀɴᴜᴀʟᴍᴇɴᴛᴇ.' : 'ᴏ ʙᴏᴛ ɴᴀ̃ᴏ ᴀᴠɪsᴀʀᴀ́ sᴏʙʀᴇ ɴᴏᴠᴀs sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs.'))
}

const decidir = async ({ tokito, grupo, alvo, acao }) => {
await sincronizar(tokito, grupo)
const jid = String(alvo || primeiro(grupo)?.jid || '').trim()
if (!jid)
return {
ok: false,
vazio: true
}
const pedidos = await tokito.groupRequestParticipantsList(grupo).catch(() => [])
const existe = pedidos.some(p => pegarJid(p) === jid)
if (!existe) {
remover(grupo, jid)
return {
ok: false,
indisponivel: true,
jid
}
}
await tokito.groupRequestParticipantsUpdate(grupo, [jid], acao)
remover(grupo, jid)
return {
ok: true,
jid
}
}

const decidirTodos = async ({ tokito, grupo, acao }) => {
const pedidos = await sincronizar(tokito, grupo)
const jids = pedidos.map(p => p.jid).filter(Boolean)
if (!jids.length)
return []
await tokito.groupRequestParticipantsUpdate(grupo, jids, acao)
for (const jid of jids)
remover(grupo, jid)
return jids
}

module.exports = {
iniciar,
estado,
ativar,
automatico,
listar,
primeiro,
remover,
limpar,
sincronizar,
configurar,
decidir,
decidirTodos
}
