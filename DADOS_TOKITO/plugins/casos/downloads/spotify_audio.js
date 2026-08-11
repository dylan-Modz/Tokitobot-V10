/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/spotify_audio')

module.exports = {
  nome: "spotify_audio",
  comandos: ["spotify_audio", "spotifymp3"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando spotify_audio.",
    "uso": "spotify_audio",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ sᴘᴏᴛɪғʏ.*\n\n> ${prefix + command} https://open.spotify.com/track/...`)
          await reagir(from, '🎧')
          await reply(mess.wait())
          await tokito.sendMessage(from, {
            audio: { url: scraper.url(q.trim()) },
            mimetype: 'audio/mpeg',
            fileName: 'spotify.mp3',
            ptt: false,
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[SPOTIFY AUDIO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
