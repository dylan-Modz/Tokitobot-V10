/*
 * Tokito Bot V10 - Perfil do bot
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

const aplicarFoto = async (
ctx,
buffer
) => {
const bot =
ctx.jidNormalizedUser(
ctx.tokito.user?.id || ''
)

if (!bot)
throw new Error('JID do bot não encontrado.')

try {
await ctx.tokito.updateProfilePicture(
bot,
buffer
)

return true
}
catch {
const pasta = ctx.runtimeSub.mediaDir
ctx.runtimeSub.ensure(pasta)

const arquivo = ctx.path.join(
pasta,
`perfil-bot-${Date.now()}.jpg`
)

ctx.fs.writeFileSync(
arquivo,
buffer
)

try {
await ctx.tokito.updateProfilePicture(
bot,
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

return true
}

dylan.setCommand({
nome: 'fotobot',
comandos: ['fotobot', 'clonar'],
categoria: 'dono',
info: {
descricao: 'Altera a foto de perfil do bot.',
uso: 'fotobot respondendo uma imagem | clonar @usuario',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

try {
let buffer = null

if (ctx.command === 'clonar') {
const destino =
await ctx.destino()

if (!destino?.mencao) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '👤',
titulo: 'CLONAR FOTO',
uso: `${ctx.prefix}clonar @usuario`,
descricao: 'Marque ou informe o número da pessoa.'
})
)
}

const alvo =
ctx.normalizar(
destino.mencao
)

const url =
await ctx.tokito.profilePictureUrl(
alvo,
'image'
).catch(() => null)

if (!url) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '👤',
titulo: 'FOTO INDISPONÍVEL',
descricao: 'Não consegui acessar a foto de perfil dessa pessoa.'
})
)
}

const resposta =
await ctx.axios.get(
url,
{
responseType: 'arraybuffer',
timeout: 30000
}
)

buffer = Buffer.from(
resposta.data
)
}
else {
const midias =
ctx.modulos.mediaAtual(ctx)

const imagem =
midias.image

if (!imagem) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🖼️',
titulo: 'FOTO DO BOT',
uso: `${ctx.prefix}fotobot`,
descricao: 'Responda uma imagem com o comando.'
})
)
}

buffer =
await ctx.getFileBuffer(
imagem,
'image'
)
}

await ctx.reagir(
ctx.from,
'⏳'
).catch(() => {})

await aplicarFoto(
ctx,
buffer
)

await ctx.reagir(
ctx.from,
'✅'
).catch(() => {})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🖼️',
titulo: 'FOTO DO BOT',
descricao: ctx.command === 'clonar'
? 'A foto de perfil foi clonada com sucesso.'
: 'A foto de perfil do bot foi alterada com sucesso.'
})
)
}
catch (error) {
console.log(
'[FOTO BOT]',
error?.message || error
)

return ctx.reply(
ctx.mess.padraoErro({
titulo: 'FOTO DO BOT',
descricao: 'Não consegui alterar a foto de perfil do bot.'
})
)
}
}
})
