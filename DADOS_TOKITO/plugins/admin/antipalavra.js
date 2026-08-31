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

const modulos = require('../../sistemas/modulos')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'antipalavra',
comandos: ['antipalavra', 'addpalavra', 'delpalavra', 'listapalavra'],
categoria: 'admin',
info: {
descricao: 'Bloqueia palavras/frases cadastradas no grupo.',
uso: 'antipalavra 1/0 | addpalavra spam',
permissao: 'ADM'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins)
return ctx.reply(ctx.mess.soadm())
if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())
const f = ctx.dataGp[0].funcoes || (ctx.dataGp[0].funcoes = {})
if (!Array.isArray(f.palavrasProibidas))
f.palavrasProibidas = []
if (ctx.command === 'antipalavra') {
const acao = String(ctx.q || '').trim()
const emoji = '🚫'
const titulo = '𝙰𝙽𝚃𝙸 𝙿𝙰𝙻𝙰𝚅𝚁𝙰𝚂'
const descricao = 'ʙʟᴏǫᴜᴇɪᴀ ᴘᴀʟᴀᴠʀᴀs ᴇ ғʀᴀsᴇs ᴄᴀᴅᴀsᴛʀᴀᴅᴀs ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.'

if (!['0', '1'].includes(acao)) {
return ctx.reply(
ctx.mess.funcaoUso(
emoji,
titulo,
ctx.prefix,
ctx.command,
descricao
)
)
}

f.antipalavra = acao === '1'
ctx.setGp(ctx.dataGp)

await ctx.reagir(
ctx.from,
f.antipalavra ? '✅' : '❌'
).catch(() => {
})

return ctx.reply(
f.antipalavra
? ctx.mess.funcaoAtivada(emoji, titulo, descricao)
: ctx.mess.funcaoDesativada(emoji, titulo, descricao)
)
}
if (ctx.command === 'listapalavra')
return ctx.reply(ctx.mess.padraoLista({
emoji: '🚫',
titulo: 'PALAVRAS BLOQUEADAS',
itens: f.palavrasProibidas,
vazio: 'Nenhuma palavra cadastrada neste grupo.'
}))
const raw = String(ctx.q || '').trim()
const n = modulos.norm(raw)
if (!n)
return ctx.reply(ctx.mess.padraoUso({
emoji: '🚫',
titulo: 'ANTI PALAVRAS',
uso: `${ctx.prefix}${ctx.command} palavra`,
descricao: 'Informe a palavra ou frase que deseja cadastrar ou remover.'
}))
if (ctx.command === 'addpalavra') {
if (!f.palavrasProibidas.some(v => modulos.norm(v) === n))
f.palavrasProibidas.push(raw)
ctx.setGp(ctx.dataGp)
return ctx.reply(ctx.mess.padraoSucesso({
titulo: 'PALAVRA ADICIONADA',
descricao: `A palavra ou frase ${raw} foi adicionada ao bloqueio.`
}))
}
f.palavrasProibidas = f.palavrasProibidas.filter(v => modulos.norm(v) !== n)
ctx.setGp(ctx.dataGp)
return ctx.reply(ctx.mess.padraoSucesso({
titulo: 'PALAVRA REMOVIDA',
descricao: `A palavra ou frase ${raw} foi removida do bloqueio.`
}))
}
}
)
