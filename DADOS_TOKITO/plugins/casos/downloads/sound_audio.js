/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/sound_audio')

module.exports = {
  nome: "sound_audio",
  comandos: ["sound_audio", "soundcloudmp3", "scmp3"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando sound_audio.",
    "uso": "sound_audio",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ sᴏᴜɴᴅᴄʟᴏᴜᴅ.*\n\n> ${prefix + command} https://soundcloud.com/...`)
          await reagir(from, '☁️')
          await tokito.sendMessage(from, {
            audio: { url: scraper.url(q.trim()) },
            mimetype: 'audio/mpeg',
            fileName: 'soundcloud.mp3',
            ptt: false,
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[SOUND AUDIO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
