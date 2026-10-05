/*
 * Tokito Bot V10 - Foto Banner
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'fotobanner',
comandos: ['fotobanner'],
categoria: 'dono',
info: {
descricao: 'Altera o banner do perfil Business do bot.',
uso: 'fotobanner respondendo uma imagem',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

const bot =
ctx.jidNormalizedUser(
ctx.tokito.user?.id || ''
)

if (!bot) {
return ctx.reply(
ctx.mess.padraoErro({
titulo: 'FOTO BANNER',
descricao: 'Não consegui identificar a conta conectada do bot.'
})
)
}

let perfilBusiness = null

try {
perfilBusiness =
await ctx.tokito.getBusinessProfile(
bot
)
}
catch {
perfilBusiness = null
}

if (!perfilBusiness?.wid) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '⚠️',
titulo: 'WHATSAPP BUSINESS',
descricao: 'Eu não estou usando uma conta do WhatsApp Business. O banner só pode ser alterado em contas Business.'
})
)
}

const midias =
ctx.modulos.mediaAtual(ctx)

const imagem =
midias.image

if (!imagem) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '👑',
titulo: 'FOTO BANNER',
uso: `${ctx.prefix}fotobanner`,
descricao: 'Responda uma imagem com o comando para usar como banner do perfil Business.'
})
)
}

const alterarBanner =
typeof ctx.tokito.updateBusinessCoverPhoto === 'function'
? ctx.tokito.updateBusinessCoverPhoto.bind(ctx.tokito)
: typeof ctx.tokito.updateCoverPhoto === 'function'
? ctx.tokito.updateCoverPhoto.bind(ctx.tokito)
: null

if (!alterarBanner) {
return ctx.reply(
ctx.mess.padraoErro({
titulo: 'FOTO BANNER',
descricao: 'A biblioteca atual não possui suporte para alterar o banner Business.'
})
)
}

try {
await ctx.reagir(
ctx.from,
'⏳'
).catch(() => {})

const buffer =
await ctx.getFileBuffer(
imagem,
'image'
)

await alterarBanner(
buffer
)

await ctx.reagir(
ctx.from,
'✅'
).catch(() => {})

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '👑',
titulo: 'FOTO BANNER',
descricao: 'O banner do perfil Business do bot foi alterado com sucesso.'
})
)
}
catch (error) {
console.log(
'[FOTO BANNER]',
error?.message || error
)

const textoErro =
String(
error?.message ||
error ||
''
).toLowerCase()

if (
textoErro.includes('business') ||
textoErro.includes('biz') ||
textoErro.includes('not-authorized') ||
textoErro.includes('forbidden')
) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '⚠️',
titulo: 'WHATSAPP BUSINESS',
descricao: 'Não consegui alterar o banner. Confirme se a conta conectada está configurada como WhatsApp Business.'
})
)
}

return ctx.reply(
ctx.mess.padraoErro({
titulo: 'FOTO BANNER',
descricao: 'Não consegui alterar o banner do bot.'
})
)
}
}
})
