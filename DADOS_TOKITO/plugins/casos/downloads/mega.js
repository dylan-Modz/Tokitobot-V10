/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/mega')

module.exports = {
  nome: "mega",
  comandos: ["mega", "mg"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando mega.",
    "uso": "mega",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ᴍᴇɢᴀ.*\n\n> ${prefix + command} https://mega.nz/file/...`)
          await reagir(from, '📦')
          await reply(mess.wait())
          const res = await scraper.buscar(q.trim())
          if (!res?.status || !res?.download)
            return reply(res?.resultado || '*❌ | ᴀʀǫᴜɪᴠᴏ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
          const nome = limpar(res?.filename || decodeURIComponent(String(res.download).split('/').pop().split('?')[0]))
          await reply(`*📦 | ᴍᴇɢᴀ*\n\n- *📁 | ɴᴏᴍᴇ → ${nome}*\n- *📦 | ᴛᴀᴍᴀɴʜᴏ → ${res?.filesize || 'Desconhecido'}*`)
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
          console.log('[MEGA]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
