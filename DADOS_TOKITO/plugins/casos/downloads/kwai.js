/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/kwai')

module.exports = {
  nome: "kwai",
  comandos: ["kwai", "kwaivideo"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando kwai.",
    "uso": "kwai",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ᴋᴡᴀɪ.*\n\n> ${prefix + command} https://kwai-video.com/...`)
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
          console.log('[KWAI]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
