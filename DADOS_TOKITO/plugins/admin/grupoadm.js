/*
 * Tokito Bot V10 - Gerenciamento extra de grupo
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

const somenteAdm = ctx => {
if (!ctx.isGroup)
return ctx.mess.sogrupo()
if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.mess.soadm()
if (!ctx.isBotGroupAdmins)
return ctx.mess.botadm()
return null
}

const aplicarFoto = async (ctx, buffer) => {
try {
await ctx.tokito.updateProfilePicture(ctx.from, buffer)
return
}
catch {
const pasta = ctx.runtimeSub.mediaDir
ctx.runtimeSub.ensure(pasta)

const arquivo = ctx.path.join(
pasta,
`foto-grupo-${Date.now()}.jpg`
)

ctx.fs.writeFileSync(arquivo, buffer)

try {
await ctx.tokito.updateProfilePicture(
ctx.from,
{ url: arquivo }
)
}
finally {
try {
if (ctx.fs.existsSync(arquivo))
ctx.fs.unlinkSync(arquivo)
}
catch {
}
}
}
}

dylan.setCommand({
nome: 'gerenciargrupoextra',
comandos: [
'fotogp',
'setfotogp',
'descgp',
'descricaogp',
'nomegp',
'novolink'
],
categoria: 'grupo',
info: {
descricao: 'Altera foto, descrição, nome ou link do grupo.',
uso: 'fotogp | descgp texto | nomegp nome | novolink',
permissao: 'ADM'
},
async executar(ctx) {
const erro = somenteAdm(ctx)

if (erro)
return ctx.reply(erro)

try {
if (['fotogp', 'setfotogp'].includes(ctx.command)) {
const midias = ctx.modulos.mediaAtual(ctx)
const imagem = midias.image

if (!imagem) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🖼️',
titulo: 'FOTO DO GRUPO',
uso: `${ctx.prefix}fotogp`,
descricao: 'Responda uma imagem com o comando.'
})
)
}

await ctx.reagir(ctx.from, '⏳').catch(() => {})

const buffer =
await ctx.getFileBuffer(
imagem,
'image'
)

await aplicarFoto(ctx, buffer)

await ctx.reagir(ctx.from, '✅').catch(() => {})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🖼️',
titulo: 'FOTO DO GRUPO',
descricao: 'A foto do grupo foi alterada com sucesso.'
})
)
}

if (ctx.command === 'descgp' || ctx.command === 'descricaogp') {
const descricao = String(ctx.q || '').trim()

if (!descricao) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '📝',
titulo: 'DESCRIÇÃO DO GRUPO',
uso: `${ctx.prefix}descgp nova descrição`,
descricao: 'Informe a nova descrição do grupo.'
})
)
}

await ctx.tokito.groupUpdateDescription(
ctx.from,
descricao
)

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '📝',
titulo: 'DESCRIÇÃO DO GRUPO',
descricao: 'A descrição do grupo foi alterada com sucesso.'
})
)
}

if (ctx.command === 'nomegp') {
const nome = String(ctx.q || '').trim()

if (!nome) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '👥',
titulo: 'NOME DO GRUPO',
uso: `${ctx.prefix}nomegp novo nome`,
descricao: 'Informe o novo nome do grupo.'
})
)
}

await ctx.tokito.groupUpdateSubject(
ctx.from,
nome
)

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '👥',
titulo: 'NOME DO GRUPO',
descricao: `O nome do grupo foi alterado para: ${nome}`
})
)
}

if (ctx.command === 'novolink') {
await ctx.reagir(ctx.from, '⏳').catch(() => {})

await ctx.tokito.groupRevokeInvite(
ctx.from
)

const codigo =
await ctx.tokito.groupInviteCode(
ctx.from
)

if (!codigo)
throw new Error('Novo código de convite não retornado.')

const link =
`https://chat.whatsapp.com/${codigo}`

await ctx.reagir(ctx.from, '✅').catch(() => {})

return ctx.reply(
`- 🔗 \`𝙽𝙾𝚅𝙾 𝙻𝙸𝙽𝙺 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`

> ✅ ׄ ( ᴏ ʟɪɴᴋ ᴀɴᴛɪɢᴏ ғᴏɪ ʀᴇᴠᴏɢᴀᴅᴏ. )
> 🔗 ׄ ( ${link} )`
)
}
}
catch (error) {
console.log('[GERENCIAR GRUPO EXTRA]', error?.message || error)

return ctx.reply(
ctx.mess.padraoErro({
titulo: 'GERENCIAR GRUPO',
descricao: 'Não consegui concluir essa alteração.',
detalhe: error?.message || 'Erro desconhecido.'
})
)
}
}
})
