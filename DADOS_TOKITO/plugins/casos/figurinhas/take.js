/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

const fs = require('fs')
const modulos = require('../../../sistemas/modulos')
const { writeExif2 } = require('../../../funcoes/js/exif2')

const st = ctx => ctx.ctxMsg?.quotedMessage?.stickerMessage || ctx.mensagem?.stickerMessage

const dados = s => {
const [packname, author] = String(s || '').split('|').map(v => String(v || '').trim())
return {
packname: packname || 'TokitoBot-MD',
author: author || 'Dylan Modz'
}
}

module.exports = {
nome: 'rgtake',
comandos: ['rgtake', 'rntake', 'take', 'roubar', 'rename'],
categoria: 'figurinhas',
info: {
descricao: 'Registra e aplica nome/autor em figurinhas.',
uso: 'rgtake nome|autor'
},
async executar(ctx) {
const db = modulos.takes()
const id = ctx.normalizar(ctx.sender)
if (['rgtake', 'rntake'].includes(ctx.command)) {
if (ctx.command === 'rntake' && !db[id])
return ctx.reply(`❌ Você ainda não registrou um take. Use *${ctx.prefix}rgtake nome|autor* primeiro.`)
const d = dados(ctx.q)
db[id] = d
modulos.salvarTakes(db)
return ctx.reply(`✅ Take ${ctx.command === 'rntake' ? 'atualizado' : 'registrado'}:\n📦 ${d.packname}\n✍️ ${d.author}`)
}
const s = st(ctx)
if (!s)
return ctx.reply('❌ Responda a uma figurinha.')
const buffer = await ctx.getFileBuffer(s, 'sticker')
if (!buffer?.length)
return ctx.reply('❌ Não consegui baixar a figurinha.')
const d = ctx.command === 'rename' ? dados(ctx.q) : (db[id] || {
packname: `🧊 ${ctx.NomeDoBot}`,
author: ctx.pushname || 'Dylan Modz'
})
let arq
try {
arq = await writeExif2({
data: buffer,
mimetype: 'image/webp'
}, d)
await ctx.tokito.sendMessage(ctx.from, { sticker: { url: arq } }, { quoted: ctx.selo })
return true
}
catch (e) {
console.log('[TAKE]', e?.message || e)
return ctx.reply(`❌ Não foi possível renomear a figurinha: ${e.message}`)
}
finally {
try {
if (arq && fs.existsSync(arq))
fs.unlinkSync(arq)
}
catch {
}
}
}
}
