const dylan = require('../../database/lib/comandos')
const base = require('./ignis.js')
const mess = require('../../mensagens/mensagens.js')

const CAPA = 'https://telegra.ph/file/8b3a18c452ce92dd2f996.jpg'
const arquivo = base.files.doulingo

const getGame = grupo => base.getGame(arquivo, grupo)
const saveGame = game => base.saveGame(arquivo, game)
const removeGame = grupo => base.removeGame(arquivo, grupo)

const embaralhar = lista => {
  const copia = [...lista]

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }

  return copia
}

function banco() {
  return base.getList(base.files.doulingoBanco)
    .filter(item => item && item.ingles && item.resposta_certa)
}

function criarGame(grupo) {
  const lista = banco()

  if (!lista.length)
    return null

  const item = lista[Math.floor(Math.random() * lista.length)]

  const respostas = [
    ...new Set(
      lista
        .map(x => String(x.resposta_certa).trim())
        .filter(Boolean)
    )
  ]

  const erradas = embaralhar(
    respostas.filter(
      x => base.norm(x) !== base.norm(item.resposta_certa)
    )
  ).slice(0, 2)

  const options = embaralhar([
    ...erradas,
    item.resposta_certa
  ])

  return {
    grupo,
    question: item.ingles,
    correctAnswer: item.resposta_certa,
    options,
    correta: options.findIndex(
      x => base.norm(x) === base.norm(item.resposta_certa)
    ) + 1,
    iniciadoEm: base.now()
  }
}

async function enviar(ctx, game) {
  const botoes = game.options.map((opcao, i) => ({
    texto: String(i + 1) + ' - ' + opcao,
    id: String(i + 1)
  }))

  try {
    return await base.sendImage(
      ctx,
      CAPA,
      mess.jogoDoulingo(game),
      [],
      botoes
    )
  } catch {
    return base.sendText(
      ctx,
      mess.jogoDoulingo(game),
      [],
      botoes
    )
  }
}

async function iniciar(ctx) {
  const game = criarGame(ctx.from)

  if (!game)
    return false

  await enviar(ctx, game)
  saveGame(game)

  return true
}

async function auto(ctx) {
  const game = getGame(ctx.from)

  if (!game)
    return false

  const texto = base.getBody(ctx)

  if (!/^[1-3]$/.test(texto))
    return false

  const resposta = Number(texto)

  if (resposta !== game.correta) {
    await base.reactMsg(ctx, '❌')
    await base.responder(ctx, mess.jogoDoulingoErrou())
    return true
  }

  removeGame(ctx.from)

  await base.reactMsg(ctx, '✅')
  await base.sendText(
    ctx,
    mess.jogoDoulingoAcertou(
      ctx.sender,
      game.correctAnswer,
      base.mention
    ),
    [ctx.sender]
  )

  setTimeout(
    () => iniciar(ctx).catch(() => {}),
    2200
  )

  return true
}

dylan.setCommand({
  nome: 'doulingo',
  comandos: ['doulingo', 'duolingo'],
  categoria: 'jogos',
  info: {
    descricao: 'Quiz de tradução do inglês para português.',
    uso: 'doulingo',
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

    await ctx.reagir(ctx.from, '🟩').catch(() => {})

    if (!await iniciar(ctx))
      return ctx.reply(
        'Não há perguntas disponíveis no Doulingo.'
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
  auto
}
