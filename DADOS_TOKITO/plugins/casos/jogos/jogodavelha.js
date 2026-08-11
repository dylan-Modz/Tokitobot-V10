/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "jogodavelha",
  comandos: ["jogodavelha", "jogov", "jv", "velha"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando jogodavelha.",
    "uso": "jogodavelha",
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
          const jogoExiste = getVelhaGame(from)
          if (jogoExiste)
            return reply(mess.velhaEmAndamento())
          if (!menc_os2)
            return reply(mess.jogoMarquePessoa(prefix, command))
          if (mesmoJid(menc_os2, sender))
            return reply(mess.jogoNaoPodeDesafiar())
          const novoGame = {
            grupo: from,
            X: sender,
            O: menc_os2,
            board: criarTabuleiroVelha(),
            turno: 'X',
            status: false,
            finalizado: false,
            vencedor: null,
            iniciadoEm: Date.now()
          }
          saveVelhaGame(novoGame)
          await reagir(from, '❌')
          await enviarTextoJogos(contextoJogos(command), mess.jogoConviteVelha(mencionarJogo(menc_os2), mencionarJogo(sender), prefix), [menc_os2, sender], [
            {
              texto: mess.botaoAceitar(),
              id: 's'
            },
            {
              texto: mess.botaoRecusar(),
              id: 'n'
            }
          ])
        }
        catch (e) {
          console.log('[JOGO DA VELHA]', e?.message || e)
          await reply(mess.velhaErro())
        }
      }
    }
  }
}
