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

const client = require('./client')

const wikipedia = (query, limite = 5) =>
  client.get('/api/wikipedia-search', {
    query,
    limite
  })

const appstore = (q) =>
  client.get('/api/appstore-search', {
    q
  })

const spotify = (q, limit = 5) =>
  client.get('/api/spotify-search', {
    q,
    limit
  })

const lyrics = (query) =>
  client.get('/api/lyrics-search', {
    query
  })

const soundcloud = (q) =>
  client.get('/api/soundcloud-search', {
    q
  })

const anime = (q) =>
  client.get('/api/anime-search', {
    q
  })

const manga = (q) =>
  client.get('/api/manga-search', {
    q
  })

const printSite = (url) =>
  client.get('/api/print-site', {
    url
  })

const metadinha = () =>
  client.get('/api/metadinha')

module.exports = {
  wikipedia,
  appstore,
  spotify,
  lyrics,
  soundcloud,
  anime,
  manga,
  printSite,
  metadinha
}
