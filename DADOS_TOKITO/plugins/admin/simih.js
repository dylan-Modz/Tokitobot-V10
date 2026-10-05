/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * ============================================================
 */

const simih = require('../../sistemas/simih')
const dylan = require('../../database/lib/comandos')

const descricao =
'ᴀᴘʀᴇɴᴅᴇ ʀᴇsᴘᴏsᴛᴀs ᴅᴀs ᴄᴏɴᴠᴇʀsᴀs ᴅᴏ ɢʀᴜᴘᴏ ᴇ ᴜsᴀ ᴜᴍᴀ ᴍᴇᴍᴏ́ʀɪᴀ ɢʟᴏʙᴀʟ.'

dylan.setCommand({
nome: 'simih',

comandos: [
'simih',
'simi'
],

categoria: 'admin',

info: {
descricao: 'Ativa o Simih, que aprende respostas das conversas do grupo.',
uso: 'simih 1/0',
permissao: 'ADM'
},

async executar(ctx) {
if (!ctx.isGroup) {
return ctx.reply(
ctx.mess.sogrupo()
)
}

if (
!ctx.isGroupAdmins &&
!ctx.SoDono
) {
return ctx.reply(
ctx.mess.soadm()
)
}

if (
!ctx.dataGp[0].funcoes ||
typeof ctx.dataGp[0].funcoes !== 'object'
) {
ctx.dataGp[0].funcoes = {}
}

const acao =
String(ctx.q || '')
.trim()
.toLowerCase()

const stats =
simih.estatisticas()

if (
!['0', '1'].includes(acao)
) {
return ctx.reply(
ctx.mess.simihStatus({
ativo:
ctx.dataGp[0].funcoes.simih === true,
prefix:
ctx.prefix,
frases:
stats.frases,
respostas:
stats.respostas
})
)
}

const ativado =
acao === '1'

ctx.dataGp[0].funcoes.simih =
ativado

ctx.setGp(
ctx.dataGp
)

await ctx.reagir(
ctx.from,
ativado ? '✅' : '❌'
).catch(() => {})

return ctx.reply(
ativado
? ctx.mess.funcaoAtivada(
'🧠',
'𝚂𝙸𝙼𝙸𝙷',
descricao
)
: ctx.mess.funcaoDesativada(
'🧠',
'𝚂𝙸𝙼𝙸𝙷',
descricao
)
)
}
})
