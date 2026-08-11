/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/tiktok_audio')

module.exports = {
  nome: "tiktok_audio",
  comandos: ["tiktok_audio", "ttaudio"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando tiktok_audio.",
    "uso": "tiktok_audio",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ᴛɪᴋᴛᴏᴋ.*\n\n> ${prefix + command} https://tiktok.com/...`)
          await reagir(from, '🎧')
          await tokito.sendMessage(from, {
            audio: { url: scraper.url(q.trim()) },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[TIKTOK AUDIO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
