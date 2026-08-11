/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/happymod')

module.exports = {
  nome: "happymod",
  comandos: ["happymod"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando happymod.",
    "uso": "happymod",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴅᴏ ᴀᴘᴘ.*\n\n> ${prefix + command} ᴡʜᴀᴛsᴀᴘᴘ`)
          await reagir(from, '📱')
          await reply(mess.wait())
          const dados = await scraper.buscar(q.trim())
          const lista = itens(dados).slice(0, 5)
          if (!lista.length)
            return reply('*❌ | ɴᴇɴʜᴜᴍ ᴀᴘᴘ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
          let texto = `*📱 | ʜᴀᴘᴘʏᴍᴏᴅ*\n\n- *🔎 | ʙᴜsᴄᴀ → ${q.trim()}*\n\n`
          for (let i = 0; i < lista.length; i++) {
            const item = lista[i]
            texto += `*${i + 1}. ${item?.title || item?.nome || 'Aplicativo'}*\n- *🧩 | ᴠᴇʀsᴀᴏ → ${item?.version || 'Indisponível'}*\n- *💾 | ᴛᴀᴍᴀɴʜᴏ → ${item?.size || 'Indisponível'}*\n- *🔗 | ʟɪɴᴋ → ${item?.url || item?.link || 'Indisponível'}*\n\n`
          }
          await reply(texto)
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[HAPPYMOD]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
