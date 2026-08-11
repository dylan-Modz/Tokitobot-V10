/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "perplexity",
  comandos: ["perplexity", "perplexityai", "ppx"],
  categoria: "ia",
  info: {
    "descricao": "Executa o comando perplexity.",
    "uso": "perplexity",
    "categoria": "ia"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q)
            return reply('ᴅɪɢɪᴛᴇ sᴜᴀ ᴘᴇʀɢᴜɴᴛᴀ.')
          await reagir(from, '🧠')
          const pergunta = encodeURIComponent(q.trim())
          const apiUrl = `${API_URL}/api/perplexity-ai?q=${pergunta}&query=${pergunta}&apikey=${API_KEY_TOKITO}`
          const { data } = await axios.get(apiUrl)
          if (!data || data.status !== true || !data.resposta) {
            await reagir(from, '❌')
            return reply('ᴇʀʀᴏ ᴀᴏ ᴏʙᴛᴇʀ ʀᴇsᴘᴏsᴛᴀ.')
          }
          await reply(data.resposta)
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[API]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌')
          reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
