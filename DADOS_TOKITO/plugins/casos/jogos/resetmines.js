/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "resetmines",
  comandos: ["resetmines"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando resetmines.",
    "uso": "resetmines",
    "categoria": "jogos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        const game = getMinesGame(from)
        if (!game)
          return reply(mess.minesSemPartida())
        removeMinesGame(from)
        await reply(mess.minesCancelado())
      }
    }
  }
}
