/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/applemusic')

module.exports = {
  nome: "applemusic",
  comandos: ["applemusic", "am"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando applemusic.",
    "uso": "applemusic",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴅᴀ ᴍᴜsɪᴄᴀ.*\n\n> ${prefix + command} ᴠᴇᴍ ᴄᴀ`)
          await reagir(from, '🍎')
          const dados = await scraper.buscar(q.trim())
          const res = dados?.resultado || dados?.result || dados?.data
          if (!res)
            return reply('*❌ | ᴍᴜsɪᴄᴀ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ.*')
          const titulo = res?.titulo || res?.title || 'Apple Music'
          const artista = res?.artista || res?.artist || 'Desconhecido'
          const album = res?.album || 'Desconhecido'
          const capa = achar(res?.capa, res?.thumbnail, res?.image)
          const link = achar(res?.download_url, res?.downloadUrl, res?.audio, res?.preview)
          if (!link)
            return reply('*❌ | ᴀ ᴀᴘɪ ɴᴀᴏ ʀᴇᴛᴏʀɴᴏᴜ ᴏ ᴀᴜᴅɪᴏ.*')
          const texto = `*🍎 | ᴀᴘᴘʟᴇ ᴍᴜsɪᴄ*\n\n- *🎶 | ᴛɪᴛᴜʟᴏ → ${titulo}*\n- *🎤 | ᴀʀᴛɪsᴛᴀ → ${artista}*\n- *💿 | ᴀʟʙᴜᴍ → ${album}*`
          if (capa)
            await tokito.sendMessage(from, {
              image: { url: capa },
              caption: texto,
              contextInfo: {
                ...newsletter,
                mentionedJid: [sender]
              }
            }, { quoted: selo })
          else
            await reply(texto)
          await tokito.sendMessage(from, {
            audio: { url: link },
            mimetype: link.includes('.m4a') ? 'audio/mp4' : 'audio/mpeg',
            fileName: `${limpar(titulo)}.mp3`,
            ptt: false,
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[APPLE MUSIC]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
