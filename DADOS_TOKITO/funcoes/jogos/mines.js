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

const arquivo = base.files.mines

const fundoPadrao = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg'

const getGame = grupo => base.getGame(arquivo, grupo)

const saveGame = game => base.saveGame(arquivo, game)

const removeGame = grupo => base.removeGame(arquivo, grupo)

function criarGame(grupo, jogador) {
const grid = Array.from({ length: 25 }, (_, i) => String(i + 1))
const bombas = []
while (bombas.length < 5) {
const indice = Math.floor(Math.random() * 25)
if (!bombas.includes(indice))
bombas.push(indice)
}
return {
grupo,
grid,
bombas,
abertas: [],
jogador,
finalizado: false,
ganhou: false,
iniciadoEm: base.now(),
atualizadoEm: base.now()
}
}

function canvas(ctx, game) {
const params = []
for (let i = 0; i < 25; i++)
params.push(`c${i + 1}=${encodeURIComponent(game.grid?.[i] || String(i + 1))}`)
params.push(`fundo=${encodeURIComponent(fundoPadrao)}`)
params.push(`t=${Date.now()}`)
params.push(`apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`)
return `${ctx.API_URL}/canvas/mines?${params.join('&')}`
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
id: `${ctx.prefix}resetmines`
},
{
texto: mess.botaoMenuJogos(),
id: `${ctx.prefix}menujogos`
}
]
return base.sendImage(ctx, canvas(ctx, game), mess.jogoMines(game, ctx.sender, base.mention), [ctx.sender], botoes)
}

async function auto(ctx) {
const game = getGame(ctx.from)
if (!game || game.finalizado || (game.jogador && !base.isSender(ctx, game.jogador)))
return false
const original = base.getBody(ctx)
if (ctx.prefix && original.startsWith(ctx.prefix))
return false
const numero = Number(original)
if (!numero || numero < 1 || numero > 25)
return false
const indice = numero - 1
if (game.abertas.includes(indice)) {
await base.reactMsg(ctx, '⚠️')
await base.responder(ctx, mess.jogoCasaAberta())
return true
}
game.abertas.push(indice)
if (game.bombas.includes(indice)) {
game.grid[indice] = 'B'
game.bombas.forEach(item => game.grid[item] = 'B')
game.finalizado = true
game.ganhou = false
removeGame(ctx.from)
await base.reactMsg(ctx, '💥')
await enviar(ctx, game)
return true
}
game.grid[indice] = 'D'
await base.reactMsg(ctx, '💎')
const abertasSeguras = game.abertas.filter(item => !game.bombas.includes(item)).length
if (abertasSeguras >= 25 - game.bombas.length) {
game.finalizado = true
game.ganhou = true
removeGame(ctx.from)
await base.reactMsg(ctx, '🏆')
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
