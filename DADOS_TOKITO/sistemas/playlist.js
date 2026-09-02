/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Sistema de Playlist / Rádio automático.
 * Dev: Dylan Modz
 * ============================================================
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const axios = require('axios')

const mensagens = require('../mensagens/mensagens')

const ARQUIVO = path.join(
  __dirname,
  '..',
  'database',
  'sistemas',
  'playlists.json'
)

const CACHE_DIR = path.join(os.tmpdir(), 'tokito-playlist-cache')

const MAX_PLAYLISTS_POR_USUARIO = 30
const MAX_PLAYLISTS_GLOBAIS = 30
const MAX_FAIXAS = 200
const MAX_IMPORTADAS = 100
const MAX_CACHE_BYTES = 80 * 1024 * 1024
const TEMPO_PADRAO_SEGUNDOS = 180
const INTERVALO_FAIXAS_MS = 1500

const sessoes = new Map()

const garantirPasta = local => {
  if (!fs.existsSync(local))
    fs.mkdirSync(local, { recursive: true })
}

const estadoPadrao = () => ({
  versao: 1,
  usuarios: {},
  globais: {}
})

const garantirArquivo = () => {
  garantirPasta(path.dirname(ARQUIVO))

  if (!fs.existsSync(ARQUIVO)) {
    fs.writeFileSync(
      ARQUIVO,
      JSON.stringify(estadoPadrao(), null, 2) + '\n'
    )
  }
}

const ler = () => {
  garantirArquivo()

  try {
    const dados = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'))

    if (!dados || typeof dados !== 'object' || Array.isArray(dados))
      return estadoPadrao()

    if (!dados.usuarios || typeof dados.usuarios !== 'object' || Array.isArray(dados.usuarios))
      dados.usuarios = {}

    if (!dados.globais || typeof dados.globais !== 'object' || Array.isArray(dados.globais))
      dados.globais = {}

    return dados
  }
  catch {
    return estadoPadrao()
  }
}

const salvar = dados => {
  garantirArquivo()

  const tmp = `${ARQUIVO}.${process.pid}.tmp`

  fs.writeFileSync(
    tmp,
    JSON.stringify(dados, null, 2) + '\n'
  )

  fs.renameSync(tmp, ARQUIVO)
}

const limparTexto = valor => String(valor || '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const normalizarNome = valor => limparTexto(valor)
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ç/g, 'c')
  .replace(/[^a-z0-9_-]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 50)

const nomeArquivo = valor => limparTexto(valor || 'musica')
  .replace(/[\\/:*?"<>|]/g, '')
  .slice(0, 90) || 'musica'

const clonar = valor => JSON.parse(JSON.stringify(valor))

const colecao = (dados, dono, global = false, criar = false) => {
  if (global)
    return dados.globais

  const id = String(dono || '').trim()

  if (!id)
    return null

  if (!dados.usuarios[id] && criar) {
    dados.usuarios[id] = {
      playlists: {}
    }
  }

  return dados.usuarios[id]?.playlists || null
}

const listar = (dono, global = false) => {
  const dados = ler()
  const alvo = colecao(dados, dono, global, false) || {}

  return Object.values(alvo)
    .filter(Boolean)
    .map(item => clonar(item))
    .sort((a, b) => String(a.nome).localeCompare(String(b.nome), 'pt-BR'))
}

const obter = (dono, nome, global = false) => {
  const chave = normalizarNome(nome)

  if (!chave)
    return null

  const dados = ler()
  const alvo = colecao(dados, dono, global, false) || {}
  const item = alvo[chave]

  return item ? clonar(item) : null
}

const criar = (dono, nome, global = false) => {
  const nomeLimpo = limparTexto(nome).slice(0, 60)
  const chave = normalizarNome(nomeLimpo)

  if (!nomeLimpo || !chave)
    return { ok: false, motivo: 'nome' }

  const dados = ler()
  const alvo = colecao(dados, dono, global, true)

  if (alvo[chave])
    return { ok: false, motivo: 'existe', playlist: clonar(alvo[chave]) }

  const limite = global
    ? MAX_PLAYLISTS_GLOBAIS
    : MAX_PLAYLISTS_POR_USUARIO

  if (Object.keys(alvo).length >= limite)
    return { ok: false, motivo: 'limite', limite }

  const agora = new Date().toISOString()

  alvo[chave] = {
    id: chave,
    nome: nomeLimpo,
    dono: String(dono || ''),
    global: Boolean(global),
    criadoEm: agora,
    atualizadoEm: agora,
    musicas: []
  }

  salvar(dados)

  return {
    ok: true,
    playlist: clonar(alvo[chave])
  }
}

const apagar = (dono, nome, global = false) => {
  const chave = normalizarNome(nome)
  const dados = ler()
  const alvo = colecao(dados, dono, global, false)

  if (!chave || !alvo?.[chave])
    return { ok: false, motivo: 'nao' }

  const removida = clonar(alvo[chave])
  delete alvo[chave]

  salvar(dados)

  return {
    ok: true,
    playlist: removida
  }
}

const renomear = (dono, nomeAtual, novoNome, global = false) => {
  const atual = normalizarNome(nomeAtual)
  const nomeLimpo = limparTexto(novoNome).slice(0, 60)
  const nova = normalizarNome(nomeLimpo)
  const dados = ler()
  const alvo = colecao(dados, dono, global, false)

  if (!atual || !nova || !nomeLimpo)
    return { ok: false, motivo: 'nome' }

  if (!alvo?.[atual])
    return { ok: false, motivo: 'nao' }

  if (atual !== nova && alvo[nova])
    return { ok: false, motivo: 'existe' }

  const item = alvo[atual]

  item.id = nova
  item.nome = nomeLimpo
  item.atualizadoEm = new Date().toISOString()

  if (atual !== nova) {
    delete alvo[atual]
    alvo[nova] = item
  }

  salvar(dados)

  return {
    ok: true,
    playlist: clonar(item)
  }
}

const parseDuracao = valor => {
  if (typeof valor === 'number' && Number.isFinite(valor))
    return Math.max(0, Math.floor(valor))

  const texto = String(valor || '').trim()

  if (!texto)
    return 0

  if (/^\d+(?:\.\d+)?$/.test(texto))
    return Math.max(0, Math.floor(Number(texto)))

  const partes = texto
    .split(':')
    .map(item => Number(item))

  if (!partes.length || partes.some(item => !Number.isFinite(item)))
    return 0

  let total = 0

  for (const numero of partes)
    total = total * 60 + numero

  return Math.max(0, Math.floor(total))
}

const formatarDuracao = segundos => {
  const total = Math.max(0, Number(segundos || 0))
  const horas = Math.floor(total / 3600)
  const minutos = Math.floor((total % 3600) / 60)
  const seg = Math.floor(total % 60)

  if (horas > 0)
    return `${horas}:${String(minutos).padStart(2, '0')}:${String(seg).padStart(2, '0')}`

  return `${minutos}:${String(seg).padStart(2, '0')}`
}

const duracaoTotalFaixas = faixas => (Array.isArray(faixas) ? faixas : [])
  .reduce((total, faixa) => {
    const segundos = Number(faixa?.duracaoSegundos || 0)
    return total + (Number.isFinite(segundos) ? Math.max(0, segundos) : 0)
  }, 0)

const esperar = ms => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms || 0))))

const normalizarFaixa = faixa => {
  const titulo = limparTexto(
    faixa?.titulo ||
    faixa?.title ||
    'Música'
  ).slice(0, 160)

  const url = limparTexto(
    faixa?.url ||
    faixa?.link ||
    ''
  )

  const autor = limparTexto(
    faixa?.autor ||
    faixa?.author?.name ||
    faixa?.author ||
    faixa?.canal ||
    'Desconhecido'
  ).slice(0, 100)

  let duracaoSegundos = parseDuracao(
    faixa?.duracaoSegundos ??
    faixa?.duration?.seconds ??
    faixa?.durationSeconds ??
    faixa?.lengthSeconds ??
    faixa?.timestamp ??
    faixa?.duration?.timestamp ??
    faixa?.duration
  )

  if (!duracaoSegundos)
    duracaoSegundos = TEMPO_PADRAO_SEGUNDOS

  return {
    id: limparTexto(faixa?.id || faixa?.videoId || '').slice(0, 80),
    titulo,
    autor,
    url,
    duracaoSegundos,
    duracao: formatarDuracao(duracaoSegundos),
    thumbnail: limparTexto(
      faixa?.thumbnail ||
      faixa?.image ||
      faixa?.thumb ||
      ''
    ),
    adicionadaEm: faixa?.adicionadaEm || new Date().toISOString()
  }
}

const adicionarFaixa = (dono, nome, faixa, global = false) => {
  const chave = normalizarNome(nome)
  const dados = ler()
  const alvo = colecao(dados, dono, global, false)

  if (!chave || !alvo?.[chave])
    return { ok: false, motivo: 'nao' }

  const playlist = alvo[chave]

  if (!Array.isArray(playlist.musicas))
    playlist.musicas = []

  if (playlist.musicas.length >= MAX_FAIXAS)
    return { ok: false, motivo: 'limite', limite: MAX_FAIXAS }

  const musica = normalizarFaixa(faixa)

  if (!musica.url)
    return { ok: false, motivo: 'faixa' }

  const duplicada = playlist.musicas.some(item =>
    String(item?.url || '').trim() === musica.url
  )

  if (duplicada)
    return { ok: false, motivo: 'duplicada', faixa: musica }

  playlist.musicas.push(musica)
  playlist.atualizadoEm = new Date().toISOString()

  salvar(dados)

  return {
    ok: true,
    faixa: musica,
    total: playlist.musicas.length,
    playlist: clonar(playlist)
  }
}

const adicionarVarias = (dono, nome, faixas, global = false) => {
  const chave = normalizarNome(nome)
  const dados = ler()
  const alvo = colecao(dados, dono, global, false)

  if (!chave || !alvo?.[chave])
    return { ok: false, motivo: 'nao' }

  const playlist = alvo[chave]

  if (!Array.isArray(playlist.musicas))
    playlist.musicas = []

  const existentes = new Set(
    playlist.musicas
      .map(item => String(item?.url || '').trim())
      .filter(Boolean)
  )

  const adicionadas = []
  let ignoradas = 0

  for (const faixaRaw of Array.isArray(faixas) ? faixas : []) {
    if (playlist.musicas.length >= MAX_FAIXAS)
      break

    const faixa = normalizarFaixa(faixaRaw)

    if (!faixa.url || existentes.has(faixa.url)) {
      ignoradas += 1
      continue
    }

    existentes.add(faixa.url)
    playlist.musicas.push(faixa)
    adicionadas.push(faixa)
  }

  playlist.atualizadoEm = new Date().toISOString()
  salvar(dados)

  return {
    ok: true,
    adicionadas,
    ignoradas,
    total: playlist.musicas.length,
    playlist: clonar(playlist)
  }
}

const removerFaixa = (dono, nome, indice, global = false) => {
  const chave = normalizarNome(nome)
  const posicao = Number(indice) - 1
  const dados = ler()
  const alvo = colecao(dados, dono, global, false)

  if (!chave || !alvo?.[chave])
    return { ok: false, motivo: 'nao' }

  const playlist = alvo[chave]

  if (
    !Array.isArray(playlist.musicas) ||
    !Number.isInteger(posicao) ||
    posicao < 0 ||
    posicao >= playlist.musicas.length
  ) {
    return { ok: false, motivo: 'indice' }
  }

  const [removida] = playlist.musicas.splice(posicao, 1)
  playlist.atualizadoEm = new Date().toISOString()

  salvar(dados)

  return {
    ok: true,
    faixa: removida,
    total: playlist.musicas.length,
    playlist: clonar(playlist)
  }
}

const limparPlaylist = (dono, nome, global = false) => {
  const chave = normalizarNome(nome)
  const dados = ler()
  const alvo = colecao(dados, dono, global, false)

  if (!chave || !alvo?.[chave])
    return { ok: false, motivo: 'nao' }

  const total = Array.isArray(alvo[chave].musicas)
    ? alvo[chave].musicas.length
    : 0

  alvo[chave].musicas = []
  alvo[chave].atualizadoEm = new Date().toISOString()

  salvar(dados)

  return {
    ok: true,
    removidas: total,
    playlist: clonar(alvo[chave])
  }
}

const buscarFaixa = async ({ entrada, apiUrl, apiKey }) => {
  const pesquisa = limparTexto(entrada)
  const base = String(apiUrl || '').replace(/\/+$/, '')

  if (!pesquisa)
    throw new Error('Informe uma música ou link.')

  if (!base)
    throw new Error('API_URL não configurada.')

  const endpoint =
    `${base}/api/youtube-search` +
    `?query=${encodeURIComponent(pesquisa)}` +
    `&apikey=${encodeURIComponent(String(apiKey || ''))}`

  const response = await axios.get(endpoint, {
    timeout: 25000,
    validateStatus: () => true
  })

  if (
    response.status !== 200 ||
    response.data?.status !== true ||
    !Array.isArray(response.data?.resultado) ||
    !response.data.resultado.length
  ) {
    throw new Error('Música não encontrada.')
  }

  const item =
    response.data.resultado.find(resultado =>
      resultado?.type === 'video' &&
      (resultado?.url || resultado?.videoId)
    ) ||
    response.data.resultado[0]

  const url = String(
    item?.url ||
    (item?.videoId
      ? `https://www.youtube.com/watch?v=${item.videoId}`
      : '')
  )

  const faixa = normalizarFaixa({
    ...item,
    url
  })

  if (!faixa.url)
    throw new Error('A busca não retornou um link de vídeo válido.')

  return faixa
}

const extrairPlaylistId = valor => {
  const texto = String(valor || '').trim()

  if (!texto)
    return ''

  try {
    const url = new URL(texto)
    const id = url.searchParams.get('list')

    if (id)
      return id.trim()
  }
  catch {}

  const match = texto.match(/[?&]list=([A-Za-z0-9_-]+)/i)

  if (match)
    return match[1]

  if (/^[A-Za-z0-9_-]{10,}$/.test(texto))
    return texto

  return ''
}

const extrairJsonBalanceado = (texto, inicio) => {
  const primeiro = texto.indexOf('{', inicio)

  if (primeiro < 0)
    return null

  let profundidade = 0
  let string = false
  let escape = false

  for (let i = primeiro; i < texto.length; i += 1) {
    const char = texto[i]

    if (string) {
      if (escape) {
        escape = false
        continue
      }

      if (char === '\\') {
        escape = true
        continue
      }

      if (char === '"')
        string = false

      continue
    }

    if (char === '"') {
      string = true
      continue
    }

    if (char === '{')
      profundidade += 1

    if (char === '}') {
      profundidade -= 1

      if (profundidade === 0)
        return texto.slice(primeiro, i + 1)
    }
  }

  return null
}

const textoRenderer = valor => {
  if (!valor)
    return ''

  if (typeof valor.simpleText === 'string')
    return limparTexto(valor.simpleText)

  if (Array.isArray(valor.runs))
    return limparTexto(valor.runs.map(item => item?.text || '').join(''))

  return ''
}

const importarYoutube = async (entrada, limite = MAX_IMPORTADAS) => {
  const playlistId = extrairPlaylistId(entrada)

  if (!playlistId)
    throw new Error('Link/ID de playlist do YouTube inválido.')

  const url = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}&hl=pt-BR&gl=BR`

  const response = await axios.get(url, {
    timeout: 30000,
    validateStatus: () => true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
    }
  })

  if (response.status !== 200 || typeof response.data !== 'string')
    throw new Error(`YouTube respondeu HTTP ${response.status}.`)

  const html = response.data
  const marcadores = [
    'var ytInitialData =',
    'ytInitialData =',
    'window["ytInitialData"] ='
  ]

  let inicial = null

  for (const marcador of marcadores) {
    const posicao = html.indexOf(marcador)

    if (posicao < 0)
      continue

    const bruto = extrairJsonBalanceado(html, posicao + marcador.length)

    if (!bruto)
      continue

    try {
      inicial = JSON.parse(bruto)
      break
    }
    catch {}
  }

  if (!inicial)
    throw new Error('Não consegui ler os dados da playlist do YouTube.')

  const faixas = []
  const vistos = new Set()
  let titulo = ''

  const visitar = no => {
    if (!no || typeof no !== 'object' || faixas.length >= limite)
      return

    if (!titulo && no.playlistMetadataRenderer?.title)
      titulo = limparTexto(no.playlistMetadataRenderer.title)

    if (!titulo && no.playlistHeaderRenderer?.title)
      titulo = textoRenderer(no.playlistHeaderRenderer.title)

    const renderer = no.playlistVideoRenderer || no.playlistPanelVideoRenderer

    if (renderer?.videoId && !vistos.has(renderer.videoId)) {
      const tituloFaixa = textoRenderer(renderer.title)
      const duracaoTexto =
        textoRenderer(renderer.lengthText) ||
        textoRenderer(renderer.thumbnailOverlays?.[0]?.thumbnailOverlayTimeStatusRenderer?.text)

      const duracao = parseDuracao(
        renderer.lengthSeconds ||
        duracaoTexto
      )

      if (tituloFaixa && duracao > 0) {
        vistos.add(renderer.videoId)

        const thumbs =
          renderer.thumbnail?.thumbnails ||
          renderer.thumbnailRenderer?.playlistVideoThumbnailRenderer?.thumbnail?.thumbnails ||
          []

        const thumb = Array.isArray(thumbs) && thumbs.length
          ? thumbs[thumbs.length - 1]?.url || ''
          : ''

        faixas.push(normalizarFaixa({
          id: renderer.videoId,
          titulo: tituloFaixa,
          autor: textoRenderer(renderer.shortBylineText),
          url: `https://www.youtube.com/watch?v=${renderer.videoId}`,
          duracaoSegundos: duracao,
          thumbnail: thumb
        }))
      }
    }

    for (const valor of Object.values(no)) {
      if (faixas.length >= limite)
        break

      if (valor && typeof valor === 'object')
        visitar(valor)
    }
  }

  visitar(inicial)

  if (!faixas.length)
    throw new Error('Nenhuma música utilizável foi encontrada nessa playlist.')

  return {
    id: playlistId,
    titulo: titulo || `Playlist ${playlistId}`,
    faixas
  }
}

const embaralhar = lista => {
  const saida = [...lista]

  for (let i = saida.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[saida[i], saida[j]] = [saida[j], saida[i]]
  }

  return saida
}

const apiAudio = (sessao, faixa) => {
  const base = String(sessao.apiUrl || '').replace(/\/+$/, '')

  return (
    `${base}/api/youtube-audio` +
    `?q=${encodeURIComponent(faixa.url)}` +
    `&apikey=${encodeURIComponent(String(sessao.apiKey || ''))}`
  )
}

const limparArquivo = arquivo => {
  if (!arquivo)
    return

  try {
    if (fs.existsSync(arquivo))
      fs.unlinkSync(arquivo)
  }
  catch {}
}

const limparPreload = sessao => {
  if (!sessao?.preload)
    return

  const atual = sessao.preload
  sessao.preload = null

  if (atual.caminho)
    limparArquivo(atual.caminho)
}

const baixarParaCache = async (sessao, faixa, trackIndex) => {
  garantirPasta(CACHE_DIR)

  const arquivo = path.join(
    CACHE_DIR,
    `${sessao.id}-${trackIndex}-${Date.now()}.mp3`
  )

  const response = await axios.get(
    apiAudio(sessao, faixa),
    {
      responseType: 'stream',
      timeout: 120000,
      maxRedirects: 5,
      validateStatus: () => true
    }
  )

  if (response.status !== 200 || !response.data?.pipe)
    throw new Error(`Pré-carregamento respondeu HTTP ${response.status}.`)

  const contentType = String(response.headers?.['content-type'] || '').toLowerCase()

  if (contentType.includes('application/json') || contentType.includes('text/html')) {
    response.data.destroy()
    throw new Error('A API não retornou áudio no pré-carregamento.')
  }

  const declarado = Number(response.headers?.['content-length'] || 0)

  if (declarado > MAX_CACHE_BYTES) {
    response.data.destroy()
    throw new Error('Áudio grande demais para pré-carregamento.')
  }

  await new Promise((resolve, reject) => {
    const destino = fs.createWriteStream(arquivo)
    let bytes = 0
    let finalizado = false

    const falhar = erro => {
      if (finalizado)
        return

      finalizado = true
      response.data.destroy()
      destino.destroy()
      limparArquivo(arquivo)
      reject(erro)
    }

    response.data.on('data', chunk => {
      bytes += chunk.length

      if (bytes > MAX_CACHE_BYTES)
        falhar(new Error('Áudio excedeu o limite do pré-carregamento.'))
    })

    response.data.on('error', falhar)
    destino.on('error', falhar)

    destino.on('finish', () => {
      if (finalizado)
        return

      finalizado = true
      resolve()
    })

    response.data.pipe(destino)
  })

  return arquivo
}

const proximoTrackIndex = sessao => {
  if (!sessao?.order?.length)
    return null

  const proximaPosicao = sessao.position + 1

  if (proximaPosicao < sessao.order.length)
    return sessao.order[proximaPosicao]

  if (sessao.mode === 'party')
    return null

  if (!sessao.loop)
    return null

  if (sessao.shuffle)
    return embaralhar(sessao.tracks.map((_, indice) => indice))[0] ?? null

  return sessao.order[0] ?? null
}

const iniciarPreload = sessao => {
  if (!sessao || sessao.stopped || sessao.paused)
    return

  const trackIndex = proximoTrackIndex(sessao)

  if (trackIndex === null || trackIndex === undefined)
    return

  if (sessao.preload?.trackIndex === trackIndex)
    return

  limparPreload(sessao)

  const faixa = sessao.tracks[trackIndex]

  if (!faixa)
    return

  const preload = {
    trackIndex,
    caminho: '',
    promise: null
  }

  preload.promise = baixarParaCache(sessao, faixa, trackIndex)
    .then(caminho => {
      preload.caminho = caminho
      return caminho
    })
    .catch(() => '')

  sessao.preload = preload
}

const fonteFaixa = async (sessao, faixa, trackIndex) => {
  const preload = sessao.preload

  if (preload?.trackIndex === trackIndex) {
    let caminho = preload.caminho

    if (!caminho && preload.promise) {
      caminho = await Promise.race([
        preload.promise,
        new Promise(resolve => setTimeout(() => resolve(''), 8000))
      ])
    }

    if (caminho && fs.existsSync(caminho)) {
      sessao.preload = null
      return {
        source: { url: caminho },
        cacheFile: caminho
      }
    }
  }

  return {
    source: { url: apiAudio(sessao, faixa) },
    cacheFile: ''
  }
}

const notificar = async (sessao, texto) => {
  if (!sessao?.tokito || !sessao?.chatId || !texto)
    return

  try {
    await sessao.tokito.sendMessage(
      sessao.chatId,
      { text: texto }
    )
  }
  catch {}
}

const enviarComCapa = async (sessao, capa, legenda) => {
  if (!sessao?.tokito || !sessao?.chatId || !legenda)
    return false

  const thumbnail = limparTexto(capa)

  if (thumbnail) {
    try {
      await sessao.tokito.sendMessage(
        sessao.chatId,
        {
          image: { url: thumbnail },
          caption: legenda
        }
      )

      return true
    }
    catch {}
  }

  try {
    await sessao.tokito.sendMessage(
      sessao.chatId,
      { text: legenda }
    )

    return true
  }
  catch {
    return false
  }
}

const resumoSessao = sessao => {
  const trackIndex = sessao?.order?.[sessao.position]
  const atual = sessao?.tracks?.[trackIndex] || null
  const nextIndex = sessao?.order?.[sessao.position + 1]
  const proxima = sessao?.tracks?.[nextIndex] || null

  return {
    nome: sessao?.nome || 'Playlist',
    total: Array.isArray(sessao?.tracks) ? sessao.tracks.length : 0,
    posicao: sessao?.position >= 0 ? sessao.position + 1 : 0,
    atual: atual ? clonar(atual) : null,
    proxima: proxima ? clonar(proxima) : null,
    loop: Boolean(sessao?.loop),
    aleatorio: Boolean(sessao?.shuffle),
    global: Boolean(sessao?.sourceGlobal),
    criadoEm: sessao?.playlistCriadoEm || '',
    duracaoTotalSegundos: Number(sessao?.totalDurationSeconds || 0),
    duracaoTotal: formatarDuracao(sessao?.totalDurationSeconds || 0)
  }
}

const enviarResumoPlaylist = async sessao => {
  if (!sessao || sessao.mode !== 'playlist')
    return false

  const resumo = resumoSessao(sessao)
  const capa = resumo.atual?.thumbnail || sessao.tracks?.[0]?.thumbnail || ''

  return enviarComCapa(
    sessao,
    capa,
    mensagens.playlistIniciada(resumo)
  )
}

const enviarCardFaixa = async (sessao, faixa) => {
  if (!sessao || !faixa)
    return false

  const resumo = resumoSessao(sessao)

  return enviarComCapa(
    sessao,
    faixa.thumbnail,
    mensagens.playlistAgoraTocando({
      ...resumo,
      atual: clonar(faixa)
    })
  )
}

const notificarFaixaFinalizada = async sessao => {
  if (!sessao || sessao.currentTrackIndex === null || sessao.currentTrackIndex === undefined)
    return false

  const faixa = sessao.tracks?.[sessao.currentTrackIndex]

  if (!faixa)
    return false

  await notificar(
    sessao,
    mensagens.playlistFaixaFinalizada({
      nome: sessao.nome,
      faixa: clonar(faixa),
      posicao: sessao.position + 1,
      total: sessao.tracks.length,
      proxima: sessao.tracks?.[
        sessao.order?.[sessao.position + 1] ??
        (sessao.loop && !sessao.shuffle ? sessao.order?.[0] : undefined)
      ] || null
    })
  )

  return true
}

const cancelarTimer = sessao => {
  if (sessao?.timer) {
    clearTimeout(sessao.timer)
    sessao.timer = null
  }
}

const agendar = (sessao, ms) => {
  cancelarTimer(sessao)

  const espera = Math.max(1000, Number(ms || 0))
  sessao.remainingMs = espera
  sessao.nextAt = Date.now() + espera

  sessao.timer = setTimeout(() => {
    sessao.timer = null
    avancarAutomatico(sessao.chatId).catch(error => {
      console.log('[PLAYLIST AUTO]', error?.message || error)
    })
  }, espera)
}

const resetarOrdem = sessao => {
  const base = sessao.tracks.map((_, indice) => indice)
  sessao.order = sessao.shuffle ? embaralhar(base) : base
  sessao.position = 0
}

const tocarAtual = async sessao => {
  if (!sessao || sessao.stopped || sessao.paused || sessao.sending)
    return false

  const trackIndex = sessao.order[sessao.position]
  const faixa = sessao.tracks[trackIndex]

  if (!faixa)
    return false

  sessao.sending = true
  sessao.waiting = false

  let cacheFile = ''

  try {
    const fonte = await fonteFaixa(sessao, faixa, trackIndex)
    cacheFile = fonte.cacheFile

    await enviarCardFaixa(sessao, faixa)

    await sessao.tokito.sendMessage(
      sessao.chatId,
      {
        audio: fonte.source,
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: `${nomeArquivo(faixa.titulo)}.mp3`
      }
    )

    sessao.errosSeguidos = 0
    sessao.currentTrackIndex = trackIndex
    sessao.currentStartedAt = Date.now()
    sessao.currentElapsedMs = 0

    const duracao = Math.max(
      10,
      Number(faixa.duracaoSegundos || TEMPO_PADRAO_SEGUNDOS)
    )

    sessao.currentDurationMs = duracao * 1000

    agendar(
      sessao,
      sessao.currentDurationMs + INTERVALO_FAIXAS_MS
    )

    iniciarPreload(sessao)

    return true
  }
  catch (error) {
    sessao.errosSeguidos += 1

    console.log(
      '[PLAYLIST FAIXA]',
      faixa?.titulo || 'Música',
      error?.message || error
    )

    if (sessao.errosSeguidos <= 3) {
      await notificar(
        sessao,
        mensagens.playlistFaixaPulada(faixa.titulo)
      )

      setTimeout(() => {
        avancarAutomatico(sessao.chatId).catch(() => {})
      }, 2500)
    } else {
      await notificar(
        sessao,
        mensagens.playlistInterrompidaErro()
      )

      parar(sessao.chatId)
    }

    return false
  }
  finally {
    sessao.sending = false

    if (cacheFile)
      limparArquivo(cacheFile)
  }
}

const avancarAutomatico = async chatId => {
  const sessao = sessoes.get(chatId)

  if (!sessao || sessao.stopped || sessao.paused)
    return false

  cancelarTimer(sessao)
  sessao.remainingMs = 0

  await notificarFaixaFinalizada(sessao)
  await esperar(700)

  if (sessao.position + 1 < sessao.order.length) {
    sessao.position += 1
    return tocarAtual(sessao)
  }

  if (sessao.mode === 'party') {
    sessao.waiting = true
    sessao.nextAt = 0
    sessao.currentStartedAt = 0
    sessao.currentDurationMs = 0
    return true
  }

  if (sessao.loop) {
    resetarOrdem(sessao)
    return tocarAtual(sessao)
  }

  const resumoFinal = {
    nome: sessao.nome,
    total: sessao.tracks.length,
    duracaoTotal: formatarDuracao(sessao.totalDurationSeconds || duracaoTotalFaixas(sessao.tracks))
  }

  parar(chatId)

  await notificar(
    sessao,
    mensagens.playlistFinalizada(resumoFinal)
  )

  return true
}

const iniciar = async ({
  chatId,
  ownerId,
  playlist,
  tokito,
  apiUrl,
  apiKey,
  shuffle = false,
  loop = false
}) => {
  if (!chatId || !tokito)
    throw new Error('Sessão de reprodução inválida.')

  const faixas = Array.isArray(playlist?.musicas)
    ? playlist.musicas.map(normalizarFaixa).filter(item => item.url)
    : []

  if (!faixas.length)
    throw new Error('Essa playlist está vazia.')

  parar(chatId)

  const sessao = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    mode: 'playlist',
    chatId,
    ownerId: String(ownerId || ''),
    nome: limparTexto(playlist.nome || 'Playlist'),
    playlistId: playlist.id || normalizarNome(playlist.nome),
    sourceGlobal: Boolean(playlist.global),
    playlistCriadoEm: playlist.criadoEm || '',
    totalDurationSeconds: duracaoTotalFaixas(faixas),
    tracks: faixas,
    order: [],
    position: 0,
    currentTrackIndex: null,
    currentStartedAt: 0,
    currentElapsedMs: 0,
    currentDurationMs: 0,
    remainingMs: 0,
    nextAt: 0,
    timer: null,
    paused: false,
    stopped: false,
    waiting: false,
    sending: false,
    loop: Boolean(loop),
    shuffle: Boolean(shuffle),
    errosSeguidos: 0,
    tokito,
    apiUrl,
    apiKey,
    preload: null,
    criadoEm: Date.now()
  }

  resetarOrdem(sessao)
  sessoes.set(chatId, sessao)

  await enviarResumoPlaylist(sessao)
  await esperar(500)
  await tocarAtual(sessao)

  return status(chatId)
}

const iniciarParty = ({
  chatId,
  ownerId,
  tokito,
  apiUrl,
  apiKey
}) => {
  if (!chatId || !tokito)
    throw new Error('Sessão Party inválida.')

  parar(chatId)

  const sessao = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    mode: 'party',
    chatId,
    ownerId: String(ownerId || ''),
    nome: 'Party',
    playlistId: '',
    sourceGlobal: false,
    playlistCriadoEm: '',
    totalDurationSeconds: 0,
    tracks: [],
    order: [],
    position: -1,
    currentTrackIndex: null,
    currentStartedAt: 0,
    currentElapsedMs: 0,
    currentDurationMs: 0,
    remainingMs: 0,
    nextAt: 0,
    timer: null,
    paused: false,
    stopped: false,
    waiting: true,
    sending: false,
    loop: false,
    shuffle: false,
    errosSeguidos: 0,
    tokito,
    apiUrl,
    apiKey,
    preload: null,
    criadoEm: Date.now()
  }

  sessoes.set(chatId, sessao)

  return status(chatId)
}

const adicionarParty = async (chatId, faixa) => {
  const sessao = sessoes.get(chatId)

  if (!sessao || sessao.mode !== 'party')
    return { ok: false, motivo: 'inativa' }

  if (sessao.tracks.length >= MAX_FAIXAS)
    return { ok: false, motivo: 'limite', limite: MAX_FAIXAS }

  const musica = normalizarFaixa(faixa)
  const indice = sessao.tracks.length

  sessao.tracks.push(musica)
  sessao.order.push(indice)
  sessao.totalDurationSeconds = duracaoTotalFaixas(sessao.tracks)

  const deveIniciar =
    sessao.waiting &&
    !sessao.paused &&
    !sessao.sending

  if (deveIniciar) {
    sessao.position = Math.max(0, sessao.order.length - 1)
    await tocarAtual(sessao)
  } else {
    iniciarPreload(sessao)
  }

  return {
    ok: true,
    faixa: musica,
    total: sessao.tracks.length,
    status: status(chatId)
  }
}

const parar = chatId => {
  const sessao = sessoes.get(chatId)

  if (!sessao)
    return false

  sessao.stopped = true
  cancelarTimer(sessao)
  limparPreload(sessao)
  sessoes.delete(chatId)

  return true
}

const pausar = chatId => {
  const sessao = sessoes.get(chatId)

  if (!sessao || sessao.paused)
    return false

  if (sessao.currentStartedAt && sessao.currentDurationMs) {
    sessao.currentElapsedMs = Math.min(
      sessao.currentDurationMs,
      Math.max(0, Date.now() - sessao.currentStartedAt)
    )
  }

  if (sessao.timer) {
    sessao.remainingMs = Math.max(1000, sessao.nextAt - Date.now())
    cancelarTimer(sessao)
  }

  sessao.paused = true
  sessao.nextAt = 0

  return true
}

const continuar = chatId => {
  const sessao = sessoes.get(chatId)

  if (!sessao || !sessao.paused)
    return false

  sessao.paused = false

  if (sessao.currentDurationMs > 0) {
    sessao.currentStartedAt = Date.now() - Math.max(0, Number(sessao.currentElapsedMs || 0))
  }

  if (sessao.mode === 'party' && sessao.waiting && sessao.order.length) {
    if (sessao.position < 0)
      sessao.position = 0

    tocarAtual(sessao).catch(() => {})
    return true
  }

  if (sessao.remainingMs > 0)
    agendar(sessao, sessao.remainingMs)

  iniciarPreload(sessao)

  return true
}

const proxima = async chatId => {
  const sessao = sessoes.get(chatId)

  if (!sessao)
    return { ok: false, motivo: 'inativa' }

  cancelarTimer(sessao)
  limparPreload(sessao)
  sessao.paused = false

  if (sessao.position + 1 < sessao.order.length) {
    sessao.position += 1
    await tocarAtual(sessao)
    return { ok: true, status: status(chatId) }
  }

  if (sessao.mode === 'party') {
    sessao.waiting = true
    return { ok: false, motivo: 'fim-party' }
  }

  if (sessao.loop) {
    resetarOrdem(sessao)
    await tocarAtual(sessao)
    return { ok: true, status: status(chatId) }
  }

  parar(chatId)
  return { ok: false, motivo: 'fim' }
}

const anterior = async chatId => {
  const sessao = sessoes.get(chatId)

  if (!sessao)
    return { ok: false, motivo: 'inativa' }

  cancelarTimer(sessao)
  limparPreload(sessao)
  sessao.paused = false

  if (sessao.position > 0) {
    sessao.position -= 1
    await tocarAtual(sessao)
    return { ok: true, status: status(chatId) }
  }

  if (sessao.loop && sessao.order.length) {
    sessao.position = sessao.order.length - 1
    await tocarAtual(sessao)
    return { ok: true, status: status(chatId) }
  }

  return { ok: false, motivo: 'inicio' }
}

const alternarLoop = chatId => {
  const sessao = sessoes.get(chatId)

  if (!sessao || sessao.mode === 'party')
    return null

  sessao.loop = !sessao.loop
  iniciarPreload(sessao)

  return sessao.loop
}

const alternarAleatorio = chatId => {
  const sessao = sessoes.get(chatId)

  if (!sessao || sessao.mode === 'party')
    return null

  sessao.shuffle = !sessao.shuffle

  const prefixo = sessao.order.slice(0, sessao.position + 1)
  const usados = new Set(prefixo)
  let restantes = sessao.tracks
    .map((_, indice) => indice)
    .filter(indice => !usados.has(indice))

  if (sessao.shuffle)
    restantes = embaralhar(restantes)

  sessao.order = [...prefixo, ...restantes]
  iniciarPreload(sessao)

  return sessao.shuffle
}

const status = chatId => {
  const sessao = sessoes.get(chatId)

  if (!sessao)
    return null

  const trackIndex = sessao.order[sessao.position]
  const atual = sessao.tracks[trackIndex] || null
  const nextIndex = sessao.order[sessao.position + 1]
  const proximaFaixa = sessao.tracks[nextIndex] || null

  let proximoEnvioMs = sessao.remainingMs

  if (sessao.timer && sessao.nextAt)
    proximoEnvioMs = Math.max(0, sessao.nextAt - Date.now())

  let decorridoMs = Math.max(0, Number(sessao.currentElapsedMs || 0))

  if (!sessao.paused && sessao.currentStartedAt && sessao.currentDurationMs) {
    decorridoMs = Math.min(
      sessao.currentDurationMs,
      Math.max(0, Date.now() - sessao.currentStartedAt)
    )
  }

  const duracaoAtualMs = Math.max(0, Number(sessao.currentDurationMs || 0))
  const restanteFaixaMs = duracaoAtualMs > 0
    ? Math.max(0, duracaoAtualMs - decorridoMs)
    : 0

  return {
    id: sessao.id,
    mode: sessao.mode,
    ownerId: sessao.ownerId,
    nome: sessao.nome,
    total: sessao.tracks.length,
    posicao: sessao.position >= 0 ? sessao.position + 1 : 0,
    atual: atual ? clonar(atual) : null,
    proxima: proximaFaixa ? clonar(proximaFaixa) : null,
    pausada: sessao.paused,
    esperando: sessao.waiting,
    loop: sessao.loop,
    aleatorio: sessao.shuffle,
    decorridoSegundos: Math.floor(decorridoMs / 1000),
    restanteSegundos: Math.ceil(restanteFaixaMs / 1000),
    proximoEnvioSegundos: Math.ceil(proximoEnvioMs / 1000),
    duracaoAtualSegundos: Math.ceil(duracaoAtualMs / 1000),
    duracaoTotalSegundos: Math.floor(sessao.totalDurationSeconds || duracaoTotalFaixas(sessao.tracks)),
    duracaoTotal: formatarDuracao(sessao.totalDurationSeconds || duracaoTotalFaixas(sessao.tracks)),
    criadoEm: sessao.playlistCriadoEm || '',
    global: Boolean(sessao.sourceGlobal),
    preload: Boolean(sessao.preload)
  }
}

const filaParty = chatId => {
  const sessao = sessoes.get(chatId)

  if (!sessao || sessao.mode !== 'party')
    return null

  const atual = status(chatId)
  const proximas = sessao.order
    .slice(Math.max(0, sessao.position + 1))
    .map(indice => sessao.tracks[indice])
    .filter(Boolean)
    .map(clonar)

  return {
    ...atual,
    proximas
  }
}

const sessao = chatId => sessoes.get(chatId) || null

const podeControlar = (chatId, sender, isAdmin = false, isOwner = false) => {
  const atual = sessoes.get(chatId)

  if (!atual)
    return false

  return Boolean(
    isOwner ||
    isAdmin ||
    String(atual.ownerId || '') === String(sender || '')
  )
}

const limparCacheAntigo = () => {
  try {
    garantirPasta(CACHE_DIR)
    const limite = Date.now() - 6 * 60 * 60 * 1000

    for (const nome of fs.readdirSync(CACHE_DIR)) {
      const local = path.join(CACHE_DIR, nome)

      try {
        const stat = fs.statSync(local)

        if (stat.isFile() && stat.mtimeMs < limite)
          fs.unlinkSync(local)
      }
      catch {}
    }
  }
  catch {}
}

limparCacheAntigo()

module.exports = {
  ARQUIVO,
  MAX_FAIXAS,
  MAX_IMPORTADAS,
  normalizarNome,
  parseDuracao,
  formatarDuracao,
  duracaoTotalFaixas,
  listar,
  obter,
  criar,
  apagar,
  renomear,
  adicionarFaixa,
  adicionarVarias,
  removerFaixa,
  limparPlaylist,
  buscarFaixa,
  importarYoutube,
  iniciar,
  iniciarParty,
  adicionarParty,
  parar,
  pausar,
  continuar,
  proxima,
  anterior,
  alternarLoop,
  alternarAleatorio,
  status,
  filaParty,
  sessao,
  podeControlar
}
