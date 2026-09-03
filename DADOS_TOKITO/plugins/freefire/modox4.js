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

const x4 = require('./x4')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'modofreefire',
comandos: ['modofreefire', 'modo-freefire', 'modoff'],
categoria: 'freefire',
info: {
descricao: 'Ativa ou desativa os comandos e automações de Free Fire neste grupo.',
uso: 'modofreefire 1/0',
permissao: 'ADM',
categoria: 'freefire'
},
async executar(ctx) {
if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
if (!x4.adm(ctx)) return ctx.reply(ctx.mess.soadm())
const acao = String(ctx.q || '').trim()
const emoji = '🎮'
const titulo = '𝙼𝙾𝙳𝙾 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴'
const descricao = 'ʟɪʙᴇʀᴀ ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴅᴏ ᴍᴇɴᴜ ғʀᴇᴇ ғɪʀᴇ, ɪɴᴄʟᴜɪɴᴅᴏ ʟɪᴋᴇs, sᴀʟᴀs, ʟɪsᴛᴀs, ɴᴏᴛᴀs, ʀᴇᴀᴄ̧ᴏ̃ᴇs ᴇ xɢᴘ.'
if (!['0', '1'].includes(acao)) return ctx.reply(ctx.mess.funcaoUso(emoji, titulo, ctx.prefix, ctx.command, descricao))
const f = x4.garantir(ctx)
if (!f) return ctx.reply(ctx.mess.error())

if (acao === '0' && f.salaFreeFire?.ativa && !ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

if (acao === '0' && f.salaFreeFire?.ativa && ctx.isBotGroupAdmins) {
try {
await ctx.tokito.groupSettingUpdate(ctx.from, 'not_announcement')
} catch {
return ctx.reply(ctx.mess.padraoErro({
titulo: 'NÃO CONSEGUI ABRIR O GRUPO',
descricao: `A lista continua ativa. Tente novamente ou use ${ctx.prefix}sala cancelar.`
}))
}
}

f.modofreefire = acao === '1'
delete f.modox4

if (!f.modofreefire)
delete f.salaFreeFire

ctx.setGp(ctx.dataGp)
await ctx.reagir(ctx.from, f.modofreefire ? '✅' : '❌').catch(() => {})
return ctx.reply(f.modofreefire ? ctx.mess.funcaoAtivada(emoji, titulo, descricao) : ctx.mess.funcaoDesativada(emoji, titulo, descricao))
}
}
)
