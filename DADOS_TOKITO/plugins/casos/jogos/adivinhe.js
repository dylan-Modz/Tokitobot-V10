/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "adivinhe",
  comandos: ["adivinhe", "adivinheapalavra", "guessword"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando adivinhe.",
    "uso": "adivinhe",
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
          const jogoExiste = getAdivinheGame(from)
          if (jogoExiste)
            return reply(mess.adivinheEmAndamento())
          const novoGame = criarAdivinheGame(from)
          if (!novoGame)
            return reply(mess.adivinheArquivoVazio())
          saveAdivinheGame(novoGame)
          await reagir(from, '🧩')
          await enviarAdivinhe(contextoJogos(command), novoGame)
        }
        catch (e) {
          console.log('[ADIVINHE]', e?.message || e)
          await reply(mess.adivinheErro())
        }
      }
    }
  }
}
