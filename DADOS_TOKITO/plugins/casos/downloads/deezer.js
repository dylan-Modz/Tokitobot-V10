/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/deezer')

module.exports = {
  nome: "deezer",
  comandos: ["deezer", "dplay"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando deezer.",
    "uso": "deezer",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴅᴀ ᴍᴜsɪᴄᴀ.*\n\n> ${prefix + command} ᴍᴄ ᴘᴏᴢᴇ`)
          await reagir(from, '🎧')
          const dados = await scraper.buscar(q.trim())
          const res = dados?.resultado || dados?.result || dados?.data
          if (!res)
            return reply('*❌ | ᴍᴜsɪᴄᴀ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ.*')
          const titulo = res?.tituloCompleto || res?.titulo || res?.titleFull || res?.title || 'Deezer'
          const artista = res?.artista || res?.artist || 'Desconhecido'
          const album = res?.album || 'Desconhecido'
          const capa = achar(res?.capa, res?.thumbnail, res?.image)
          const link = achar(res?.preview, res?.download_url, res?.downloadUrl, res?.audio)
          if (!link)
            return reply('*❌ | ᴀ ᴀᴘɪ ɴᴀᴏ ʀᴇᴛᴏʀɴᴏᴜ ᴏ ᴀᴜᴅɪᴏ.*')
          const texto = `*🎧 | ᴅᴇᴇᴢᴇʀ*\n\n- *🎶 | ᴛɪᴛᴜʟᴏ → ${titulo}*\n- *🎤 | ᴀʀᴛɪsᴛᴀ → ${artista}*\n- *💿 | ᴀʟʙᴜᴍ → ${album}*`
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
            mimetype: 'audio/mpeg',
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
          console.log('[DEEZER]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
