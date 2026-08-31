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
const { limitar, texto } = require('./_novas_rotas')
const dylan = require('../../database/lib/comandos')

function botaoUrl(textoBotao, url) {
  return {
    name: 'cta_url',
    buttonParamsJson: JSON.stringify({
      display_text: textoBotao,
      url
    })
  }
}

dylan.setCommand({
  nome: 'appstore',
  comandos: ['appstore', 'appstoresearch', 'iosapp'],
  categoria: 'downloads',

  info: {
    descricao: 'Pesquisa aplicativos na App Store.',
    uso: 'appstore WhatsApp',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        const busca = String(q || '').trim()

        if (!busca) {
          return reply(
            mess.downloadUso({
              tipo: 'APP DA APP STORE',
              prefix,
              command,
              exemplo: 'WhatsApp'
            })
          )
        }

        await reagir(from, '🍎')
        await reply(mess.wait())

        const dados = await api.appstore(busca)
        const lista = Array.isArray(dados?.resultado)
          ? dados.resultado.slice(0, 5)
          : []

        if (!dados?.status || !lista.length) {
          await reagir(from, '❌').catch(() => {})
          return reply(mess.downloadNaoEncontrado('APP'))
        }

        if (!isBotoes) {
          const resultados = lista
            .map((item, index) => {
              return `${index + 1}. *${texto(item?.titulo, 'Aplicativo')}*\n` +
                `> 👨‍💻 ${texto(item?.desenvolvedor)}\n` +
                `> ⭐ ${texto(item?.nota)} | 💬 ${texto(item?.reviews, '0')}\n` +
                `> 📦 ${texto(item?.tamanho)} | 🆕 ${texto(item?.versao)}\n` +
                `> 💰 ${texto(item?.preco)}\n` +
                `> 🔗 ${texto(item?.link)}`
            })
            .join('\n\n')

          await reply(`*🍎 | APP STORE*\n\n> 🔎 *${busca}*\n\n${resultados}`)
          await reagir(from, '✅')
          return
        }

        const cards = []

        for (const item of lista) {
          const media = await prepareWAMessageMedia(
            {
              image: {
                url: item.imagem
              }
            },
            {
              upload: tokito.waUploadToServer
            }
          )

          const descricao = limitar(item?.descricao, 330)

          cards.push({
            header: {
              hasMediaAttachment: true,
              imageMessage: media.imageMessage
            },
            body: {
              text:
                `🍎 *${texto(item?.titulo, 'Aplicativo')}*\n\n` +
                `👨‍💻 ${texto(item?.desenvolvedor)}\n` +
                `⭐ ${texto(item?.nota)} • ${texto(item?.reviews, '0')} avaliações\n` +
                `📦 ${texto(item?.tamanho)} • v${texto(item?.versao)}\n` +
                `🔞 ${texto(item?.classificacao)} • ${texto(item?.preco)}\n\n` +
                `${descricao}`
            },
            footer: {
              text: texto(item?.requisitos, '')
            },
            nativeFlowMessage: {
              buttons: [
                botaoUrl('🍎 ABRIR NA APP STORE', item.link)
              ]
            }
          })
        }

        await tokito.relayMessage(
          from,
          {
            interactiveMessage: {
              contextInfo: {
                quotedMessage: selo?.message,
                participant: selo?.key?.participant || sender,
                stanzaId: selo?.key?.id,
                remoteJid: selo?.key?.remoteJid || from,
                mentionedJid: [sender]
              },
              body: {
                text: `🍎 Resultado da App Store para *${busca}*`
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
        console.log('[APPSTORE]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
        await reagir(from, '❌').catch(() => {})
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})
