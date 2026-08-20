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

const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys')
const x4 = require('./_x4')

const notas = ctx => {
const f = x4.garantir(ctx)
if (!f) return []
if (!Array.isArray(f.x4notas)) f.x4notas = []
return f.x4notas
}

const seletor = async (ctx, lista) => {
const menu = {
title: '📝 ANOTAÇÕES X4',
sections: [{
title: 'Escolha uma anotação',
rows: lista.map((texto, i) => ({
title: `📝 Nota ${i + 1}`,
description: String(texto).slice(0, 72),
id: `${ctx.prefix}nota enviar ${i + 1}`
}))
}]
}

const msg = generateWAMessageFromContent(ctx.from, {
interactiveMessage: proto.Message.InteractiveMessage.create({
body: proto.Message.InteractiveMessage.Body.create({ text: '- 📝 `𝙰𝙽𝙾𝚃𝙰𝙲̧𝙾̃𝙴𝚂 𝚇𝟺`' }),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify(menu) }],
messageParamsJson: JSON.stringify({})
})
})
}, { quoted: ctx.selo, userJid: ctx.tokito.user?.id })

await ctx.tokito.relayMessage(ctx.from, msg.message, { messageId: msg.key.id })
}

module.exports = {
nome: 'nota',
comandos: ['nota', 'notax4', 'anotacao', 'anotacoes'],
categoria: 'freefire',
info: {
descricao: 'Salva e escolhe anotações rápidas do modo X4.',
uso: 'nota add texto | nota del número | nota',
permissao: 'ADM',
categoria: 'freefire'
},
async executar(ctx) {
if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
if (!x4.ativo(ctx)) return ctx.reply(`- ⚠️ \`𝙼𝙾𝙳𝙾 𝚇𝟺\`\n\n> *ᴀᴛɪᴠᴇ ᴘʀɪᴍᴇɪʀᴏ ᴄᴏᴍ ${ctx.prefix}modox4 1.*`)
if (!x4.adm(ctx)) return ctx.reply(ctx.mess.soadm())

const lista = notas(ctx)
const q = String(ctx.q || '').trim()
const [acaoRaw, ...resto] = q.split(/\s+/)
const acao = String(acaoRaw || '').toLowerCase()

if (acao === 'add') {
const texto = resto.join(' ').trim()
if (!texto) return ctx.reply(`- 📝 \`𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝚁 𝙽𝙾𝚃𝙰\`\n\n> *ᴜsᴇ ${ctx.prefix}nota add sua anotação.*`)
if (lista.length >= 20) return ctx.reply('- ⚠️ `𝙻𝙸𝙼𝙸𝚃𝙴`\n\n> *ᴏ ʟɪᴍɪᴛᴇ ᴇ́ 20 ᴀɴᴏᴛᴀᴄ̧ᴏ̃ᴇs.*')
lista.push(texto.slice(0, 1000))
ctx.setGp(ctx.dataGp)
return ctx.reply(`- ✅ \`𝙽𝙾𝚃𝙰 𝚂𝙰𝙻𝚅𝙰\`\n\n> *『 ${lista.length} 』— ᴀɴᴏᴛᴀᴄ̧ᴀ̃ᴏ sᴀʟᴠᴀ ᴄᴏᴍ sᴜᴄᴇssᴏ.*`)
}

if (['del', 'apagar', 'remover'].includes(acao)) {
const n = Number(resto[0])
if (!Number.isInteger(n) || n < 1 || n > lista.length) return ctx.reply('- ❌ `𝙽𝙾𝚃𝙰 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰`')
lista.splice(n - 1, 1)
ctx.setGp(ctx.dataGp)
return ctx.reply('- ✅ `𝙽𝙾𝚃𝙰 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙰`')
}

if (acao === 'enviar') {
const n = Number(resto[0])
if (!Number.isInteger(n) || n < 1 || n > lista.length) return ctx.reply('- ❌ `𝙽𝙾𝚃𝙰 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰`')
return ctx.reply(lista[n - 1])
}

if (!lista.length) return ctx.reply(`- 📝 \`𝚂𝙴𝙼 𝙰𝙽𝙾𝚃𝙰𝙲̧𝙾̃𝙴𝚂\`\n\n> *ᴜsᴇ ${ctx.prefix}nota add sua anotação.*`)
return seletor(ctx, lista)
}
}
