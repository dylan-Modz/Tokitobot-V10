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

const api = require('../../scrapers/downloads/pesquisas')
const { texto } = require('./_novas_rotas')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'mangasearch',
  comandos: ['mangasearch', 'manga'],
  categoria: 'downloads',

  info: {
    descricao: 'Pesquisa mangás pela Tokito API.',
    uso: 'manga Naruto',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        const busca = String(q || '').trim()

        if (!busca) {
          return reply(
            mess.downloadUso({
              tipo: 'MANGÁ',
              prefix,
              command,
              exemplo: 'Naruto'
            })
          )
        }

        await reagir(from, '📖')
        const dados = await api.manga(busca)
        const lista = Array.isArray(dados?.resultado)
          ? dados.resultado.slice(0, 9)
          : []

        if (!dados?.status || !lista.length) {
          await reagir(from, '❌').catch(() => {})
          return reply(mess.downloadNaoEncontrado('MANGÁ'))
        }

        const resultados = lista
          .map((item, index) => {
            return `${index + 1}. *${texto(item?.titulo, 'Mangá')}*\n` +
              `> 📚 Tipo: ${texto(item?.tipo)} | 📦 Volumes: ${texto(item?.volumes)}\n` +
              `> ⭐ Nota: ${texto(item?.nota)}\n` +
              `> 🔗 ${texto(item?.link)}`
          })
          .join('\n\n')

        const mensagem =
          `*📖 | MANGA SEARCH*\n\n` +
          `> 🔎 Pesquisa: *${busca}*\n\n` +
          resultados

        if (lista[0]?.imagem) {
          await tokito.sendMessage(
            from,
            {
              image: {
                url: lista[0].imagem
              },
              caption: mensagem,
              contextInfo: {
                ...newsletter,
                mentionedJid: [sender]
              }
            },
            {
              quoted: selo
            }
          )
        } else {
          await reply(mensagem)
        }

        await reagir(from, '✅')
      } catch (e) {
        console.log('[MANGA SEARCH]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
        await reagir(from, '❌').catch(() => {})
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})
