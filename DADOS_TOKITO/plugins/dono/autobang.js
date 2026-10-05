/*
 * Tokito Bot V10 - AutoBan global
 * Author: Dylan Modz
 */

const donoSistema = require('../../sistemas/dono')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'autobang',
comandos: [
'autobang',
'delautobang',
'autobanglist'
],
categoria: 'dono',
info: {
descricao: 'Gerencia a lista negra global do bot.',
uso: 'autobang número',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

if (ctx.command === 'autobanglist') {
const lista =
donoSistema.listaAutoban()

if (!lista.length) {
return ctx.reply(
ctx.mess.padraoLista({
emoji: '🚫',
titulo: 'AUTOBAN GLOBAL',
itens: [],
vazio: 'Nenhum número cadastrado no AutoBan.'
})
)
}

return ctx.reply(
`- 🚫 \`𝙰𝚄𝚃𝙾𝙱𝙰𝙽 𝙶𝙻𝙾𝙱𝙰𝙻\`

${lista.map((jid, i) =>
`> ${i + 1}. @${jid.split('@')[0]}`
).join('\n')}`,
lista
)
}

const destino =
await ctx.destino()

if (!destino?.mencao) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '🚫',
titulo: ctx.command === 'autobang'
? 'ADICIONAR AUTOBAN'
: 'REMOVER AUTOBAN',
uso: `${ctx.prefix}${ctx.command} 5511999999999`,
descricao: 'Informe o número ou marque a pessoa.'
})
)
}

const alvo =
ctx.normalizar(
destino.mencao
)

if (
ctx.numerodono
.map(ctx.normalizar)
.includes(alvo) ||
alvo === ctx.botNormalizado
) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '🚫',
titulo: 'USUÁRIO PROTEGIDO',
descricao: 'O bot e os donos não podem entrar no AutoBan.'
})
)
}

const resultado =
ctx.command === 'autobang'
? donoSistema.autobanAdicionar(alvo)
: donoSistema.autobanRemover(alvo)

if (!resultado.ok) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '🚫',
titulo: 'AUTOBAN GLOBAL',
descricao: resultado.motivo === 'ja'
? 'Esse número já está no AutoBan.'
: 'Esse número não está no AutoBan.'
})
)
}

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '🚫',
titulo: ctx.command === 'autobang'
? 'AUTOBAN ADICIONADO'
: 'AUTOBAN REMOVIDO',
descricao: `@${alvo.split('@')[0]} foi ${ctx.command === 'autobang' ? 'adicionado ao' : 'removido do'} AutoBan global.`
}),
[alvo]
)
}
})
