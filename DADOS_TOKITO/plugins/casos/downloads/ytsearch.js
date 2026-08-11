/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
const scraper = require('../../../scrapers/downloads/ytsearch')

module.exports = {
  nome: "ytsearch",
  comandos: ["ytsearch", "yts"],
  categoria: "downloads",
  info: {
    "descricao": "Executa o comando ytsearch.",
    "uso": "ytsearch",
    "categoria": "downloads"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!q || !q.trim())
            return reply(`*❌ | ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴅᴏ ᴠɪᴅᴇᴏ.*\n\n> ${prefix + command} ᴍᴀᴛᴜᴇ 1993`)
          await reagir(from, '🔎')
          await reply(mess.wait())
          const dados = await scraper.buscar(q.trim())
          const lista = itens(dados).slice(0, 5)
          if (!lista.length)
            return reply('*❌ | ɴᴇɴʜᴜᴍ ʀᴇsᴜʟᴛᴀᴅᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴏ.*')
          let texto = `*🔎 | ʏᴏᴜᴛᴜʙᴇ sᴇᴀʀᴄʜ*\n\n- *🔍 | ʙᴜsᴄᴀ → ${q.trim()}*\n\n`
          for (let i = 0; i < lista.length; i++) {
            const item = lista[i]
            texto += `*${i + 1}. ${item?.title || item?.titulo || 'Sem título'}*\n- *📺 | ᴄᴀɴᴀʟ → ${item?.author?.name || item?.canal || item?.channel || 'Desconhecido'}*\n- *⏱️ | ᴅᴜʀᴀᴄᴀᴏ → ${item?.timestamp || item?.duration || item?.duracao || '0:00'}*\n- *🔗 | ʟɪɴᴋ → ${item?.url || item?.link || ''}*\n\n`
          }
          const capa = achar(lista[0]?.thumbnail, lista[0]?.image, lista[0]?.thumb)
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
          await reagir(from, '✅')
        }
        catch (e) {
          console.log('[YTSEARCH]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
          await reagir(from, '❌').catch(() => {
          })
          await reply(mess.erroApi(API_URL))
        }
      }
    }
  }
}
