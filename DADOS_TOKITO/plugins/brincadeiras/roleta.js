/*
 * Tokito Bot V10 - Roleta
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

const jid = (ctx, participante) =>
ctx.normalizar(participante)

const ehAdmin = participante =>
['admin', 'superadmin'].includes(participante?.admin)

dylan.setCommand({
nome: 'roleta',
comandos: ['roleta', 'roleta2'],
categoria: 'brincadeiras',
info: {
descricao: 'Roleta com 5 espaços vazios e 3 cheios.',
uso: 'roleta | roleta2',
permissao: 'Grupo'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

const bot =
ctx.normalizar(
ctx.tokito.user?.id || ''
)

let candidatos = (ctx.groupMembers || [])
.filter(item => {
const alvo = jid(ctx, item)
if (!alvo || alvo === bot)
return false

if (
ctx.command === 'roleta2' &&
ehAdmin(item)
)
return false

return true
})

if (!candidatos.length) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '🎲',
titulo: 'ROLETA',
descricao: ctx.command === 'roleta2'
? 'Não há membros comuns disponíveis para a roleta.'
: 'Não há participantes disponíveis.'
})
)
}

const escolhido =
candidatos[
Math.floor(Math.random() * candidatos.length)
]

const alvo = jid(ctx, escolhido)
const numero =
String(alvo || '')
.split('@')[0]

const tambor = [
false,
false,
false,
false,
false,
true,
true,
true
]

const cheio =
tambor[
Math.floor(Math.random() * tambor.length)
]

if (!cheio) {
return ctx.reply(
`- 🎲 \`𝚁𝙾𝙻𝙴𝚃𝙰\`

> 👤 ׄ ( @${numero} )
> 💨 ׄ ( ᴠᴀᴢɪᴏ! ᴠᴄ ᴇsᴄᴀᴘᴏᴜ ᴅᴇssᴀ. )`,
[alvo]
)
}

const protegido =
ehAdmin(escolhido) &&
ctx.command === 'roleta2'

if (protegido) {
return ctx.reply(
`- 🎲 \`𝚁𝙾𝙻𝙴𝚃𝙰 2\`

> 👤 ׄ ( @${numero} )
> 🛡️ ׄ ( ᴄᴀɪᴜ ɴᴏ ᴄʜᴇɪᴏ, ᴍᴀs ᴀᴅᴍs sᴀ̃ᴏ ᴘʀᴏᴛᴇɢɪᴅᴏs. )`,
[alvo]
)
}

const resultado =
await ctx.tokito.groupParticipantsUpdate(
ctx.from,
[alvo],
'remove'
).catch(() => null)

if (!resultado) {
return ctx.reply(
`- 🎲 \`𝚁𝙾𝙻𝙴𝚃𝙰\`

> 👤 ׄ ( @${numero} )
> 💥 ׄ ( ᴄᴀɪᴜ ɴᴏ ᴄʜᴇɪᴏ, ᴍᴀs ɴᴀ̃ᴏ ᴄᴏɴsᴇɢᴜɪ ʀᴇᴍᴏᴠᴇʀ. )`,
[alvo]
)
}

return ctx.reply(
`- 🎲 \`𝚁𝙾𝙻𝙴𝚃𝙰\`

> 👤 ׄ ( @${numero} )
> 💥 ׄ ( ᴄᴀɪᴜ ɴᴏ ᴄʜᴇɪᴏ! ᴏ ᴜsᴜᴀ́ʀɪᴏ ғᴏɪ ʀᴇᴍᴏᴠɪᴅᴏ. )`,
[alvo]
)
}
})
