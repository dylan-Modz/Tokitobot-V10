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

const { proto, generateWAMessageFromContent } = require('baileys')
const x4 = require('./x4')

const notas = ctx => {
const f = x4.garantir(ctx)
if (!f) return []
if (!Array.isArray(f.x4notas)) f.x4notas = []
return f.x4notas
}

const seletor = async (ctx, lista) => {
const menu = {
title: '📝 ANOTAÇÕES FREE FIRE',
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
body: proto.Message.InteractiveMessage.Body.create({ text: '- 📝 `𝙰𝙽𝙾𝚃𝙰𝙲̧𝙾̃𝙴𝚂 𝙵𝚁𝙴𝙴 𝙵𝙸𝚁𝙴`' }),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify(menu) }],
messageParamsJson: JSON.stringify({})
})
})
}, { quoted: ctx.selo, userJid: ctx.tokito.user?.id })

await ctx.tokito.relayMessage(ctx.from, msg.message, { messageId: msg.key.id })
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'nota',
comandos: ['nota', 'notax4', 'anotacao', 'anotacoes'],
categoria: 'freefire',
info: {
descricao: 'Salva e escolhe anotações rápidas do Modo Free Fire.',
uso: 'nota add texto | nota del número | nota',
permissao: 'ADM',
categoria: 'freefire'
},
async executar(ctx) {
if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
if (!x4.ativo(ctx)) return ctx.reply(ctx.mess.padraoAviso({
titulo: 'MODO FREE FIRE',
descricao: `Ative primeiro com ${ctx.prefix}modofreefire 1.`
}))
if (!x4.adm(ctx)) return ctx.reply(ctx.mess.soadm())

const lista = notas(ctx)
const q = String(ctx.q || '').trim()
const [acaoRaw, ...resto] = q.split(/\s+/)
const acao = String(acaoRaw || '').toLowerCase()

if (acao === 'add') {
const texto = resto.join(' ').trim()
if (!texto) return ctx.reply(ctx.mess.padraoUso({
emoji: '📝',
titulo: 'ADICIONAR NOTA',
uso: `${ctx.prefix}nota add sua anotação`,
descricao: 'Digite a anotação que deseja salvar.'
}))
if (lista.length >= 20) return ctx.reply(ctx.mess.padraoAviso({
titulo: 'LIMITE DE NOTAS',
descricao: 'O limite é de 20 anotações.'
}))
lista.push(texto.slice(0, 1000))
ctx.setGp(ctx.dataGp)
return ctx.reply(ctx.mess.padraoSucesso({
emoji: '📝',
titulo: 'NOTA SALVA',
descricao: `Anotação ${lista.length} salva com sucesso.`
}))
}

if (['del', 'apagar', 'remover'].includes(acao)) {
const n = Number(resto[0])
if (!Number.isInteger(n) || n < 1 || n > lista.length) return ctx.reply(ctx.mess.padraoErro({
titulo: 'NOTA INVÁLIDA',
descricao: 'Informe o número de uma anotação existente.'
}))
lista.splice(n - 1, 1)
ctx.setGp(ctx.dataGp)
return ctx.reply(ctx.mess.padraoSucesso({
emoji: '📝',
titulo: 'NOTA REMOVIDA',
descricao: 'A anotação foi removida com sucesso.'
}))
}

if (acao === 'enviar') {
const n = Number(resto[0])
if (!Number.isInteger(n) || n < 1 || n > lista.length) return ctx.reply(ctx.mess.padraoErro({
titulo: 'NOTA INVÁLIDA',
descricao: 'Informe o número de uma anotação existente.'
}))
return ctx.reply(lista[n - 1])
}

if (!lista.length) return ctx.reply(ctx.mess.padraoAviso({
emoji: '📝',
titulo: 'SEM ANOTAÇÕES',
descricao: `Use ${ctx.prefix}nota add sua anotação para adicionar a primeira.`
}))
return seletor(ctx, lista)
}
}
)
