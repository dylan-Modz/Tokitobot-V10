/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

const axios = require('axios')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: "play",
  comandos: ["play", "ytplay"],
  categoria: "downloads",

  info: {
    descricao: "Executa o comando play.",
    uso: "play",
    categoria: "downloads"
  },

  async executar(ctx) {
    with (ctx) {
      try {
        if (!q || !q.trim()) {
          return reply(mess.downloadUso({ tipo: 'MÚSICA', prefix, command, exemplo: 'vem ca' }))
        }

        await reagir(from, '🎧')

        const contextInfo = {
          ...newsletter,
          mentionedJid: [sender]
        }

        const pesquisa = q.trim()

        const buscaApi =
          `${API_URL}/api/youtube-search` +
          `?query=${encodeURIComponent(pesquisa)}` +
          `&apikey=${encodeURIComponent(API_KEY_TOKITO)}`

        const response = await axios.get(
          buscaApi,
          {
            timeout: 20000,
            validateStatus: () => true
          }
        )

        if (
          response.status !== 200 ||
          response.data?.status !== true ||
          !Array.isArray(response.data?.resultado) ||
          !response.data.resultado.length
        ) {
          await reagir(from, '❌')

          return reply(mess.downloadNaoEncontrado('ÁUDIO'))
        }

        const res =
          response.data.resultado.find(
            item =>
              item?.type === 'video' &&
              item?.videoId &&
              item?.url
          ) ||
          response.data.resultado[0]

        if (!res?.url) {
          await reagir(from, '❌')

          return reply(mess.downloadNaoEncontrado('ÁUDIO'))
        }

        const title = String(
          res?.title ||
          pesquisa ||
          'Música não encontrada'
        )

        const canal = String(
          res?.author?.name ||
          'Desconhecido'
        )

        const duration = String(
          res?.timestamp ||
          res?.duration?.timestamp ||
          res?.duration ||
          '0:00'
        )

        const views = String(
          res?.views ||
          '0'
        )
          .replace(/\s*views?/gi, '')
          .trim()

        const thumbnail =
          res?.image ||
          res?.thumbnail ||
          (
            res?.videoId
              ? `https://i.ytimg.com/vi/${res.videoId}/hq720.jpg`
              : null
          )

        const url = String(
          res?.url ||
          `https://www.youtube.com/watch?v=${res?.videoId}`
        )

        const nomeArquivo =
          `${title}.mp3`
            .replace(/[\\/:*?"<>|]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 100)

        const audioApi =
          `${API_URL}/api/youtube-audio` +
          `?q=${encodeURIComponent(url)}` +
          `&apikey=${encodeURIComponent(API_KEY_TOKITO)}`

        const numeroUsuario =
          sender.split('@')[0]

        const texto = `⏤͟͟͞͞𝐌𝐮́𝐬𝐢𝐜𝐚 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐝𝐚! 𖤐⃝🎧
•
> ╭ ℹ️ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒
> *[✏️]* • *𝚝𝚒́𝚝𝚞𝚕𝚘:* *${title}*
> *[⏱️]* • *ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ:* ${duration}
> *[👥]* • *ᴠɪᴇᴡs:* ${views}
> *[👨‍🎤]* • *ᴀᴜᴛᴏʀ:* ${canal}
> *[🔗]* • *ʟɪɴᴋ:* ${url}
•`

        const enviandoAudio =
          `> *[🎼]* • *𝙴𝚗𝚟𝚒𝚊𝚗𝚍𝚘 𝚘 𝚜𝚎𝚞 𝚊́𝚞𝚍𝚒𝚘* _@${numeroUsuario}_`

        if (isBotoes) {
          try {
            let header

            if (thumbnail) {
              const media =
                await prepareWAMessageMedia(
                  {
                    image: {
                      url: thumbnail
                    }
                  },
                  {
                    upload: tokito.waUploadToServer
                  }
                )

              header =
                proto.Message.InteractiveMessage.Header.create({
                  hasMediaAttachment: true,
                  imageMessage: media.imageMessage
                })
            }

            const mensagemInterativa = {
              contextInfo,

              body:
                proto.Message.InteractiveMessage.Body.create({
                  text: `${texto}

> *[🎼]* • *𝙴𝚜𝚌𝚘𝚕𝚑𝚊 𝚌𝚘𝚖𝚘 𝚍𝚎𝚜𝚎𝚓𝚊 𝚋𝚊𝚒𝚡𝚊𝚛*`
                }),

              footer:
                proto.Message.InteractiveMessage.Footer.create({
                  text: ''
                }),

              nativeFlowMessage:
                proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons: [
                    {
                      name: 'quick_reply',

                      buttonParamsJson: JSON.stringify({
                        display_text: '🎧﹚𝐀́𝐔𝐃𝐈𝐎﹙🎧',
                        id: `${prefix}play_audio ${url}`
                      })
                    },

                    {
                      name: 'quick_reply',

                      buttonParamsJson: JSON.stringify({
                        display_text: '🎬﹚𝐕𝐈́𝐃𝐄𝐎﹙🎬',
                        id: `${prefix}play_video ${url}`
                      })
                    },

                    {
                      name: 'quick_reply',

                      buttonParamsJson: JSON.stringify({
                        display_text: '📄﹚𝐃𝐎𝐂𝐔𝐌𝐄𝐍𝐓𝐎﹙📄',
                        id: `${prefix}playdoc ${url}`
                      })
                    }
                  ]
                })
            }

            if (header) {
              mensagemInterativa.header = header
            }

            const msg =
              generateWAMessageFromContent(
                from,
                {
                  interactiveMessage:
                    proto.Message.InteractiveMessage.create(
                      mensagemInterativa
                    )
                },
                {
                  quoted: selo,
                  userJid: tokito.user.id
                }
              )

            await tokito.relayMessage(
              from,
              msg.message,
              {
                messageId: msg.key.id
              }
            )

            await reagir(from, '✅')

            return

          } catch (e) {
            console.log(
              '[PLAY BOTÕES]',
              modulos.sanitizarErro(
                e,
                [API_KEY_TOKITO]
              )
            )
          }
        }

        if (thumbnail) {
          await tokito.sendMessage(
            from,
            {
              image: {
                url: thumbnail
              },

              caption: `${texto}

${enviandoAudio}`,

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
              text: `${texto}

${enviandoAudio}`,

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
              url: audioApi
            },

            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: nomeArquivo,
            contextInfo
          },
          {
            quoted: selo
          }
        )

        await reagir(from, '✅')

      } catch (e) {
        console.log(
          '[PLAY ERRO]',
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
)
