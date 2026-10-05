/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * ============================================================
 */

const simih = require('../../sistemas/simih')

module.exports = {
prioridade: 85,
nome: 'evento-simih',
categoria: 'eventos',
fase: 'normal',

async evento(ctx) {
if (
!ctx.isGroup ||
ctx.isCmd ||
ctx.info?.key?.fromMe ||
!ctx.sender
) {
return false
}

if (
ctx.dataGp?.[0]?.funcoes?.simih !== true
) {
return false
}

const textoAtual =
simih.textoMensagem(
ctx.mensagem
) ||
String(ctx.body || '').trim()

if (!textoAtual)
return false

// Toda frase curta pode virar um gatilho.
simih.registrar(
textoAtual
)

// Se a mensagem for uma resposta, aprende a relação
// "mensagem citada" -> "resposta atual".
const citado =
simih.textoCitado(
ctx.mensagem
)

if (citado) {
simih.aprender(
citado,
textoAtual
)
}

// Responde somente quando já existe aprendizado
// para exatamente aquela frase curta.
const resposta =
simih.verificar(
textoAtual
)

if (!resposta)
return false

await ctx.reply(
resposta
)

return true
}
}
