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

const mess = require('../../database/lib/global.js')
const base = require('./base.js')

const arquivo = base.files.forca

const fundoPadrao = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg'

const getGame = grupo => base.getGame(arquivo, grupo)

const saveGame = game => base.saveGame(arquivo, game)

const removeGame = grupo => base.removeGame(arquivo, grupo)

function criarGame(grupo) {
const palavras = base.getList(base.files.palavrasForca).map(item => ({
palavra: base.onlyLetters(item.palavra),
tema: item.tema || mess.jogoTemaPadrao(),
dica: item.dica || mess.jogoDicaPadrao()
})).filter(item => item.palavra.length >= 2)
if (!palavras.length)
return null
const item = palavras[Math.floor(Math.random() * palavras.length)]
return {
grupo,
palavra: item.palavra,
tema: item.tema,
dica: item.dica,
letrasCertas: [],
letrasErradas: [],
erros: 0,
finalizado: false,
iniciadoEm: base.now(),
atualizadoEm: base.now()
}
}

function formatar(palavra, certas = []) {
return String(palavra || '').split('').map(letra => letra === ' ' ? ' ' : certas.includes(letra) ? letra.toUpperCase() : '_').join(' ')
}

function venceu(game) {
return game.palavra.split('').filter(letra => letra !== ' ').every(letra => game.letrasCertas.includes(letra))
}

function canvas(ctx, game) {
const params = [
`palavra=${encodeURIComponent(formatar(game.palavra, game.letrasCertas))}`,
`tema=${encodeURIComponent(game.tema)}`,
`dica=${encodeURIComponent(game.dica)}`,
`erros=${encodeURIComponent(game.erros)}`,
`max=6`,
`fundo=${encodeURIComponent(fundoPadrao)}`,
`t=${Date.now()}`,
`apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`
]
return `${ctx.API_URL}/canvas/forca?${params.join('&')}`
}

async function enviar(ctx, game) {
const botoes = game.finalizado
? [{
texto: mess.botaoMenuJogos(),
id: `${ctx.prefix}menujogos`
}]
: [
{
texto: mess.botaoCancelar(),
id: `${ctx.prefix}resetforca`
},
{
texto: mess.botaoMenuJogos(),
id: `${ctx.prefix}menujogos`
}
]
return base.sendImage(ctx, canvas(ctx, game), mess.jogoForca(game, formatar(game.palavra, game.letrasCertas)), [], botoes)
}

async function auto(ctx) {
const game = getGame(ctx.from)
if (!game)
return false
const original = base.getBody(ctx)
if (ctx.prefix && original.startsWith(ctx.prefix))
return false
const entrada = base.onlyLetters(original)
if (!entrada)
return false
if (entrada.length > 1) {
if (entrada !== game.palavra)
return false
game.finalizado = true
game.venceu = true
game.letrasCertas = [...new Set(game.palavra.split('').filter(Boolean))]
removeGame(ctx.from)
await base.reactMsg(ctx, '🏆')
await enviar(ctx, game)
return true
}
if (game.letrasCertas.includes(entrada) || game.letrasErradas.includes(entrada)) {
await base.responder(ctx, mess.jogoLetraUsada())
return true
}
await base.reactMsg(ctx, '🔤')
if (game.palavra.includes(entrada))
game.letrasCertas.push(entrada)
else {
game.letrasErradas.push(entrada)
game.erros++
}
if (venceu(game)) {
game.finalizado = true
game.venceu = true
removeGame(ctx.from)
await base.reactMsg(ctx, '🏆')
await enviar(ctx, game)
return true
}
if (game.erros >= 6) {
game.finalizado = true
game.venceu = false
removeGame(ctx.from)
await base.reactMsg(ctx, '💀')
await enviar(ctx, game)
return true
}
saveGame(game)
await enviar(ctx, game)
return true
}

module.exports = {
getGame,
saveGame,
removeGame,
criarGame,
enviar,
auto
}
