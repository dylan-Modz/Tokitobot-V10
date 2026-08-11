/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/playvideo')

module.exports = {
  nome: "playvideo",
  comandos: ["playvideo", "play-video", "ytvideo", "ytmp4", "play_video"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando playvideo.",
    "uso": "playvideo",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ɪɴsɪʀᴀ ᴏ ɴᴏᴍᴇ ᴏᴜ ʟɪɴᴋ ᴅᴏ ᴠɪᴅᴇᴏ.*

      *📌 | ᴇxᴇᴍᴘʟᴏ:*
      > ${prefix + command} ᴠᴇᴍ ᴄᴀ`)
          await reagir(from, '🎥')
          await reply(mess.wait())
          const pesquisa = q.trim()
          const contextInfo = {
            ...newsletter,
            mentionedJid: [sender]
          }
          const apiUrl = scraper.url(pesquisa)
          await tokito.sendMessage(from, {
            video: { url: apiUrl },
            mimetype: 'video/mp4',
            fileName: 'video.mp4',
            caption: `*🎥 | ᴘʟᴀʏ ᴠɪᴅᴇᴏ*

      - *👤 | ᴜsᴜᴀʀɪᴏ → ${pushname}*
      - *🤖 | ʙᴏᴛ → ${NomeDoBot}*`,
            contextInfo
          }, {
            quoted: selo
          })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[PLAY VIDEO ERRO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
