/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/tiktok_foto')

module.exports = {
  nome: "tiktok_foto",
  comandos: ["tiktok_foto", "ttfoto"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando tiktok_foto.",
    "uso": "tiktok_foto",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴇɴᴠɪᴇ ᴏ ʟɪɴᴋ ᴅᴏ ᴛɪᴋᴛᴏᴋ ᴄᴏᴍ ғᴏᴛᴏs.*\n\n> ${prefix + command} https://tiktok.com/...`)
          await reagir(from, '🖼️')
          await reply(mess.wait())
          const fotos = await scraper.fotos(q.trim())
          for (let i = 0; i < fotos.length; i++) {
            await tokito.sendMessage(from, {
              image: { url: fotos[i] },
              contextInfo: {
                ...newsletter,
                mentionedJid: [sender]
              }
            }, { quoted: i === 0 ? selo : undefined })
          }
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[TIKTOK FOTO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
