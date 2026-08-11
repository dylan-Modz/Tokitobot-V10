/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "dama",
  comandos: ["dama"],
  categoria: "jogos",
  info: {
    "descricao": "Executa o comando dama.",
    "uso": "dama",
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
          const jogoExiste = getDamaGame(from)
          if (jogoExiste)
            return reply(mess.damaEmAndamento())
          if (!menc_os2)
            return reply(mess.jogoMarquePessoa(prefix, command))
          if (mesmoJid(menc_os2, sender))
            return reply(mess.jogoNaoPodeDesafiar())
          const novoGame = {
            grupo: from,
            W: sender,
            B: menc_os2,
            status: false,
            turno: 'W',
            finalizado: false,
            vencedor: null,
            board: criarTabuleiroDama(),
            iniciadoEm: Date.now()
          }
          saveDamaGame(novoGame)
          await reagir(from, '⚫')
          await enviarTextoJogos(contextoJogos(command), mess.jogoConviteDama(mencionarJogo(menc_os2), mencionarJogo(sender), prefix), [menc_os2, sender], [
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
          console.log('[DAMA]', e?.message || e)
          await reply(mess.damaErro())
        }
      }
    }
  }
}
