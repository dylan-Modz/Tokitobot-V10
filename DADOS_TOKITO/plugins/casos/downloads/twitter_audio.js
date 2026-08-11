/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/twitter_audio')

module.exports = {
  nome: "twitter_audio",
  comandos: ["twitter_audio", "twitteraudio", "xaudio", "xmp3"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando twitter_audio.",
    "uso": "twitter_audio",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ᴛᴡɪᴛᴛᴇʀ/𝕏.*\n\n> ${prefix + command} https://x.com/...`)
          await reagir(from, '🎧')
          await tokito.sendMessage(from, {
            audio: { url: scraper.url(q.trim()) },
            mimetype: 'audio/mp4',
            ptt: false,
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[TWITTER AUDIO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
