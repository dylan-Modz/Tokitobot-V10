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
nome: 'obesidade',
comandos: ['obesidade'],
categoria: 'brincadeiras',
info: {
descricao: 'Calcula o IMC pelo peso e altura, como no Tokito V8.',
uso: 'obesidade 70/1.75'
},
async executar(ctx) {
const q = String(ctx.q || '').trim()
if (!q.includes('/'))
return ctx.reply(ctx.mess.padraoUso({
emoji: '⚖️',
titulo: 'OBESIDADE',
uso: `${ctx.prefix}obesidade 70/1.75`,
descricao: 'Informe peso e altura separados por /.'
}))
let [peso, altura] = q.split('/').map(v => Number(String(v || '').trim().replace(',', '.')))
if (!Number.isFinite(peso) || !Number.isFinite(altura) || peso <= 0 || altura <= 0)
return ctx.reply(ctx.mess.padraoUso({
emoji: '⚖️',
titulo: 'OBESIDADE',
uso: `${ctx.prefix}obesidade 70/1.75`,
descricao: 'Informe peso e altura separados por /.'
}))
const imc = (peso / (altura ** 2)).toFixed(2)
let texto
let emoji
if (imc < 18.5) {
texto = `• Seu índice de massa corporal é de: *${imc}* → Você está abaixo do peso.`
emoji = '😸'
}
else if (imc <= 24.9) {
texto = `• Seu índice de massa corporal é: *${imc}* → Você está no peso ideal.`
emoji = '👍'
}
else if (imc <= 29.9) {
texto = `• Seu índice de massa corporal é: *${imc}* → Você está com sobrepeso.`
emoji = '🫤'
}
else if (imc <= 39.9) {
texto = `• Seu índice de massa corporal é: *${imc}* → Em situação de obesidade.`
emoji = '🤨'
}
else {
texto = `• Seu índice de massa corporal é: *${imc}* → Obesidade mórbida!`
emoji = '😵'
}
await ctx.reagir(ctx.from, emoji).catch(() => {
})
return ctx.reply(ctx.mess.padraoInfo({
emoji,
titulo: 'RESULTADO DO IMC',
linhas: [
{ rotulo: '⚖️ 𝙸𝙼𝙲', valor: imc },
{ rotulo: '📌 𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾', valor: texto.replace(/^•\s*/, '').replace(/^Seu índice de massa corporal (é de|é):?\s*\*[^*]+\*\s*→\s*/i, '') }
]
}))
}
}
)
