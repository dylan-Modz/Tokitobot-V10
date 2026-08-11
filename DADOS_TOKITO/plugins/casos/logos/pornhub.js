/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "pornhub",
  comandos: ["pornhub", "deadpool", "thor", "captainamerica"],
  categoria: "logos",
  info: {
    "descricao": "Executa o comando pornhub.",
    "uso": "pornhub",
    "categoria": "logos"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          const partes = String(q || '')
            .split('|')
            .map(item => item.trim())
          if (partes.length < 2 ||
            !partes[0] ||
            !partes[1]) {
            return reply(mess.usodupla(prefix, command))
          }
          await reagir(from, '🎨')
          const texto = `${partes[0]}|${partes[1]}`
          const url = `${API_URL}/api/${command}?texto=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
          await tokito.sendMessage(from, {
            image: { url },
            caption: mess.logofeita(command),
            contextInfo: canalInfo([sender])
          }, {
            quoted: selo
          })
          await reagir(from, '✅')
        }
        catch (erro) {
          console.log('[ERRO LOGO DUPLA]', modulos.sanitizarErro(erro, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          return reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
