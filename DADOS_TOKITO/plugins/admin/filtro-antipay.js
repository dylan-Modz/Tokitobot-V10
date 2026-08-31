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

const base = require('../../sistemas/grupos.js')
const toggle = require('../../sistemas/toggle.js')
const mess = require('../../mensagens/mensagens.js')

const chaves = new Set([
'requestPaymentMessage',
'sendPaymentMessage',
'paymentInviteMessage',
'paymentOrderMessage',
'paymentMessage',
'paymentInfo',
'paymentBackground'
])

const fila = global.__TOKITO_ANTIPAY__ ||= new Map()

const detectar = (objeto, vistos = new WeakSet()) => {
if (!objeto || typeof objeto !== 'object' || Buffer.isBuffer(objeto))
return false
if (vistos.has(objeto))
return false
vistos.add(objeto)
for (const [chave, valor] of Object.entries(objeto)) {
if (chaves.has(chave))
return true
if (valor && typeof valor === 'object' && detectar(valor, vistos))
return true
}
return false
}

const configurar = ctx => toggle({
...ctx,
campo: 'antipay',
emoji: '💳',
titulo: '𝙰𝙽𝚃𝙸-𝙿𝙰𝚈',
descricao: 'ғᴇᴄʜᴀ ᴏ ɢʀᴜᴘᴏ, ᴇᴅɪᴛᴀ ᴇ ᴀᴘᴀɢᴀ ᴀ ᴍᴇɴsᴀɢᴇᴍ ᴅᴇ ᴘᴀɢᴀᴍᴇɴᴛᴏ, ʀᴇᴍᴏᴠᴇ ᴏ ᴜsᴜᴀ́ʀɪᴏ ᴇ ᴀʙʀᴇ ᴏ ɢʀᴜᴘᴏ ɴᴏᴠᴀᴍᴇɴᴛᴇ.'
})

const ids = membro => [
membro?.phoneNumber,
membro?.participantAlt,
membro?.participantPn,
membro?.jid,
membro?.id,
membro?.participant,
membro?.lid
].filter(Boolean)

const mesmo = (a, b) => {
const x = base.normalizar(a)
const y = base.normalizar(b)
if (!x || !y)
return false
if (x === y)
return true
const nx = base.numero(x)
const ny = base.numero(y)
return Boolean(nx && ny && nx === ny)
}

const membro = (meta, alvo) => {
const lista = meta?.participants || []
return lista.find(item => ids(item).some(jid => mesmo(jid, alvo))) || null
}

const resolver = (meta, alvo) => {
const item = membro(meta, alvo)
if (!item)
return base.normalizar(alvo)
const real = ids(item)
.map(base.normalizar)
.find(jid => String(jid).endsWith('@s.whatsapp.net'))
return real || base.normalizar(alvo)
}

const trava = (from, id) => {
const chave = `${from}:${id}`
const agora = Date.now()
const antes = fila.get(chave) || 0
for (const [item, tempo] of fila) {
if (agora - tempo > 180000)
fila.delete(item)
}
if (agora - antes < 180000)
return true
fila.set(chave, agora)
return false
}

const apagarRastro = async (tokito, from, id) => {
if (!id)
return false
try {
await tokito.sendMessage(from, {
delete: {
remoteJid: from,
id,
fromMe: true
}
})
return true
}
catch {
try {
await tokito.sendMessage(from, {
delete: {
remoteJid: from,
id,
fromMe: false,
participant: tokito.user?.id
}
})
return true
}
catch {
return false
}
}
}

const apagar = async (tokito, info, participante) => {
if (!info?.key?.id || !info?.key?.remoteJid)
return false
try {
await tokito.sendMessage(info.key.remoteJid, { delete: info.key })
return true
}
catch {
}
try {
await tokito.sendMessage(info.key.remoteJid, {
delete: {
remoteJid: info.key.remoteJid,
id: info.key.id,
fromMe: false,
participant: participante
}
})
return true
}
catch {
return false
}
}

const editarEApagar = async ({ tokito, info, from, participante }) => {
let auxiliar = ''
try {
const msg = await tokito.sendMessage(from, { text: '\u200B' })
auxiliar = msg?.key?.id || ''
if (auxiliar) {
await tokito.sendMessage(from, {
text: mess.antiPayTextoEditado(),
edit: { id: auxiliar }
}, {
messageId: info.key?.id
}).catch(() => {
})
await base.esperar(500)
}
}
catch (error) {
console.log('[ANTI-PAY EDITAR]', error?.message || error)
}
await apagar(tokito, info, participante)
await base.esperar(500)
await apagarRastro(tokito, from, auxiliar)
return true
}

const executar = async ({ tokito, info, from, participante, newsletter = {}, selo = null }) => {
if (!tokito || !info?.key?.id || !from || !participante)
return false
if (trava(from, info.key.id))
return true
let fechado = false
let removido = false
try {
await base.esperar(400)
await tokito.groupSettingUpdate(from, 'announcement')
fechado = true
await editarEApagar({
tokito,
info,
from,
participante
})
await base.esperar(500)
try {
await tokito.groupParticipantsUpdate(from, [participante], 'remove')
removido = true
}
catch (error) {
console.log('[ANTI-PAY REMOVER]', error?.message || error)
}
await base.esperar(1500)
}
catch (error) {
console.log('[ANTI-PAY]', error?.message || error)
await apagar(tokito, info, participante).catch(() => {
})
}
finally {
if (fechado) {
await tokito.groupSettingUpdate(from, 'not_announcement').catch(error => {
console.log('[ANTI-PAY REABRIR]', error?.message || error)
})
}
}
await base.esperar(500)
const conteudo = {
text: mess.antiPayRemocao(base.numero(participante), removido),
contextInfo: {
...newsletter,
mentionedJid: [participante]
}
}
const opcoes = selo ? { quoted: selo } : {}
await tokito.sendMessage(from, conteudo, opcoes).catch(() => {
})
return true
}

const verificar = async (ctx) => {
const { tokito, info, from, sender, original, isGroup, isGroupAdmins, isBotGroupAdmins, config, newsletter, selo } = ctx
if (!isGroup || !config?.antipay || isGroupAdmins || !detectar(original))
return false
if (!isBotGroupAdmins || info.key?.fromMe)
return false
const participante = base.normalizar(info.key?.participantAlt || info.key?.participant || sender)
if (!participante)
return false
return executar({
tokito,
info,
from,
participante,
newsletter,
selo
})
}

const externo = async ({ tokito, info }) => {
const from = String(info?.key?.remoteJid || '')
if (!tokito || !from.endsWith('@g.us') || info?.key?.fromMe || !detectar(info?.message))
return false
if (!base.config(from)?.antipay)
return false
let meta
try {
meta = await tokito.groupMetadata(from)
}
catch {
return false
}
const bot = membro(meta, tokito.user?.id || tokito.user?.lid)
if (!bot || !['admin', 'superadmin'].includes(bot?.admin))
return false
const bruto = info.key?.participantAlt || info.key?.senderAlt || info.key?.participant || ''
const item = membro(meta, bruto)
if (item && ['admin', 'superadmin'].includes(item?.admin))
return false
const participante = resolver(meta, bruto)
if (!participante || mesmo(participante, tokito.user?.id))
return false
return executar({
tokito,
info,
from,
participante
})
}

module.exports = {
configurar,
verificar,
detectar,
editarEApagar,
externo,
executar
}
