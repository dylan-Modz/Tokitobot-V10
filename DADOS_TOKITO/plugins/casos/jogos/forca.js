/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "forca",
  comandos: ["forca"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando forca.",
    "uso": "forca",
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
          const jogoExiste = getForcaGame(from)
          if (jogoExiste)
            return reply(mess.forcaEmAndamento())
          const novoGame = criarForcaGame(from)
          if (!novoGame)
            return reply(mess.forcaArquivoVazio())
          saveForcaGame(novoGame)
          await reagir(from, '🔤')
          await enviarForca(contextoJogos('forca'), novoGame)
        }
        catch (e) {
          console.log('[FORCA]', e?.message || e)
          await reply(mess.forcaErro())
        }
      }
    }
  }
}
