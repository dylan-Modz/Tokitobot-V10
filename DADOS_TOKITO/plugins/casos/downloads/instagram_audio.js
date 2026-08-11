/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/instagram_audio')

module.exports = {
  nome: "instagram_audio",
  comandos: ["instagram_audio", "insta_audio"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando instagram_audio.",
    "uso": "instagram_audio",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ɪɴsᴛᴀɢʀᴀᴍ.*\n\n> ${prefix + command} https://instagram.com/reel/...`)
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
          console.log('[INSTAGRAM AUDIO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
