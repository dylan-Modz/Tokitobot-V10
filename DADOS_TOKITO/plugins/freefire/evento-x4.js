/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const { proto, generateWAMessageFromContent } = require('baileys')
const x4 = require('./x4')

const enviarSala = async (ctx, id, senha) => {
const msg = generateWAMessageFromContent(ctx.from, {
viewOnceMessage: {
message: {
interactiveMessage: proto.Message.InteractiveMessage.create({
body: proto.Message.InteractiveMessage.Body.create({
text: `- 🎮 \`𝚂𝙰𝙻𝙰 𝙳𝙴𝚃𝙴𝙲𝚃𝙰𝙳𝙰\`\n\n> *『 🆔 𝙸𝙳 』— ${id}*\n> *『 🔐 𝚂𝙴𝙽𝙷𝙰 』— ${senha}*`
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [
{
name: 'cta_copy',
buttonParamsJson: JSON.stringify({ display_text: '🆔﹚𝐂𝐎𝐏𝐈𝐀𝐑 𝐈𝐃﹙🆔', id: `x4_id_${Date.now()}`, copy_code: id })
},
{
name: 'cta_copy',
buttonParamsJson: JSON.stringify({ display_text: '🔐﹚𝐂𝐎𝐏𝐈𝐀𝐑 𝐒𝐄𝐍𝐇𝐀﹙🔐', id: `x4_senha_${Date.now()}`, copy_code: senha })
}
],
messageParamsJson: JSON.stringify({})
})
})
}
}
}, { quoted: ctx.selo, userJid: ctx.tokito.user?.id })
await ctx.tokito.relayMessage(ctx.from, msg.message, { messageId: msg.key.id })
}

module.exports = {
nome: 'evento-x4',
categoria: 'freefire',
fase: 'normal',
prioridade: 30,
async evento(ctx) {
if (!ctx.isGroup || ctx.info?.key?.fromMe || !x4.ativo(ctx)) return false
const texto = String(ctx.body || '').trim()
if (!texto) return false

const sala = texto.match(/^(\d{8})\s+(\d{2})$/)
if (sala) {
await enviarSala(ctx, sala[1], sala[2])
return true
}

if (!['a', 'f', 'm'].includes(texto.toLowerCase())) return false
if (!x4.adm(ctx)) return false
if (!ctx.isBotGroupAdmins) {
await ctx.reply(ctx.mess.botadm())
return true
}

if (texto.toLowerCase() === 'a') {
await ctx.tokito.groupSettingUpdate(ctx.from, 'not_announcement')
await ctx.reagir(ctx.from, '🔓').catch(() => {})
return true
}

if (texto.toLowerCase() === 'f') {
await ctx.tokito.groupSettingUpdate(ctx.from, 'announcement')
await ctx.reagir(ctx.from, '🔒').catch(() => {})
return true
}

if (texto.toLowerCase() === 'm') {
await x4.marcacaoOculta(ctx)
return true
}

return false
}
}
