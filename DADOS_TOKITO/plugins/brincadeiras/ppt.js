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
nome: 'ppt',
comandos: ['ppt'],
categoria: 'brincadeiras',
info: {
descricao: 'Joga pedra, papel e tesoura contra o bot.',
uso: 'ppt pedra|papel|tesoura',
categoria: 'brincadeiras'
},
async executar(ctx) {
const { q, reply, prefix } = ctx
const u = String(q || '').trim().toLowerCase()
if (!['pedra', 'papel', 'tesoura'].includes(u))
return reply(ctx.mess.padraoUso({
emoji: '✊',
titulo: 'PEDRA PAPEL TESOURA',
uso: `${prefix}ppt pedra | papel | tesoura`,
descricao: 'Escolha pedra, papel ou tesoura.'
}))
const op = ['pedra', 'papel', 'tesoura'][Math.floor(Math.random() * 3)]
const ganha = (u === 'pedra' && op === 'tesoura') || (u === 'papel' && op === 'pedra') || (u === 'tesoura' && op === 'papel')
const r = u === op ? 'Empate 🤝' : ganha ? 'Você venceu 🎉' : 'O bot venceu 🤖'
return reply(ctx.mess.padraoInfo({
emoji: '✊',
titulo: 'PEDRA PAPEL TESOURA',
linhas: [
{ rotulo: '👤 𝚅𝙾𝙲𝙴̂', valor: u },
{ rotulo: '🤖 𝙱𝙾𝚃', valor: op },
{ rotulo: '🏆 𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾', valor: r }
]
}))
}
}
)
