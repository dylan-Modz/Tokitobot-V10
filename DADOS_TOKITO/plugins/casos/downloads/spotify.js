/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada.
 *
 * Dev: dylan Modz.
 */

const scraper = require('../../../scrapers/downloads/spotify')

module.exports = {
  nome: "spotify",
  comandos: ["spotify", "sp"],
  categoria: "downloads",

  info: {
    descricao: "Executa o comando spotify.",
    uso: "spotify",
    categoria: "downloads"
  },

  async executar(ctx) {
    with (ctx) {
      try {
        if (!q || !q.trim()) {
          return reply(
            `*❌ | ᴅɪɢɪᴛᴇ ᴏ ɴᴏᴍᴇ ᴅᴀ ᴍᴜsɪᴄᴀ.*

*📌 | ᴇxᴇᴍᴘʟᴏ:*
> ${prefix + command} ᴠᴇᴍ ᴄᴀ`
          )
        }

        await reagir(from, '🎧')

        const dados = await scraper.buscar(q.trim())

        const res =
          dados?.resultado ||
          dados?.result ||
          dados?.data

        if (!res) {
          await reagir(from, '❌')

          return reply(
            '*❌ | ᴍᴜsɪᴄᴀ ɴᴀᴏ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ.*'
          )
        }

        const titulo =
          res?.titulo ||
          res?.title ||
          'Spotify'

        const artista =
          res?.artista ||
          res?.artist ||
          res?.artists ||
          'Desconhecido'

        const album =
          res?.album ||
          res?.album_name ||
          'Não informado'

        const duracao =
          res?.duracao ||
          res?.duration ||
          '0:00'

        const popularidade =
          res?.popularidade ??
          res?.popularity ??
          'Não informado'

        const lancamento =
          res?.lancamento ||
          res?.release_date_formatado ||
          res?.release_date ||
          'Não informado'

        const releaseAt =
          res?.release_at ||
          res?.releaseAt ||
          null

        const spotifyLink =
          res?.link ||
          res?.url ||
          res?.spotify_url ||
          'Não informado'

        const capa = achar(
          res?.capa,
          res?.thumbnail,
          res?.image,
          res?.cover
        )

        const link = achar(
          res?.download_url,
          res?.downloadUrl,
          res?.audio,
          res?.url_audio
        )

        if (!link) {
          await reagir(from, '❌')

          return reply(
            '*❌ | ᴀ ᴀᴘɪ ɴᴀᴏ ʀᴇᴛᴏʀɴᴏᴜ ᴏ ᴀᴜᴅɪᴏ.*'
          )
        }

        const numeroUsuario = sender.split('@')[0]

        const texto = `⏤͟͟͞͞𝐌𝐮́𝐬𝐢𝐜𝐚 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐝𝐚! 𖤐⃝🎧
•
> ╭ ℹ️ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒
> *[✏️]* • *𝚝𝚒́𝚝𝚞𝚕𝚘:* *${titulo}*
> *[👨‍🎤]* • *ᴀʀᴛɪsᴛᴀ:* ${artista}
> *[💿]* • *ᴀ́ʟʙᴜᴍ:* ${album}
> *[⏱️]* • *ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ:* ${duracao}
> *[🔥]* • *ᴘᴏᴘᴜʟᴀʀɪᴅᴀᴅᴇ:* ${popularidade}
> *[📆]* • *ʟᴀɴᴄ̧ᴀᴍᴇɴᴛᴏ:* ${lancamento}${releaseAt ? `\n> *[🗓️]* • *ᴅᴀᴛᴀ:* ${releaseAt}` : ''}
> *[🔗]* • *ʟɪɴᴋ:* ${spotifyLink}
•
> *[🎼]* • *𝙴𝚗𝚟𝚒𝚊𝚗𝚍𝚘 𝚘 𝚜𝚎𝚞 𝚊́𝚞𝚍𝚒𝚘* _@${numeroUsuario}_`

        const contextInfo = {
          ...newsletter,
          mentionedJid: [sender]
        }

        if (capa) {
          await tokito.sendMessage(
            from,
            {
              image: {
                url: capa
              },

              caption: texto,

              contextInfo
            },
            {
              quoted: selo
            }
          )
        } else {
          await tokito.sendMessage(
            from,
            {
              text: texto,
              contextInfo
            },
            {
              quoted: selo
            }
          )
        }

        await tokito.sendMessage(
          from,
          {
            audio: {
              url: link
            },

            mimetype: 'audio/mpeg',

            fileName: `${limpar(titulo)}.mp3`,

            ptt: false,

            contextInfo
          },
          {
            quoted: selo
          }
        )

        await reagir(from, '✅')
      } catch (e) {
        console.log(
          '[SPOTIFY]',
          modulos.sanitizarErro(
            e,
            [API_KEY_TOKITO]
          )
        )

        await reagir(from, '❌').catch(() => {})

        await reply(
          mess.erroApi(API_URL)
        )
      }
    }
  }
}