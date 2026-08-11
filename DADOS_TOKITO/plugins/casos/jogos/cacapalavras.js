/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "cacapalavras",
  comandos: ["cacapalavras", "cacapalavra", "caca"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando cacapalavras.",
    "uso": "cacapalavras",
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
          const jogoExiste = getCacaGame(from)
          if (jogoExiste)
            return reply(mess.cacaEmAndamento())
          const novoGame = criarCacaGame(from)
          if (!novoGame)
            return reply(mess.cacaArquivoVazio())
          saveCacaGame(novoGame)
          await reagir(from, '🔎')
          await enviarCaca(contextoJogos(command), novoGame)
        }
        catch (e) {
          console.log('[CAÇA-PALAVRAS]', e?.message || e)
          await reply(mess.cacaErro())
        }
      }
    }
  }
}
