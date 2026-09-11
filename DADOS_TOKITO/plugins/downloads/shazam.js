/*
 * ============================================================
 *                         TOKITO BOT V10
 * ============================================================
 *  Arquivo: shazam.js
 *  Função : Identificar música através de áudio, voz ou vídeo
 *  Dev    : Dylan Modz
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')

const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg')
const modulos = require('../../sistemas/modulos')

const MAX_MIDIA = 20 * 1024 * 1024
const DOWNLOAD_TIMEOUT = 45000
const FFMPEG_TIMEOUT = 35000
const RECONHECER_TIMEOUT = 45000
const AUDIO_TIMEOUT = 45000

let ultraCache = null

const erro = (code, message, cause = null) => {
  const e = new Error(message)
  e.code = code
  if (cause) e.cause = cause
  return e
}

const comTimeout = (promessa, tempo, code, message) => {
  let timer

  const limite = new Promise((_, reject) => {
    timer = setTimeout(() => reject(erro(code, message)), tempo)
  })

  return Promise.race([promessa, limite])
    .finally(() => clearTimeout(timer))
}

const numero = valor => {
  if (valor == null) return 0
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0
  if (typeof valor === 'bigint') return Number(valor)

  try {
    if (typeof valor?.toNumber === 'function') return Number(valor.toNumber()) || 0
    return Number(valor?.toString?.() ?? valor) || 0
  } catch {
    return 0
  }
}

const extensao = (mime = '', tipo = 'audio') => {
  const valor = String(mime || '').toLowerCase()

  if (tipo === 'video') {
    if (valor.includes('webm')) return 'webm'
    if (valor.includes('quicktime')) return 'mov'
    if (valor.includes('matroska')) return 'mkv'
    return 'mp4'
  }

  if (valor.includes('mpeg')) return 'mp3'
  if (valor.includes('mp4') || valor.includes('m4a')) return 'm4a'
  if (valor.includes('wav')) return 'wav'
  if (valor.includes('webm')) return 'webm'
  if (valor.includes('aac')) return 'aac'
  if (valor.includes('flac')) return 'flac'
  return 'ogg'
}

const selecionar = ctx => {
  const midias = modulos.mediaAtual(ctx)

  if (midias?.audio) {
    return { tipo: 'audio', midia: midias.audio }
  }

  if (midias?.video) {
    return { tipo: 'video', midia: midias.video }
  }

  return null
}

const baixar = async (ctx, alvo) => {
  if (!alvo?.midia) {
    throw erro('SHAZAM_SEM_MIDIA', 'Mídia não encontrada.')
  }

  if (typeof ctx?.getFileBuffer !== 'function') {
    throw erro('SHAZAM_DOWNLOAD', 'getFileBuffer não está disponível.')
  }

  if (numero(alvo.midia?.fileLength) > MAX_MIDIA) {
    throw erro('SHAZAM_ARQUIVO_GRANDE', 'A mídia ultrapassa 20 MB.')
  }

  let buffer

  try {
    buffer = await comTimeout(
      Promise.resolve(ctx.getFileBuffer(alvo.midia, alvo.tipo)),
      DOWNLOAD_TIMEOUT,
      'SHAZAM_TIMEOUT_DOWNLOAD',
      'O download da mídia demorou demais.'
    )
  } catch (e) {
    if (e?.code) throw e
    throw erro('SHAZAM_DOWNLOAD', e?.message || 'Falha ao baixar a mídia.', e)
  }

  if (!Buffer.isBuffer(buffer) || !buffer.length) {
    throw erro('SHAZAM_DOWNLOAD', 'O WhatsApp não retornou a mídia.')
  }

  if (buffer.length > MAX_MIDIA) {
    throw erro('SHAZAM_ARQUIVO_GRANDE', 'A mídia ultrapassa 20 MB.')
  }

  return buffer
}

const prepararTrecho = async (buffer, mime = 'audio/ogg', tipo = 'audio') => {
  const id = crypto.randomBytes(8).toString('hex')
  const entrada = path.join(os.tmpdir(), `tokito-shazam-${id}.${extensao(mime, tipo)}`)
  const saida = path.join(os.tmpdir(), `tokito-shazam-${id}.wav`)

  fs.writeFileSync(entrada, buffer)

  let comando
  let timer

  try {
    await new Promise((resolve, reject) => {
      let finalizado = false

      const fim = falha => {
        if (finalizado) return
        finalizado = true
        clearTimeout(timer)
        falha ? reject(falha) : resolve()
      }

      comando = ffmpeg(entrada)
        .noVideo()
        .audioChannels(1)
        .audioFrequency(16000)
        .duration(20)
        .format('wav')
        .on('end', () => fim())
        .on('error', falha => fim(falha))
        .save(saida)

      timer = setTimeout(() => {
        try { comando?.kill('SIGKILL') } catch {}
        fim(erro('SHAZAM_TIMEOUT_CONVERSAO', 'A conversão demorou demais.'))
      }, FFMPEG_TIMEOUT)
    })

    const sample = fs.readFileSync(saida)

    if (!sample.length) {
      throw erro('SHAZAM_CONVERSAO', 'Não foi possível preparar o trecho de áudio.')
    }

    return { buffer: sample, arquivo: saida, entrada }
  } catch (e) {
    try { fs.unlinkSync(entrada) } catch {}
    try { fs.unlinkSync(saida) } catch {}

    if (e?.code) throw e
    throw erro('SHAZAM_CONVERSAO', e?.message || 'Falha ao preparar o áudio.', e)
  }
}

const limparTrecho = trecho => {
  try { fs.unlinkSync(trecho?.entrada) } catch {}
  try { fs.unlinkSync(trecho?.arquivo) } catch {}
}

const carregarUltra = async () => {
  if (ultraCache) return ultraCache

  try {
    ultraCache = require('ultra-acrcloud')
    return ultraCache
  } catch (e) {
    if (e?.code !== 'ERR_REQUIRE_ESM') {
      if (e?.code === 'MODULE_NOT_FOUND') {
        throw erro(
          'SHAZAM_MODULO',
          'O módulo ultra-acrcloud não está instalado. Rode npm install.',
          e
        )
      }
      throw erro('SHAZAM_MODULO', e?.message || 'Falha ao carregar ultra-acrcloud.', e)
    }
  }

  try {
    ultraCache = await import('ultra-acrcloud')
    return ultraCache
  } catch (e) {
    throw erro('SHAZAM_MODULO', e?.message || 'Falha ao importar ultra-acrcloud.', e)
  }
}

const parseJson = valor => {
  if (!valor) return valor

  if (Buffer.isBuffer(valor)) {
    valor = valor.toString('utf8')
  }

  if (typeof valor === 'string') {
    try { return JSON.parse(valor) } catch { return valor }
  }

  return valor
}

const pareceErroDeArgumento = e => /buffer|path|file|arquivo|string|argument|input|parameter|tipo|type/i.test(
  String(e?.message || '')
)

const chamarMetodo = async (obj, nome, trecho) => {
  const metodo = obj?.[nome]
  if (typeof metodo !== 'function') return null

  try {
    return await metodo.call(obj, trecho.buffer)
  } catch (e) {
    if (!pareceErroDeArgumento(e)) throw e
    return metodo.call(obj, trecho.arquivo)
  }
}

const metodos = [
  'identify',
  'recognize',
  'recognise',
  'identifyMusic',
  'recognizeMusic',
  'musicRecognition',
  'shazam',
  'search'
]

const executarUltra = async trecho => {
  const modulo = await carregarUltra()
  const candidatos = [
    modulo,
    modulo?.default,
    modulo?.UltraACRCloud,
    modulo?.UltraAcrCloud,
    modulo?.ACRCloud,
    modulo?.acrcloud,
    modulo?.client
  ].filter(Boolean)

  let ultimoErro = null

  for (const candidato of candidatos) {
    if (typeof candidato === 'object') {
      for (const nome of metodos) {
        if (typeof candidato?.[nome] !== 'function') continue

        try {
          return await chamarMetodo(candidato, nome, trecho)
        } catch (e) {
          ultimoErro = e
          break
        }
      }
      continue
    }

    if (typeof candidato !== 'function') continue

    const ehClasse = /^class\s/.test(Function.prototype.toString.call(candidato))
    const temMetodo = metodos.some(nome => typeof candidato?.prototype?.[nome] === 'function')

    if (ehClasse || temMetodo) {
      try {
        const instancia = new candidato()

        for (const nome of metodos) {
          if (typeof instancia?.[nome] !== 'function') continue
          return await chamarMetodo(instancia, nome, trecho)
        }
      } catch (e) {
        ultimoErro = e
      }
      continue
    }

    try {
      return await candidato(trecho.buffer)
    } catch (e) {
      if (!pareceErroDeArgumento(e)) {
        ultimoErro = e
        continue
      }

      try {
        return await candidato(trecho.arquivo)
      } catch (falha) {
        ultimoErro = falha
      }
    }
  }

  throw erro(
    'SHAZAM_ULTRA_INCOMPATIVEL',
    ultimoErro?.message || 'Não encontrei uma função de reconhecimento compatível no ultra-acrcloud.',
    ultimoErro
  )
}

const raizResposta = resposta => {
  const valor = parseJson(resposta)

  if (!valor || typeof valor !== 'object') return valor

  if (valor?.data && typeof valor.data === 'object') return parseJson(valor.data)
  if (valor?.result && typeof valor.result === 'object') return parseJson(valor.result)
  if (valor?.response && typeof valor.response === 'object') return parseJson(valor.response)

  return valor
}

const acharMusica = resposta => {
  const bruto = parseJson(resposta)
  const raiz = raizResposta(bruto)
  const fontes = [bruto, raiz, bruto?.data, bruto?.result, bruto?.response].filter(Boolean)

  for (const fonteOriginal of fontes) {
    const fonte = parseJson(fonteOriginal)
    if (!fonte || typeof fonte !== 'object') continue

    const music = fonte?.metadata?.music
    if (Array.isArray(music) && music[0]) return { musica: music[0], raw: bruto }

    if (Array.isArray(fonte?.music) && fonte.music[0]) {
      const item = fonte.music[0]?.result || fonte.music[0]
      return { musica: item, raw: bruto }
    }

    const item = fonte?.track || fonte?.song || fonte?.music || fonte
    const titulo = item?.title || item?.titulo || item?.name || item?.trackName

    if (titulo && typeof item === 'object' && !Array.isArray(item)) {
      return { musica: item, raw: bruto }
    }
  }

  return { musica: null, raw: bruto }
}

const textoArtista = musica => {
  const lista = musica?.artists || musica?.artist

  if (Array.isArray(lista)) {
    return lista
      .map(item => typeof item === 'string' ? item : item?.name)
      .filter(Boolean)
      .join(', ')
  }

  if (typeof lista === 'object' && lista?.name) return String(lista.name)

  return String(
    musica?.artist_name ||
    musica?.artistName ||
    musica?.author ||
    musica?.subtitle ||
    'Não informado'
  )
}

const duracao = valor => {
  const n = Number(valor || 0)
  if (!Number.isFinite(n) || n <= 0) return null

  const segundos = n > 10000 ? Math.round(n / 1000) : Math.round(n)
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`
}

const urlImagem = musica => {
  const imagens = musica?.album?.images || musica?.images

  if (Array.isArray(imagens) && imagens[0]) {
    return imagens[0]?.url || imagens[0]
  }

  return String(
    musica?.artwork?.url ||
    musica?.artwork ||
    musica?.cover?.url ||
    musica?.cover ||
    musica?.image?.url ||
    musica?.image ||
    musica?.thumbnail ||
    musica?.thumb ||
    ''
  ).trim() || null
}

const idExterno = (musica, servico) => {
  const ext = musica?.external_metadata?.[servico]

  if (servico === 'youtube') {
    return String(
      ext?.vid ||
      ext?.video_id ||
      ext?.id ||
      musica?.youtube?.videoId ||
      musica?.youtube?.id ||
      musica?.youtubeId ||
      ''
    ).trim() || null
  }

  return String(
    ext?.track?.id ||
    ext?.id ||
    musica?.[servico]?.id ||
    musica?.[`${servico}Id`] ||
    ''
  ).trim() || null
}

const normalizar = resposta => {
  const { musica, raw } = acharMusica(resposta)
  const status = raw?.status || raw?.data?.status || {}
  const code = Number(status?.code)

  if (code === 1001) return { matched: false, raw }

  if (Number.isFinite(code) && code !== 0) {
    throw erro(
      'SHAZAM_SERVICO',
      String(status?.msg || status?.message || `Reconhecimento retornou código ${code}.`)
    )
  }

  if (!musica) return { matched: false, raw }

  const titulo = String(
    musica?.title || musica?.titulo || musica?.name || musica?.trackName || ''
  ).trim()

  if (!titulo) return { matched: false, raw }

  const artista = textoArtista(musica)
  const youtube = idExterno(musica, 'youtube')
  const spotify = idExterno(musica, 'spotify')
  const deezer = idExterno(musica, 'deezer')
  const generos = Array.isArray(musica?.genres)
    ? musica.genres.map(item => item?.name || item).filter(Boolean)
    : []

  const capa = urlImagem(musica) || (
    youtube ? `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg` : null
  )

  return {
    matched: true,
    titulo,
    artista,
    album: musica?.album?.name || musica?.album || null,
    data: musica?.release_date || musica?.releaseDate || musica?.date || null,
    lancamento: musica?.release_date || musica?.releaseDate || musica?.date || null,
    gravadora: musica?.label || musica?.record_label || null,
    genero: generos.join(', ') || musica?.genre || null,
    duracao: duracao(musica?.duration_ms || musica?.duration || musica?.durationMs),
    score: musica?.score ?? musica?.confidence ?? null,
    youtube,
    spotify,
    deezer,
    capa,
    busca: `${titulo} ${artista}`.replace(/\s+/g, ' ').trim(),
    acrid: musica?.acrid || null,
    isrc: musica?.external_ids?.isrc || musica?.isrc || null,
    raw
  }
}

const identificar = async ctx => {
  const alvo = selecionar(ctx)

  if (!alvo) {
    throw erro('SHAZAM_SEM_MIDIA', 'Responda um áudio, voz ou vídeo.')
  }

  const buffer = await baixar(ctx, alvo)
  const trecho = await prepararTrecho(
    buffer,
    alvo.midia?.mimetype || (alvo.tipo === 'video' ? 'video/mp4' : 'audio/ogg'),
    alvo.tipo
  )

  try {
    const resposta = await comTimeout(
      executarUltra(trecho),
      RECONHECER_TIMEOUT,
      'SHAZAM_TIMEOUT_RECONHECER',
      'O reconhecimento demorou demais.'
    )

    return normalizar(resposta)
  } catch (e) {
    if (e?.code) throw e
    throw erro('SHAZAM_SERVICO', e?.message || 'Falha ao reconhecer a música.', e)
  } finally {
    limparTrecho(trecho)
  }
}

const buscarAudio = async (ctx, musica = {}) => {
  const apiKey = String(ctx?.API_KEY_TOKITO || '').trim()
  const base = String(ctx?.API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, '')
  const query = String(
    musica?.busca || `${musica?.titulo || ''} ${musica?.artista || ''}`
  ).trim()

  if (!apiKey || !query) return null

  try {
    const resposta = await axios.get(`${base}/api/youtube-play`, {
      params: { query, apikey: apiKey },
      timeout: AUDIO_TIMEOUT,
      validateStatus: () => true
    })

    const dados = resposta?.data || {}
    const result = dados?.resultado || dados?.result || dados?.data || {}
    const url = String(
      result?.download ||
      result?.downloadUrl ||
      result?.download_url ||
      dados?.download ||
      ''
    ).trim()

    if (
      resposta.status < 200 ||
      resposta.status >= 300 ||
      dados?.status === false ||
      !/^https?:\/\//i.test(url)
    ) {
      return null
    }

    return {
      url,
      titulo: result?.title || result?.titulo || musica?.titulo,
      artista: result?.author?.name || result?.artist || musica?.artista
    }
  } catch {
    return null
  }
}

const nomeSeguro = valor => String(valor || 'musica')
  .replace(/[\\/:*?"<>|]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 100) || 'musica'

const comTimeoutEnvio = (promessa, tempo) => Promise.race([
  promessa,
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Tempo esgotado.')), tempo)
  })
])

const enviarResultado = async (ctx, musica) => {
  const texto = ctx.mess.shazamResultado(musica, ctx.prefix)
  const contexto = typeof ctx.canalInfo === 'function'
    ? ctx.canalInfo([ctx.sender])
    : { mentionedJid: [ctx.sender] }

  if (musica.capa) {
    try {
      await ctx.tokito.sendMessage(
        ctx.from,
        {
          image: { url: musica.capa },
          caption: texto,
          contextInfo: contexto
        },
        { quoted: ctx.selo }
      )
      return
    } catch {}
  }

  await ctx.tokito.sendMessage(
    ctx.from,
    { text: texto, contextInfo: contexto },
    { quoted: ctx.selo }
  )
}

dylan.setCommand({
  nome: 'shazam',
  comandos: ['shazam'],
  categoria: 'downloads',

  info: {
    descricao: 'Identifica música em áudio, voz ou vídeo usando ultra-acrcloud.',
    uso: 'shazam (responder áudio ou vídeo)',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      if (!selecionar(ctx)) {
        return reply(mess.shazamUso(prefix))
      }

      await reagir(from, '🎛️').catch(() => {})
      await reply(mess.shazamAnalisando())

      let musica

      try {
        musica = await identificar(ctx)
      } catch (error) {
        await reagir(from, '❌').catch(() => {})

        if (error?.code === 'SHAZAM_SEM_MIDIA') {
          return reply(mess.shazamUso(prefix))
        }

        if (error?.code === 'SHAZAM_ARQUIVO_GRANDE') {
          return reply(
            mess.shazamErro('A mídia ultrapassa 20 MB. Responda um trecho menor.')
          )
        }

        if (
          error?.code === 'SHAZAM_TIMEOUT_DOWNLOAD' ||
          error?.code === 'SHAZAM_TIMEOUT_CONVERSAO' ||
          error?.code === 'SHAZAM_TIMEOUT_RECONHECER'
        ) {
          return reply(
            mess.shazamErro('A análise demorou demais e foi cancelada. Tente um trecho menor.')
          )
        }

        if (error?.code === 'SHAZAM_DOWNLOAD') {
          return reply(
            mess.shazamErro('Não consegui baixar a mídia respondida. Tente reenviar o arquivo.')
          )
        }

        if (error?.code === 'SHAZAM_CONVERSAO') {
          return reply(
            mess.shazamErro('Não consegui preparar o áudio dessa mídia. Tente outro trecho.')
          )
        }

        if (error?.code === 'SHAZAM_MODULO') {
          return reply(
            mess.shazamErro('O módulo ultra-acrcloud ainda não está instalado. Reinicie o bot após o npm instalar as dependências.')
          )
        }

        console.log(
          '[SHAZAM ULTRA]',
          modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes'
        )

        return reply(
          mess.shazamErro('Não consegui reconhecer essa música agora. Tente outro trecho com o som mais limpo.')
        )
      }

      if (!musica?.matched) {
        await reagir(from, '❌').catch(() => {})
        return reply(mess.shazamNaoEncontrada())
      }

      await enviarResultado(ctx, musica)
      await reagir(from, '✅').catch(() => {})

      const audio = await buscarAudio(ctx, musica)
      if (!audio?.url) return true

      try {
        await comTimeoutEnvio(
          tokito.sendMessage(
            from,
            {
              audio: { url: audio.url },
              mimetype: 'audio/mpeg',
              ptt: false,
              fileName: `${nomeSeguro(
                `${audio.titulo || musica.titulo} - ${audio.artista || musica.artista}`
              )}.mp3`
            },
            { quoted: selo }
          ),
          60000
        )
      } catch (error) {
        console.log(
          '[SHAZAM MP3]',
          modulos.sanitizarErro(error, [API_KEY_TOKITO]) || 'Erro sem detalhes'
        )
      }

      return true
    }
  }
})
