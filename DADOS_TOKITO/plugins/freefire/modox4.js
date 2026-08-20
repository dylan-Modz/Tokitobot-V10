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

const x4 = require('./_x4')

module.exports = {
nome: 'modox4',
comandos: ['modox4', 'modo-x4'],
categoria: 'freefire',
info: {
descricao: 'Ativa ou desativa as automações de X4 neste grupo.',
uso: 'modox4 1/0',
permissao: 'ADM',
categoria: 'freefire'
},
async executar(ctx) {
if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
if (!x4.adm(ctx)) return ctx.reply(ctx.mess.soadm())
const acao = String(ctx.q || '').trim()
const emoji = '🎮'
const titulo = '𝙼𝙾𝙳𝙾 𝚇𝟺'
const descricao = 'ʟɪʙᴇʀᴀ ᴀᴛᴀʟʜᴏs ᴅᴇ sᴀʟᴀ, ᴍᴀʀᴄᴀᴄ̧ᴀ̃ᴏ, ᴛɪᴍᴇs, ɴᴏᴛᴀs ᴇ xɢᴘ.'
if (!['0', '1'].includes(acao)) return ctx.reply(ctx.mess.funcaoUso(emoji, titulo, ctx.prefix, ctx.command, descricao))
const f = x4.garantir(ctx)
if (!f) return ctx.reply(ctx.mess.error())
f.modox4 = acao === '1'
ctx.setGp(ctx.dataGp)
await ctx.reagir(ctx.from, f.modox4 ? '✅' : '❌').catch(() => {})
return ctx.reply(f.modox4 ? ctx.mess.funcaoAtivada(emoji, titulo, descricao) : ctx.mess.funcaoDesativada(emoji, titulo, descricao))
}
}
