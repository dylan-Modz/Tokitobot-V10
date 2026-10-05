/*
 * Tokito Bot V10 - Grupo All
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'grupo-all',
comandos: ['grupo-all', 'grupoall'],
categoria: 'grupo',
info: {
descricao: 'Programa fechamento e abertura do grupo de uma vez.',
uso: 'grupo-all 22:00/07:00',
permissao: 'ADM'
},
async executar(ctx) {
with (ctx) {
try {
if (!isGroup)
return reply(mess.sogrupo())

if (!isGroupAdmins && !SoDono)
return reply(mess.soadm())

if (!isBotGroupAdmins)
return reply(mess.botadm())

const texto = String(q || '').trim()
const match = texto.match(
/^([01]\d|2[0-3]):([0-5]\d)\s*\/\s*([01]\d|2[0-3]):([0-5]\d)$/
)

if (!match) {
return reply(
mess.padraoUso({
emoji: '⏰',
titulo: 'GRUPO ALL',
uso: `${prefix}grupo-all 22:00/07:00`,
descricao: 'Informe primeiro o horário de fechar e depois o horário de abrir.'
})
)
}

const fechar = `${match[1]}:${match[2]}`
const abrir = `${match[3]}:${match[4]}`

const grupos = ler()
const atual = grupos[from] || {}

grupos[from] = {
...atual,
nome: groupName,
ativo: true,
fechar,
abrir,
ultimoFechamento: null,
ultimaAbertura: null
}

salvar(grupos)
processar().catch(() => {})

await reagir(from, '✅').catch(() => {})

return reply(
`- ⏰ \`𝙶𝚁𝚄𝙿𝙾 𝙰𝙻𝙻\`

> 🔒 ׄ ( ғᴇᴄʜᴀʀ: ${fechar} )
> 🔓 ׄ ( ᴀʙʀɪʀ: ${abrir} )
> ✅ ׄ ( ᴘʀᴏɢʀᴀᴍᴀᴄ̧ᴀ̃ᴏ sᴀʟᴠᴀ. )`
)
}
catch (error) {
console.log('[GRUPO ALL]', error?.message || error)
return reply(mess.error())
}
}
}
})
