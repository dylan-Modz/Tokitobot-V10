const dylan = require('../../database/lib/comandos')
const velha = require('./sistema-jogodavelha.js')
const velha2 = require('./jogodavelha2.js')
const dama = require('./sistema-dama.js')
const forca = require('./sistema-forca.js')
const caca = require('./sistema-cacapalavras.js')
const adivinhe = require('./sistema-adivinhe.js')
const quiz = require('./sistema-quiz.js')
const mines = require('./sistema-mines.js')
const doulingo = require('./doulingo.js')
const anagrama = require('./anagrama.js')
const quizanimais = require('./quizanimais.js')
const quizzes = require('./quizzes.js')

const mapa = {
  velha: {
    nome: 'Jogo da Velha',
    reset: grupo =>
      velha.removeGame(grupo) ||
      velha2.removeGame(grupo)
  },

  jogodavelha: {
    nome: 'Jogo da Velha',
    reset: grupo =>
      velha.removeGame(grupo) ||
      velha2.removeGame(grupo)
  },

  velha2: {
    nome: 'Jogo da Velha 2',
    reset: grupo => velha2.removeGame(grupo)
  },

  jogodavelha2: {
    nome: 'Jogo da Velha 2',
    reset: grupo => velha2.removeGame(grupo)
  },

  jv2: {
    nome: 'Jogo da Velha 2',
    reset: grupo => velha2.removeGame(grupo)
  },

  dama: {
    nome: 'Dama',
    reset: grupo => dama.removeGame(grupo)
  },

  forca: {
    nome: 'Forca',
    reset: grupo => forca.removeGame(grupo)
  },

  caca: {
    nome: 'Caca-palavras',
    reset: grupo => caca.removeGame(grupo)
  },

  cacapalavras: {
    nome: 'Caca-palavras',
    reset: grupo => caca.removeGame(grupo)
  },

  adivinhe: {
    nome: 'Adivinhe',
    reset: grupo => adivinhe.removeGame(grupo)
  },

  quiz: {
    nome: 'Quiz',
    reset: grupo => quiz.removeGame(grupo)
  },

  mines: {
    nome: 'Campo Minado',
    reset: grupo => mines.removeGame(grupo)
  },

  doulingo: {
    nome: 'Doulingo',
    reset: grupo => doulingo.removeGame(grupo)
  },

  duolingo: {
    nome: 'Doulingo',
    reset: grupo => doulingo.removeGame(grupo)
  },

  anagrama: {
    nome: 'Anagrama',
    reset: grupo => anagrama.removeGame(grupo)
  },

  quizanimais: {
    nome: 'Quiz Animais',
    reset: grupo => quizanimais.removeGame(grupo)
  },

  animais: {
    nome: 'Quiz Animais',
    reset: grupo => quizanimais.removeGame(grupo)
  },

  quizpokemon: {
    nome: 'Quiz Pokémon',
    reset: grupo => quizzes.removeGame(grupo)
  },

  quizcalculadora: {
    nome: 'Quiz Calculadora',
    reset: grupo => quizzes.removeGame(grupo)
  },

  quiztrivia: {
    nome: 'Quiz Trivia',
    reset: grupo => quizzes.removeGame(grupo)
  },

  quizgeografia: {
    nome: 'Quiz Geografia',
    reset: grupo => quizzes.removeGame(grupo)
  },

  quizfilme: {
    nome: 'Quiz Filmes',
    reset: grupo => quizzes.removeGame(grupo)
  }
}

const cancelaveis = [
  {
    nome: 'Jogo da Velha',
    reset: grupo =>
      velha.removeGame(grupo) ||
      velha2.removeGame(grupo)
  },
  {
    nome: 'Dama',
    reset: grupo => dama.removeGame(grupo)
  },
  {
    nome: 'Forca',
    reset: grupo => forca.removeGame(grupo)
  },
  {
    nome: 'Caca-palavras',
    reset: grupo => caca.removeGame(grupo)
  },
  {
    nome: 'Adivinhe',
    reset: grupo => adivinhe.removeGame(grupo)
  },
  {
    nome: 'Quiz',
    reset: grupo => quiz.removeGame(grupo)
  },
  {
    nome: 'Campo Minado',
    reset: grupo => mines.removeGame(grupo)
  },
  {
    nome: 'Doulingo',
    reset: grupo => doulingo.removeGame(grupo)
  },
  {
    nome: 'Anagrama',
    reset: grupo => anagrama.removeGame(grupo)
  },
  {
    nome: 'Quiz Animais',
    reset: grupo => quizanimais.removeGame(grupo)
  },
  {
    nome: 'Quiz',
    reset: grupo => quizzes.removeGame(grupo)
  }
]

function cancelarAtual(grupo) {
  for (const item of cancelaveis) {
    if (item.reset(grupo))
      return item
  }

  return null
}

dylan.setCommand({
  nome: 'rv',
  comandos: [
    'rv',
    'resetjogo',
    'resetarjogo',
    'cancelarjogo',
    'cancelarpartida'
  ],
  categoria: 'jogos',
  info: {
    descricao: 'Reseta ou cancela uma partida em andamento.',
    uso: 'rv velha | cancelarjogo',
    categoria: 'jogos'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    const comando = String(
      ctx.command || ''
    ).trim().toLowerCase()

    const nome = String(
      ctx.args?.[0] || ''
    ).trim().toLowerCase()

    if (
      !nome &&
      ['cancelarjogo', 'cancelarpartida'].includes(comando)
    ) {
      const item = cancelarAtual(ctx.from)

      if (!item)
        return ctx.reply(
          ctx.mess.jogoResetVazio('jogo')
        )

      await ctx.reagir(
        ctx.from,
        '♻️'
      ).catch(() => {})

      return ctx.reply(
        ctx.mess.jogoResetOk(item.nome)
      )
    }

    if (!nome || !mapa[nome])
      return ctx.reply(
        ctx.mess.jogoResetUso(ctx.prefix)
      )

    const item = mapa[nome]
    const removeu = item.reset(ctx.from)

    if (!removeu)
      return ctx.reply(
        ctx.mess.jogoResetVazio(item.nome)
      )

    await ctx.reagir(
      ctx.from,
      '♻️'
    ).catch(() => {})

    return ctx.reply(
      ctx.mess.jogoResetOk(item.nome)
    )
  }
})
