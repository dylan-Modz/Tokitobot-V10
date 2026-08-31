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

const { prepareWAMessageMedia } = require('baileys')
const api = require('../../scrapers/downloads/pesquisas')
const dylan = require('../../database/lib/comandos')

function botaoImagem(emoji, texto, url) {
  return {
    name: 'cta_url',
    buttonParamsJson: JSON.stringify({
      display_text: `${emoji} ${texto}`,
      url
    })
  }
}

dylan.setCommand({
  nome: 'metadinha',
  comandos: ['metadinha', 'meta'],
  categoria: 'brincadeiras',

  info: {
    descricao: 'Envia uma metadinha masculina e feminina em carrossel.',
    uso: 'metadinha',
    categoria: 'brincadeiras'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        await reagir(from, '💞')

        const data = await api.metadinha()

        if (!data || data.status !== true || !data.resultado) {
          return reply(
            mess.padraoAviso({
              emoji: '💞',
              titulo: 'METADINHA',
              descricao: 'Não foi possível buscar a metadinha.'
            })
          )
        }

        const masculina = data.resultado.masculina
        const feminina = data.resultado.feminina

        if (!masculina || !feminina) {
          return reply(
            mess.padraoAviso({
              emoji: '💞',
              titulo: 'METADINHA',
              descricao: 'A API retornou dados inválidos.'
            })
          )
        }

        const mediaMasc = await prepareWAMessageMedia(
          {
            image: {
              url: masculina
            }
          },
          {
            upload: tokito.waUploadToServer
          }
        )

        const mediaFem = await prepareWAMessageMedia(
          {
            image: {
              url: feminina
            }
          },
          {
            upload: tokito.waUploadToServer
          }
        )

        const cards = [
          {
            header: {
              hasMediaAttachment: true,
              imageMessage: mediaMasc.imageMessage
            },
            body: {
              text: '💙 ᴍᴇᴛᴀᴅɪɴʜᴀ ᴍᴀsᴄᴜʟɪɴᴀ'
            },
            footer: {
              text: ''
            },
            nativeFlowMessage: {
              buttons: [
                botaoImagem('🔗', 'ᴀʙʀɪʀ ɪᴍᴀɢᴇᴍ', masculina)
              ]
            }
          },
          {
            header: {
              hasMediaAttachment: true,
              imageMessage: mediaFem.imageMessage
            },
            body: {
              text: '💖 ᴍᴇᴛᴀᴅɪɴʜᴀ ꜰᴇᴍɪɴɪɴᴀ'
            },
            footer: {
              text: ''
            },
            nativeFlowMessage: {
              buttons: [
                botaoImagem('🔗', 'ᴀʙʀɪʀ ɪᴍᴀɢᴇᴍ', feminina)
              ]
            }
          }
        ]

        await tokito.relayMessage(
          from,
          {
            interactiveMessage: {
              contextInfo: {
                participant: selo?.key?.participant || sender,
                quotedMessage: selo?.message,
                stanzaId: selo?.key?.id,
                remoteJid: selo?.key?.remoteJid || from,
                ...canalInfo([sender])
              },
              body: {
                text: '💞 ᴍᴇᴛᴀᴅɪɴʜᴀ ᴅᴏ ᴅɪᴀ'
              },
              carouselMessage: {
                cards
              }
            }
          },
          {
            quoted: selo
          }
        )

        await reagir(from, '✅')
      } catch (e) {
        console.log('[METADINHA]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
        await reagir(from, '❌').catch(() => {})
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})
