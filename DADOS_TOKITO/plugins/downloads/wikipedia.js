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
const { limitar, texto } = require('./_novas_rotas')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'wikipedia',
  comandos: ['wikipedia', 'wiki'],
  categoria: 'downloads',

  info: {
    descricao: 'Pesquisa artigos na Wikipédia pela Tokito API.',
    uso: 'wikipedia Yuta',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        const busca = String(q || '').trim()

        if (!busca) {
          return reply(
            mess.downloadUso({
              tipo: 'PESQUISA WIKIPÉDIA',
              prefix,
              command,
              exemplo: 'Yuta'
            })
          )
        }

        await reagir(from, '🔎')
        const dados = await api.wikipedia(busca, 5)
        const lista = Array.isArray(dados?.resultado)
          ? dados.resultado.slice(0, 5)
          : []

        if (!dados?.status || !lista.length) {
          await reagir(from, '❌').catch(() => {})
          return reply(mess.downloadNaoEncontrado('ARTIGO'))
        }

        const resultados = lista
          .map((item, index) => {
            return `${index + 1}. *${texto(item?.titulo, 'Sem título')}*\n` +
              `> 📝 ${limitar(item?.snippet, 420)}\n` +
              `> 🔄 Atualizado: ${texto(item?.atualizado)}\n` +
              `> 🔗 ${texto(item?.url)}`
          })
          .join('\n\n')

        await reply(
          `*📚 | WIKIPÉDIA*\n\n` +
          `> 🔎 Pesquisa: *${busca}*\n` +
          `> 📄 Resultados: *${lista.length}*\n\n` +
          resultados
        )

        await reagir(from, '✅')
      } catch (e) {
        console.log('[WIKIPEDIA]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
        await reagir(from, '❌').catch(() => {})
        await reply(mess.erroApi(API_URL))
      }
    }
  }
})
