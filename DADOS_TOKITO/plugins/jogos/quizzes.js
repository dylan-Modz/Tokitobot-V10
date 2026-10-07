const dylan = require('../../database/lib/comandos')
const quizzes = require('./sistema-quizzes.js')

const comandos = [
  ['quizpokemon', 'pokemon'],
  ['quizcalculadora', 'calculadora'],
  ['quiztrivia', 'trivia'],
  ['quizgeografia', 'geografia'],
  ['quizfilme', 'filme']
]

for (const [nome, tipo] of comandos) {
  dylan.setCommand({
    nome,
    comandos: [nome],
    categoria: 'jogos',
    info: {
      descricao: `Executa o ${nome}.`,
      uso: nome,
      categoria: 'jogos'
    },
    async executar(ctx) {
      with (ctx) {
        try {
          if (!isGroup) return reply(mess.sogrupo())
          if (!modoJogosAtivo(from, dataGp)) return reply(mess.modoJogosDesativado(prefix))
          if (getQuizGame(from)) return reply(mess.quizEmAndamento())
          const resultado = await quizzes.iniciar(contextoJogos(nome), tipo)
          if (!resultado.ok && resultado.motivo === 'andamento')
            return reply(`- ⚠️ \`𝚀𝚄𝙸𝚉\`\n\n> ⚠️ ׄ ( ᴊᴀ́ ᴇxɪsᴛᴇ ᴜᴍ ᴅᴏs ɴᴏᴠᴏs ǫᴜɪᴢᴢᴇs ᴀᴛɪᴠᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ. 🙇‍♂️ )`)
          if (!resultado.ok) return reply(mess.quizArquivoVazio())
        }
        catch (e) {
          console.log(`[${nome.toUpperCase()}]`, e?.message || e)
          await reply(mess.quizErro())
        }
      }
    }
  })
}
