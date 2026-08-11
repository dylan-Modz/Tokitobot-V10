const mess = require('../../database/lib/global.js')
const base = require('./base.js')

const arquivo = base.files.quiz

const fundoPadrao = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg'

const getGame = grupo => base.getGame(arquivo, grupo)

const saveGame = game => base.saveGame(arquivo, game)

const removeGame = grupo => base.removeGame(arquivo, grupo)

function perguntas() {
  return base.getList(base.files.perguntasQuiz).map((item, index) => ({
    ...item,
    id: Number(item.id) || index + 1
  }))
    .filter(item => item.pergunta && Array.isArray(item.opcoes) && item.opcoes.length === 4 && Number(item.correta) >= 1 && Number(item.correta) <= 4)
}

function criarGame(grupo, usadas = []) {
  const usadasNumeros = Array.isArray(usadas) ? usadas.map(Number).filter(Boolean) : []
  const disponiveis = perguntas().filter(item => !usadasNumeros.includes(Number(item.id)))
  if (!disponiveis.length)
    return null
  const item = disponiveis[Math.floor(Math.random() * disponiveis.length)]
  return {
    grupo,
    perguntaId: Number(item.id),
    pergunta: item.pergunta,
    opcoes: item.opcoes,
    correta: Number(item.correta),
    categoria: item.categoria || mess.jogoTemaPadrao(),
    usadas: [...usadasNumeros, Number(item.id)],
    iniciadoEm: base.now(),
    atualizadoEm: base.now()
  }
}

function canvas(ctx, game, estado = 'jogando', resposta = 0) {
  const params = [
    `pergunta=${encodeURIComponent(game.pergunta)}`,
    `op1=${encodeURIComponent(game.opcoes[0])}`,
    `op2=${encodeURIComponent(game.opcoes[1])}`,
    `op3=${encodeURIComponent(game.opcoes[2])}`,
    `op4=${encodeURIComponent(game.opcoes[3])}`,
    `correta=${encodeURIComponent(game.correta)}`,
    `categoria=${encodeURIComponent(game.categoria)}`,
    `estado=${encodeURIComponent(estado)}`,
    `resposta=${encodeURIComponent(resposta)}`,
    `fundo=${encodeURIComponent(fundoPadrao)}`,
    `t=${Date.now()}`,
    `apikey=${encodeURIComponent(ctx.API_KEY_TOKITO)}`
  ]
  return `${ctx.API_URL}/canvas/quiz?${params.join('&')}`
}

async function enviar(ctx, game, estado = 'jogando', respondedor = null, resposta = 0) {
  const botoes = estado === 'jogando'
    ? game.opcoes.map((opcao, index) => ({
      texto: mess.botaoQuiz(index + 1, opcao),
      id: String(index + 1)
    }))
    : [{
      texto: mess.botaoMenuJogos(),
      id: `${ctx.prefix}menujogos`
    }]
  return base.sendImage(ctx, canvas(ctx, game, estado, resposta), mess.jogoQuiz(game, estado, respondedor, base.mention), respondedor ? [respondedor] : [], botoes)
}

async function auto(ctx) {
  const game = getGame(ctx.from)
  if (!game)
    return false
  const texto = base.getBody(ctx)
  if (!/^[1-4]$/.test(texto))
    return false
  const resposta = Number(texto)
  const acertou = resposta === game.correta
  await base.reactMsg(ctx, acertou ? '🏆' : '❌')
  await enviar(ctx, game, acertou ? 'acertou' : 'errou', ctx.sender, resposta)
  const usadas = Array.isArray(game.usadas) ? game.usadas : []
  removeGame(ctx.from)
  setTimeout(async () => {
    try {
      const proximo = criarGame(ctx.from, usadas)
      if (!proximo)
        return base.sendText(ctx, mess.jogoQuizFinalizado())
      saveGame(proximo)
      await enviar(ctx, proximo)
    }
    catch {
    }
  }, 5000)
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
