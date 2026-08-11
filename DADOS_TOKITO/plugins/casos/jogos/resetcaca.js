/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "resetcaca",
  comandos: ["resetcaca", "cancelarcaca"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando resetcaca.",
    "uso": "resetcaca",
    "categoria": "jogos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        const game = getCacaGame(from)
        if (!game)
          return reply(mess.cacaSemPartida())
        removeCacaGame(from)
        await reply(mess.cacaCancelada())
      }
    }
  }
}
