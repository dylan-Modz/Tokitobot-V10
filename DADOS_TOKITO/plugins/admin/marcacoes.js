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

const listaJids = ctx => [...new Set((ctx.groupMembers || []).map(m => ctx.nJid(m)).filter(Boolean))]

const quotedMessage = info => {
const m = info?.message || {}
return m?.extendedTextMessage?.contextInfo?.quotedMessage ||
m?.imageMessage?.contextInfo?.quotedMessage ||
m?.videoMessage?.contextInfo?.quotedMessage ||
m?.documentMessage?.contextInfo?.quotedMessage ||
m?.audioMessage?.contextInfo?.quotedMessage ||
m?.stickerMessage?.contextInfo?.quotedMessage || null
}

const desenrolar = msg => {
let m = msg
for (let i = 0; i < 5; i++) {
if (m?.ephemeralMessage?.message) { m = m.ephemeralMessage.message; continue }
if (m?.viewOnceMessage?.message) { m = m.viewOnceMessage.message; continue }
if (m?.viewOnceMessageV2?.message) { m = m.viewOnceMessageV2.message; continue }
if (m?.viewOnceMessageV2Extension?.message) { m = m.viewOnceMessageV2Extension.message; continue }
if (m?.documentWithCaptionMessage?.message) { m = m.documentWithCaptionMessage.message; continue }
break
}
return m || {}
}

const editarLegenda = (msg, texto) => {
if (!texto) return msg
const m = desenrolar(msg)
const tipos = ['imageMessage', 'videoMessage', 'documentMessage']
for (const tipo of tipos) {
if (m?.[tipo]) {
m[tipo].caption = texto
break
}
}
return msg
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'marcar',
comandos: ['marcar', 'totag', 'cita', 'hidetag', 'citar'],
categoria: 'admin',
info: {
descricao: 'Marca todos os membros do grupo.',
uso: 'marcar mensagem | hidetag mensagem',
permissao: 'ADM'
},

async executar(ctx) {
if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins) return ctx.reply(ctx.mess.soadm())
if (!ctx.isBotGroupAdmins) return ctx.reply(ctx.mess.botadm())

const membros = listaJids(ctx)
const texto = String(ctx.q || '').trim()
const contexto = { ...ctx.canalInfo(membros), mentionedJid: membros }

if (ctx.command === 'marcar') {
const msg = `${texto ? `${texto}\n\n` : ''}${membros.map(j => `@${j.split('@')[0]}`).join('\n')}`
return ctx.tokito.sendMessage(ctx.from, {
text: msg,
mentions: membros,
contextInfo: contexto
}, { quoted: ctx.selo })
}

const quoted = quotedMessage(ctx.info)

if (!quoted && texto) {
return ctx.tokito.sendMessage(ctx.from, {
text: texto,
mentions: membros,
contextInfo: contexto
}, { quoted: ctx.selo })
}

if (quoted) {
const aberto = desenrolar(quoted)
const poll = aberto?.pollCreationMessageV3 || aberto?.pollCreationMessageV2 || aberto?.pollCreationMessage

if (poll) {
const titulo = poll.name || 'Enquete'
const opcoes = (poll.options || []).map(o => o?.optionName || o?.name).filter(Boolean)
const aviso = await ctx.tokito.sendMessage(ctx.from, {
text: texto || '🧊',
mentions: membros,
contextInfo: contexto
}, { quoted: ctx.selo })

return ctx.tokito.sendMessage(ctx.from, {
poll: {
name: titulo,
values: opcoes,
selectableCount: Number(poll.selectableCount || poll.selectableOptionsCount || 1),
contextInfo: contexto
},
mentions: membros,
contextInfo: contexto
}, { quoted: aviso })
}

editarLegenda(quoted, texto)

return ctx.tokito.sendMessage(ctx.from, {
forward: {
key: ctx.info?.key || {},
message: quoted
},
mentions: membros,
contextInfo: contexto
}, { quoted: ctx.selo })
}

return ctx.reply(ctx.mess.padraoUso({
emoji: '📣',
titulo: 'MARCAÇÕES',
uso: `${ctx.prefix}${ctx.command} sua mensagem`,
descricao: 'Responda uma mídia/mensagem para reenviá-la marcando todos ou escreva o texto depois do comando.',
exemplos: [`${ctx.prefix}${ctx.command} reunião às 20h`]
}))
}
}
)
