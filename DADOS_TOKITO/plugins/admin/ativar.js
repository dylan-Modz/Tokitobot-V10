/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const fs = require('fs')
const path = require('path')
const { proto, prepareWAMessageMedia, generateWAMessageFromContent } = require('baileys')
const dylan = require('../../database/lib/comandos')

const mediaMenu = async ctx => {
const video = path.join(__dirname, '..', '..', 'INFO_DADOS', 'LOGOS', 'fotomenu.mp4')
const image = path.join(__dirname, '..', '..', 'INFO_DADOS', 'LOGOS', 'fotomenu.png')

if (fs.existsSync(video)) {
const media = await prepareWAMessageMedia({
video: fs.readFileSync(video),
gifPlayback: true,
mimetype: 'video/mp4'
}, { upload: ctx.tokito.waUploadToServer })

return proto.Message.InteractiveMessage.Header.create({
hasMediaAttachment: true,
videoMessage: media.videoMessage
})
}

if (fs.existsSync(image)) {
const media = await prepareWAMessageMedia({
image: fs.readFileSync(image)
}, { upload: ctx.tokito.waUploadToServer })

return proto.Message.InteractiveMessage.Header.create({
hasMediaAttachment: true,
imageMessage: media.imageMessage
})
}

return null
}

const itens = [
['__bemvindo1', 'Bem-vindo 1', 'bemvindos'],
['__bemvindo2', 'Bem-vindo 2', 'bemvindos'],
['__bemvindo3', 'Bem-vindo 3', 'bemvindos'],
['__bemvindo4', 'Bem-vindo 4', 'bemvindos'],
['__bemvindo5', 'Bem-vindo 5', 'bemvindos'],

['aprovacao', 'Aprovação de entrada', 'entrada'],
['autoaprovacao', 'Auto Aprovação', 'entrada'],
['soadm', 'Só ADM', 'entrada'],

['__antilinkeasy', 'Anti Link Easy', 'links'],
['__antilinkmedium', 'Anti Link Medium', 'links'],
['__antilinkhard', 'Anti Link Hard', 'links'],

['antifake', 'Anti Fake', 'seguranca'],
['__antiddd', 'Anti DDD', 'seguranca'],
['antirroubo', 'Anti Roubo', 'seguranca'],
['antinuke', 'Anti-Nuke', 'seguranca'],
['antinotas', 'Anti Notas', 'seguranca'],
['antipalavra', 'Anti Palavras', 'seguranca'],
['antipay', 'Anti Pagamento', 'seguranca'],
['antibot', 'Anti Bot', 'seguranca'],
['antispam', 'Anti Spam', 'seguranca'],
['antistatus', 'Anti Status', 'seguranca'],
['antimarcacao', 'Anti Marcação', 'seguranca'],
['anticanal', 'Anti Canal', 'seguranca'],
['x9', 'X9', 'seguranca'],

['antivideo', 'Anti Vídeo', 'midias'],
['antifoto', 'Anti Foto', 'midias'],
['antivisu', 'Anti Visualização Única', 'midias'],
['antisticker', 'Anti Sticker', 'midias'],
['antifloodsticker', 'Anti Flood Sticker', 'midias'],
['anticontato', 'Anti Contato', 'midias'],
['antilocalizacao', 'Anti Localização', 'midias'],
['antidocumento', 'Anti Documento', 'midias'],
['antiaudio', 'Anti Áudio', 'midias'],

['autodl', 'Auto Download', 'automacao'],
['autosticker', 'Auto Sticker', 'automacao'],
['autortext', 'Auto Transcrição', 'automacao'],
['multiprefix', 'Multi-prefix', 'automacao'],

['modojogos', 'Modo Jogos', 'modos'],
['__modobn', 'Modo Brincadeiras', 'modos'],
['modorpg', 'Modo RPG', 'modos'],
['modocoins', 'Modo Coins', 'modos'],
['__modoia', 'Modo IA', 'modos'],
['simih', 'Simih', 'modos']
]

const secoes = [
['bemvindos', '🌸 Bem-vindos'],
['entrada', '👥 Entrada e grupo'],
['links', '🔗 Anti Link'],
['seguranca', '🛡️ Segurança'],
['midias', '📁 Mídias'],
['automacao', '🤖 Automação'],
['modos', '🎮 Modos']
]

const funcoes = ctx => {
if (!ctx.dataGp?.[0]?.funcoes || typeof ctx.dataGp[0].funcoes !== 'object')
ctx.dataGp[0].funcoes = {}

return ctx.dataGp[0].funcoes
}

const ativo = (ctx, chave) => {
const f = ctx.dataGp?.[0]?.funcoes || {}

if (chave.startsWith('__bemvindo')) {
const numero = Number(chave.replace('__bemvindo', ''))
const indice = numero - 1

return Boolean(
ctx.dataGp?.[0]?.wellcome?.[indice]?.[`bemvindo${numero}`]
)
}

if (chave === '__modobn')
return ctx.dataGp?.[0]?.jogos === true

if (chave === '__modoia')
return Boolean(f.modoia?.ativo)

if (chave === '__antiddd')
return Boolean(f.antiddd?.ativo)

if (chave.startsWith('__antilink')) {
const nivel = chave.replace('__antilink', '')
return Boolean(f.antilink?.ativo) && f.antilink?.nivel === nivel
}

return Boolean(f[chave])
}

const trocar = (ctx, chave) => {
const f = funcoes(ctx)

if (chave.startsWith('__bemvindo')) {
const numero = Number(chave.replace('__bemvindo', ''))
const indice = numero - 1

if (!Array.isArray(ctx.dataGp[0].wellcome))
ctx.dataGp[0].wellcome = []

if (!ctx.dataGp[0].wellcome[indice] || typeof ctx.dataGp[0].wellcome[indice] !== 'object')
ctx.dataGp[0].wellcome[indice] = {}

const campo = `bemvindo${numero}`
ctx.dataGp[0].wellcome[indice][campo] = !Boolean(ctx.dataGp[0].wellcome[indice][campo])
return ctx.dataGp[0].wellcome[indice][campo]
}

if (chave === '__modobn') {
ctx.dataGp[0].jogos = !Boolean(ctx.dataGp[0].jogos)
return ctx.dataGp[0].jogos
}

if (chave === '__modoia') {
if (!f.modoia || typeof f.modoia !== 'object')
f.modoia = { ativo: false, tipo: 'texto' }

f.modoia.ativo = !Boolean(f.modoia.ativo)
return f.modoia.ativo
}

if (chave === '__antiddd') {
if (!f.antiddd || typeof f.antiddd !== 'object')
f.antiddd = { ativo: false, listaProibidos: [] }

f.antiddd.ativo = !Boolean(f.antiddd.ativo)
return f.antiddd.ativo
}

if (chave.startsWith('__antilink')) {
const nivel = chave.replace('__antilink', '')

if (!f.antilink || typeof f.antilink !== 'object')
f.antilink = { ativo: false, nivel: null }

const mesmo =
f.antilink.ativo === true &&
f.antilink.nivel === nivel

f.antilink.ativo = !mesmo
f.antilink.nivel = mesmo ? null : nivel

return f.antilink.ativo
}

f[chave] = !Boolean(f[chave])

if (chave === 'multiprefix' && f[chave] && !f.prefixGrupo)
f.prefixGrupo = ctx.prefix

return f[chave]
}

const linhas = ctx => {
return secoes
.map(([id, titulo]) => {
const rows = itens
.filter(item => item[2] === id)
.map(([chave, nome], indice) => {
const ligado = ativo(ctx, chave)

return {
title: `${ligado ? '🟢' : '🔴'} ${nome}`,
description: ligado
? 'Ativado • toque para desativar.'
: 'Desativado • toque para ativar.',
id: `${ctx.prefix}ativar ${chave}`
}
})

return rows.length
? { title: titulo, rows }
: null
})
.filter(Boolean)
}

const painel = async (ctx, alteracao = '') => {
const total = itens.length
const ativas = itens.filter(([chave]) => ativo(ctx, chave)).length

const adminNome = String(ctx.pushname || 'Administrador').trim() || 'Administrador'
const texto =
`- ⚙️ \`𝙰𝚃𝙸𝚅𝙰𝚁 𝚂𝙸𝚂𝚃𝙴𝙼𝙰𝚂\`

> 👤 ׄ ( ᴀᴅᴍ: ${adminNome} )
> 🟢 ׄ ( ᴀᴛɪᴠᴀᴅᴏs: ${ativas} )
> 🔴 ׄ ( ᴅᴇsᴀᴛɪᴠᴀᴅᴏs: ${total - ativas} )
${alteracao ? `\n> ⚙️ ׄ ( ${alteracao} )\n` : ''}
> 📋 ׄ ( ᴇsᴄᴏʟʜᴀ ᴜᴍᴀ ғᴜɴᴄ̧ᴀ̃ᴏ ɴᴀ ʟɪsᴛᴀ ᴀʙᴀɪxᴏ. )`

const lista = {
title: '⚙️﹚𝐀𝐓𝐈𝐕𝐀𝐑 𝐒𝐈𝐒𝐓𝐄𝐌𝐀𝐒﹙⚙️',
sections: linhas(ctx)
}

try {
const header = await mediaMenu(ctx)
const interactiveData = {
body: proto.Message.InteractiveMessage.Body.create({
text: texto
}),
footer: proto.Message.InteractiveMessage.Footer.create({
text: 'ᴇsᴄᴏʟʜᴀ ᴜᴍᴀ ғᴜɴᴄ̧ᴀ̃ᴏ ᴀʙᴀɪxᴏ'
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [{
name: 'single_select',
buttonParamsJson: JSON.stringify(lista)
}],
messageParamsJson: JSON.stringify({})
})
}

if (header)
interactiveData.header = header

const msg = generateWAMessageFromContent(ctx.from, {
viewOnceMessage: {
message: {
interactiveMessage: proto.Message.InteractiveMessage.create(interactiveData)
}
}
}, {
quoted: ctx.selo,
userJid: ctx.tokito.user?.id
})

await ctx.tokito.relayMessage(
ctx.from,
msg.message,
{ messageId: msg.key.id }
)

return true
}
catch (error) {
console.log(
'[ATIVAR LIST]',
error?.message || error
)

const fallback = itens
.map(([chave, nome], i) =>
`> ${ativo(ctx, chave) ? '🟢' : '🔴'} ׄ ( ${i + 1} — ${nome}. )`
)
.join('\n')

return ctx.reply(
`${texto}\n\n${fallback}`
)
}
}

dylan.setCommand({
nome: 'ativar',
comandos: ['ativar'],
categoria: 'admin',

info: {
descricao: 'Abre a lista interativa para ativar ou desativar sistemas do grupo.',
uso: 'ativar',
permissao: 'ADM'
},

itens,
ativo,
trocar,
painel,

async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())

const escolha = String(ctx.q || '').trim()

if (!escolha)
return painel(ctx)

const item = itens.find(([chave]) => chave === escolha)

if (!item)
return painel(ctx)

const [chave, nome] = item
const estado = trocar(ctx, chave)

ctx.setGp(ctx.dataGp)

await ctx.reagir(
ctx.from,
estado ? '✅' : '❌'
).catch(() => {})

return painel(
ctx,
`${nome} — ${estado ? 'ATIVADO ✅' : 'DESATIVADO ❌'}`
)
}
})
