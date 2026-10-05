/*
 * Tokito Bot V10 - Tabela do grupo
 * Author: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

const dataHora = valor => {
return new Date(valor || Date.now()).toLocaleString(
'pt-BR',
{
timeZone: 'America/Fortaleza',
day: '2-digit',
month: '2-digit',
year: 'numeric',
hour: '2-digit',
minute: '2-digit'
}
)
}

dylan.setCommand({
nome: 'tabelagp',
comandos: ['criartabela', 'tabelagp'],
categoria: 'grupo',
info: {
descricao: 'Cria e consulta a tabela fixa do grupo.',
uso: 'criartabela texto | tabelagp',
permissao: 'ADM para criar'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (ctx.command === 'criartabela') {
if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())

const texto = String(ctx.q || '').trim()

if (!texto) {
return ctx.reply(
ctx.mess.padraoUso({
emoji: '📋',
titulo: 'CRIAR TABELA',
uso: `${ctx.prefix}criartabela texto da tabela`,
descricao: 'O texto fica salvo somente neste grupo.'
})
)
}

ctx.dataGp[0].tabelaGp = {
texto: texto.slice(0, 12000),
autor: ctx.sender,
atualizadoEm: Date.now()
}

ctx.setGp(ctx.dataGp)

return ctx.reply(
ctx.mess.padraoSucesso({
emoji: '📋',
titulo: 'TABELA DO GRUPO',
descricao: 'A tabela deste grupo foi salva com sucesso.'
})
)
}

const tabela = ctx.dataGp?.[0]?.tabelaGp

if (!tabela?.texto) {
return ctx.reply(
ctx.mess.padraoAviso({
emoji: '📋',
titulo: 'TABELA DO GRUPO',
descricao: 'Ainda não existe uma tabela salva neste grupo.'
})
)
}

return ctx.reply(
`- 📋 \`𝚃𝙰𝙱𝙴𝙻𝙰 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`

${tabela.texto}

> 🕒 ׄ ( ᴀᴛᴜᴀʟɪᴢᴀᴅᴀ: ${dataHora(tabela.atualizadoEm)} )`
)
}
})
