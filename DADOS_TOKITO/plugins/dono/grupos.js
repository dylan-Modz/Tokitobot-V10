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

const dylan = require('../../database/lib/comandos')
const aluguel = require('../../sistemas/aluguel/index')

dylan.setCommand({
nome: 'entrar',
comandos: ['entrar', 'sairgp'],
categoria: 'dono',
info: {
descricao: 'Entra ou sai de grupos.',
uso: 'entrar link',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
if (ctx.command === 'sairgp') {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
await ctx.reply(ctx.mess.padraoAviso({
emoji: '👋',
titulo: 'SAINDO DO GRUPO',
descricao: 'Estou saindo deste grupo.'
}))
return ctx.tokito.groupLeave(ctx.from)
}
const m = String(ctx.q || '').match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i)
if (!m)
return ctx.reply(ctx.mess.padraoUso({
emoji: '🔗',
titulo: 'ENTRAR NO GRUPO',
uso: `${ctx.prefix}entrar https://chat.whatsapp.com/SEUCODIGO`,
descricao: 'Informe um link válido de convite do WhatsApp.'
}))
try {
const link = String(ctx.q || '').trim()
const code = m[1]

let inviteInfo = null

try {
inviteInfo = await ctx.tokito.groupGetInviteInfo(code)
} catch {}

const resposta = await ctx.tokito.groupAcceptInvite(code)

let jid = String(
typeof resposta === 'string'
? resposta
: resposta?.id || resposta?.jid || resposta?.groupJid || inviteInfo?.id || inviteInfo?.jid || inviteInfo?.groupJid || ''
).trim()

let metadata = null

if (jid) {
try {
metadata = await ctx.tokito.groupMetadata(jid)
} catch {}
}

const nome = String(
metadata?.subject ||
inviteInfo?.subject ||
inviteInfo?.name ||
'Grupo'
).trim()

const quantidade = Number(
metadata?.participants?.length ||
inviteInfo?.participants?.length ||
inviteInfo?.size ||
inviteInfo?.participantCount ||
inviteInfo?.participantsCount ||
0
)

if (!jid) {
jid = String(inviteInfo?.id || inviteInfo?.jid || inviteInfo?.groupJid || '').trim()
}

if (jid) {
aluguel.savegp(jid, {
nome,
quantidade,
link,
salvoPor: ctx.sender
})
}

return ctx.reply(ctx.mess.grupoEntrou({
nome,
quantidade,
link,
id: jid
}))
}
catch (e) {
return ctx.reply(ctx.mess.padraoErro({
titulo: 'ERRO AO ENTRAR',
descricao: 'Não consegui entrar no grupo.',
detalhe: e?.message || 'Erro desconhecido.'
}))
}
}
}
)
