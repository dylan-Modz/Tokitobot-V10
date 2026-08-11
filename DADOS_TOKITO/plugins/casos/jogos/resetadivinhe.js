/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "resetadivinhe",
  comandos: ["resetadivinhe", "resetguess", "rvadivinhe"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando resetadivinhe.",
    "uso": "resetadivinhe",
    "categoria": "jogos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        const game = getAdivinheGame(from)
        if (!game)
          return reply(mess.adivinheSemPartida())
        removeAdivinheGame(from)
        await reply(mess.adivinheCancelado())
      }
    }
  }
}
