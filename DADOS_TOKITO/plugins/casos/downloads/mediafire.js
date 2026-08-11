/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/mediafire')

module.exports = {
  nome: "mediafire",
  comandos: ["mediafire", "mf"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando mediafire.",
    "uso": "mediafire",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ᴍᴇᴅɪᴀғɪʀᴇ.*\n\n> ${prefix + command} https://www.mediafire.com/file/...`)
          await reagir(from, '📦')
          await reply(mess.wait())
          const res = await scraper.buscar(q.trim())
          if (!res?.status || !res?.download)
            return reply(res?.resultado || '*❌ | ᴀʀǫᴜɪᴠᴏ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
          const nome = limpar(res?.filename || decodeURIComponent(String(res.download).split('/').pop().split('?')[0]))
          await reply(`*📦 | ᴍᴇᴅɪᴀғɪʀᴇ*\n\n- *📁 | ɴᴏᴍᴇ → ${nome}*\n- *📦 | ᴛᴀᴍᴀɴʜᴏ → ${res?.filesize || 'Desconhecido'}*`)
          await tokito.sendMessage(from, {
            document: { url: res.download },
            mimetype: res?.mimetype || 'application/octet-stream',
            fileName: nome,
            contextInfo: {
              ...newsletter,
              mentionedJid: [sender]
            }
          }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[MEDIAFIRE]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
