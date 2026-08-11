const mess = require('../../database/lib/global.js')
const base = require('./base.js')

const arquivo = base.files.velha

const getGame = grupo => base.getGame(arquivo, grupo)

const saveGame = game => base.saveGame(arquivo, game)

const removeGame = grupo => base.removeGame(arquivo, grupo)

const criarTabuleiro = () => [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9'
]

function vencedor(board) {
  const vitorias = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
  for (const [a, b, c] of vitorias)
    if (board[a] === board[b] && board[b] === board[c])
      return board[a]
  return board.every(item => ['X', 'O'].includes(item)) ? 'EMPATE' : null
}

function canvas(ctx, game) {
  const casas = game.board.map((valor, i) => `c${i + 1}=${encodeURIComponent(valor)}`).join('&')
  return `${ctx.API_URL}/canvas/jogodavelha?${casas}&t=${Date.now()}&apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`
}

async function enviar(ctx, game, extra = '') {
  const turno = game.turno === 'X' ? game.X : game.O
  const botoes = game.finalizado
    ? [{
      texto: mess.botaoMenuJogos(),
      id: `${ctx.prefix}menujogos`
    }]
    : [
      {
        texto: mess.botaoCancelar(),
        id: `${ctx.prefix}resetvelha`
      },
      {
        texto: mess.botaoMenuJogos(),
        id: `${ctx.prefix}menujogos`
      }
    ]
  return base.sendImage(ctx, canvas(ctx, game), mess.jogoVelha(game, extra, base.mention), [game.X, game.O, turno], botoes)
}

async function auto(ctx) {
  const game = getGame(ctx.from)
  if (!game)
    return false
  const texto = base.norm(base.getBody(ctx))
  if (!game.status) {
    if (['s', 'sim', 'ok'].includes(texto) && base.isSender(ctx, game.O)) {
      game.status = true
      saveGame(game)
      await base.reactMsg(ctx, '✅')
      await enviar(ctx, game, mess.jogoVelhaIniciada())
      return true
    }
    if (['n', 'nao', 'não', 'no'].includes(texto) && base.isSender(ctx, game.O)) {
      removeGame(ctx.from)
      await base.reactMsg(ctx, '❌')
      await base.sendText(ctx, mess.jogoDesafioRecusado(base.mention(game.O)), [game.X, game.O])
      return true
    }
    return false
  }
  const numero = Number(texto)
  if (!numero || numero < 1 || numero > 9)
    return false
  const jogador = game.turno === 'X' ? game.X : game.O
  if (!base.isSender(ctx, jogador))
    return false
  const indice = numero - 1
  if (['X', 'O'].includes(game.board[indice])) {
    await base.responder(ctx, mess.jogoCasaEscolhida())
    return true
  }
  game.board[indice] = game.turno
  await base.reactMsg(ctx, game.turno === 'X' ? '❌' : '⭕')
  const ganhou = vencedor(game.board)
  if (ganhou) {
    removeGame(ctx.from)
    if (ganhou === 'EMPATE')
      await enviar(ctx, game, mess.jogoVelhaEmpate())
    else
      await enviar(ctx, game, mess.jogoVelhaVencedor(base.mention(ganhou === 'X' ? game.X : game.O)))
    return true
  }
  game.turno = game.turno === 'X' ? 'O' : 'X'
  saveGame(game)
  await enviar(ctx, game)
  return true
}

module.exports = {
  getGame,
  saveGame,
  removeGame,
  criarTabuleiro,
  enviar,
  auto
}
