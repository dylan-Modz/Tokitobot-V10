/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "mines",
  comandos: ["mines"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando mines.",
    "uso": "mines",
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
          const jogoExiste = getMinesGame(from)
          if (jogoExiste)
            return reply(mess.minesEmAndamento())
          const novoGame = criarMinesGame(from, sender)
          saveMinesGame(novoGame)
          await reagir(from, '💣')
          await enviarMines(contextoJogos('mines'), novoGame)
        }
        catch (e) {
          console.log('[MINES]', e?.message || e)
          await reply(mess.minesErro())
        }
      }
    }
  }
}
