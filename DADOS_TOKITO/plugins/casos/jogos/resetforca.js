/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "resetforca",
  comandos: ["resetforca", "rvforca"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando resetforca.",
    "uso": "resetforca",
    "categoria": "jogos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        const game = getForcaGame(from)
        if (!game)
          return reply(mess.forcaSemPartida())
        removeForcaGame(from)
        await reply(mess.forcaCancelada())
      }
    }
  }
}
