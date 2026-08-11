/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/playdoc')

module.exports = {
  nome: "playdoc",
  comandos: ["playdoc"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando playdoc.",
    "uso": "playdoc",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴏᴜ ʟɪɴᴋ ᴅᴀ ᴍᴜsɪᴄᴀ.*\n\n*📌 | ᴇxᴇᴍᴘʟᴏ:*\n> ${prefix + command} ᴠᴇᴍ ᴄᴀ`)
          await reagir(from, '📄')
          await reply(mess.wait())
          const busca = q.trim()
          let link = busca
          if (!/^https?:\/\//i.test(busca)) {
            const dados = await scraper.buscar(busca)
            const lista = itens(dados)
            if (!lista.length)
              return reply('*❌ | ɴᴇɴʜᴜᴍ ʀᴇsᴜʟᴛᴀᴅᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
            link = lista[0]?.url || lista[0]?.link || busca
          }
          await tokito.sendMessage(from, {
            document: { url: scraper.url(link) },
            mimetype: 'audio/mpeg',
            fileName: `${limpar(busca)}.mp3`,
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[PLAYDOC]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
