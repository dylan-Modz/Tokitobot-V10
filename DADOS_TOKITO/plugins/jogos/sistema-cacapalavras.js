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

const mess = require('../../mensagens/mensagens.js')
const base = require('./sistema-base.js')

const arquivo = base.files.caca

const getGame = grupo => base.getGame(arquivo, grupo)

const saveGame = game => base.saveGame(arquivo, game)

const removeGame = grupo => base.removeGame(arquivo, grupo)

const letraAleatoria = () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]

function criarGrade(lista, tamanho = 14) {
const grade = Array.from({ length: tamanho }, () => Array.from({ length: tamanho }, () => ''))
const usadas = []
const direcoes = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]
function podeAdicionar(palavra, linha, coluna, dx, dy) {
for (let i = 0; i < palavra.length; i++) {
const novaLinha = linha + i * dy
const novaColuna = coluna + i * dx
if (novaLinha < 0 || novaLinha >= tamanho || novaColuna < 0 || novaColuna >= tamanho)
return false
if (grade[novaLinha][novaColuna] && grade[novaLinha][novaColuna] !== palavra[i])
return false
}
return true
}
for (const item of lista) {
const palavra = item.palavra.toUpperCase()
let adicionada = false
let tentativas = 0
while (!adicionada && tentativas++ < 300) {
const [dx, dy] = direcoes[Math.floor(Math.random() * direcoes.length)]
const linha = Math.floor(Math.random() * tamanho)
const coluna = Math.floor(Math.random() * tamanho)
if (!podeAdicionar(palavra, linha, coluna, dx, dy))
continue
const posicoes = []
for (let i = 0; i < palavra.length; i++) {
const novaLinha = linha + i * dy
const novaColuna = coluna + i * dx
grade[novaLinha][novaColuna] = palavra[i]
posicoes.push([novaLinha, novaColuna])
}
usadas.push({
palavra: item.palavra,
tema: item.tema,
posicoes
})
adicionada = true
}
}
for (let linha = 0; linha < tamanho; linha++) {
for (let coluna = 0; coluna < tamanho; coluna++) {
if (!grade[linha][coluna])
grade[linha][coluna] = letraAleatoria()
}
}
return {
grade,
palavras: usadas
}
}

function embaralhar(lista = []) {
const copia = [...lista]

for (let i = copia.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1))
const atual = copia[i]

copia[i] = copia[j]
copia[j] = atual
}

return copia
}

function criarGame(grupo) {
const todas = base.getList(base.files.palavrasCaca).map(item => ({
palavra: base.onlyLetters(item.palavra),
tema: item.tema || mess.jogoTemaPadrao()
})).filter(item => item.palavra.length >= 4 && item.palavra.length <= 12)

if (!todas.length)
return null

const porTema = todas.reduce((acc, item) => {
const tema = String(item.tema || mess.jogoTemaPadrao())

if (!acc[tema])
acc[tema] = []

acc[tema].push(item)
return acc
}, {})

const temasValidos = Object.keys(porTema).filter(tema => porTema[tema].length >= 8)

let palavras

if (temasValidos.length) {
const tema = temasValidos[Math.floor(Math.random() * temasValidos.length)]
palavras = embaralhar(porTema[tema]).slice(0, 8)
}
else {
palavras = embaralhar(todas).slice(0, 8)
}

if (!palavras.length)
return null

const tabuleiro = criarGrade(palavras, 14)

if (!tabuleiro.palavras.length)
return null

return {
grupo,
tamanho: 14,
tema: palavras[0].tema,
grade: tabuleiro.grade,
palavras: tabuleiro.palavras,
encontradas: [],
iniciadoEm: base.now(),
atualizadoEm: base.now()
}
}

function canvas(ctx, game) {
const params = []
for (let linha = 0; linha < game.tamanho; linha++) {
for (let coluna = 0; coluna < game.tamanho; coluna++) {
params.push(`c${linha}_${coluna}=${encodeURIComponent(game.grade[linha][coluna])}`)
}
}
const marcadas = []
game.palavras.forEach(item => {
if (game.encontradas.includes(item.palavra))
item.posicoes.forEach(([linha, coluna]) => marcadas.push(`${linha}_${coluna}`))
})
params.push(`tamanho=${game.tamanho}`)
params.push(`tema=${encodeURIComponent(game.tema)}`)
params.push(`marcadas=${encodeURIComponent(marcadas.join('|'))}`)
params.push(`t=${Date.now()}`)
params.push(`apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`)
return `${ctx.API_URL}/canvas/cacapalavras?${params.join('&')}`
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
id: `${ctx.prefix}resetcaca`
},
{
texto: mess.botaoMenuJogos(),
id: `${ctx.prefix}menujogos`
}
]
return base.sendImage(ctx, canvas(ctx, game), mess.jogoCacaPalavras(game, ctx.sender, base.mention), [ctx.sender], botoes)
}

async function auto(ctx) {
const game = getGame(ctx.from)
if (!game)
return false
const palavra = base.onlyLetters(base.getBody(ctx))
if (!palavra)
return false
const item = game.palavras.find(registro => registro.palavra === palavra)
if (!item)
return false
if (game.encontradas.includes(palavra)) {
await base.responder(ctx, mess.jogoPalavraEncontrada())
return true
}
game.encontradas.push(palavra)
await base.reactMsg(ctx, '🔎')
if (game.encontradas.length >= game.palavras.length) {
game.finalizado = true
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
