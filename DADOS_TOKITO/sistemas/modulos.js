/* Recursos compartilhados dos sistemas modulares. Dev: Dylan Modz */

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const crypto = require('crypto')

const BASE = path.join(__dirname, '..', 'database', 'sistemas')

if (!fs.existsSync(BASE)) fs.mkdirSync(BASE, { recursive: true })

const arq = n => path.join(BASE, n)

const ler = (n, p = {}) => {
  try {
    const d = JSON.parse(fs.readFileSync(arq(n), 'utf8'))
    return d && typeof d === 'object' ? d : p
  } catch {
    return JSON.parse(JSON.stringify(p))
  }
}

const salvar = (n, d) => {
  fs.writeFileSync(arq(n), JSON.stringify(d, null, 2) + '\n')
  return d
}

const GLOBAL_PADRAO = {
  visualizarmsg: false,
  antipv: false,
  audioMenu: false,
  audioMenuArquivo: '',
  bloqueados: []
}

const globalCfg = () => ({
  ...GLOBAL_PADRAO,
  ...ler('global.json', GLOBAL_PADRAO)
})

const salvarGlobal = d => salvar('global.json', {
  ...GLOBAL_PADRAO,
  ...d,
  bloqueados: [...new Set((d?.bloqueados || []).map(String).filter(Boolean))]
})

const noPrefix = () => ler('noprefix.json', {})
const salvarNoPrefix = d => salvar('noprefix.json', d)
const figuras = () => ler('figuras.json', {})
const salvarFiguras = d => salvar('figuras.json', d)
const takes = () => ler('take.json', {})
const salvarTakes = d => salvar('take.json', d)

const pendentesAtivar = global.__TOKITO_ATIVAR__ ||= new Map()
const pendentesSairall = global.__TOKITO_SAIRALL__ ||= new Map()

const norm = s => String(s || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ')

const hashSticker = m => {
  const b = m?.stickerMessage?.fileSha256 || m?.stickerMessage?.fileEncSha256
  return Buffer.isBuffer(b) ? b.toString('base64') : b ? Buffer.from(b).toString('base64') : ''
}

const desenrolarMensagem = mensagem => {
  let atual = mensagem || {}

  for (let i = 0; i < 12; i++) {
    if (atual?.ephemeralMessage?.message) {
      atual = atual.ephemeralMessage.message
      continue
    }
    if (atual?.viewOnceMessage?.message) {
      atual = atual.viewOnceMessage.message
      continue
    }
    if (atual?.viewOnceMessageV2?.message) {
      atual = atual.viewOnceMessageV2.message
      continue
    }
    if (atual?.viewOnceMessageV2Extension?.message) {
      atual = atual.viewOnceMessageV2Extension.message
      continue
    }
    if (atual?.documentWithCaptionMessage?.message) {
      atual = atual.documentWithCaptionMessage.message
      continue
    }
    if (atual?.editedMessage?.message) {
      atual = atual.editedMessage.message
      continue
    }
    break
  }

  return atual || {}
}

const contextoMensagem = mensagem => {
  const m = desenrolarMensagem(mensagem)
  return m?.extendedTextMessage?.contextInfo ||
    m?.imageMessage?.contextInfo ||
    m?.videoMessage?.contextInfo ||
    m?.audioMessage?.contextInfo ||
    m?.documentMessage?.contextInfo ||
    m?.stickerMessage?.contextInfo ||
    {}
}

const mensagemRespondida = ctx => {
  const contexto = ctx?.ctxMsg?.quotedMessage
    ? ctx.ctxMsg
    : contextoMensagem(ctx?.mensagem)

  return desenrolarMensagem(contexto?.quotedMessage || {})
}

const audioMensagemAtual = ctx => {
  const atual = desenrolarMensagem(ctx?.mensagem || {})
  return atual?.audioMessage || null
}

const audioAtual = ctx => {
  const atual = audioMensagemAtual(ctx)
  const respondida = mensagemRespondida(ctx)

  // Prioridade para o áudio NOVO da mensagem atual.
  // O áudio respondido só é usado quando não existe áudio atual.
  return atual || respondida?.audioMessage || null
}

const mediaAtual = ctx => {
  const atual = desenrolarMensagem(ctx?.mensagem || {})
  const respondida = mensagemRespondida(ctx)

  return {
    image: atual?.imageMessage || respondida?.imageMessage || null,
    video: atual?.videoMessage || respondida?.videoMessage || null,
    audio: atual?.audioMessage || respondida?.audioMessage || null,
    document: atual?.documentMessage || respondida?.documentMessage || null,
    sticker: atual?.stickerMessage || respondida?.stickerMessage || null,
    poll: atual?.pollCreationMessage ||
      atual?.pollCreationMessageV2 ||
      atual?.pollCreationMessageV3 ||
      respondida?.pollCreationMessage ||
      respondida?.pollCreationMessageV2 ||
      respondida?.pollCreationMessageV3 ||
      null
  }
}

const extensaoSegura = ext => {
  const limpa = String(ext || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')
  return limpa || 'bin'
}

const mimetypeExt = ext => {
  switch (String(ext || '').toLowerCase()) {
    case 'mp3': return 'audio/mpeg'
    case 'm4a': return 'audio/mp4'
    case 'wav': return 'audio/wav'
    case 'webm': return 'audio/webm'
    case 'ogg':
    case 'opus': return 'audio/ogg'
    default: return 'application/octet-stream'
  }
}

const uploadTemp = async (buffer, ext = 'bin') => {
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw new Error('Arquivo vazio para upload.')

  const extensao = extensaoSegura(ext)
  const form = new FormData()

  form.append('file', buffer, {
    filename: `tokito_${Date.now()}.${extensao}`,
    contentType: mimetypeExt(extensao)
  })

  const resposta = await axios.post('https://tmpfile.link/api/upload', form, {
    headers: {
      ...form.getHeaders(),
      Accept: 'application/json'
    },
    timeout: 120000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    validateStatus: () => true
  })

  if (resposta.status < 200 || resposta.status >= 300) {
    throw new Error(`Falha ao hospedar áudio. HTTP ${resposta.status}`)
  }

  const url = String(
    resposta.data?.downloadLink ||
    resposta.data?.download_link ||
    resposta.data?.url ||
    ''
  ).trim()

  if (!/^https?:\/\//i.test(url)) {
    throw new Error('O servidor temporário não retornou uma URL válida.')
  }

  const teste = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 60000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    validateStatus: () => true
  })

  if (teste.status < 200 || teste.status >= 300 || !teste.data?.length) {
    throw new Error(`O áudio hospedado não está acessível. HTTP ${teste.status}`)
  }

  return url
}

// Compatibilidade com plugins antigos. Todos usam o uploader atual.
const uploadPomfSpace = async (buffer, ext = 'bin') => uploadTemp(buffer, ext)
const uploadTmpFiles = async (buffer, ext = 'bin') => uploadTemp(buffer, ext)
const uploadCatbox = async (buffer, ext = 'bin') => uploadTemp(buffer, ext)

const transcrever = async (ctx, audio = null) => {
  const audioFinal = audio || audioAtual(ctx)

  if (!audioFinal) throw new Error('Áudio não encontrado.')
  if (typeof ctx?.getFileBuffer !== 'function') throw new Error('getFileBuffer não está disponível no contexto.')

  const buffer = await ctx.getFileBuffer(audioFinal, 'audio')
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw new Error('Não foi possível baixar o áudio.')

  const mime = String(audioFinal?.mimetype || 'audio/ogg').toLowerCase()
  let ext = 'ogg'

  if (mime.includes('mpeg')) ext = 'mp3'
  else if (mime.includes('mp4')) ext = 'm4a'
  else if (mime.includes('wav')) ext = 'wav'
  else if (mime.includes('webm')) ext = 'webm'
  else if (mime.includes('opus')) ext = 'ogg'

  const url = await uploadTemp(buffer, ext)
  let resposta

  try {
    resposta = await axios.get(`${ctx.API_URL}/api/outros/totext`, {
      params: {
        apikey: ctx.API_KEY_TOKITO,
        url
      },
      timeout: 180000,
      validateStatus: () => true
    })
  } catch (erro) {
    throw marcarErroApi(erro)
  }

  const data = resposta?.data

  if (resposta.status < 200 || resposta.status >= 300) {
    const erro = new Error(
      data?.mensagem ||
      data?.message ||
      data?.error ||
      `Erro HTTP ${resposta.status} na API de transcrição.`
    )
    erro.response = { status: resposta.status, data }
    throw marcarErroApi(erro)
  }

  if (data?.status === false) {
    const erro = new Error(
      data?.mensagem ||
      data?.message ||
      data?.error ||
      'Falha ao transcrever o áudio.'
    )
    erro.response = { status: resposta.status, data }
    throw marcarErroApi(erro)
  }

  const resultado = data?.resultado || data?.result || {}
  const texto = String(
    resultado?.texto ||
    resultado?.text ||
    data?.texto ||
    data?.text ||
    ''
  ).trim()

  if (!texto) {
    throw new Error(
      data?.mensagem ||
      data?.message ||
      'A API não retornou o texto da transcrição.'
    )
  }

  return {
    texto,
    url,
    duracao: resultado?.duracao ?? resultado?.duration ?? null,
    idioma: resultado?.idioma ?? resultado?.language ?? null,
    confidence: resultado?.confidence ?? resultado?.confianca ?? null,
    palavras: resultado?.palavras ?? resultado?.words ?? null,
    resultado,
    data
  }
}

/* ============================================================
 * SHAZAM — reconhecimento por áudio ou vídeo
 * Dev: Dylan Modz
 * ============================================================ */

const SHAZAM_ENDPOINT = 'https://songfinder.dev/api/music/recognize'
const SHAZAM_MAX_BYTES = 10 * 1024 * 1024
const SHAZAM_DOWNLOAD_TIMEOUT = 45000
const SHAZAM_RECOGNIZE_TIMEOUT = 65000
const SHAZAM_AUDIO_TIMEOUT = 40000

const erroShazam = (codigo, mensagem) => {
  const erro = new Error(mensagem)
  erro.code = codigo
  return erro
}

const comTimeoutShazam = (promessa, tempo, codigo, mensagem) => {
  let timer = null

  const limite = new Promise((_, reject) => {
    timer = setTimeout(() => reject(erroShazam(codigo, mensagem)), tempo)
  })

  return Promise.race([promessa, limite])
    .finally(() => {
      if (timer) clearTimeout(timer)
    })
}

const numeroSeguroShazam = valor => {
  if (valor == null) return 0
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0
  if (typeof valor === 'bigint') return Number(valor)

  try {
    if (typeof valor?.toNumber === 'function') {
      const numero = valor.toNumber()
      return Number.isFinite(numero) ? numero : 0
    }

    const numero = Number(valor?.toString?.() ?? valor)
    return Number.isFinite(numero) ? numero : 0
  } catch {
    return 0
  }
}

const extensaoShazam = (mime = '', tipo = 'audio') => {
  const valor = String(mime || '').toLowerCase()

  if (tipo === 'video') {
    if (valor.includes('webm')) return 'webm'
    if (valor.includes('quicktime')) return 'mov'
    if (valor.includes('x-matroska')) return 'mkv'
    return 'mp4'
  }

  if (valor.includes('mpeg')) return 'mp3'
  if (valor.includes('mp4') || valor.includes('m4a')) return 'm4a'
  if (valor.includes('wav')) return 'wav'
  if (valor.includes('webm')) return 'webm'
  if (valor.includes('flac')) return 'flac'
  return 'ogg'
}

const selecionarMidiaShazam = (ctx, alvo = null) => {
  if (alvo?.midia) {
    return {
      tipo: alvo.tipo === 'video' ? 'video' : 'audio',
      midia: alvo.midia
    }
  }

  if (alvo && typeof alvo === 'object') {
    const mime = String(alvo?.mimetype || '').toLowerCase()

    if (mime.startsWith('video/')) return { tipo: 'video', midia: alvo }
    if (mime.startsWith('audio/')) return { tipo: 'audio', midia: alvo }
  }

  const midias = mediaAtual(ctx)

  if (midias.audio) return { tipo: 'audio', midia: midias.audio }
  if (midias.video) return { tipo: 'video', midia: midias.video }

  return null
}

const extrairYoutubeIdShazam = valor => {
  const texto = String(valor || '').trim()
  if (!texto) return null
  if (/^[A-Za-z0-9_-]{11}$/.test(texto)) return texto

  const match = texto.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/i)
  return match?.[1] || null
}

const extrairSpotifyIdShazam = valor => {
  const texto = String(valor || '').trim()
  if (!texto) return null
  if (/^[A-Za-z0-9]{20,30}$/.test(texto)) return texto
  return texto.match(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/i)?.[1] || null
}

const extrairDeezerIdShazam = valor => {
  const texto = String(valor || '').trim()
  if (!texto) return null
  if (/^\d+$/.test(texto)) return texto
  return texto.match(/deezer\.com\/(?:[a-z]{2}\/)?track\/(\d+)/i)?.[1] || null
}

const formatarDuracaoShazam = valor => {
  if (valor == null || valor === '') return null

  if (typeof valor === 'string' && valor.includes(':')) return valor

  const numero = Number(valor)
  if (!Number.isFinite(numero) || numero <= 0) return String(valor)

  const segundos = numero > 10000 ? Math.round(numero / 1000) : Math.round(numero)
  const min = Math.floor(segundos / 60)
  const seg = segundos % 60
  return `${min}:${String(seg).padStart(2, '0')}`
}

const identificarMusica = async (ctx, alvo = null) => {
  const selecionada = selecionarMidiaShazam(ctx, alvo)

  if (!selecionada?.midia) {
    throw erroShazam(
      'SHAZAM_SEM_MIDIA',
      'Responda um áudio, mensagem de voz ou vídeo com música.'
    )
  }

  if (typeof ctx?.getFileBuffer !== 'function') {
    throw erroShazam('SHAZAM_DOWNLOAD', 'getFileBuffer não está disponível no contexto.')
  }

  const { tipo, midia } = selecionada
  const tamanhoDeclarado = numeroSeguroShazam(midia?.fileLength)

  if (tamanhoDeclarado > SHAZAM_MAX_BYTES) {
    throw erroShazam(
      'SHAZAM_ARQUIVO_GRANDE',
      'A mídia ultrapassa o limite de 10 MB.'
    )
  }

  let buffer

  try {
    buffer = await comTimeoutShazam(
      Promise.resolve(ctx.getFileBuffer(midia, tipo)),
      SHAZAM_DOWNLOAD_TIMEOUT,
      'SHAZAM_TIMEOUT_DOWNLOAD',
      'A mídia demorou demais para baixar do WhatsApp.'
    )
  } catch (erro) {
    if (erro?.code) throw erro
    throw erroShazam(
      'SHAZAM_DOWNLOAD',
      erro?.message || 'Não foi possível baixar a mídia.'
    )
  }

  if (!Buffer.isBuffer(buffer) || !buffer.length) {
    throw erroShazam('SHAZAM_DOWNLOAD', 'Não foi possível baixar a mídia.')
  }

  if (buffer.length > SHAZAM_MAX_BYTES) {
    throw erroShazam(
      'SHAZAM_ARQUIVO_GRANDE',
      'A mídia ultrapassa o limite de 10 MB.'
    )
  }

  const mimeOriginal = String(
    midia?.mimetype || (tipo === 'video' ? 'video/mp4' : 'audio/ogg')
  )
  const mime = mimeOriginal.split(';')[0].trim() || (tipo === 'video' ? 'video/mp4' : 'audio/ogg')
  const ext = extensaoShazam(mimeOriginal, tipo)
  const form = new FormData()

  form.append('file', buffer, {
    filename: `tokito_shazam_${Date.now()}.${ext}`,
    contentType: mime
  })
  form.append('source', 'cli')

  let resposta

  try {
    resposta = await axios.post(SHAZAM_ENDPOINT, form, {
      headers: {
        ...form.getHeaders(),
        'X-SongFinder-Client': 'cli',
        Accept: 'application/json'
      },
      timeout: SHAZAM_RECOGNIZE_TIMEOUT,
      maxBodyLength: SHAZAM_MAX_BYTES + (1024 * 1024),
      maxContentLength: SHAZAM_MAX_BYTES + (1024 * 1024),
      validateStatus: () => true
    })
  } catch (erro) {
    const timeout = erro?.code === 'ECONNABORTED' || /timeout/i.test(String(erro?.message || ''))

    throw erroShazam(
      timeout ? 'SHAZAM_TIMEOUT_RECONHECER' : 'SHAZAM_SERVICO',
      timeout
        ? 'O reconhecimento demorou demais para responder.'
        : (erro?.message || 'Falha ao consultar o identificador de músicas.')
    )
  }

  const payload = resposta?.data || {}

  if (resposta.status === 429) {
    throw erroShazam('SHAZAM_LIMITE', 'Limite temporário do identificador atingido.')
  }

  if (resposta.status === 413) {
    throw erroShazam('SHAZAM_ARQUIVO_GRANDE', 'A mídia ultrapassa o limite aceito.')
  }

  if (resposta.status < 200 || resposta.status >= 300) {
    throw erroShazam(
      'SHAZAM_SERVICO',
      payload?.message || payload?.error || `SongFinder respondeu HTTP ${resposta.status}.`
    )
  }

  const musica = payload?.data || payload?.result || payload?.resultado || {}
  const titulo = String(musica?.title || musica?.titulo || '').trim()
  const artista = String(musica?.artist || musica?.artista || '').trim()

  if (!titulo && !artista) {
    return {
      matched: false,
      raw: musica
    }
  }

  const spotifyUrl = musica?.spotifyUrl || musica?.spotify_url || musica?.spotify || null
  const youtubeUrl = musica?.youtubeUrl || musica?.youtube_url || musica?.youtube || null
  const deezerUrl = musica?.deezerUrl || musica?.deezer_url || musica?.deezer || null
  const lancamento = musica?.releaseDate || musica?.release_date || musica?.date || musica?.data || null
  const genero = musica?.genre || musica?.genero || (Array.isArray(musica?.genres) ? musica.genres[0] : null)
  const duracao = formatarDuracaoShazam(
    musica?.durationText ?? musica?.duration ?? musica?.duracao ?? null
  )
  const busca = [titulo, artista].filter(Boolean).join(' - ')

  return {
    matched: true,
    titulo: titulo || 'Não informado',
    artista: artista || 'Não informado',
    album: musica?.album || null,

    // Campos compatíveis com mensagens.js atual.
    data: lancamento,
    genero: genero || null,
    duracao,
    youtube: extrairYoutubeIdShazam(youtubeUrl),
    spotify: extrairSpotifyIdShazam(spotifyUrl),
    deezer: extrairDeezerIdShazam(deezerUrl),

    // Campos completos do SongFinder.
    lancamento,
    gravadora: musica?.label || musica?.gravadora || null,
    capa: musica?.artworkUrl || musica?.artwork_url || musica?.cover || musica?.capa || null,
    link: musica?.songLink || musica?.song_link || musica?.link || null,
    spotifyUrl,
    appleMusic: musica?.appleMusicUrl || musica?.apple_music_url || null,
    youtubeUrl,
    deezerUrl,
    score: musica?.score ?? musica?.confidence ?? null,
    engine: musica?.engine || null,
    busca,
    tipoMidia: tipo,
    raw: musica
  }
}

const buscarAudioShazam = async (ctx, musica = {}) => {
  const busca = String(
    musica?.busca || [musica?.titulo, musica?.artista].filter(Boolean).join(' - ')
  ).trim()

  const apiKey = String(ctx?.API_KEY_TOKITO || '').trim()
  const baseApi = String(ctx?.API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, '')

  if (!apiKey || !busca) return null

  let resposta

  try {
    resposta = await axios.get(`${baseApi}/api/youtube-play`, {
      params: {
        query: busca,
        apikey: apiKey
      },
      timeout: SHAZAM_AUDIO_TIMEOUT,
      maxBodyLength: 1024 * 1024,
      maxContentLength: 1024 * 1024,
      validateStatus: () => true
    })
  } catch (erro) {
    throw erroShazam(
      'SHAZAM_AUDIO',
      /timeout/i.test(String(erro?.message || ''))
        ? 'A busca do MP3 demorou demais.'
        : (erro?.message || 'Falha ao buscar o MP3.')
    )
  }

  const data = resposta?.data || {}
  const resultado = data?.resultado || data?.result || data?.data || {}
  const url = String(
    resultado?.download ||
    resultado?.downloadUrl ||
    resultado?.download_url ||
    resultado?.audio ||
    data?.download ||
    data?.url ||
    ''
  ).trim()

  if (
    resposta.status < 200 ||
    resposta.status >= 300 ||
    data?.status === false ||
    !/^https?:\/\//i.test(url)
  ) {
    throw erroShazam(
      'SHAZAM_AUDIO',
      data?.message || data?.mensagem || data?.error || 'A API não retornou um MP3 válido.'
    )
  }

  return {
    url,
    titulo: resultado?.title || resultado?.titulo || musica?.titulo || 'musica',
    artista: resultado?.author?.name || resultado?.artist || musica?.artista || ''
  }
}

const siteApi = valor => {
  try {
    return new URL(String(valor || 'https://tokito-apis.com.br')).origin
  } catch {
    return 'https://tokito-apis.com.br'
  }
}

const parteErro = valor => {
  if (valor == null) return ''
  if (typeof valor === 'string') return valor
  if (typeof valor === 'number' || typeof valor === 'boolean') return String(valor)

  try {
    return JSON.stringify(valor)
  } catch {
    return String(valor)
  }
}

const textoErro = erro => {
  if (erro == null) return ''
  if (typeof erro === 'string') return erro

  const partes = [
    erro?.message,
    erro?.response?.data?.mensagem,
    erro?.response?.data?.message,
    erro?.response?.data?.error,
    erro?.response?.data?.resultado,
    erro?.config?.url,
    erro?.request?.url
  ].filter(Boolean).map(parteErro).filter(Boolean)

  if (!partes.length) {
    try {
      return JSON.stringify(erro)
    } catch {
      return String(erro)
    }
  }

  return partes.join(' | ')
}

const sanitizarErro = (erro, segredos = []) => {
  let texto = textoErro(erro)

  texto = texto
    .replace(/([?&](?:apikey|api_key|key|token|access_token|authorization)=)[^&\s]+/gi, '$1***')
    .replace(/(["']?(?:apikey|api_key|key|token|access_token)["']?\s*[:=]\s*["'])[^"']+(["'])/gi, '$1***$2')
    .replace(/(authorization\s*:\s*bearer\s+)[^\s,;]+/gi, '$1***')
    .replace(/(bearer\s+)[A-Za-z0-9._~+\/=-]{12,}/gi, '$1***')

  for (const segredo of segredos) {
    const valor = String(segredo || '').trim()
    if (valor) texto = texto.split(valor).join('***')
  }

  return texto.slice(0, 3000)
}

const marcarErroApi = erro => {
  if (erro && typeof erro === 'object') erro.__tokitoApi = true
  return erro
}

const ehErroApi = (erro, apiUrl = '') => {
  if (erro?.__tokitoApi) return true

  const texto = textoErro(erro).toLowerCase()
  const origem = siteApi(apiUrl).toLowerCase()

  if (texto.includes('tokito-apis.com.br')) return true
  if (origem && texto.includes(origem)) return true

  return /[?&](?:apikey|api_key)=/i.test(texto)
}

const responderErroApi = async (ctx, erro, origem = 'API') => {
  const limpo = sanitizarErro(erro, [ctx?.API_KEY_TOKITO])
  console.log(`[ ${origem} • TOKITO ]`, limpo || 'Erro sem detalhes')

  if (typeof ctx?.reply === 'function' && ctx?.mess?.erroApi) {
    return ctx.reply(ctx.mess.erroApi(siteApi(ctx.API_URL)))
  }

  return false
}

const alvoHash = jid => crypto
  .createHash('sha1')
  .update(String(jid || ''))
  .digest('hex')
  .slice(0, 16)

const garantirFuncoes = ctx => {
  if (!ctx.dataGp?.[0]) return {}

  if (!ctx.dataGp[0].funcoes || typeof ctx.dataGp[0].funcoes !== 'object') {
    ctx.dataGp[0].funcoes = {}
  }

  return ctx.dataGp[0].funcoes
}

module.exports = {
  BASE,
  ler,
  salvar,
  globalCfg,
  salvarGlobal,
  noPrefix,
  salvarNoPrefix,
  figuras,
  salvarFiguras,
  takes,
  salvarTakes,
  pendentesAtivar,
  pendentesSairall,
  norm,
  hashSticker,
  desenrolarMensagem,
  contextoMensagem,
  mensagemRespondida,
  audioMensagemAtual,
  audioAtual,
  mediaAtual,
  uploadTemp,
  uploadPomfSpace,
  uploadTmpFiles,
  uploadCatbox,
  transcrever,
  identificarMusica,
  buscarAudioShazam,
  siteApi,
  sanitizarErro,
  marcarErroApi,
  ehErroApi,
  responderErroApi,
  alvoHash,
  garantirFuncoes
}
