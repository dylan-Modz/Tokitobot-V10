/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "resetdama",
  comandos: ["resetdama"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando resetdama.",
    "uso": "resetdama",
    "categoria": "jogos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        const game = getDamaGame(from)
        if (!game)
          return reply(mess.damaSemPartida())
        removeDamaGame(from)
        await reply(mess.damaCancelada())
      }
    }
  }
}
