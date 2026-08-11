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

const arquivo = base.files.adivinhe

const getGame = grupo => base.getGame(arquivo, grupo)

const saveGame = game => base.saveGame(arquivo, game)

const removeGame = grupo => base.removeGame(arquivo, grupo)

function criarGame(grupo) {
const palavras = base.getList(base.files.palavrasAdivinhe).map(item => ({
palavra: base.onlyLetters(item.palavra),
tema: item.tema || mess.jogoTemaPadrao(),
dica: item.dica || mess.jogoDicaPadrao()
})).filter(item => item.palavra.length === 5)
if (!palavras.length)
return null
const item = palavras[Math.floor(Math.random() * palavras.length)]
return {
grupo,
palavra: item.palavra,
tema: item.tema,
dica: item.dica,
tentativas: [],
finalizado: false,
iniciadoEm: base.now(),
atualizadoEm: base.now()
}
}

function statusTentativa(tentativa, palavra) {
const status = Array(5).fill('cinza')
const segredo = palavra.split('')
const letras = tentativa.split('')
const usados = Array(5).fill(false)
for (let i = 0; i < 5; i++) {
if (letras[i] === segredo[i]) {
status[i] = 'verde'
usados[i] = true
}
}
for (let i = 0; i < 5; i++) {
if (status[i] === 'verde')
continue
for (let j = 0; j < 5; j++) {
if (!usados[j] && letras[i] === segredo[j]) {
status[i] = 'amarelo'
usados[j] = true
break
}
}
}
return status
}

function canvas(ctx, game) {
const letras = Array(30).fill('')
const status = Array(30).fill('');
(game.tentativas || []).forEach((tentativa, linha) => {
for (let i = 0; i < 5; i++) {
const indice = linha * 5 + i
letras[indice] = tentativa.letras?.[i] || ''
status[indice] = tentativa.status?.[i] || ''
}
})
const params = []
for (let i = 0; i < 30; i++) {
params.push(`l${i + 1}=${encodeURIComponent(letras[i])}`)
params.push(`s${i + 1}=${encodeURIComponent(status[i])}`)
}
params.push(`t=${Date.now()}`)
params.push(`apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`)
return `${ctx.API_URL}/canvas/adivinhepalavra?${params.join('&')}`
}

async function enviar(ctx, game, jid = ctx.sender) {
const botoes = game.finalizado
? [{
texto: mess.botaoMenuJogos(),
id: `${ctx.prefix}menujogos`
}]
: [
{
texto: mess.botaoCancelar(),
id: `${ctx.prefix}resetadivinhe`
},
{
texto: mess.botaoMenuJogos(),
id: `${ctx.prefix}menujogos`
}
]
return base.sendImage(ctx, canvas(ctx, game), mess.jogoAdivinhe(game, jid, base.mention), [jid], botoes)
}

async function auto(ctx) {
const game = getGame(ctx.from)
if (!game)
return false
const tentativa = base.onlyLetters(base.getBody(ctx))
if (tentativa.length !== 5)
return false
game.tentativas.push({
letras: tentativa.split(''),
status: statusTentativa(tentativa, game.palavra),
autor: ctx.sender
})
if (tentativa === game.palavra) {
game.finalizado = true
game.venceu = true
removeGame(ctx.from)
await base.reactMsg(ctx, '🏆')
await enviar(ctx, game)
return true
}
if (game.tentativas.length >= 6) {
game.finalizado = true
game.venceu = false
removeGame(ctx.from)
await base.reactMsg(ctx, '💀')
await enviar(ctx, game)
return true
}
saveGame(game)
await base.reactMsg(ctx, '🧩')
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
