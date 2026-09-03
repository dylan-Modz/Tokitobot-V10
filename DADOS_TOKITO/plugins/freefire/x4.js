/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const ativo = ctx => {
const funcoes = ctx.dataGp?.[0]?.funcoes

if (!funcoes || typeof funcoes !== 'object')
return false

if (typeof funcoes.modofreefire === 'boolean')
return funcoes.modofreefire

return Boolean(funcoes.modox4)
}

const membros = ctx => [...new Set(
(ctx.groupMembers || [])
.map(item => ctx.nJid(item))
.filter(Boolean)
)]

const adm = ctx => Boolean(ctx.isGroupAdmins || ctx.SoDono)

const garantir = ctx => {
if (!ctx.dataGp?.[0]) return null
if (!ctx.dataGp[0].funcoes || typeof ctx.dataGp[0].funcoes !== 'object') ctx.dataGp[0].funcoes = {}
return ctx.dataGp[0].funcoes
}

const esperar = ms => new Promise(resolve => setTimeout(resolve, ms))

const marcacaoOculta = async (ctx, texto = '\u200e') => {
const lista = membros(ctx)
if (!lista.length) return false
await ctx.tokito.sendMessage(ctx.from, {
text: texto,
mentions: lista,
contextInfo: {
...ctx.canalInfo(lista),
mentionedJid: lista
}
}, { quoted: ctx.selo })
return true
}

module.exports = { ativo, membros, adm, garantir, esperar, marcacaoOculta }
