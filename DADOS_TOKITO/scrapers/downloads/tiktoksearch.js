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

const buscar = (entrada, opcoes = {}) => client.get('/api/tiktok-search', {
  query: entrada,
  limite: Math.max(1, Math.min(30, Number(opcoes.limite) || 20)),
  cursor: Math.max(0, Math.floor(Number(opcoes.cursor) || 0))
})

function seguraUrl(texto) {
  if (typeof texto !== 'string') return ''
  try {
    const url = new URL(texto.trim())
    const host = url.hostname.toLowerCase()
    if (url.protocol !== 'https:' || !host || url.username || url.password ||
        host === 'localhost' || host.endsWith('.local') ||
        /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return ''
    return url.href
  } catch (_) { return '' }
}

function publicacao(item) {
  if (!item || typeof item !== 'object') return ''
  for (const candidato of [item.link, item.permalink, item.post_url, item.share_url, item.url]) {
    const endereco = seguraUrl(candidato)
    if (!endereco) continue
    const host = new URL(endereco).hostname.toLowerCase()
    if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) return endereco
  }
  const autor = item.autor || item.author || {}
  const nome = String(autor.username || autor.usuario || autor.unique_id ||
    autor.nickname || item.username || '').trim().replace(/^@/, '')
  const id = String(item.id || item.video_id || item.aweme_id || '').trim()
  if (/^[\w.]{1,32}$/.test(nome) && /^\d{15,22}$/.test(id)) {
    return 'https://www.tiktok.com/@' + nome + '/video/' + id
  }
  return ''
}

function linksDiretos(item) {
  if (!item || typeof item !== 'object') return []
  const links = new Set()
  for (const entrada of [
    item.video_sem_marca, item.video, item.download, item.download_url,
    item.downloadUrl, item.data, item.play, item.hdplay, item.nowatermark, item.nowatermark_hd
  ]) {
    const url = seguraUrl(entrada)
    if (!url || /\.(?:png|jpe?g|webp|gif|avif)(?:$|[?#])/i.test(url)) continue
    const host = new URL(url).hostname.toLowerCase()
    if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) continue
    links.add(url)
  }
  return [...links]
}


// A chave identifica a PUBLICAÇÃO, não a URL temporária do MP4.
function chaveVideo(item) {
  const id = String(item?.id || item?.video_id || item?.aweme_id || '').trim()
  if (/^\d{15,22}$/.test(id)) return 'id:' + id
  const post = publicacao(item)
  const extraido = post.match(/\/(?:video|photo)\/(\d{15,22})(?:[/?#]|$)/)
  if (extraido) return 'id:' + extraido[1]
  if (post) return 'post:' + post.split('?')[0].toLowerCase()
  const direto = linksDiretos(item)[0]
  if (direto) {
    const u = new URL(direto)
    return 'media:' + u.origin + u.pathname
  }
  return ''
}

const historicos = new Map()
const TTL = 60 * 60 * 1000
const MAX_SESSOES = 300

function sessaoBusca(chat, consulta) {
  const key = String(chat || '') + '\n' +
    String(consulta || '').trim().replace(/\s+/g, ' ').toLowerCase()
  const now = Date.now()
  for (const [id, info] of historicos) if (now - info.ultimoUso >= TTL) historicos.delete(id)
  let info = historicos.get(key)
  if (!info) {
    info = { vistos: new Set(), cursor: 0, ultimoUso: now }
    historicos.set(key, info)
  }
  info.ultimoUso = now
  if (historicos.size > MAX_SESSOES) historicos.delete(historicos.keys().next().value)
  return info
}

function embaralhar(itens) {
  const values = [...itens]
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[values[i], values[j]] = [values[j], values[i]]
  }
  return values
}

const temVideo = item => Boolean(publicacao(item) || linksDiretos(item).length)

async function obterVideo(item) {
  const post = publicacao(item)
  // Os resultados da pesquisa já trazem o MP4 no campo "data".
  // Evita uma segunda consulta se o vídeo direto estiver válido;
  // usa a rota de download apenas se o link temporário expirar.
  const tentativas = [
    ...linksDiretos(item),
    ...(post ? [client.url('/api/tiktok-video', { url: post })] : [])
  ]
  if (!tentativas.length) throw new Error('O resultado não contém link de vídeo ou publicação.')

  let ultimo = ''
  for (const link of [...new Set(tentativas)].slice(0, 5)) {
    try {
      const resposta = await client.axios.get(link, {
        responseType: 'arraybuffer',
        timeout: 120000,
        maxRedirects: 5,
        maxContentLength: 40 * 1024 * 1024,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36',
          'Accept': 'video/mp4,application/octet-stream;q=0.9,*/*;q=0.8',
          'Referer': 'https://www.tiktok.com/'
        }
      })
      const arquivo = Buffer.isBuffer(resposta.data) ? resposta.data : Buffer.from(resposta.data)
      if (arquivo.length < 64 || arquivo.toString('ascii', 4, 8) !== 'ftyp') {
        throw new Error('Resposta não é um MP4 válido.')
      }
      return arquivo
    } catch (erro) {
      ultimo = erro?.response?.status ? 'HTTP ' + erro.response.status : String(erro?.message || erro)
    }
  }
  throw new Error('Nenhum MP4 válido foi entregue. ' + ultimo)
}

module.exports = { buscar, publicacao, linksDiretos, temVideo, obterVideo, chaveVideo, sessaoBusca, embaralhar }
