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
  nome: 'spotifysearch',
  comandos: ['spotifysearch', 'spsearch', 'spbuscar'],
  categoria: 'downloads',

  info: {
    descricao: 'Pesquisa músicas no Spotify.',
    uso: 'spotifysearch MC Poze',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        const busca = String(q || '').trim()

        if (!busca) {
          return reply(
            mess.downloadUso({
              tipo: 'PESQUISA SPOTIFY',
              prefix,
              command,
              exemplo: 'MC Poze'
            })
          )
        }

        await reagir(from, '🎧')
        const dados = await api.spotify(busca, 5)
        const lista = Array.isArray(dados?.resultado)
          ? dados.resultado.slice(0, 5)
          : []

        if (!dados?.status || !lista.length) {
          await reagir(from, '❌').catch(() => {})
          return reply(mess.downloadNaoEncontrado('MÚSICA'))
        }

        const resultados = lista
          .map((item, index) => {
            return `${index + 1}. *${texto(item?.title, 'Música')}*\n` +
              `> 🎤 ${texto(item?.artist)}\n` +
              `> 💿 ${texto(item?.album)}\n` +
              `> ⏱️ ${texto(item?.duration)} | 🔥 ${texto(item?.popularity, '0')}\n` +
              `> 📅 ${texto(item?.release_date)}\n` +
              `> 🔗 ${texto(item?.url)}`
          })
          .join('\n\n')

        await reply(
          `*🎧 | SPOTIFY SEARCH*\n\n` +
          `> 🔎 Pesquisa: *${busca}*\n\n` +
          resultados +
          `\n\n> 💡 Para baixar, use *${prefix}spotify <link>*`
        )

        await reagir(from, '✅')
      } catch (e) {
        console.log('[SPOTIFY SEARCH]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
        await reagir(from, '❌').catch(() => {})
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})
