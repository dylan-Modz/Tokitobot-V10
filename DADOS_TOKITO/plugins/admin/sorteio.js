/*
 * Tokito Bot V10 - Sorteio de grupo
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')
const sorteioGrupo = require('../../sistemas/sorteio-grupo')

const contexto = ctx =>
ctx.mensagem?.extendedTextMessage?.contextInfo ||
ctx.mensagem?.imageMessage?.contextInfo ||
ctx.mensagem?.videoMessage?.contextInfo ||
ctx.mensagem?.documentMessage?.contextInfo ||
ctx.mensagem?.audioMessage?.contextInfo ||
ctx.info?.message?.extendedTextMessage?.contextInfo ||
{}

const textoMensagem = mensagem => {
if (!mensagem || typeof mensagem !== 'object')
return ''

return String(
mensagem.conversation ||
mensagem.extendedTextMessage?.text ||
mensagem.imageMessage?.caption ||
mensagem.videoMessage?.caption ||
mensagem.documentMessage?.caption ||
mensagem.buttonsResponseMessage?.selectedDisplayText ||
mensagem.listResponseMessage?.title ||
''
).trim()
}

const formatarData = ms =>
new Date(Number(ms)).toLocaleString(
'pt-BR',
{
timeZone: 'America/Fortaleza',
day: '2-digit',
month: '2-digit',
year: 'numeric',
hour: '2-digit',
minute: '2-digit'
}
)

dylan.setCommand({
nome: 'sorteio',
comandos: [
'sorteio',
'infosorteio',
'sorteionumero'
],
categoria: 'grupo',
info: {
descricao: 'Cria sorteio por reação e sorteia números.',
uso: 'sorteio 20:00 1/all ❤️ | infosorteio | sorteionumero 500',
permissao: 'ADM para criar sorteio'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (ctx.command === 'sorteionumero') {
const maximo =
Number(
String(ctx.q || '')
.replace(/\D/g, '')
)

if (
!Number.isInteger(maximo) ||
maximo < 1 ||
maximo > 1000000000
) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🔢',
titulo: 'SORTEIO DE NÚMERO',
uso: `${ctx.prefix}sorteionumero 500`,
descricao: 'O Tokito sorteia um número entre 0 e o valor informado.'
})
)
}

const numero =
Math.floor(
Math.random() * (maximo + 1)
)

return ctx.reply(
`- 🔢 \`𝚂𝙾𝚁𝚃𝙴𝙸𝙾 𝙳𝙴 𝙽𝚄́𝙼𝙴𝚁𝙾\`

> 🎯 ׄ ( ɪɴᴛᴇʀᴠᴀʟᴏ: 0 ᴀ ${maximo} )
> 🏆 ׄ ( ɴᴜ́ᴍᴇʀᴏ sᴏʀᴛᴇᴀᴅᴏ: ${numero} )`
)
}

if (ctx.command === 'infosorteio') {
const item =
sorteioGrupo.ativo(
ctx.from
)

if (!item) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '🎁',
titulo: 'SORTEIO',
descricao: 'Não existe um sorteio ativo neste grupo.'
})
)
}

const limite =
item.limite === 'all'
? 'Sem limite'
: String(item.limite)

return ctx.reply(
`- 🎁 \`𝙸𝙽𝙵𝙾 𝙳𝙾 𝚂𝙾𝚁𝚃𝙴𝙸𝙾\`

> 🎁 ׄ ( ᴘʀᴇ̂ᴍɪᴏ: ${item.premio} )
> ⏰ ׄ ( ʀᴇsᴜʟᴛᴀᴅᴏ: ${formatarData(item.quando)} )
> 🏆 ׄ ( ᴠᴇɴᴄᴇᴅᴏʀᴇs: ${item.vencedores} )
> 👥 ׄ ( ʟɪᴍɪᴛᴇ: ${limite} )
> ${item.emoji} ׄ ( ʀᴇᴀᴄ̧ᴀ̃ᴏ ᴘᴀʀᴀ ᴘᴀʀᴛɪᴄɪᴘᴀʀ )
> 👤 ׄ ( ᴘᴀʀᴛɪᴄɪᴘᴀɴᴛᴇs: ${item.participantes.length} )`
)
}

if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())

const atual =
sorteioGrupo.ativo(
ctx.from
)

if (atual) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '🎁',
titulo: 'SORTEIO ATIVO',
descricao: 'Já existe um sorteio ativo neste grupo. Aguarde ele finalizar.'
})
)
}

const partes =
String(ctx.q || '')
.trim()
.split(/\s+/)
.filter(Boolean)

const hora = partes[0] || ''
const regra = partes[1] || ''
const emoji = partes[2] || ''

const divisao =
regra.split('/')

const vencedores =
Number(divisao[0])

const limiteTexto =
String(divisao[1] || '').toLowerCase()

const limite =
limiteTexto === 'all'
? 'all'
: Number(limiteTexto)

if (
!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora) ||
!Number.isInteger(vencedores) ||
vencedores < 1 ||
(
limite !== 'all' &&
(
!Number.isInteger(limite) ||
limite < vencedores
)
) ||
!emoji
) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🎁',
titulo: 'CRIAR SORTEIO',
uso: `${ctx.prefix}sorteio 20:00 1/all ❤️`,
descricao: 'Responda a mensagem que contém o prêmio. Use vencedores/limite; all significa participantes sem limite.'
})
)
}

const ctxMsg = contexto(ctx)
const quoted =
ctxMsg?.quotedMessage

if (!quoted) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🎁',
titulo: 'CRIAR SORTEIO',
uso: `${ctx.prefix}sorteio 20:00 1/all ❤️`,
descricao: 'Responda a mensagem que contém o prêmio do sorteio.'
})
)
}

const premio =
textoMensagem(quoted) ||
'Mídia respondida'

const quando =
sorteioGrupo.horarioParaMs(
hora
)

if (!quando)
return ctx.reply(ctx.mess.error())

const data =
formatarData(quando)

const anuncio =
await ctx.tokito.sendMessage(
ctx.from,
{
text:
`- 🎁 \`𝚂𝙾𝚁𝚃𝙴𝙸𝙾\`

> 🎁 ׄ ( ᴘʀᴇ̂ᴍɪᴏ: ${premio} )
> ⏰ ׄ ( ʀᴇsᴜʟᴛᴀᴅᴏ: ${data} )
> 🏆 ׄ ( ᴠᴇɴᴄᴇᴅᴏʀᴇs: ${vencedores} )
> 👥 ׄ ( ʟɪᴍɪᴛᴇ: ${limite === 'all' ? 'Sem limite' : limite} )

> ${emoji} ׄ ( ʀᴇᴀᴊᴀ ɴᴇsᴛᴀ ᴍᴇɴsᴀɢᴇᴍ ᴘᴀʀᴀ ᴘᴀʀᴛɪᴄɪᴘᴀʀ. )`
},
{
quoted: ctx.selo
}
)

const mensagemId =
anuncio?.key?.id

const criado =
sorteioGrupo.criar({
grupo: ctx.from,
premio,
hora,
vencedores,
limite,
emoji,
criadoPor: ctx.sender,
mensagemId
})

if (!criado.ok) {
return ctx.reply(
ctx.mess.padraoErro({
titulo: 'SORTEIO',
descricao: 'Não consegui salvar o sorteio.',
detalhe: criado.motivo || 'Erro desconhecido.'
})
)
}

return ctx.reagir(
ctx.from,
'✅'
).catch(() => {})
}
})
