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
nome: 'mencionar',
comandos: ['mencionar'],
categoria: 'brincadeiras',
info: {
descricao: 'Escolhe aleatoriamente alguém do grupo para a zoeira informada.',
uso: 'mencionar corno',
requisitos: 'Modo Brincadeiras'
},
async executar(ctx) {
const q = String(ctx.q || '').trim()
if (!q)
return ctx.reply(ctx.mess.padraoUso({
emoji: '👤',
titulo: 'MENCIONAR',
uso: `${ctx.prefix}mencionar corno`,
descricao: 'Informe o que deseja sortear entre os membros do grupo.'
}))
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isModobn)
return ctx.reply(ctx.mess.onlyGroupFun(ctx.prefix))
const membros = [...new Set((ctx.groupMembers || []).map(v => ctx.nJid(v)).filter(Boolean))]
if (!membros.length)
return ctx.reply(ctx.mess.padraoAviso({
emoji: '👥',
titulo: 'SEM MEMBROS',
descricao: 'Não encontrei membros disponíveis neste grupo.'
}))
const alvo = membros[Math.floor(Math.random() * membros.length)]
return ctx.reply(ctx.mess.padraoInfo({
emoji: '👤',
titulo: 'MEMBRO SORTEADO',
linhas: [
{ rotulo: '🎯 𝚂𝙾𝚁𝚃𝙴𝙸𝙾', valor: q },
{ rotulo: '👤 𝚄𝚂𝚄𝙰́𝚁𝙸𝙾', valor: `@${alvo.split('@')[0]}` }
]
}), [alvo])
}
}
)
