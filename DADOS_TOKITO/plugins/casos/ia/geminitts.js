/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "geminitts",
  comandos: ["geminitts", "ttsgemini"],
  categoria: "ia",
  info: {
    "descricao": "Executa o comando geminitts.",
    "uso": "geminitts",
    "categoria": "ia"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q)
            return reply(`${prefix + command} ᴛᴇxᴛᴏ`)
          await reagir(from, '🎧')
          const apiUrl = `${API_URL}/api/gemini-tts?texto=${encodeURIComponent(q)}&apikey=${API_KEY_TOKITO}`
          await tokito.sendMessage(from, {
            audio: {
              url: apiUrl
            },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: canalInfo([sender])
          }, {
            quoted: selo
          })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[ɢᴇᴍɪɴɪ ᴛᴛs ᴇʀʀᴏ]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌')
          return reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
