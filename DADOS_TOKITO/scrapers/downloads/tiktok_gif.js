/*
 * TOKITO BOT V10 — TikTok GIF
 * Integração com a API oficial configurada no bot.
 * Os arquivos são MP4 originais, enviados em modo GIF no WhatsApp.
 * Author: Dylan Modz
 */
const client = require('./client')

const LIMITE_GIFS = 20
const LIMITE_BYTES = 20 * 1024 * 1024

function validarTikTok(link) {
  const texto = String(link || '').trim()
  if (!texto || texto.length > 2000) throw new Error('Informe um link do TikTok.')
  let url
  try { url = new URL(texto) } catch (_) { throw new Error('Link do TikTok inválido.') }
  if (url.protocol !== 'https:' ||
      url.username || url.password ||
      !/(^|\.)tiktok\.com$/i.test(url.hostname)) {
    throw new Error('Informe um link HTTPS válido do TikTok.')
  }
  return url.toString()
}

async function consultar(entrada) {
  const url = validarTikTok(entrada)
  // A key/token vem da config do bot, sem expor o valor em mensagens.
  const dados = await client.get('/api/tiktok-animado', { url }, {
    timeout: 120000
  })

  const resultado = dados?.resultado
  if (dados?.status !== true || !Array.isArray(resultado?.animacoes)) {
    throw new Error('A Tokito APIs não retornou uma lista de animações válida.')
  }

  const animacoes = resultado.animacoes.slice(0, LIMITE_GIFS)
    .filter(item => item && typeof item.download === 'string' && item.download.trim())
    .map(item => ({
      download: item.download.trim(),
      duracao: typeof item.duracao === 'string' ? item.duracao : null
    }))

  return {
    total: animacoes.length,
    animacoes,
    link: url
  }
}

function validarDownload(link) {
  const raiz = new URL(client.config().API_URL)
  let midia
  try { midia = new URL(link) } catch (_) { throw new Error('Link da animação inválido.') }
  if (midia.protocol !== 'https:' ||
      midia.username || midia.password ||
      midia.hostname !== raiz.hostname ||
      !/^\/midias\/tiktok-animado\/[a-f0-9]{48}\.mp4$/i.test(midia.pathname)) {
    throw new Error('A animação não pertence à rota de mídia da Tokito APIs.')
  }
  return midia.href
}

async function baixar(entrada) {
  const url = validarDownload(entrada)
  const resposta = await client.axios.get(url, {
    responseType: 'stream',
    timeout: 45000,
    maxRedirects: 0,
    validateStatus: () => true,
    headers: { accept: 'video/mp4' }
  })

  if (resposta.status !== 200) {
    resposta.data?.destroy?.()
    if (resposta.status === 410 || resposta.status === 404) {
      throw new Error('O link do GIF expirou. Envie o comando novamente.')
    }
    throw new Error('Não foi possível baixar esta animação.')
  }

  const tamanho = Number(resposta.headers?.['content-length'] || 0)
  if (tamanho > LIMITE_BYTES) {
    resposta.data?.destroy?.()
    throw new Error('A animação excedeu 20 MB.')
  }

  const partes = []
  let total = 0
  try {
    for await (const parte of resposta.data) {
      total += parte.length
      if (total > LIMITE_BYTES) throw new Error('A animação excedeu 20 MB.')
      partes.push(parte)
    }
  } catch (erro) {
    resposta.data?.destroy?.()
    throw erro
  }

  const arquivo = Buffer.concat(partes, total)
  if (arquivo.length < 12 || arquivo.toString('ascii', 4, 8) !== 'ftyp') {
    throw new Error('A mídia retornada não é um MP4 válido.')
  }
  return arquivo
}

module.exports = { consultar, baixar }
