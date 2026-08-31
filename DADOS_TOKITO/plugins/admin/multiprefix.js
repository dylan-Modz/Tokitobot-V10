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

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'multiprefix',

comandos: [
'multiprefix',
'addprefix'
],

categoria: 'admin',

info: {
descricao: 'Prefixo próprio por grupo.',
uso: 'multiprefix 1/0 | addprefix !',
permissao: 'ADM'
},

async executar(ctx) {
if (!ctx.isGroup) {
return ctx.reply(
ctx.mess.sogrupo()
)
}

if (!ctx.isGroupAdmins && !ctx.SoDono) {
return ctx.reply(
ctx.mess.soadm()
)
}

const funcoes = ctx.dataGp[0].funcoes || (ctx.dataGp[0].funcoes = {})

if (ctx.command === 'multiprefix') {
const acao = String(ctx.q || '').trim()
const emoji = '🧩'
const titulo = '𝙼𝚄𝙻𝚃𝙸-𝙿𝚁𝙴𝙵𝙸𝚇'
const descricao = 'ᴘᴇʀᴍɪᴛᴇ ᴜsᴀʀ ᴜᴍ ᴘʀᴇғɪxᴏ ᴘʀᴏ́ᴘʀɪᴏ ᴘᴀʀᴀ ᴇsᴛᴇ ɢʀᴜᴘᴏ.'

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

funcoes.multiprefix = acao === '1'

if (!funcoes.prefixGrupo) {
funcoes.prefixGrupo = ctx.prefix
}

ctx.setGp(ctx.dataGp)

await ctx.reagir(
ctx.from,
funcoes.multiprefix ? '✅' : '❌'
).catch(() => {
})

return ctx.reply(
funcoes.multiprefix
? ctx.mess.funcaoAtivada(emoji, titulo, descricao)
: ctx.mess.funcaoDesativada(emoji, titulo, descricao)
)
}

if (!funcoes.multiprefix) {
return ctx.reply(ctx.mess.padraoAviso({
titulo: 'MULTIPREFIX DESATIVADO',
descricao: `Ative primeiro com ${ctx.prefix}multiprefix 1.`
}))
}

const novoPrefixo = String(ctx.q || '')
.trim()
.split(/\s+/)[0]

if (!novoPrefixo || novoPrefixo.length > 5) {
return ctx.reply(ctx.mess.padraoErro({
titulo: 'PREFIXO INVÁLIDO',
descricao: 'Informe um prefixo de 1 a 5 caracteres.'
}))
}

funcoes.prefixGrupo = novoPrefixo
ctx.setGp(ctx.dataGp)

return ctx.reply(ctx.mess.padraoSucesso({
titulo: 'PREFIXO ALTERADO',
descricao: `O prefixo deste grupo agora é ${novoPrefixo}.`
}))
}
}
)
