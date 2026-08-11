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
  siteApi,
  sanitizarErro,
  marcarErroApi,
  ehErroApi,
  responderErroApi,
  alvoHash,
  garantirFuncoes
}
