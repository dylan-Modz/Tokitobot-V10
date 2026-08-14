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

const { WAMessageStubType, decryptPollVote, getAggregateVotesInPollMessage, getKeyAuthor, jidNormalizedUser } = require('@whiskeysockets/baileys')
const base = require('./base.js')
const toggle = require('./toggle.js')
const mess = require('../database/lib/global.js')

const estadoGlobal = global.__TOKITO_X9_ESTADO__ ||= {
votos: new Map(),
eventos: new Map()
}

const { votos, eventos } = estadoGlobal

const limiteStore = 5000

const eventoDuplicado = (chave, tempo = 15000) => {
if (!chave)
return false
const agora = Date.now()
const anterior = eventos.get(chave) || 0
if (agora - anterior < tempo)
return true
eventos.set(chave, agora)
if (eventos.size > 5000) {
for (const [item, data] of eventos) {
if (agora - data > 120000)
eventos.delete(item)
}
}
return false
}

global.messageStore = global.messageStore || {}

global.messageStoreOrdem = global.messageStoreOrdem || []

const ativo = grupo => Boolean(base.config(grupo)?.x9)

const configurar = ctx => toggle({
...ctx,
campo: 'x9',
emoji: '🕵️',
titulo: '𝚂𝙸𝚂𝚃𝙴𝙼𝙰 𝚇𝟿',
descricao: 'ʀᴇᴠᴇʟᴀ ᴍᴇɴsᴀɢᴇɴs ᴀᴘᴀɢᴀᴅᴀs, ᴠᴏᴛᴏs ᴇᴍ ᴇɴǫᴜᴇᴛᴀs ᴇ ᴀʟᴛᴇʀᴀᴄ̧ᴏ̃ᴇs ʀᴇᴀʟɪᴢᴀᴅᴀs ɴᴏ ɢʀᴜᴘᴏ.'
})

const guardar = mensagem => {
const id = mensagem?.key?.id
if (!id)
return
const jaExistia = Boolean(global.messageStore[id])
global.messageStore[id] = mensagem
if (!jaExistia)
global.messageStoreOrdem.push(id)
while (global.messageStoreOrdem.length > limiteStore) {
const antigo = global.messageStoreOrdem.shift()
if (antigo)
delete global.messageStore[antigo]
}
}

const enviar = async (tokito, grupo, texto, mencoes = []) => {
if (!ativo(grupo))
return
await tokito.sendMessage(grupo, {
text: texto,
contextInfo: { mentionedJid: [...new Set(mencoes.filter(Boolean))] }
}).catch(error => console.log('[X9 ENVIO]', error?.message || error))
}

const jidEvento = valor => base.normalizar(valor)

const processarApagadas = async (tokito, atualizacoes) => {
for (const item of atualizacoes || []) {
try {
const apagada = item?.update?.messageStubType === WAMessageStubType.REVOKE || (item?.update?.message === null && item?.update?.key)
if (!apagada)
continue
const grupo = item?.key?.remoteJid
if (!grupo?.endsWith('@g.us') || !ativo(grupo))
continue
if (eventoDuplicado(`apagada:${grupo}:${item?.key?.id || ''}`, 120000))
continue
const original = global.messageStore?.[item.key.id]
const autorJid = jidEvento(original?.key?.participantAlt || original?.key?.participant || item?.key?.participantAlt || item?.key?.participant)
const apagouJid = jidEvento(item?.update?.key?.participantAlt || item?.update?.key?.participant || autorJid)
const autor = base.numero(autorJid) || 'desconhecido'
const apagou = base.numero(apagouJid) || autor
const tipo = base.tipo(original?.message)
const conteudo = base.texto(original?.message) || `[ ${tipo.toUpperCase()} ]`
await enviar(tokito, grupo, mess.x9MensagemApagada(autor, apagou, tipo, conteudo), [autorJid, apagouJid])
if (original?.message) {
await tokito.sendMessage(grupo, { forward: original }).catch(() => {
})
}
if (item.key.id)
delete global.messageStore[item.key.id]
}
catch (error) {
console.log('[X9 APAGADA]', error?.message || error)
}
}
}

const processarEnquete = async (tokito, mensagem) => {
try {
const grupo = mensagem?.key?.remoteJid
if (!grupo?.endsWith('@g.us') || !ativo(grupo))
return
const conteudo = base.desenrolar(mensagem.message)
const atualizacao = conteudo?.pollUpdateMessage
if (!atualizacao?.pollCreationMessageKey || !atualizacao?.vote)
return
const chave = atualizacao.pollCreationMessageKey
const original = global.messageStore?.[chave.id]
if (!original?.message)
return
const criacao = base.desenrolar(original.message)
const segredo = criacao?.messageContextInfo?.messageSecret
if (!segredo)
return
const meuJid = jidNormalizedUser(tokito.user?.id || '')
const criador = getKeyAuthor(chave, meuJid)
const eleitor = getKeyAuthor(mensagem.key, meuJid)
const voto = decryptPollVote(atualizacao.vote, {
pollCreatorJid: criador,
pollMsgId: chave.id,
pollEncKey: segredo,
voterJid: eleitor
})
const agregado = getAggregateVotesInPollMessage({
message: criacao,
pollUpdates: [{
pollUpdateMessageKey: mensagem.key,
vote
}]
}, meuJid)
const opcoes = agregado.filter(item => item.voters?.some(jid => jidNormalizedUser(jid) === jidNormalizedUser(eleitor))).map(item => item.name).filter(Boolean)
const poll = criacao?.pollCreationMessage || criacao?.pollCreationMessageV2 || criacao?.pollCreationMessageV3
const nome = poll?.name || 'Enquete'
const chaveVoto = `${grupo}:${chave.id}:${jidNormalizedUser(eleitor)}`
const anterior = votos.get(chaveVoto)
const atual = opcoes.join(', ')
if (anterior === atual)
return
votos.set(chaveVoto, atual)
await enviar(tokito, grupo, mess.x9Enquete(base.numero(eleitor), nome, atual, anterior !== undefined && anterior !== atual), [eleitor])
}
catch (error) {
console.log('[X9 ENQUETE]', error?.message || error)
}
}

const processarStub = async (tokito, mensagem) => {
try {
const grupo = mensagem?.key?.remoteJid
if (!grupo?.endsWith('@g.us') || !ativo(grupo))
return
const tipo = mensagem?.messageStubType
if (eventoDuplicado(`stub:${grupo}:${mensagem?.key?.id || ''}:${tipo}`, 30000))
return
const autorJid = jidEvento(mensagem?.key?.participantAlt || mensagem?.key?.participant)
const autor = base.numero(autorJid) || 'desconhecido'
const parametros = mensagem?.messageStubParameters || []
if (tipo === WAMessageStubType.GROUP_CHANGE_ICON) {
await enviar(tokito, grupo, mess.x9Grupo('🖼️', '𝙵𝙾𝚃𝙾 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾', autor, parametros?.[0] ? 'ᴀʟᴛᴇʀᴏᴜ ᴀ ғᴏᴛᴏ ᴅᴏ ɢʀᴜᴘᴏ' : 'ʀᴇᴍᴏᴠᴇᴜ ᴀ ғᴏᴛᴏ ᴅᴏ ɢʀᴜᴘᴏ'), [autorJid])
}
if (tipo === WAMessageStubType.CHANGE_EPHEMERAL_SETTING) {
const segundos = Number(parametros?.[0] || 0)
const valor = segundos ? `${segundos} sᴇɢᴜɴᴅᴏs` : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴀs'
await enviar(tokito, grupo, mess.x9Grupo('⏳', '𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙽𝚂 𝚃𝙴𝙼𝙿𝙾𝚁𝙰́𝚁𝙸𝙰𝚂', autor, 'ᴀʟᴛᴇʀᴏᴜ ᴀ ᴄᴏɴғɪɢᴜʀᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ᴍᴇɴsᴀɢᴇɴs ᴛᴇᴍᴘᴏʀᴀ́ʀɪᴀs ᴘᴀʀᴀ', valor), [autorJid])
}
}
catch (error) {
console.log('[X9 STUB]', error?.message || error)
}
}

const processarUpsert = async (tokito, upsert) => {
for (const mensagem of upsert?.messages || []) {
guardar(mensagem)
await processarEnquete(tokito, mensagem)
await processarStub(tokito, mensagem)
}
}

const processarGrupos = async (tokito, atualizacoes) => {
for (const item of atualizacoes || []) {
try {
const grupo = item?.id
if (!grupo?.endsWith('@g.us') || !ativo(grupo))
continue

const autorOriginal = item?.authorPn || item?.author
if (!autorOriginal)
continue

const autorJid = jidEvento(autorOriginal)
const autor = base.numero(autorJid)
if (!autorJid || !autor)
continue

const assinatura = [
item?.subject,
item?.desc,
item?.announce,
item?.restrict,
item?.inviteCode,
item?.memberAddMode,
item?.joinApprovalMode,
item?.ephemeralDuration,
autorOriginal
].map(valor => String(valor ?? '')).join('|')

if (eventoDuplicado(`grupo:${grupo}:${assinatura}`, 30000))
continue

if (Object.prototype.hasOwnProperty.call(item, 'subject')) {
await enviar(tokito, grupo, mess.x9Grupo('📝', '𝙽𝙾𝙼𝙴 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾', autor, 'ᴀʟᴛᴇʀᴏᴜ ᴏ ɴᴏᴍᴇ ᴅᴏ ɢʀᴜᴘᴏ ᴘᴀʀᴀ', item.subject || 'sᴇᴍ ɴᴏᴍᴇ'), [autorJid])
}
if (Object.prototype.hasOwnProperty.call(item, 'desc')) {
await enviar(tokito, grupo, mess.x9Grupo('📄', '𝙳𝙴𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾', autor, 'ᴀʟᴛᴇʀᴏᴜ ᴀ ᴅᴇsᴄʀɪᴄ̧ᴀ̃ᴏ ᴅᴏ ɢʀᴜᴘᴏ ᴘᴀʀᴀ', item.desc || 'sᴇᴍ ᴅᴇsᴄʀɪᴄ̧ᴀ̃ᴏ'), [autorJid])
}
if (Object.prototype.hasOwnProperty.call(item, 'announce')) {
await enviar(tokito, grupo, mess.x9Grupo(item.announce ? '🔒' : '🔓', item.announce ? '𝙶𝚁𝚄𝙿𝙾 𝙵𝙴𝙲𝙷𝙰𝙳𝙾' : '𝙶𝚁𝚄𝙿𝙾 𝙰𝙱𝙴𝚁𝚃𝙾', autor, item.announce ? 'ғᴇᴄʜᴏᴜ ᴏ ɢʀᴜᴘᴏ ᴘᴀʀᴀ ǫᴜᴇ sᴏᴍᴇɴᴛᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴇɴᴠɪᴇᴍ ᴍᴇɴsᴀɢᴇɴs' : 'ᴀʙʀɪᴜ ᴏ ɢʀᴜᴘᴏ ᴘᴀʀᴀ ǫᴜᴇ ᴛᴏᴅᴏs ᴇɴᴠɪᴇᴍ ᴍᴇɴsᴀɢᴇɴs'), [autorJid])
}
if (Object.prototype.hasOwnProperty.call(item, 'restrict')) {
await enviar(tokito, grupo, mess.x9Grupo('⚙️', '𝙴𝙳𝙸𝙲̧𝙰̃𝙾 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾', autor, item.restrict ? 'ᴅᴇғɪɴɪᴜ ǫᴜᴇ sᴏᴍᴇɴᴛᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴘᴏᴅᴇᴍ ᴇᴅɪᴛᴀʀ ᴏ ɢʀᴜᴘᴏ' : 'ʟɪʙᴇʀᴏᴜ ᴛᴏᴅᴏs ᴏs ᴍᴇᴍʙʀᴏs ᴘᴀʀᴀ ᴇᴅɪᴛᴀʀ ᴏ ɢʀᴜᴘᴏ'), [autorJid])
}
if (Object.prototype.hasOwnProperty.call(item, 'inviteCode')) {
await enviar(tokito, grupo, mess.x9Grupo('🔗', '𝙻𝙸𝙽𝙺 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾', autor, 'ʀᴇᴅᴇғɪɴɪᴜ ᴏ ʟɪɴᴋ ᴅᴇ ᴄᴏɴᴠɪᴛᴇ ᴅᴏ ɢʀᴜᴘᴏ'), [autorJid])
}
if (Object.prototype.hasOwnProperty.call(item, 'memberAddMode')) {
await enviar(tokito, grupo, mess.x9Grupo('➕', '𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝚁 𝙼𝙴𝙼𝙱𝚁𝙾𝚂', autor, item.memberAddMode ? 'ʟɪʙᴇʀᴏᴜ ᴛᴏᴅᴏs ᴏs ᴍᴇᴍʙʀᴏs ᴘᴀʀᴀ ᴀᴅɪᴄɪᴏɴᴀʀ ᴘᴇssᴏᴀs' : 'ᴅᴇғɪɴɪᴜ ǫᴜᴇ sᴏᴍᴇɴᴛᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴘᴏᴅᴇᴍ ᴀᴅɪᴄɪᴏɴᴀʀ ᴘᴇssᴏᴀs'), [autorJid])
}
if (Object.prototype.hasOwnProperty.call(item, 'joinApprovalMode')) {
await enviar(tokito, grupo, mess.x9Grupo('📥', '𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾 𝙳𝙴 𝙼𝙴𝙼𝙱𝚁𝙾𝚂', autor, item.joinApprovalMode ? 'ᴀᴛɪᴠᴏᴜ ᴀ ᴀᴘʀᴏᴠᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ɴᴏᴠᴏs ᴍᴇᴍʙʀᴏs' : 'ᴅᴇsᴀᴛɪᴠᴏᴜ ᴀ ᴀᴘʀᴏᴠᴀᴄ̧ᴀ̃ᴏ ᴅᴇ ɴᴏᴠᴏs ᴍᴇᴍʙʀᴏs'), [autorJid])
}
if (Object.prototype.hasOwnProperty.call(item, 'ephemeralDuration')) {
const valor = item.ephemeralDuration ? `${item.ephemeralDuration} sᴇɢᴜɴᴅᴏs` : 'ᴅᴇsᴀᴛɪᴠᴀᴅᴀs'
await enviar(tokito, grupo, mess.x9Grupo('⏳', '𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙽𝚂 𝚃𝙴𝙼𝙿𝙾𝚁𝙰́𝚁𝙸𝙰𝚂', autor, 'ᴀʟᴛᴇʀᴏᴜ ᴀ ᴄᴏɴғɪɢᴜʀᴀᴄ̧ᴀ̃ᴏ ᴘᴀʀᴀ', valor), [autorJid])
}
}
catch (error) {
console.log('[X9 GRUPO]', error?.message || error)
}
}
}

const processarParticipantes = async (tokito, evento) => {
const lista = Array.isArray(evento) ? evento : [evento]
for (const item of lista) {
try {
const grupo = item?.id
if (!grupo?.endsWith('@g.us') || !ativo(grupo))
continue
const participantesEvento = (item?.participants || []).map(participante => String(participante?.phoneNumber || participante?.jid || participante?.id || participante?.participant || participante || '')).sort().join(',')
const assinatura = `${item?.action || ''}:${item?.authorPn || item?.author || ''}:${participantesEvento}`
if (eventoDuplicado(`participantes:${grupo}:${assinatura}`, 30000))
continue
const autorJid = jidEvento(item?.authorPn || item?.author)
const autor = base.numero(autorJid) || 'desconhecido'
for (const participante of item?.participants || []) {
const alvoJid = jidEvento(participante?.phoneNumber || participante?.jid || participante?.id || participante?.participant || participante)
const alvo = base.numero(alvoJid) || 'desconhecido'
if (item.action === 'add')
await enviar(tokito, grupo, mess.x9Participante('➕', '𝙼𝙴𝙼𝙱𝚁𝙾 𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙳𝙾', autor, alvo, 'ᴀᴅɪᴄɪᴏɴᴏᴜ'), [autorJid, alvoJid])
if (item.action === 'promote')
await enviar(tokito, grupo, mess.x9Participante('👑', '𝙼𝙴𝙼𝙱𝚁𝙾 𝙿𝚁𝙾𝙼𝙾𝚅𝙸𝙳𝙾', autor, alvo, 'ᴘʀᴏᴍᴏᴠᴇᴜ ᴀ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ'), [autorJid, alvoJid])
if (item.action === 'demote')
await enviar(tokito, grupo, mess.x9Participante('📉', '𝙰𝙳𝙼𝙸𝙽 𝚁𝙴𝙱𝙰𝙸𝚇𝙰𝙳𝙾', autor, alvo, 'ʀᴇʙᴀɪxᴏᴜ ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀ'), [autorJid, alvoJid])
if (item.action === 'remove') {
const saiu = jidNormalizedUser(autorJid) === jidNormalizedUser(alvoJid)

if (saiu) {
await enviar(
tokito,
grupo,
mess.x9Saiu(alvo),
[alvoJid]
)

continue
}

await enviar(
tokito,
grupo,
mess.x9Participante(
'🚫',
'𝙼𝙴𝙼𝙱𝚁𝙾 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾',
autor,
alvo,
'ʀᴇᴍᴏᴠᴇᴜ'
),
[autorJid, alvoJid]
)
}
}
}
catch (error) {
console.log('[X9 PARTICIPANTES]', error?.message || error)
}
}
}

const iniciar = tokito => {
if (!tokito?.ev?.on || tokito.x9TokitoIniciado)
return
tokito.x9TokitoIniciado = true
const socketAtual = () => !global.__TOKITO_SOCKET_ATUAL__ || global.__TOKITO_SOCKET_ATUAL__ === tokito
tokito.ev.on('messages.upsert', upsert => {
if (!socketAtual())
return
processarUpsert(tokito, upsert).catch(() => {
})
})
tokito.ev.on('messages.update', updates => {
if (!socketAtual())
return
processarApagadas(tokito, updates).catch(() => {
})
})
tokito.ev.on('groups.update', updates => {
if (!socketAtual())
return
processarGrupos(tokito, updates).catch(() => {
})
})
tokito.ev.on('group-participants.update', update => {
if (!socketAtual())
return
processarParticipantes(tokito, update).catch(() => {
})
})
}

module.exports = {
iniciar,
configurar,
ativo,
guardar,
processarUpsert,
processarApagadas,
processarGrupos,
processarParticipantes
}
