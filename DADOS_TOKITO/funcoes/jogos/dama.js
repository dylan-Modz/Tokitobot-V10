const mess = require('../../database/lib/global.js')
const base = require('./base.js')

const arquivo = base.files.dama

const fundoPadrao = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg'

const getGame = grupo => base.getGame(arquivo, grupo)

const saveGame = game => base.saveGame(arquivo, game)

const removeGame = grupo => base.removeGame(arquivo, grupo)

function criarTabuleiro() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(''))
  for (let linha = 0; linha < 3; linha++) {
    for (let coluna = 0; coluna < 8; coluna++) {
      if ((linha + coluna) % 2 === 1)
        board[linha][coluna] = 'b'
    }
  }
  for (let linha = 5; linha < 8; linha++) {
    for (let coluna = 0; coluna < 8; coluna++) {
      if ((linha + coluna) % 2 === 1)
        board[linha][coluna] = 'w'
    }
  }
  return board
}

function coord(posicao = '') {
  const resultado = String(posicao).trim().toUpperCase().match(/^([A-H])([1-8])$/)
  if (!resultado)
    return null
  return {
    col: 'ABCDEFGH'.indexOf(resultado[1]),
    row: 8 - Number(resultado[2])
  }
}

function canvas(ctx, game) {
  const params = []
  for (let linha = 0; linha < 8; linha++) {
    for (let coluna = 0; coluna < 8; coluna++) {
      params.push(`c${linha}_${coluna}=${encodeURIComponent(game.board[linha][coluna] || '')}`)
    }
  }
  params.push(`turno=${game.turno}`)
  params.push(`fundo=${encodeURIComponent(fundoPadrao)}`)
  params.push(`t=${Date.now()}`)
  params.push(`apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`)
  return `${ctx.API_URL}/canvas/dama?${params.join('&')}`
}

async function enviar(ctx, game, extra = '') {
  const turno = game.turno === 'W' ? game.W : game.B
  const botoes = game.finalizado
    ? [{
      texto: mess.botaoMenuJogos(),
      id: `${ctx.prefix}menujogos`
    }]
    : [
      {
        texto: mess.botaoCancelar(),
        id: `${ctx.prefix}resetdama`
      },
      {
        texto: mess.botaoMenuJogos(),
        id: `${ctx.prefix}menujogos`
      }
    ]
  return base.sendImage(ctx, canvas(ctx, game), mess.jogoDama(game, extra, base.mention), [game.W, game.B, turno], botoes)
}

async function auto(ctx) {
  const game = getGame(ctx.from)
  if (!game)
    return false
  const texto = base.norm(base.getBody(ctx))
  if (!game.status) {
    if (['s', 'sim', 'ok'].includes(texto) && base.isSender(ctx, game.B)) {
      game.status = true
      saveGame(game)
      await base.reactMsg(ctx, '✅')
      await enviar(ctx, game, mess.jogoDamaIniciada())
      return true
    }
    if (['n', 'nao', 'não', 'no'].includes(texto) && base.isSender(ctx, game.B)) {
      removeGame(ctx.from)
      await base.reactMsg(ctx, '❌')
      await base.sendText(ctx, mess.jogoDesafioRecusado(base.mention(game.B)), [game.W, game.B])
      return true
    }
    return false
  }
  const movimento = base.getBody(ctx).toUpperCase().replace(/\s+/g, '').split('-')
  if (movimento.length !== 2)
    return false
  const origem = coord(movimento[0])
  const destino = coord(movimento[1])
  if (!origem || !destino)
    return false
  const jogador = game.turno === 'W' ? game.W : game.B
  if (!base.isSender(ctx, jogador))
    return false
  const peca = game.board[origem.row]?.[origem.col]
  const proprias = game.turno === 'W' ? ['w', 'W'] : ['b', 'B']
  if (!proprias.includes(peca)) {
    await base.responder(ctx, mess.jogoPecaNaoSua())
    return true
  }
  if (game.board[destino.row][destino.col]) {
    await base.responder(ctx, mess.jogoCasaOcupada())
    return true
  }
  const dr = destino.row - origem.row
  const dc = destino.col - origem.col
  if (Math.abs(dr) !== Math.abs(dc)) {
    await base.responder(ctx, mess.jogoMovimentoInvalido())
    return true
  }
  if (Math.abs(dr) === 2) {
    const meioLinha = origem.row + dr / 2
    const meioColuna = origem.col + dc / 2
    const inimiga = game.board[meioLinha][meioColuna]
    const inimigas = game.turno === 'W' ? ['b', 'B'] : ['w', 'W']
    if (!inimigas.includes(inimiga)) {
      await base.responder(ctx, mess.jogoSemInimigo())
      return true
    }
    game.board[meioLinha][meioColuna] = ''
  }
  else if (Math.abs(dr) !== 1) {
    await base.responder(ctx, mess.jogoMovimentoInvalido())
    return true
  }
  game.board[destino.row][destino.col] = peca
  game.board[origem.row][origem.col] = ''
  if (peca === 'w' && destino.row === 0)
    game.board[destino.row][destino.col] = 'W'
  if (peca === 'b' && destino.row === 7)
    game.board[destino.row][destino.col] = 'B'
  await base.reactMsg(ctx, '⚫')
  const pecas = game.board.flat()
  if (!pecas.some(item => ['w', 'W'].includes(item)) || !pecas.some(item => ['b', 'B'].includes(item))) {
    game.finalizado = true
    removeGame(ctx.from)
    await base.reactMsg(ctx, '🏆')
    await enviar(ctx, game, mess.jogoDamaVencedor(base.mention(jogador)))
    return true
  }
  game.turno = game.turno === 'W' ? 'B' : 'W'
  saveGame(game)
  await enviar(ctx, game, mess.jogoDamaMovimento(movimento.join('-')))
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
