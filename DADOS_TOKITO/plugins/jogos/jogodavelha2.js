const dylan = require('../../database/lib/comandos')
const base = require('./sistema-base.js')
const visual = require('./sistema-jogodavelha.js')
const mess = require('../../mensagens/mensagens.js')

const arquivo = base.files.velha2

const getGame = grupo => base.getGame(arquivo, grupo)
const saveGame = game => base.saveGame(arquivo, game)
const removeGame = grupo => base.removeGame(arquivo, grupo)

const vitorias = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function vencedor(board) {
  for (const [a, b, c] of vitorias) {
    if (
      board[a] === board[b] &&
      board[b] === board[c]
    )
      return board[a]
  }

  return board.every(
    x => x === 'X' || x === 'O'
  ) ? 'EMPATE' : null
}

function minimax(
  board,
  maximizando,
  profundidade = 0
) {
  const fim = vencedor(board)

  if (fim === 'O')
    return 10 - profundidade

  if (fim === 'X')
    return profundidade - 10

  if (fim === 'EMPATE')
    return 0

  if (maximizando) {
    let melhor = -Infinity

    for (let i = 0; i < 9; i++) {
      if (board[i] === 'X' || board[i] === 'O')
        continue

      const antigo = board[i]

      board[i] = 'O'

      melhor = Math.max(
        melhor,
        minimax(board, false, profundidade + 1)
      )

      board[i] = antigo
    }

    return melhor
  }

  let melhor = Infinity

  for (let i = 0; i < 9; i++) {
    if (board[i] === 'X' || board[i] === 'O')
      continue

    const antigo = board[i]

    board[i] = 'X'

    melhor = Math.min(
      melhor,
      minimax(board, true, profundidade + 1)
    )

    board[i] = antigo
  }

  return melhor
}

function jogadaBot(board) {
  let valor = -Infinity
  let casa = -1

  for (let i = 0; i < 9; i++) {
    if (board[i] === 'X' || board[i] === 'O')
      continue

    const antigo = board[i]

    board[i] = 'O'

    const atual = minimax(
      board,
      false
    )

    board[i] = antigo

    if (atual > valor) {
      valor = atual
      casa = i
    }
  }

  return casa
}

function botJid(ctx) {
  return String(
    ctx.tokito?.user?.id || ''
  ).replace(
    /:\d+@/,
    '@'
  )
}

async function iniciar(ctx) {
  const bot = botJid(ctx)

  if (!bot)
    return false

  const game = {
    grupo: ctx.from,
    X: ctx.sender,
    O: bot,
    board: visual.criarTabuleiro(),
    turno: 'X',
    status: true,
    finalizado: false,
    vencedor: null,
    iniciadoEm: base.now()
  }

  saveGame(game)

  await visual.enviar(
    ctx,
    game,
    mess.jogoVelhaBotIniciada(
      base.mention(bot)
    )
  )

  return true
}

async function auto(ctx) {
  const game = getGame(ctx.from)

  if (
    !game ||
    !base.isSender(ctx, game.X)
  )
    return false

  const texto = base.norm(
    base.getBody(ctx)
  )

  if (!/^[1-9]$/.test(texto))
    return false

  const pos = Number(texto) - 1

  if (
    game.board[pos] === 'X' ||
    game.board[pos] === 'O'
  ) {
    await base.responder(
      ctx,
      mess.jogoCasaEscolhida()
    )

    return true
  }

  game.board[pos] = 'X'

  let fim = vencedor(game.board)

  if (fim === 'X') {
    removeGame(ctx.from)
    game.finalizado = true

    await base.reactMsg(ctx, '🏆')

    await visual.enviar(
      ctx,
      game,
      mess.jogoVelhaBotDerrota(ctx.sender)
    )

    return true
  }

  if (fim === 'EMPATE') {
    removeGame(ctx.from)
    game.finalizado = true

    await visual.enviar(
      ctx,
      game,
      mess.jogoVelhaBotEmpate()
    )

    return true
  }

  game.turno = 'O'
  saveGame(game)

  await new Promise(
    resolve => setTimeout(resolve, 650)
  )

  const botMove = jogadaBot(game.board)

  if (botMove >= 0)
    game.board[botMove] = 'O'

  fim = vencedor(game.board)

  if (fim === 'O') {
    removeGame(ctx.from)
    game.finalizado = true

    await base.reactMsg(ctx, '🤖')

    await visual.enviar(
      ctx,
      game,
      mess.jogoVelhaBotVitoria()
    )

    return true
  }

  if (fim === 'EMPATE') {
    removeGame(ctx.from)
    game.finalizado = true

    await visual.enviar(
      ctx,
      game,
      mess.jogoVelhaBotEmpate()
    )

    return true
  }

  game.turno = 'X'
  saveGame(game)

  await visual.enviar(
    ctx,
    game,
    mess.jogoVelhaBotJogou(botMove + 1)
  )

  return true
}

dylan.setCommand({
  nome: 'jogodavelha2',
  comandos: [
    'jogodavelha2',
    'jv2',
    'velha2'
  ],
  categoria: 'jogos',
  info: {
    descricao: 'Jogo da velha contra o próprio Tokito.',
    uso: 'jogodavelha2',
    categoria: 'jogos'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!ctx.modoJogosAtivo(ctx.from, ctx.dataGp))
      return ctx.reply(
        ctx.mess.modoJogosDesativado(ctx.prefix)
      )

    if (
      visual.getGame(ctx.from) ||
      getGame(ctx.from)
    )
      return ctx.reply(
        ctx.mess.velhaEmAndamento()
      )

    await ctx.reagir(ctx.from, '🤖').catch(() => {})

    if (!await iniciar(ctx))
      return ctx.reply(
        'Não foi possível iniciar o Jogo da Velha contra o Tokito.'
      )
  }
})

module.exports = {
  getGame,
  saveGame,
  removeGame,
  iniciar,
  auto
}
