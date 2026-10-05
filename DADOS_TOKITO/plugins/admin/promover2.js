/*
 * Tokito Bot V10 - Promover 2
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')
const promocoes = require('../../sistemas/promocoes.js')

dylan.setCommand({
nome: 'promover2',
comandos: ['promover2'],
categoria: 'grupo',
info: {
descricao: 'Programa uma promoção temporária de administrador.',
uso: 'promover2 @usuario 18:00/22:00',
permissao: 'ADM'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())

if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

const texto = String(ctx.q || '').trim()
const horario = texto.match(/([01]\d|2[0-3]):([0-5]\d)\s*\/\s*([01]\d|2[0-3]):([0-5]\d)/)

if (!horario) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🛡️',
titulo: 'PROMOVER 2',
uso: `${ctx.prefix}promover2 @usuario 18:00/22:00`,
descricao: 'Informe o usuário, o horário de promoção e o horário de rebaixamento.'
})
)
}

let alvo = ctx.menc_os2 || ctx.menc_prt || ''
if (Array.isArray(alvo))
alvo = alvo[0]

if (!alvo) {
const semHorario = texto.replace(horario[0], '')
const numero = semHorario.replace(/\D/g, '')
alvo = numero ? `${numero}@s.whatsapp.net` : ''
}

alvo = ctx.normalizar(alvo)

if (!alvo)
return ctx.reply(ctx.mess.marque())

const bot = ctx.normalizar(ctx.botNumber || ctx.tokito.user?.id || '')
if (alvo === bot)
return ctx.reply(ctx.mess.nobot())

const admins = (ctx.groupAdmins || []).map(item => ctx.normalizar(item))
if (admins.includes(alvo))
return ctx.reply(ctx.mess.jaadm())

const inicio = `${horario[1]}:${horario[2]}`
const fim = `${horario[3]}:${horario[4]}`

const resultado = promocoes.agendar({
grupo: ctx.from,
usuario: alvo,
inicio,
fim,
autor: ctx.sender
})

if (!resultado.ok)
return ctx.reply(ctx.mess.falha())

await ctx.reagir(ctx.from, '✅').catch(() => {})

return ctx.tokito.sendMessage(ctx.from, {
text:
`- 🛡️ \`𝙿𝚁𝙾𝙼𝙾𝚅𝙴𝚁 𝟸\`\n\n> 👤 ׄ ( @${alvo.split('@')[0]} )\n> ⬆️ ׄ ( ᴘʀᴏᴍᴏᴠᴇʀ: ${inicio}. )\n> ⬇️ ׄ ( ʀᴇʙᴀɪxᴀʀ: ${fim}. )\n> ✅ ׄ ( ᴘʀᴏɢʀᴀᴍᴀᴄ̧ᴀ̃ᴏ sᴀʟᴠᴀ. )`,
mentions: [alvo]
}, { quoted: ctx.selo })
}
})
