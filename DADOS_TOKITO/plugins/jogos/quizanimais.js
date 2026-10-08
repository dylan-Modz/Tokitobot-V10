const dylan = require('../../database/lib/comandos')
const base = require('./ignis.js')
const mess = require('../../mensagens/mensagens.js')

const arquivo = base.files.quizanimais

const getGame = grupo => base.getGame(arquivo, grupo)
const saveGame = game => base.saveGame(arquivo, game)
const removeGame = grupo => base.removeGame(arquivo, grupo)

function banco() {
  return base.getList(base.files.quizanimaisBanco)
    .filter(item => item?.nome && item?.imagem)
}

function criarGame(grupo, ignorar = []) {
  const bloqueados = new Set(
    ignorar.map(base.norm)
  )

  const lista = banco().filter(
    item => !bloqueados.has(base.norm(item.nome))
  )

  if (!lista.length)
    return null

  const item = lista[Math.floor(Math.random() * lista.length)]

  return {
    grupo,
    nome: item.nome,
    imagem: item.imagem,
    iniciadoEm: base.now()
  }
}

async function enviar(ctx, game) {
  return base.sendImage(
    ctx,
    game.imagem,
    mess.jogoQuizAnimais(game),
    [],
    [{
      texto: '👀 Revelar',
      id: ctx.prefix + 'revelarquiz'
    }]
  )
}

async function iniciar(ctx, ignorar = []) {
  const usados = [...ignorar]

  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const game = criarGame(ctx.from, usados)

    if (!game)
      return false

    try {
      await enviar(ctx, game)
      saveGame(game)
      return true
    } catch {
      usados.push(game.nome)
    }
  }

  return false
}

async function revelar(ctx) {
  const game = getGame(ctx.from)

  if (!game)
    return false

  removeGame(ctx.from)

  await base.sendText(
    ctx,
    mess.jogoQuizAnimaisRevelado(game.nome)
  )

  setTimeout(
    () => iniciar(ctx, [game.nome]).catch(() => {}),
    2200
  )

  return true
}

async function auto(ctx) {
  const game = getGame(ctx.from)

  if (!game)
    return false

  const texto = base.getBody(ctx)

  if (
    !texto ||
    base.norm(texto) !== base.norm(game.nome)
  )
    return false

  removeGame(ctx.from)

  await base.reactMsg(ctx, '🏆')

  await base.sendText(
    ctx,
    mess.jogoQuizAnimaisAcertou(
      ctx.sender,
      game.nome,
      base.mention
    ),
    [ctx.sender]
  )

  setTimeout(
    () => iniciar(ctx, [game.nome]).catch(() => {}),
    2200
  )

  return true
}

dylan.setCommand({
  nome: 'quizanimais',
  comandos: ['quizanimais'],
  categoria: 'jogos',
  info: {
    descricao: 'Descubra o animal mostrado na imagem.',
    uso: 'quizanimais',
    categoria: 'jogos'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!ctx.modoJogosAtivo(ctx.from, ctx.dataGp))
      return ctx.reply(
        ctx.mess.modoJogosDesativado(ctx.prefix)
      )

    const atual = getGame(ctx.from)

    if (atual)
      return enviar(ctx, atual)

    await ctx.reagir(ctx.from, '🐾').catch(() => {})

    if (!await iniciar(ctx))
      return ctx.reply(
        'Não consegui carregar uma imagem do Quiz Animais agora.'
      )
  }
})

module.exports = {
  getGame,
  saveGame,
  removeGame,
  criarGame,
  enviar,
  iniciar,
  revelar,
  auto
}
