/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/capcut')

module.exports = {
  nome: "capcut",
  comandos: ["capcut", "capcutdl"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando capcut.",
    "uso": "capcut",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ᴄᴀᴘᴄᴜᴛ.*\n\n> ${prefix + command} https://www.capcut.com/...`)
          await reagir(from, '🎬')
          await reply(mess.wait())
          const dados = await scraper.buscar(q.trim())
          const res = dados?.resultado || dados?.result || dados?.data
          if (!res)
            return reply('*❌ | ᴠɪᴅᴇᴏ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
          const titulo = res?.title || res?.titulo || 'CapCut'
          const capa = achar(res?.thumbnail, res?.thumb, res?.image)
          const link = achar(res?.url, res?.download, res?.video)
          if (!link)
            return reply('*❌ | ᴀ ᴀᴘɪ ɴᴀᴏ ʀᴇᴛᴏʀɴᴏᴜ ᴏ ᴠɪᴅᴇᴏ.*')
          if (capa)
            await tokito.sendMessage(from, {
              image: { url: capa },
              caption: `*🎬 | ${titulo}*`,
              contextInfo: {
                ...newsletter,
                mentionedJid: [sender]
              }
            }, { quoted: selo })
          await tokito.sendMessage(from, {
            video: { url: link },
            mimetype: 'video/mp4',
            caption: `*🎬 | ${titulo}*`,
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          }, { quoted: capa ? undefined : selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[CAPCUT]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
