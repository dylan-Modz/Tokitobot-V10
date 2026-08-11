/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/tiktoksearch')

module.exports = {
  nome: "tiktoksearch",
  comandos: ["tiktoksearch"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando tiktoksearch.",
    "uso": "tiktoksearch",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴅᴏ ᴠɪᴅᴇᴏ.*\n\n> ${prefix + command} ᴇᴅɪᴛ ᴛᴏᴋɪᴛᴏ`)
          await reagir(from, '🔎')
          await reply(mess.wait())
          const dados = await scraper.buscar(q.trim())
          const lista = itens(dados)
          if (!lista.length)
            return reply('*❌ | ɴᴇɴʜᴜᴍ ᴠɪᴅᴇᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
          const item = lista[Math.floor(Math.random() * lista.length)]
          const link = achar(item?.video_sem_marca, item?.video, item?.download, item?.url)
          if (!link)
            return reply('*❌ | ᴀ ᴀᴘɪ ɴᴀᴏ ʀᴇᴛᴏʀɴᴏᴜ ᴏ ᴠɪᴅᴇᴏ.*')
          await tokito.sendMessage(from, {
            video: { url: link },
            mimetype: 'video/mp4',
            caption: item?.titulo || item?.title || undefined,
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[TIKTOK SEARCH]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
