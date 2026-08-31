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

const bangplit = require('../dono/bangplit')

module.exports = {
prioridade: 41,
nome: 'evento-bangplit',
categoria: 'eventos',
fase: 'pre',

async evento(ctx) {
const chave = `${ctx.from}|${ctx.sender}`
const s = bangplit.pendentes.get(chave)

if (!s)
return false

if (!ctx.SoDono) {
bangplit.pendentes.delete(chave)
return false
}

if (s.expira < Date.now()) {
bangplit.pendentes.delete(chave)
return false
}

if (ctx.isCmd)
return false

const txt = String(ctx.body || '').trim()

if (!/^\d+$/.test(txt))
return false

const n = Number(txt)

if (n === 0) {
bangplit.pendentes.delete(chave)

await ctx.reply(`- ❌ \`𝙱𝙰𝙽𝙶𝙿𝙻𝙸𝚃 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙾\`

> *ɴᴇɴʜᴜᴍ ɢʀᴜᴘᴏ ғᴏɪ ᴀʟᴛᴇʀᴀᴅᴏ.*`)

return true
}

if (s.modo === 'acao') {
const grupo = s.selecionado

if (!grupo) {
s.modo = 'lista'
s.selecionado = null
s.expira = Date.now() + 180000
bangplit.pendentes.set(chave, s)

await ctx.reply(bangplit.render(s))
return true
}

if (n === 3) {
s.modo = 'lista'
s.selecionado = null
s.expira = Date.now() + 180000
bangplit.pendentes.set(chave, s)

await ctx.reply(bangplit.render(s))
return true
}

if (n !== 1 && n !== 2)
return true

const ativo = n === 1

bangplit.salvarEstado(
ctx,
grupo,
ativo
)

s.grupos = await bangplit.carregar(ctx)
s.modo = 'lista'
s.selecionado = null
s.expira = Date.now() + 180000

const atualizado = s.grupos.find(g => g.id === grupo.id)
bangplit.pendentes.set(chave, s)

await ctx.reply(`- ${ativo ? '🔴' : '🟢'} \`𝙱𝙰𝙽𝙶𝙿 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙳𝙾\`

『 👥 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${atualizado?.nome || grupo.nome}
『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${ativo ? 'ATIVADO' : 'DESATIVADO'}

${bangplit.render(s)}`)

return true
}

if (n === 98) {
s.page++
s.expira = Date.now() + 180000
bangplit.pendentes.set(chave, s)

await ctx.reply(bangplit.render(s))
return true
}

if (n === 97) {
s.page--
s.expira = Date.now() + 180000
bangplit.pendentes.set(chave, s)

await ctx.reply(bangplit.render(s))
return true
}

if (n >= 1 && n <= bangplit.POR_PAGINA) {
const indice = s.page * bangplit.POR_PAGINA + (n - 1)
const grupo = s.grupos[indice]

if (!grupo)
return true

s.modo = 'acao'
s.selecionado = grupo
s.expira = Date.now() + 180000
bangplit.pendentes.set(chave, s)

await ctx.reply(
bangplit.renderAcao(grupo)
)

return true
}

return true
}
}
