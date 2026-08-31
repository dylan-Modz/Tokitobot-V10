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

const x4 = require('./x4')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'time',
comandos: ['time', 'lista'],
categoria: 'freefire',

info: {
descricao: 'Monta dois times de 3 jogadores para X4.',
uso: 'time jogador1,jogador2,jogador3,jogador4,jogador5,jogador6',
categoria: 'freefire'
},

async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!x4.ativo(ctx))
return ctx.reply(ctx.mess.padraoAviso({
titulo: 'MODO X4',
descricao: `Ative primeiro com ${ctx.prefix}modox4 1.`
}))

const nomes = String(ctx.q || '')
.split(',')
.map(v => v.trim())
.filter(Boolean)

if (nomes.length !== 6)
return ctx.reply(ctx.mess.padraoErro({
titulo: 'TIME INVÁLIDO',
descricao: 'Informe exatamente 6 nomes separados por vírgula.'
}))

const a = nomes.slice(0, 3)
const b = nomes.slice(3, 6)

const texto = `╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
┃ ┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├╾═╼･ﾟ𖤐ﾟ･｡⚔️｡･ﾟ𖤐ﾟ･╾═╼┤
├─ ⊹ 𖤐  𝚃𝙸𝙼𝙴𝚂-𝚇𝟺
├╾═╼･ﾟ𖤐ﾟ･｡🎮｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ 🧊 𝚃𝙸𝙼𝙴 𝟷
┃࣪ ╎—̳͟͞͞ 👤 ${a[0]}
┃࣪ ╎—̳͟͞͞ 👤 ${a[1]}
┃࣪ ╎—̳͟͞͞ 👤 ${a[2]}
┃࣪ ╎
┃࣪ ╎—̳͟͞͞ ⚔️ 𝚅𝚂
┃࣪ ╎
┃࣪ ╎—̳͟͞͞ 🔥 𝚃𝙸𝙼𝙴 𝟸
┃࣪ ╎—̳͟͞͞ 👤 ${b[0]}
┃࣪ ╎—̳͟͞͞ 👤 ${b[1]}
┃࣪ ╎—̳͟͞͞ 👤 ${b[2]}
├╾═╼･ﾟ𖤐ﾟ･｡📜｡･ﾟ𖤐ﾟ･╾═╼┤
┃࣪ ╎—̳͟͞͞ 👤 𝙻𝙴𝙾𝙽 • 𝙰𝙻𝙾𝙺 • 𝙺𝙴𝙻𝙻𝚈
┃࣪ ╎—̳͟͞͞ 👤 𝙼𝙰𝚇𝙸𝙼 • 𝙼𝙾𝙲𝙾
┃࣪ ╎—̳͟͞͞ 🚫 𝙿𝙴𝚃𝚂: 𝙴𝚃 & 𝙳𝚁𝙰𝚀𝚄𝙸𝙽𝙷𝙾
┃࣪ ╎—̳͟͞͞ 🎮 𝙱𝙾𝙼 𝚇𝟺 𝙰 𝚃𝙾𝙳𝙾𝚂!
┃ ┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`

return ctx.reply(texto)
}
}
)
