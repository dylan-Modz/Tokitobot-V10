/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "getbio",
  comandos: ["getbio"],
  categoria: "info",
  info: {
    "descricao": "Executa o comando getbio.",
    "uso": "getbio",
    "categoria": "info"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          const dados = await destino()
          if (!dados) {
            return reply(mess.getUsuarioUso({
              prefix,
              command
            }))
          }
          await reagir(from, '🗿')
          await reply(mess.getBioCarregando())
          let status = await tokito
            .fetchStatus(dados.consulta)
            .catch(() => null)
          if (!status &&
            dados.consulta !== dados.alvo) {
            status = await tokito
              .fetchStatus(dados.alvo)
              .catch(() => null)
          }
          const bio = status?.status?.status ||
            status?.status ||
            status?.[0]?.status?.status ||
            status?.[0]?.status ||
            'Privado ou sem recado'
          await tokito.sendMessage(from, {
            text: mess.getBioResultado({
              numero: dados.numero,
              bio
            }),
            mentions: [dados.mencao],
            contextInfo: {
              ...canalInfo([dados.mencao]),
              mentionedJid: [dados.mencao]
            }
          }, {
            quoted: selo
          })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('Erro getbio:', e)
          await reagir(from, '❌').catch(() => {
          })
          return reply(mess.error())
        }
      }
    }
  }
}
