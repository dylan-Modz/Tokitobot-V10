/*
 * TOKITO BOT V10 — Figurinhas com áudio, suporte de mídia compatível.
 * Usa StickerMessage.audioMessage (campo 26); não mistura o wrapper
 * FutureProofMessage, cujo conteúdo não tem estrutura confirmada.
 * Author: Dylan Modz
 */
'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const { promisify } = require('util')
const { execFile } = require('child_process')
const { randomBytes } = require('crypto')
const { proto, prepareWAMessageMedia } = require('@stone-wpp/ofc')
const modulos = require('./modulos')

const executar = promisify(execFile)
const ARQUIVO = path.join(__dirname, '..', 'database', 'sistemas', 'sticker-audio.webp')
const META = path.join(__dirname, '..', 'database', 'sistemas', 'sticker-audio.json')
const PATCH = Symbol.for('tokito.stickerAudio.sticker26.v2')
const MAX_WEBP = 1024 * 1024
const MAX_AUDIO = 20 * 1024 * 1024
const MAX_SEGUNDOS = 60

const registrada = () => fs.existsSync(ARQUIVO)
const metadados = () => {
  try { return JSON.parse(fs.readFileSync(META, 'utf8')) } catch { return {} }
}
const stickerAtual = ctx => modulos.mediaAtual(ctx).sticker
const audioAtual = ctx => modulos.audioAtual(ctx)

function patchProtocolo() {
  const mensagem = proto?.Message
  const sticker = mensagem?.StickerMessage
  const audio = mensagem?.AudioMessage
  if (!mensagem || !sticker || !audio ||
      typeof mensagem.encode !== 'function' ||
      typeof sticker.encode !== 'function' ||
      typeof audio.encode !== 'function') {
    throw new Error('A Stone WPP instalada não disponibiliza o encoder do áudio de figurinha.')
  }
  if (sticker[PATCH]) return
  const anterior = sticker.encode
  // Se uma versão futura da Stone já codificar audioMessage, não duplicar.
  if (/\baudioMessage\b/.test(Function.prototype.toString.call(anterior))) {
    Object.defineProperty(sticker, PATCH, { value: true })
    return
  }
  sticker.encode = function (valor, writer) {
    const resultado = anterior.call(this, valor, writer)
    // Campo 26, wire type 2 -> tag varint 210. Não duplicar se o schema
    // da Stone passar a suportar o campo nativamente.
    if (valor?.audioMessage) {
      audio.encode(valor.audioMessage, resultado.uint32(210).fork()).ldelim()
    }
    return resultado
  }
  Object.defineProperty(sticker, PATCH, { value: true })
}

async function registrar(ctx) {
  const st = stickerAtual(ctx)
  if (!st) throw new Error('Marque a figurinha que deseja registrar.')
  if (st.isLottie) throw new Error('Figurinhas Lottie não são suportadas.')
  const buffer = await ctx.getFileBuffer(st, 'sticker')
  if (!Buffer.isBuffer(buffer) || buffer.length < 12 || buffer.length > MAX_WEBP ||
      buffer.toString('ascii', 0, 4) !== 'RIFF' ||
      buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Use uma figurinha WebP válida de até 1 MB.')
  }
  fs.mkdirSync(path.dirname(ARQUIVO), { recursive: true })
  const tmp = ARQUIVO + '.' + process.pid + '.tmp'
  const tmpMeta = META + '.' + process.pid + '.tmp'
  try {
    fs.writeFileSync(tmp, buffer)
    fs.renameSync(tmp, ARQUIVO)
    fs.writeFileSync(tmpMeta, JSON.stringify({
      width: Number(st.width) || 512,
      height: Number(st.height) || 512,
      isAnimated: st.isAnimated === true,
      savedAt: new Date().toISOString()
    }, null, 2) + '\n')
    fs.renameSync(tmpMeta, META)
  } finally {
    for (const p of [tmp, tmpMeta]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true })
    }
  }
  return metadados()
}

function remover() {
  if (!registrada()) return false
  fs.rmSync(ARQUIVO, { force: true })
  fs.rmSync(META, { force: true })
  return true
}

async function visualizar(ctx) {
  if (!registrada()) throw new Error('Nenhuma figurinha registrada.')
  return ctx.tokito.sendMessage(ctx.from, {
    sticker: fs.readFileSync(ARQUIVO),
    isAnimated: metadados().isAnimated === true
  }, { quoted: ctx.selo })
}

function temOpus(mime, bytes) {
  // Áudio do WhatsApp costuma ser OGG/Opus. Não confiar apenas no MIME.
  return /audio\/ogg/i.test(mime) &&
    bytes.length >= 8 && bytes.subarray(0, 4).toString('ascii') === 'OggS' &&
    bytes.includes(Buffer.from('OpusHead'))
}

const MAX_VIDEO_SEGUNDOS = 9.9
// Apenas a animação fica em até 9,5s. O som mantém até 60s do vídeo original.
const MAX_SOM_VIDEO_SEGUNDOS = 60
const MAX_MUSICA_SEGUNDOS = 60
const MAX_VIDEO_BYTES = 85 * 1024 * 1024
const MAX_IMAGEM_BYTES = 10 * 1024 * 1024
const { imageToWebp2, videoToWebp2 } = require('../plugins/figurinhas/exif2')
const midiaCitada = require('./midia-citada')
const axios = require('axios')

const temporario = funcao => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokito-figaudio-'))
  return Promise.resolve().then(() => funcao(dir)).finally(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })
}

const transcodificar = async (bytes, extensao, args, formato = '.ogg') => {
  if (!Buffer.isBuffer(bytes) || !bytes.length) throw new Error('Mídia vazia.')
  return temporario(async dir => {
    const entrada = path.join(dir, 'entrada.' + extensao)
    const saida = path.join(dir, 'saida' + formato)
    fs.writeFileSync(entrada, bytes)
    try {
      await executar(process.env.FFMPEG_PATH || 'ffmpeg', [
        '-hide_banner', '-loglevel', 'error', '-y',
        '-i', entrada, ...args, saida
      ], { timeout: 45000, maxBuffer: 1024 * 1024 })
    } catch (error) {
      if (error?.code === 'ENOENT') throw new Error('FFmpeg não está instalado na hospedagem.')
      throw new Error('Não foi possível extrair ou converter o áudio da mídia.')
    }
    const resultado = fs.readFileSync(saida)
    if (!resultado.length || resultado.length > MAX_AUDIO) {
      throw new Error('O áudio convertido excedeu o limite permitido.')
    }
    return resultado
  })
}

const opcoesOpus = segundos => [
  '-map', '0:a:0', '-t', String(segundos), '-vn', '-ac', '1', '-ar', '48000',
  '-c:a', 'libopus', '-application', 'audio', '-b:a', '48k', '-vbr', 'on', '-f', 'ogg'
]

async function normalizarBufferAudio(buffer, mime = '', duracao = 0, segundos = MAX_SEGUNDOS) {
  if (!Buffer.isBuffer(buffer) || !buffer.length || buffer.length > 35 * 1024 * 1024) {
    throw new Error('Áudio inválido ou maior que o permitido.')
  }
  if (temOpus(mime, buffer) && duracao > 0 && duracao <= segundos) return buffer
  return transcodificar(buffer, 'bin', opcoesOpus(segundos))
}

async function normalizarAudio(ctx, audioOrigem) {
  if (!audioOrigem) throw new Error('Marque um áudio para usar figaudio.')
  const { fontes, referencia } = midiaCitada.preparar(ctx)
  const candidatos = midiaCitada.candidatos(fontes, 'audio')
  const lista = [audioOrigem, ...candidatos.filter(item => item !== audioOrigem)]
  const dados = await midiaCitada.baixar(ctx, 'audio', lista, referencia)
  return normalizarBufferAudio(dados, audioOrigem.mimetype || '', Number(audioOrigem.seconds || 0), MAX_SEGUNDOS)
}

const youtubeId = entrada => {
  try {
    const url = new URL(String(entrada || '').trim())
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = url.pathname.split('/')[1]
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : ''
    }
    if (['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) {
      const id = url.pathname.startsWith('/shorts/') ? url.pathname.split('/')[2]
        : url.pathname.startsWith('/live/') ? url.pathname.split('/')[2]
        : url.searchParams.get('v')
      return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? id : ''
    }
  } catch {}
  return ''
}

const apiUrl = (ctx, endpoint, params) => {
  const base = new URL(String(ctx.API_URL || 'https://tokito-apis.com.br'))
  if (!['https:', 'http:'].includes(base.protocol)) throw new Error('API inválida.')
  const link = new URL(endpoint, base.origin)
  for (const [key, value] of Object.entries(params)) {
    if (value) link.searchParams.set(key, String(value))
  }
  if (ctx.API_KEY_TOKITO) link.searchParams.set('apikey', String(ctx.API_KEY_TOKITO))
  return link.toString()
}

const enderecoAudio = objeto => {
  if (typeof objeto === 'string') return /^https:\/\//i.test(objeto) ? objeto : ''
  if (!objeto || typeof objeto !== 'object') return ''
  for (const chave of ['url', 'download', 'downloadUrl', 'download_url', 'audio', 'link', 'src']) {
    const url = enderecoAudio(objeto[chave])
    if (url) return url
  }
  for (const chave of ['resultado', 'result', 'data', 'response']) {
    const url = enderecoAudio(objeto[chave])
    if (url) return url
  }
  return ''
}

const linkAudioSeguro = valor => {
  try {
    const url = new URL(valor)
    if (url.protocol !== 'https:' || url.username || url.password) return false
    const host = url.hostname.toLowerCase()
    if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return false
    if (/^(?:127|10|0)\.|^192\.168\.|^169\.254\.|^172\.(?:1[6-9]|2\d|3[01])\.|^\[?::1\]?$/.test(host)) return false
    return true
  } catch { return false }
}

const retornoMusica = resp => {
  const status = Number(resp?.status || 0)
  if (status !== 200) throw new Error('A API de músicas retornou HTTP ' + status + '.')
  const dados = resp.data
  const contentType = String(resp.headers?.['content-type'] || '').toLowerCase()
  if (dados && typeof dados === 'object' && !Buffer.isBuffer(dados) &&
      !(dados instanceof Uint8Array) && !Array.isArray(dados)) {
    return { url: enderecoAudio(dados), bytes: null }
  }
  const bytes = Buffer.isBuffer(dados) ? dados : Buffer.from(dados || [])
  if (!bytes.length) throw new Error('A API não retornou áudio.')
  const prefixo = bytes.subarray(0, Math.min(bytes.length, 80)).toString('utf8').trim()
  if (contentType.includes('json') || prefixo[0] === '{' || prefixo[0] === '[') {
    try {
      const data = JSON.parse(bytes.toString('utf8'))
      return { url: enderecoAudio(data), bytes: null }
    } catch {
      throw new Error('A API retornou dados de música inválidos.')
    }
  }
  if (contentType.includes('text/html') || /^<!doctype|^<html/i.test(prefixo)) {
    throw new Error('A API retornou uma página em vez do áudio.')
  }
  return { bytes, mime: contentType, url: '' }
}

// Usa os mesmos endpoints do play_audio e do play. Falhas transitórias
// (rede, HTTP 429 e 5xx) recebem mais uma tentativa, sem pesquisar infinitamente.
async function requisitarMusica(url, opcoes = {}) {
  let ultima
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    try {
      const resp = await axios.get(url, { ...opcoes, validateStatus: () => true })
      if (resp.status !== 429 && resp.status < 500) return resp
      ultima = new Error('Serviço de música temporariamente indisponível (HTTP ' + resp.status + ').')
    } catch (erro) {
      ultima = erro
    }
    if (tentativa === 0) await new Promise(resolve => setTimeout(resolve, 900))
  }
  throw new Error('Não foi possível acessar a API de música. Tente novamente.')
}

async function baixarMusica(ctx, termo) {
  const entrada = String(termo || '').trim()
  let id = youtubeId(entrada)
  if (!id) {
    if (/^https?:\/\//i.test(entrada)) throw new Error('Use um link válido do YouTube.')
    if (entrada.length < 2 || entrada.length > 140) throw new Error('Informe o nome da música.')
    try {
      const busca = await requisitarMusica(apiUrl(ctx, '/api/youtube-search', { query: entrada }), {
        timeout: 25000
      })
      const data = busca.data
      const lista = Array.isArray(data?.resultado) ? data.resultado
        : Array.isArray(data?.result) ? data.result
        : Array.isArray(data?.data) ? data.data
        : Array.isArray(data) ? data : []
      const encontrado = lista.find(item => item?.type === 'video' && (item.videoId || youtubeId(item.url)))
        || lista.find(item => item?.videoId || youtubeId(item?.url))
      id = encontrado?.videoId && /^[a-zA-Z0-9_-]{11}$/.test(encontrado.videoId)
        ? encontrado.videoId : youtubeId(encontrado?.url)
    } catch (erro) {
      // Não bloqueia o play_audio por erro de busca: o endpoint de áudio
      // também pesquisa por texto e costuma continuar funcionando.
      console.warn('[FIGAUDIO BUSCA]', erro?.code || erro?.message || erro)
    }
  }
  const alvo = id ? 'https://www.youtube.com/watch?v=' + id : entrada
  const solicitar = async q => {
    const resposta = await requisitarMusica(apiUrl(ctx, '/api/youtube-audio', { q }), {
      timeout: 90000, responseType: 'arraybuffer',
      maxContentLength: 35 * 1024 * 1024,
      maxBodyLength: 35 * 1024 * 1024
    })
    return retornoMusica(resposta)
  }
  let midia
  try {
    midia = await solicitar(alvo)
  } catch (erro) {
    if (!id || alvo === entrada) throw erro
    // Às vezes o vídeo está indisponível pelo link, mas a busca textual
    // do endpoint de áudio encontra outra fonte.
    midia = await solicitar(entrada)
  }
  if (midia.url) {
    if (!linkAudioSeguro(midia.url)) throw new Error('A API retornou um link de áudio inválido.')
    const download = await requisitarMusica(midia.url, {
      responseType: 'arraybuffer', timeout: 90000,
      maxContentLength: 35 * 1024 * 1024,
      maxBodyLength: 35 * 1024 * 1024,
      maxRedirects: 2
    })
    midia = retornoMusica(download)
  }
  if (!midia.bytes) throw new Error('A API não retornou um arquivo de áudio reproduzível.')
  return normalizarBufferAudio(midia.bytes, midia.mime || '', 0, MAX_MUSICA_SEGUNDOS)
}

async function converterVideoAdaptativo(bytes) {
  // Prioriza o conversor existente do /s. Se o WebP ultrapassar 1 MB,
  // reduz resolução, FPS e qualidade progressivamente sem excluir o vídeo.
  // Todos os perfis esticam o quadro para um quadrado, igual ao comando /s.
  try {
    const padrao = await videoToWebp2(bytes)
    if (padrao?.length && padrao.length <= MAX_WEBP) return padrao
  } catch (error) {
    console.warn('[FIGAUDIO WEBP BASE]', error?.message || error)
  }
  const perfis = [
    { pixels: 448, fps: 9, qualidade: 38 },
    { pixels: 384, fps: 8, qualidade: 32 },
    { pixels: 320, fps: 7, qualidade: 26 },
    { pixels: 288, fps: 6, qualidade: 20 },
    { pixels: 256, fps: 5, qualidade: 16 }
  ]
  return temporario(async dir => {
    const entrada = path.join(dir, 'video.mp4')
    fs.writeFileSync(entrada, bytes)
    for (let i = 0; i < perfis.length; i++) {
      const perfil = perfis[i]
      const saida = path.join(dir, 'sticker-' + i + '.webp')
      try {
        await executar(process.env.FFMPEG_PATH || 'ffmpeg', [
          '-hide_banner', '-loglevel', 'error', '-y', '-i', entrada,
          '-t', '9.5', '-an',
          '-vf', 'fps=' + perfil.fps + ',scale=' + perfil.pixels + ':' + perfil.pixels +
            ':flags=lanczos,setsar=1,format=yuva420p',
          '-c:v', 'libwebp', '-lossless', '0', '-compression_level', '5',
          '-q:v', String(perfil.qualidade), '-loop', '0', '-f', 'webp', saida
        ], { timeout: 75000, maxBuffer: 1024 * 1024 })
        const convertido = fs.readFileSync(saida)
        if (convertido.length <= MAX_WEBP && convertido.length > 12 &&
            convertido.toString('ascii', 0, 4) === 'RIFF') return convertido
      } catch (error) {
        console.warn('[FIGAUDIO WEBP ADAPTATIVO]', i, error?.message || error)
      }
    }
    throw new Error('Não foi possível compactar esse vídeo em uma figurinha de até 1 MB.')
  })
}

// Mesma técnica de extração FFmpeg dos alteradores: seleciona o áudio
// original do vídeo, corrige timestamps e codifica em OGG/Opus.
async function extrairSomDoVideo(bytes) {
  const som = await transcodificar(bytes, 'mp4', [
    '-map', '0:a:0',
    '-t', String(MAX_SOM_VIDEO_SEGUNDOS),
    '-vn', '-af', 'aresample=async=1:first_pts=0',
    '-ac', '1', '-ar', '48000',
    '-c:a', 'libopus', '-application', 'voip',
    '-frame_duration', '20', '-b:a', '32k', '-vbr', 'on',
    '-f', 'ogg'
  ])
  if (!temOpus('audio/ogg', som)) {
    throw new Error('O vídeo não gerou um áudio OGG/Opus válido.')
  }
  const segundos = duracaoOpus(som)
  if (segundos > MAX_SOM_VIDEO_SEGUNDOS) {
    throw new Error('O áudio extraído ultrapassou o limite da figurinha sonora.')
  }
  await temporario(async dir => {
    const arquivo = path.join(dir, 'audio.ogg')
    fs.writeFileSync(arquivo, som)
    try {
      // Confirma o áudio extraído (até 60s), sem restringir à duração do WebP.
      await executar(process.env.FFMPEG_PATH || 'ffmpeg', [
        '-nostdin', '-hide_banner', '-loglevel', 'error',
        '-i', arquivo, '-map', '0:a:0', '-t', String(MAX_SOM_VIDEO_SEGUNDOS),
        '-f', 'null', '-'
      ], { timeout: 15000, maxBuffer: 1024 * 1024 })
    } catch {
      throw new Error('Falha ao validar o áudio extraído do vídeo.')
    }
  })
  return som
}

async function prepararVideo(ctx, lista, referencia) {
  const media = lista[0]
  const duracao = Number(media?.seconds || 0)
  if (duracao < 0) throw new Error('Duração de vídeo inválida.')
  const bytes = await midiaCitada.baixar(ctx, 'video', lista, referencia)
  if (bytes.length > MAX_VIDEO_BYTES) throw new Error('O vídeo ultrapassou 85 MB.')
  // Prepara a animação de até 9,5s e o áudio de até 60s separadamente.
  const [som, figurinha] = await Promise.all([
    extrairSomDoVideo(bytes),
    converterVideoAdaptativo(bytes)
  ])
  return { figurinha, som, animada: true }
}
async function prepararImagem(ctx, lista, referencia) {
  const bytes = await midiaCitada.baixar(ctx, 'image', lista, referencia)
  if (bytes.length > MAX_IMAGEM_BYTES) throw new Error('A imagem ultrapassou 10 MB.')
  const figurinha = await imageToWebp2(bytes)
  if (!figurinha?.length || figurinha.length > MAX_WEBP) {
    throw new Error('A figurinha gerada excedeu 1 MB.')
  }
  return { figurinha, animada: false }
}

async function prepararFigurinha(ctx, lista, referencia) {
  const buffer = await midiaCitada.baixar(ctx, 'sticker', lista, referencia)
  if (!buffer?.length || buffer.length > MAX_WEBP) throw new Error('Figurinha inválida ou maior que 1 MB.')
  return { figurinha: buffer, animada: lista[0]?.isAnimated === true }
}

function construirMensagem(fig, som) {
  if (!fig?.stickerMessage || !som?.audioMessage) {
    throw new Error('Falha no preparo da figurinha ou do áudio.')
  }
  patchProtocolo()
  const resultado = proto.Message.fromObject({
    stickerMessage: fig.stickerMessage,
    messageContextInfo: { messageSecret: randomBytes(32) }
  })
  // fromObject normalmente ignora campos experimentais desconhecidos;
  // adicionar o áudio DEPOIS do fromObject garante o encoder patchado.
  resultado.stickerMessage.audioMessage = som.audioMessage
  if (!resultado.stickerMessage.audioMessage?.mediaKey ||
      !(resultado.stickerMessage.audioMessage?.directPath || resultado.stickerMessage.audioMessage?.url)) {
    throw new Error('Áudio sem metadados de upload; não é seguro anunciar envio com som.')
  }
  return resultado
}

function duracaoOpus(bytes) {
  let pos = 0
  let ultima = 0
  while (pos + 27 <= bytes.length) {
    const offset = bytes.indexOf('OggS', pos, 'ascii')
    if (offset < 0 || offset + 27 > bytes.length) break
    const segmentos = bytes[offset + 26]
    const tabela = offset + 27
    if (tabela + segmentos > bytes.length) break
    let tamanho = 0
    for (let i = 0; i < segmentos; i++) tamanho += bytes[tabela + i]
    const amostras = Number(bytes.readBigUInt64LE(offset + 6))
    if (Number.isSafeInteger(amostras) && amostras > ultima) ultima = amostras
    pos = tabela + segmentos + tamanho
  }
  return Math.max(1, Math.min(MAX_SEGUNDOS, Math.round(ultima / 48000) || 10))
}

async function enviarPersonalizada(ctx, { figurinha, som, animada = false } = {}) {
  if (!Buffer.isBuffer(figurinha) || !figurinha.length ||
      figurinha.toString('ascii', 0, 4) !== 'RIFF' ||
      figurinha.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Não foi possível preparar a figurinha WebP.')
  }
  if (!Buffer.isBuffer(som) || !temOpus('audio/ogg', som)) {
    throw new Error('Não foi possível preparar o áudio da figurinha.')
  }
  if (typeof ctx.tokito?.relayMessage !== 'function' ||
      typeof ctx.tokito?.waUploadToServer !== 'function') {
    throw new Error('A conexão não disponibiliza envio de mídia.')
  }
  const upload = ctx.tokito.waUploadToServer
  const [fig, audio] = await Promise.all([
    prepareWAMessageMedia({
      sticker: figurinha, mimetype: 'image/webp',
      isAnimated: animada, width: 512, height: 512
    }, { upload }),
    prepareWAMessageMedia({
      audio: som, mimetype: 'audio/ogg; codecs=opus', ptt: true
    }, { upload })
  ])
  // Os clientes esperam AudioMessage com MIME/tempo coerentes para tocar.
  const audioMsg = audio.audioMessage
  audioMsg.mimetype = 'audio/ogg; codecs=opus'
  audioMsg.ptt = true
  // Calcula a duração real pelas granule positions do OGG (48 kHz).
  // Um tempo incorreto pode provocar falha de reprodução no cliente.
  audioMsg.seconds = duracaoOpus(som)
  const mensagem = construirMensagem(fig, audio)
  // O encoder da figurinha pode ter o campo extra 26, mesmo sem o
  // decoder nativo conhecer esse campo. Confirmamos o trecho de bytes.
  const codificado = proto.Message.encode(mensagem).finish()
  if (!codificado?.length) throw new Error('A mensagem da figurinha não foi codificada.')
  await ctx.tokito.relayMessage(ctx.from, mensagem, {})
  return true
}

// Renomeia uma figurinha sonora sem tocar ou recodificar o áudio original.
// O WebP contém apenas imagem/EXIF: a trilha está em stickerMessage.audioMessage.
async function enviarComAudioExistente(ctx, { figurinha, audioMessage, animada = false } = {}) {
  if (!Buffer.isBuffer(figurinha) || figurinha.length < 12 ||
      figurinha.length > MAX_WEBP ||
      figurinha.toString('ascii', 0, 4) !== 'RIFF' ||
      figurinha.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('A figurinha renomeada precisa ser um WebP válido de até 1 MB.')
  }
  if (!audioMessage?.mediaKey ||
      !(audioMessage.directPath || audioMessage.url)) {
    throw new Error('Não recebi os dados do áudio dessa figurinha. Peça para reenviar a figurinha sonora original.')
  }
  if (typeof ctx.tokito?.relayMessage !== 'function' ||
      typeof ctx.tokito?.waUploadToServer !== 'function') {
    throw new Error('A conexão não disponibiliza o envio de figurinha com áudio.')
  }
  const fig = await prepareWAMessageMedia({
    sticker: figurinha,
    mimetype: 'image/webp',
    isAnimated: animada,
    width: 512,
    height: 512
  }, { upload: ctx.tokito.waUploadToServer })
  // Mantém mediaKey, directPath, SHA e os demais campos da trilha existente.
  // ConstruirMensagem aplica o mesmo patch de protocolo do /figaudio.
  const audio = proto.Message.AudioMessage.fromObject(audioMessage)
  const mensagem = construirMensagem(fig, { audioMessage: audio })
  if (!proto.Message.encode(mensagem).finish().length) {
    throw new Error('Falha ao codificar a figurinha renomeada com áudio.')
  }
  await ctx.tokito.relayMessage(ctx.from, mensagem, {})
  return true
}

async function enviar(ctx, audioOrigem) {
  if (!registrada()) throw new Error('Nenhuma figurinha registrada. Use rgfigaudio.')
  if (!audioOrigem) throw new Error('Marque um áudio para usar figaudio.')
  const som = await normalizarAudio(ctx, audioOrigem)
  return enviarPersonalizada(ctx, {
    figurinha: fs.readFileSync(ARQUIVO),
    som,
    animada: metadados().isAnimated === true
  })
}

const usarRegistrada = som => {
  if (!registrada()) throw new Error('Nenhuma figurinha registrada. Use rgfigaudio.')
  return { figurinha: fs.readFileSync(ARQUIVO), animada: metadados().isAnimated === true, som }
}

module.exports = {
  ARQUIVO, META, registrada, metadados, stickerAtual, audioAtual,
  registrar, remover, visualizar, enviar, enviarPersonalizada, enviarComAudioExistente, usarRegistrada,
  prepararVideo, prepararImagem, prepararFigurinha, baixarMusica,
  normalizarBufferAudio, normalizarAudio, patchProtocolo, construirMensagem,
  MAX_SEGUNDOS, MAX_VIDEO_SEGUNDOS, MAX_SOM_VIDEO_SEGUNDOS, MAX_MUSICA_SEGUNDOS, youtubeId
}
