/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "quiz",
  comandos: ["quiz"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando quiz.",
    "uso": "quiz",
    "categoria": "jogos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!isGroup)
            return reply(mess.sogrupo())
          if (!modoJogosAtivo(from, dataGp))
            return reply(mess.modoJogosDesativado(prefix))
          const jogoExiste = getQuizGame(from)
          if (jogoExiste)
            return reply(mess.quizEmAndamento())
          const novoGame = criarQuizGame(from)
          if (!novoGame)
            return reply(mess.quizArquivoVazio())
          saveQuizGame(novoGame)
          await reagir(from, '🧠')
          await enviarQuiz(contextoJogos('quiz'), novoGame)
        }
        catch (e) {
          console.log('[QUIZ]', e?.message || e)
          await reply(mess.quizErro())
        }
      }
    }
  }
}
