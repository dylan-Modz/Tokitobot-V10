/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/aptoide')

module.exports = {
  nome: "aptoide",
  comandos: ["aptoide"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando aptoide.",
    "uso": "aptoide",
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
          const res = dados?.data || dados?.resultado || dados?.result
          if (!dados?.status || !res)
            return reply('*❌ | ᴀᴘᴘ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
          const nome = res?.name || res?.nome || 'Aplicativo'
          const capa = achar(res?.image, res?.icon, res?.thumbnail)
          const link = achar(res?.download, res?.url)
          const texto = `*📱 | ᴀᴘᴛᴏɪᴅᴇ*\n\n- *📦 | ɴᴏᴍᴇ → ${nome}*\n- *👨‍💻 | ᴅᴇᴠ → ${res?.developer || 'Desconhecido'}*\n- *💾 | ᴛᴀᴍᴀɴʜᴏ → ${res?.size || 'Desconhecido'}*\n- *⬇️ | ᴅᴏᴡɴʟᴏᴀᴅs → ${res?.stats?.downloads || 0}*`
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
          if (link)
            await tokito.sendMessage(from, {
              document: { url: link },
              mimetype: 'application/vnd.android.package-archive',
              fileName: `${limpar(nome)}.apk`,
              contextInfo: {
                ...newsletter,
                mentionedJid: [sender]
              }
            }, { quoted: selo })
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[APTOIDE]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
