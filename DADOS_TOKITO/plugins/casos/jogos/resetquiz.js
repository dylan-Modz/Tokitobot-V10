/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "resetquiz",
  comandos: ["resetquiz"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando resetquiz.",
    "uso": "resetquiz",
    "categoria": "jogos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        const game = getQuizGame(from)
        if (!game)
          return reply(mess.quizSemPartida())
        removeQuizGame(from)
        await reply(mess.quizCancelado())
      }
    }
  }
}
