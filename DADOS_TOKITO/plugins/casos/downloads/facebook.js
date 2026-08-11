/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/facebook')

module.exports = {
  nome: "facebook",
  comandos: ["facebook", "fb"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando facebook.",
    "uso": "facebook",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ғᴀᴄᴇʙᴏᴏᴋ.*\n\n> ${prefix + command} https://facebook.com/...`)
          await reagir(from, '🎥')
          await reply(mess.wait())
          await tokito.sendMessage(from, {
            video: { url: scraper.url(q.trim()) },
            mimetype: 'video/mp4',
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[FACEBOOK]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
