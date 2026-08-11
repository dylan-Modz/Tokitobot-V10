/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "tokito-ia",
  comandos: ["tokito-ia"],
  categoria: "ia",
  info: {
    "descricao": "Executa o comando tokito-ia.",
    "uso": "tokito-ia",
    "categoria": "ia"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply('*❌ | Faça uma pergunta para a Tokito IA.*')
          await reagir(from, '🧊')
          const apiUrl = `${API_URL}/api/tokito-ia?texto=${encodeURIComponent(q.trim())}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
          const { data } = await axios.get(apiUrl, { timeout: 90000 })
          const resposta = String(data?.resposta ||
            data?.resultado ||
            data?.result ||
            data?.message ||
            data?.texto ||
            '').trim()
          if (!resposta) {
            await reagir(from, '❌')
            return reply('*❌ | A Tokito IA não retornou nenhuma resposta.*')
          }
          await tokito.sendMessage(from, {
            text: resposta,
            contextInfo: canalInfo([sender])
          }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (error) {
          console.log('[TOKITO IA ERRO]', modulos.sanitizarErro(error, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
