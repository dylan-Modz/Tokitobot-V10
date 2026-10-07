const dylan = require('../../database/lib/comandos')
const quizzes = require('./sistema-quizzes.js')

const tipos = {
  quizpokemon: 'pokemon',
  quizcalculadora: 'calculadora',
  quiztrivia: 'trivia',
  quizgeografia: 'geografia',
  quizfilme: 'filme'
}

dylan.setCommand({
  nome: 'quizpokemon',
  comandos: Object.keys(tipos),
  categoria: 'jogos',
  info: {
    descricao: 'Executa os quizzes temáticos do Tokito.',
    uso: 'quizpokemon | quizcalculadora | quiztrivia | quizgeografia | quizfilme',
    categoria: 'jogos'
  },
  async executar(ctx) {
    with (ctx) {
      const nome = String(command || '').toLowerCase()
      const tipo = tipos[nome]

      try {
        if (!tipo) return reply(mess.quizErro())
        if (!isGroup) return reply(mess.sogrupo())
        if (!modoJogosAtivo(from, dataGp)) return reply(mess.modoJogosDesativado(prefix))
        if (getQuizGame(from)) return reply(mess.quizEmAndamento())

        const resultado = await quizzes.iniciar(contextoJogos(nome), tipo)

        if (!resultado.ok && resultado.motivo === 'andamento')
          return reply(`- ⚠️ \`𝚀𝚄𝙸𝚉\`

> ⚠️ ׄ ( ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍ ᴅᴏs ɴᴏᴠᴏs ǫᴜɪᴢᴢᴇs ᴀᴛɪᴠᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`)

        if (!resultado.ok)
          return reply(mess.quizArquivoVazio())
      }
      catch (e) {
        console.log(`[${nome.toUpperCase()}]`, e?.message || e)
        await reply(mess.quizErro())
      }
    }
  }
})
