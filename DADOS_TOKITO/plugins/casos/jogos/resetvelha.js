/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "resetvelha",
  comandos: ["resetvelha", "resetarvelha", "resetavelha", "resetarv", "resetav", "rv"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando resetvelha.",
    "uso": "resetvelha",
    "categoria": "jogos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        const game = getVelhaGame(from)
        if (!game)
          return reply(mess.velhaSemPartida())
        removeVelhaGame(from)
        await reply(mess.velhaCancelada())
      }
    }
  }
}
