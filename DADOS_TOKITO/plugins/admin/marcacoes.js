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

const modulos = require('../../sistemas/modulos')

const listaJids = ctx => [...new Set((ctx.groupMembers || []).map(m => ctx.nJid(m)).filter(Boolean))]

module.exports = {
nome: 'marcar',
comandos: ['marcar', 'totag', 'cita', 'hidetag', 'citar'],
categoria: 'admin',
info: {
descricao: 'Marca todos os membros do grupo.',
uso: 'marcar mensagem | hidetag mensagem',
permissao: 'ADM'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins)
return ctx.reply(ctx.mess.soadm())
if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())
const membros = listaJids(ctx)
if (ctx.command === 'marcar') {
const extra = String(ctx.q || '').trim()
const texto = `${extra ? `${extra}\n\n` : ''}${membros.map(j => `@${j.split('@')[0]}`).join('\n')}`
return ctx.tokito.sendMessage(ctx.from, {
text: texto,
mentions: membros,
contextInfo: ctx.canalInfo(membros)
}, { quoted: ctx.selo })
}
const mid = modulos.mediaAtual(ctx)
const caption = String(ctx.q || '').trim()
const base = {
mentions: membros,
contextInfo: ctx.canalInfo(membros)
}
if (mid.image) {
const b = await ctx.getFileBuffer(mid.image, 'image')
return ctx.tokito.sendMessage(ctx.from, {
image: b,
caption: caption || mid.image.caption || '',
...base
}, { quoted: ctx.selo })
}
if (mid.video) {
const b = await ctx.getFileBuffer(mid.video, 'video')
return ctx.tokito.sendMessage(ctx.from, {
video: b,
caption: caption || mid.video.caption || '',
mimetype: mid.video.mimetype || 'video/mp4',
...base
}, { quoted: ctx.selo })
}
if (mid.audio) {
const b = await ctx.getFileBuffer(mid.audio, 'audio')
return ctx.tokito.sendMessage(ctx.from, {
audio: b,
mimetype: mid.audio.mimetype || 'audio/ogg; codecs=opus',
ptt: Boolean(mid.audio.ptt),
...base
}, { quoted: ctx.selo })
}
if (mid.document) {
const b = await ctx.getFileBuffer(mid.document, 'document')
return ctx.tokito.sendMessage(ctx.from, {
document: b,
mimetype: mid.document.mimetype || 'application/octet-stream',
fileName: mid.document.fileName || 'arquivo',
caption: caption || mid.document.caption || '',
...base
}, { quoted: ctx.selo })
}
if (mid.poll) {
const valores = (mid.poll.options || []).map(o => o.optionName || o.name).filter(Boolean)
return ctx.tokito.sendMessage(ctx.from, {
poll: {
name: caption || mid.poll.name || 'Enquete',
values: valores,
selectableCount: Number(mid.poll.selectableOptionsCount || 1)
},
contextInfo: ctx.canalInfo(membros)
}, { quoted: ctx.selo })
}
return ctx.tokito.sendMessage(ctx.from, {
text: caption || ctx.body.replace(/^\S+\s*/, '') || '🧊',
mentions: membros,
contextInfo: ctx.canalInfo(membros)
}, { quoted: ctx.selo })
}
}
