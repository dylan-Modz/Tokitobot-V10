/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "getperfil",
  comandos: ["getperfil"],
  categoria: "info",
  info: {
    "descricao": "Executa o comando getperfil.",
    "uso": "getperfil",
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
          const padrao = 'https://raw.githubusercontent.com/dylanModz/uploadsgg/main/midias/imagens/9841648c3df.jpg'
          await reagir(from, '⚡')
          await reply(mess.getPerfilCarregando())
          let foto = await tokito
            .profilePictureUrl(dados.consulta, 'image')
            .catch(() => null)
          if (!foto &&
            dados.consulta !== dados.alvo) {
            foto = await tokito
              .profilePictureUrl(dados.alvo, 'image')
              .catch(() => null)
          }
          if (!foto)
            foto = padrao
          await tokito.sendMessage(from, {
            image: {
              url: foto
            },
            caption: mess.getPerfilResultado({
              numero: dados.numero,
              prefix
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
          console.log('Erro getperfil:', e)
          await reagir(from, '❌').catch(() => {
          })
          return reply(mess.error())
        }
      }
    }
  }
}
