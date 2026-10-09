/*
 * TOKITO BOT V10 — Horários programados do grupo
 * Author: Dylan Modz
 */
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'horariogp',
comandos: ['horariogp'],
categoria: 'grupo',
info: {
descricao: 'Consulta os horários programados de abertura e fechamento do grupo.',
uso: 'horariogp',
permissao: 'ADM',
categoria: 'grupo'
},
async executar(ctx) {
try {
if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm())
const grupos = ctx.ler()
const dados = grupos?.[ctx.from] || {}
const valido = hora => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(hora || ''))
const fechar = valido(dados.fechar) ? dados.fechar : ''
const abrir = valido(dados.abrir) ? dados.abrir : ''
const possuiHorario = Boolean(fechar || abrir)
const ativo = dados.ativo === true && possuiHorario
const texto = [
'• `𝙷𝙾𝚁𝙰́𝚁𝙸𝙾𝚂 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾` ⏰',
ativo
? '> A programação automática deste grupo está ativada.'
: possuiHorario
? '> Existem horários cadastrados neste grupo, mas a programação está desativada.'
: '> Este grupo ainda não possui horários de abertura ou fechamento programados.',
`- Fechamento — ( \`${fechar ? fechar + ' 🔒' : 'Não programado 🔒'}\` )`,
fechar
? `> Às ${fechar}, somente os administradores poderão enviar mensagens.`
: `> Para programar, use ${ctx.prefix}fechargp 22:00.`,
`- Abertura — ( \`${abrir ? abrir + ' 🔓' : 'Não programado 🔓'}\` )`,
abrir
? `> Às ${abrir}, todos os participantes poderão enviar mensagens novamente.`
: `> Para programar, use ${ctx.prefix}abrirgp 07:00.`,
`- Programação — ( \`${ativo ? 'Ativa ✅' : 'Inativa ⏸️'}\` )`,
ativo
? '> Os horários se repetem diariamente com o bot online e como administrador.'
: possuiHorario
? '> Os horários cadastrados não serão executados enquanto a programação estiver desativada.'
: `> Use ${ctx.prefix}grupo-all 22:00/07:00 para configurar os dois horários.`
].join('\n')
return ctx.reply(texto)
} catch (error) {
console.log('[HORARIO GP]', error?.message || error)
return ctx.reply(ctx.mess.error())
}
}
})
