/*
 * Tokito Bot V10 - Participação em sorteio por reação
 * Author: Dylan Modz
 */

const sorteioGrupo = require('../../sistemas/sorteio-grupo')

module.exports = {
prioridade: 15,
nome: 'evento-sorteio-grupo',
categoria: 'eventos',
async evento(ctx) {
if (
!ctx.isGroup ||
ctx.info?.key?.fromMe ||
!ctx.mensagem?.reactionMessage
) {
return false
}

const reacao =
ctx.mensagem.reactionMessage

const mensagemId =
reacao?.key?.id ||
''

if (!mensagemId)
return false

const resultado =
sorteioGrupo.reagir({
grupo: ctx.from,
mensagemId,
usuario: ctx.sender,
emoji: reacao.text || ''
})

return resultado.ok === true
}
}
