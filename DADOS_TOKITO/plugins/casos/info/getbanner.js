/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "getbanner",
  comandos: ["getbanner"],
  categoria: "info",
  info: {
    "descricao": "Executa o comando getbanner.",
    "uso": "getbanner",
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
          await reagir(from, '🖼️')
          await reply(mess.getBannerCarregando())
          let biz = await tokito
            .getBusinessProfile(dados.consulta)
            .catch(() => null)
          if (!biz &&
            dados.consulta !== dados.alvo) {
            biz = await tokito
              .getBusinessProfile(dados.alvo)
              .catch(() => null)
          }
          const banner = biz?.coverPhotoUrl ||
            biz?.cover_photo?.url ||
            biz?.coverPhoto?.url ||
            biz?.coverPhoto ||
            null
          if (!banner) {
            await reagir(from, '❌')
            return reply(mess.getBannerNaoEncontrado({
              numero: dados.numero
            }), [dados.mencao])
          }
          await tokito.sendMessage(from, {
            image: {
              url: banner
            },
            caption: mess.getBannerResultado({
              numero: dados.numero
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
          console.log('Erro getbanner:', e)
          await reagir(from, '❌').catch(() => {
          })
          return reply(mess.error())
        }
      }
    }
  }
}
