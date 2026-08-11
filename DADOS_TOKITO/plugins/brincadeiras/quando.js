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

module.exports = {
nome: 'quando',
comandos: ['quando'],
categoria: 'brincadeiras',
info: {
descricao: 'Prevê de brincadeira quando algo vai acontecer.',
uso: 'quando pergunta',
requisitos: 'Modo Brincadeiras'
},
async executar(ctx) {
const q = String(ctx.q || '').trim()
if (!q)
return ctx.reply('Digite a pergunta!')
const base = ['Hoje', 'Amanhã', 'Nunca', 'dia', 'semana', 'mês', 'ano']
const plural = ['dias', 'semanas', 'meses', 'anos']
const tipo = base[Math.floor(Math.random() * base.length)]
const n = Math.floor(Math.random() * 11) + 1
let resposta
if (['Hoje', 'Amanhã', 'Nunca'].includes(tipo))
resposta = tipo
else if (n === 1)
resposta = `1 ${tipo}`
else
resposta = `${n} ${plural[Math.floor(Math.random() * plural.length)]}`
return ctx.reply(`Pergunta: ${q}\nResposta: ${resposta}`)
}
}
