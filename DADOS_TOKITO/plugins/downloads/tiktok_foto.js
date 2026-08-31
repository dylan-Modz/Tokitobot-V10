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

const scraper = require('../../scrapers/downloads/tiktok_foto')
const dylan = require('../../database/lib/comandos')

const LIMITE_ALBUM = 10
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

dylan.setCommand({
  nome: 'tiktok_foto',
  comandos: ['tiktok_foto', 'ttfoto'],
  categoria: 'downloads',

  info: {
    descricao: 'Baixa as fotos de uma publicação do TikTok e envia em álbum.',
    uso: 'tiktok_foto link',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        const link = String(q || '').trim()

        if (!link) {
          return reply(
            mess.downloadUso({
              tipo: 'LINK TIKTOK',
              prefix,
              command,
              exemplo: 'https://tiktok.com/...'
            })
          )
        }

        await reagir(from, '🖼️')
        await reply(mess.wait())

        const todasFotos = (await scraper.fotos(link)).filter(Boolean)

        if (!todasFotos.length) {
          await reagir(from, '❌').catch(() => {})
          return reply(mess.downloadNaoEncontrado('FOTOS'))
        }

        for (let inicio = 0; inicio < todasFotos.length; inicio += LIMITE_ALBUM) {
          const fotos = todasFotos.slice(inicio, inicio + LIMITE_ALBUM)
          const numeroAlbum = Math.floor(inicio / LIMITE_ALBUM) + 1
          const totalAlbuns = Math.ceil(todasFotos.length / LIMITE_ALBUM)

          const album = await tokito.sendMessage(
            from,
            {
              album: {
                expectedImageCount: fotos.length,
                expectedVideoCount: 0
              },
              contextInfo: {
                ...newsletter,
                mentionedJid: [sender]
              }
            },
            {
              quoted: selo
            }
          )

          for (let i = 0; i < fotos.length; i++) {
            const primeiraFotoGeral = inicio === 0 && i === 0

            await tokito.sendMessage(
              from,
              {
                image: {
                  url: fotos[i]
                },
                caption: primeiraFotoGeral
                  ? `*🖼️ | ᴛɪᴋᴛᴏᴋ ғᴏᴛᴏ*\n\n` +
                    `- *📸 | ɪᴍᴀɢᴇɴs → ${todasFotos.length}*\n` +
                    `- *🔗 | ʟɪɴᴋ → ${link}*`
                  : undefined,
                albumParentKey: album.key,
                contextInfo: {
                  ...newsletter,
                  mentionedJid: [sender]
                }
              }
            )

            await sleep(150)
          }

          if (numeroAlbum < totalAlbuns) {
            await sleep(350)
          }
        }

        await reagir(from, '✅')
      } catch (e) {
        console.log(
          '[TIKTOK FOTO ALBUM]',
          modulos.sanitizarErro(e, [API_KEY_TOKITO])
        )

        await reagir(from, '❌').catch(() => {})
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})
