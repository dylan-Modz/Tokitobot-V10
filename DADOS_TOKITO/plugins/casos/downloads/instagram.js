/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/instagram')

module.exports = {
  nome: "instagram",
  comandos: ["instagram", "insta"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando instagram.",
    "uso": "instagram",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ɪɴsᴛᴀɢʀᴀᴍ.*\n\n> ${prefix + command} https://instagram.com/reel/...`)
          await reagir(from, '📸')
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
          console.log('[INSTAGRAM]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
