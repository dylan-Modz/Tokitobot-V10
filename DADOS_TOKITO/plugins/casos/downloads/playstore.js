/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/playstore')

module.exports = {
  nome: "playstore",
  comandos: ["playstore"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando playstore.",
    "uso": "playstore",
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
          const lista = Array.isArray(dados) ? dados.slice(0, 5) : itens(dados).slice(0, 5)
          if (!lista.length)
            return reply('*❌ | ɴᴇɴʜᴜᴍ ᴀᴘᴘ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
          let texto = `*📱 | ᴘʟᴀʏ sᴛᴏʀᴇ*\n\n- *🔎 | ʙᴜsᴄᴀ → ${q.trim()}*\n\n`
          for (let i = 0; i < lista.length; i++) {
            const item = lista[i]
            texto += `*${i + 1}. ${item?.nome || item?.name || item?.title || 'Aplicativo'}*\n- *🔗 | ʟɪɴᴋ → ${item?.link || item?.url || 'Indisponível'}*\n\n`
          }
          await reply(texto)
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[PLAYSTORE]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
