/*
 * Tokito Bot V10 - AntiCall
 * Author: Dylan Modz
 */

const donoSistema = require('../../sistemas/dono')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'anticall',
comandos: ['anticall'],
categoria: 'dono',
info: {
descricao: 'Bloqueia automaticamente quem ligar para o bot.',
uso: 'anticall 1/0',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

const acao = String(ctx.q || '').trim()

if (!['0', '1'].includes(acao)) {
return ctx.reply(
ctx.mess.funcaoUso(
'📵',
'𝙰𝙽𝚃𝙸 𝙲𝙰𝙻𝙻',
ctx.prefix,
ctx.command,
'ʀᴇᴊᴇɪᴛᴀ ᴀ ᴄʜᴀᴍᴀᴅᴀ ᴇ ʙʟᴏǫᴜᴇɪᴀ ǫᴜᴇᴍ ʟɪɢᴀʀ ᴘᴀʀᴀ ᴏ ʙᴏᴛ.'
)
)
}

const ativo = acao === '1'
donoSistema.set({ anticall: ativo })

return ctx.reply(
ativo
? ctx.mess.funcaoAtivada(
'📵',
'𝙰𝙽𝚃𝙸 𝙲𝙰𝙻𝙻',
'ʀᴇᴊᴇɪᴛᴀ ᴀ ᴄʜᴀᴍᴀᴅᴀ ᴇ ʙʟᴏǫᴜᴇɪᴀ ǫᴜᴇᴍ ʟɪɢᴀʀ ᴘᴀʀᴀ ᴏ ʙᴏᴛ.'
)
: ctx.mess.funcaoDesativada(
'📵',
'𝙰𝙽𝚃𝙸 𝙲𝙰𝙻𝙻',
'ʀᴇᴊᴇɪᴛᴀ ᴀ ᴄʜᴀᴍᴀᴅᴀ ᴇ ʙʟᴏǫᴜᴇɪᴀ ǫᴜᴇᴍ ʟɪɢᴀʀ ᴘᴀʀᴀ ᴏ ʙᴏᴛ.'
)
)
}
})
