/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "play_audio",
  comandos: ["play_audio"],
  categoria: "outros",
  info: {
    "descricao": "Executa o comando play_audio.",
    "uso": "play_audio",
    "categoria": "outros"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ɪɴsɪʀᴀ ᴏ ɴᴏᴍᴇ ᴏᴜ ʟɪɴᴋ ᴅᴀ ᴍᴜsɪᴄᴀ.*

      *📌 | ᴇxᴇᴍᴘʟᴏ:*
      > ${prefix + command} ᴠᴇᴍ ᴄᴀ`)
          await reagir(from, '🎧')
          await reply(mess.wait())
          const pesquisa = q.trim()
          const contextInfo = {
            ...newsletter,
            mentionedJid: [sender]
          }
          const apiUrl = `${API_URL}/api/youtube-audio?q=${encodeURIComponent(pesquisa)}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
          await tokito.sendMessage(from, {
            audio: { url: apiUrl },
            mimetype: 'audio/mpeg',
            fileName: 'audio.mp3',
            ptt: false,
            contextInfo
          }, {
            quoted: selo
          })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[PLAY AUDIO ERRO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
