/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "openai",
  comandos: ["openai", "gpt", "chatgpt"],
  categoria: "ia",
  info: {
    "descricao": "Executa o comando openai.",
    "uso": "openai",
    "categoria": "ia"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q)
            return reply('ᴅɪɢɪᴛᴇ sᴜᴀ ᴘᴇʀɢᴜɴᴛᴀ.')
          await reagir(from, '💬')
          const apiUrl = `${API_URL}/api/openai?q=${encodeURIComponent(q)}&apikey=${API_KEY_TOKITO}`
          const { data } = await axios.get(apiUrl)
          if (!data || !data.status || !data.resposta) {
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
