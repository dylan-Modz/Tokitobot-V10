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
const { spawn } = require('child_process')
const { sendInteractiveMessage } = require('@stone-wpp/ofc')

// Mesmo tratamento de capa usado no Play2: JPEG quadrado, sem metadados
// e qualidade 60. Faz a conversao em memoria para nao criar arquivos no bot.
const executarImagem = (programa, argumentos, imagem) => new Promise((resolve, reject) => {
  let encerrado = false
  let total = 0
  const partes = []
  let erro = ''

  const filho = spawn(programa, argumentos, {
    stdio: ['pipe', 'pipe', 'pipe']
  })

  const finalizar = (falha, resultado) => {
    if (encerrado) return
    encerrado = true
    clearTimeout(limite)
    if (falha) reject(falha)
    else resolve(resultado)
  }

  const limite = setTimeout(() => {
    filho.kill('SIGKILL')
    finalizar(new Error('Tempo limite ao converter a capa'))
  }, 12000)

  filho.on('error', finalizar)
  filho.stdin.on('error', () => {})
  filho.stdout.on('data', parte => {
    total += parte.length
    if (total > 4 * 1024 * 1024) {
      filho.kill('SIGKILL')
      finalizar(new Error('Capa convertida muito grande'))
      return
    }
    partes.push(parte)
  })
  filho.stderr.on('data', parte => {
    if (erro.length < 500) erro += String(parte).slice(0, 500)
  })
  filho.on('close', codigo => {
    if (codigo !== 0) return finalizar(new Error(erro || 'Falha ao converter a capa'))
    finalizar(null, Buffer.concat(partes))
  })

  filho.stdin.end(imagem)
})

const converterCapa = async imagem => {
  const args = [
    '-', '-auto-orient',
    '-resize', '300x300^',
    '-gravity', 'center',
    '-extent', '300x300',
    '-strip', '-quality', '60',
    'jpeg:-'
  ]

  let falha
  for (const executavel of ['magick', 'convert']) {
    try {
      const capa = await executarImagem(executavel, args, imagem)
      if (capa.length > 3 && capa[0] === 0xff && capa[1] === 0xd8) return capa
    } catch (error) {
      falha = error
    }
  }

  // Hospedagens com ffmpeg mas sem ImageMagick tambem conseguem gerar JPEG.
  try {
    const capa = await executarImagem('ffmpeg', [
      '-hide_banner', '-loglevel', 'error',
      '-i', 'pipe:0',
      '-vf', 'scale=300:300:force_original_aspect_ratio=increase,crop=300:300',
      '-frames:v', '1',
      '-q:v', '5',
      '-f', 'image2pipe', '-vcodec', 'mjpeg', 'pipe:1'
    ], imagem)
    if (capa.length > 3 && capa[0] === 0xff && capa[1] === 0xd8) return capa
  } catch (error) {
    falha = error
  }

  throw falha || new Error('Nao foi possivel preparar a capa')
}

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

        const texto = `• \`𝙼𝚄́𝚂𝙸𝙲𝙰 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰\` 🎧
> ℹ️ \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂\`
> ✏️ ᴛɪ́ᴛᴜʟᴏ: ${title}
> ⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ${duration}
> 👥 ᴠɪᴇᴡs: ${views}
> 👨‍🎤 ᴀᴜᴛᴏʀ: ${canal}
> 🔗 ʟɪɴᴋ: ${url}`

        const enviandoAudio =
          `> 🎼 ᴇɴᴠɪᴀɴᴅᴏ ᴏ sᴇᴜ ᴀ́ᴜᴅɪᴏ para @${numeroUsuario}`

        if (isBotoes) {
          // Play2: botoes tradicionais com visual de localizacao e miniatura JPEG.
          // O selo aqui e somente a mensagem citada; nao adiciona verificacao Meta.
          try {
            // A capa devolvida pela pesquisa tem prioridade sobre o mapa
            // e sobre as miniaturas genericas do YouTube.
            const fontes = [
              res?.image,
              res?.thumbnail,
              res?.thumbnails?.[0]?.url,
              thumbnail,
              res?.videoId ? 'https://i.ytimg.com/vi/' + res.videoId + '/hq720.jpg' : null,
              res?.videoId ? 'https://i.ytimg.com/vi/' + res.videoId + '/hqdefault.jpg' : null
            ].filter(valor => typeof valor === 'string' && /^https?:\/\//i.test(valor))

            let jpegThumbnail = null
            let erroCapa = null

            for (const fonte of [...new Set(fontes)]) {
              try {
                const imagem = await axios.get(fonte, {
                  responseType: 'arraybuffer',
                  timeout: 12000,
                  maxContentLength: 8 * 1024 * 1024,
                  maxBodyLength: 8 * 1024 * 1024
                })

                const original = Buffer.from(imagem.data || [])
                if (!original.length) throw new Error('Imagem vazia')

                jpegThumbnail = await converterCapa(original)
                break
              } catch (error) {
                erroCapa = error
              }
            }

            if (!jpegThumbnail) throw erroCapa || new Error('Capa indisponivel')

            const buttons = [
              {
                buttonId: `${prefix}play_audio ${url}`,
                buttonText: { displayText: '🎧﹚𝐀́𝐔𝐃𝐈𝐎﹙🎧' },
                type: 1
              },
              {
                buttonId: `${prefix}play_video ${url}`,
                buttonText: { displayText: '🎬﹚𝐕𝐈́𝐃𝐄𝐎﹙🎬' },
                type: 1
              },
              {
                buttonId: `${prefix}playdoc ${url}`,
                buttonText: { displayText: '📄﹚𝐃𝐎𝐂𝐔𝐌𝐄𝐍𝐓𝐎﹙📄' },
                type: 1
              }
            ]

            await sendInteractiveMessage(
              tokito,
              from,
              {
                buttonsMessage: {
                  contentText: `${texto}\n\n> *[🎼]* • *𝙴𝚜𝚌𝚘𝚕𝚑𝚊 𝚌𝚘𝚖𝚘 𝚍𝚎𝚜𝚎𝚓𝚊 𝚋𝚊𝚒𝚡𝚊𝚛*`,
                  footerText: '',
                  headerType: 6,
                  locationMessage: {
                    degreesLatitude: 0,
                    degreesLongitude: 0,
                    name: title,
                    address: canal,
                    jpegThumbnail
                  },
                  buttons
                }
              },
              { quoted: selo, mentions: [sender] }
            )

            await reagir(from, '✅')
            return
          } catch (e) {
            console.log(
              '[PLAY LOCALIZACAO]',
              modulos.sanitizarErro(e, [API_KEY_TOKITO])
            )
            // Caso a localizacao nao seja aceita, mantem os botoes atuais.
          }

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
