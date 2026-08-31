/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const aluguel = require('../../sistemas/aluguel/index')

const {
proto,
prepareWAMessageMedia,
generateWAMessageFromContent
} = require('baileys')

const enviarPixCompleto = async (ctx, item, caption) => {
const codigoPix = String(
item.pix_copia_e_cola ||
item.qr_code ||
''
).trim()

const b64 = String(
item.qr_code_base64 ||
''
)
.replace(/^data:image\/\w+;base64,/i, '')
.trim()

if (!b64)
return false

try {
const media = await prepareWAMessageMedia({
image: Buffer.from(
b64,
'base64'
)
}, {
upload: ctx.tokito.waUploadToServer
})

const interactiveMessage =
proto.Message.InteractiveMessage.create({
header:
proto.Message.InteractiveMessage.Header.create({
hasMediaAttachment: true,
imageMessage: media.imageMessage
}),

body:
proto.Message.InteractiveMessage.Body.create({
text: caption
}),

nativeFlowMessage:
proto.Message.InteractiveMessage.NativeFlowMessage.create({
messageParamsJson: JSON.stringify({}),
buttons: codigoPix ? [
{
name: 'cta_copy',
buttonParamsJson: JSON.stringify({
display_text: '🧊﹚𝐂𝐎𝐏𝐈𝐀𝐑 𝐏𝐈𝐗﹙🧊',
id: `pix_${Date.now()}`,
copy_code: codigoPix
})
}
] : []
})
})

const msg = generateWAMessageFromContent(
ctx.from,
{
viewOnceMessage: {
message: {
interactiveMessage
}
}
},
{
userJid: ctx.tokito.user?.id,
quoted: ctx.selo
}
)

await ctx.tokito.relayMessage(
ctx.from,
msg.message,
{
messageId: msg.key.id
}
)

return true

} catch (e) {
console.log(
'[PIX COMPLETO]',
e?.message || e
)

return false
}
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'pixalugar',
comandos: ['pixalugar', 'pixaluguel'],
categoria: 'aluguel',

info: {
descricao: 'Gera o PIX do plano e inicia verificação automática.',
uso: 'pixalugar valor',
categoria: 'aluguel'
},

async executar(ctx) {
if (!ctx.nescessario.aluguel)
return ctx.reply(
ctx.mess.aluguelDesativado()
)

if (!aluguel.tokenConfigurado())
return ctx.reply(
ctx.mess.tokenMpAusente()
)

const valor = Number(
String(ctx.q || '')
.replace(',', '.')
)

if (
!Number.isFinite(valor) ||
valor <= 0
)
return ctx.reply(
ctx.mess.aluguelPlanoInvalido()
)

/*
 * Impede outro PIX caso já exista
 * pagamento aprovado aguardando entrada.
 */
const pendencias = aluguel.ler(
aluguel.arquivos.pendencias,
[]
)

const aguardando = pendencias.find(item =>
item?.comprador === ctx.sender &&
item?.status === 'approved_waiting_group'
)

if (aguardando) {
if (
typeof ctx.mess.aluguelAguardandoGrupo ===
'function'
)
return ctx.reply(
ctx.mess.aluguelAguardandoGrupo()
)

return ctx.reply(ctx.mess.padraoAviso({
emoji: '⏳',
titulo: 'PAGAMENTO APROVADO',
descricao: 'O pagamento já foi aprovado e está aguardando a entrada do bot no grupo.'
}))
}

try {
const item = await aluguel.criarPix(
ctx.sender,
valor
)

await ctx.reagir(
ctx.from,
'💵'
).catch(() => {})

const caption =
ctx.mess.aluguelPix(item)

const codigoPix = String(
item.pix_copia_e_cola ||
item.qr_code ||
''
).trim()

const qrBase64 = String(
item.qr_code_base64 ||
''
)
.replace(
/^data:image\/\w+;base64,/i,
''
)
.trim()

/*
 * ============================================================
 * QR CODE + TEXTO + BOTÃO NA MESMA MENSAGEM
 * ============================================================
 */

if (qrBase64) {
const enviado = await enviarPixCompleto(
ctx,
item,
caption
)

/*
 * Fallback caso o Native Flow falhe.
 */
if (!enviado) {
await ctx.tokito.sendMessage(
ctx.from,
{
image: Buffer.from(
qrBase64,
'base64'
),
caption,
contextInfo:
ctx.canalInfo([ctx.sender])
},
{
quoted: ctx.selo
}
)

if (codigoPix) {
await ctx.reply(ctx.mess.padraoInfo({
emoji: '💳',
titulo: 'PIX COPIA E COLA',
linhas: [
{ rotulo: '📋 𝙲𝙾́𝙳𝙸𝙶𝙾', valor: `\n\`${codigoPix}\`` }
]
}))
}
}
}

/*
 * Caso não exista imagem de QR.
 */
else {
await ctx.reply(
codigoPix
? `${caption}\n\n${codigoPix}`
: caption
)
}

return true

} catch (e) {
if (
e?.code ===
'MP_TOKEN_NAO_CONFIGURADO' ||
e?.message ===
'MP_TOKEN_NAO_CONFIGURADO'
)
return ctx.reply(
ctx.mess.tokenMpAusente()
)

if (
e?.message ===
'PEDIDO_NAO_ENCONTRADO'
)
return ctx.reply(
ctx.mess.aluguelSemPedido(
ctx.prefix
)
)

if (
e?.message ===
'PLANO_NAO_ENCONTRADO'
)
return ctx.reply(
ctx.mess.aluguelPlanoInvalido()
)

console.log(
'[PIX ALUGUEL]',
e?.message || e
)

return ctx.reply(
ctx.mess.error()
)
}
}
}
)
