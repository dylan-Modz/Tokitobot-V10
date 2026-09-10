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

const fs = require('fs')
const path = require('path')
const ACRCloud = require('acrcloud')
const dylan = require('../../database/lib/comandos')

const ACR_FILE = path.resolve(__dirname, '../../INFO_DADOS/acrcloud.json')
const CONFIG_ALL = path.resolve(__dirname, '../../INFO_DADOS/config-all.json')
const MAX_SAMPLE = 5 * 1024 * 1024

function lerJson(arquivo) {
  try {
    if (!fs.existsSync(arquivo)) return {}
    return JSON.parse(fs.readFileSync(arquivo, 'utf8'))
  } catch {
    return {}
  }
}

function valorValido(valor) {
  const txt = String(valor || '').trim()
  if (!txt) return ''
  if (/^(SEU_|SUA_|HOST_|ACCESS_|CHAVE_|TOKEN_)/i.test(txt)) return ''
  return txt
}

function credenciais(ctx = {}) {
  const local = lerJson(ACR_FILE)
  const geral = lerJson(CONFIG_ALL)

  return {
    host: valorValido(
      process.env.ACRCLOUD_HOST ||
      ctx.ACRCLOUD_HOST ||
      local.host ||
      geral.ACRCLOUD_HOST
    ),
    access_key: valorValido(
      process.env.ACRCLOUD_ACCESS_KEY ||
      ctx.ACRCLOUD_ACCESS_KEY ||
      local.access_key ||
      geral.ACRCLOUD_ACCESS_KEY
    ),
    access_secret: valorValido(
      process.env.ACRCLOUD_ACCESS_SECRET ||
      ctx.ACRCLOUD_ACCESS_SECRET ||
      local.access_secret ||
      geral.ACRCLOUD_ACCESS_SECRET
    )
  }
}

function unwrap(message) {
  let atual = message || {}

  for (let i = 0; i < 6; i++) {
    const proxima =
      atual?.ephemeralMessage?.message ||
      atual?.viewOnceMessage?.message ||
      atual?.viewOnceMessageV2?.message ||
      atual?.viewOnceMessageV2Extension?.message

    if (!proxima) break
    atual = proxima
  }

  return atual
}

function mensagemCitada(message) {
  const msg = unwrap(message)

  const blocos = [
    msg?.extendedTextMessage,
    msg?.imageMessage,
    msg?.videoMessage,
    msg?.audioMessage,
    msg?.documentMessage,
    msg?.buttonsResponseMessage,
    msg?.listResponseMessage,
    msg?.templateButtonReplyMessage
  ]

  for (const bloco of blocos) {
    const citada = bloco?.contextInfo?.quotedMessage
    if (citada) return unwrap(citada)
  }

  return null
}

function localizarMidia(message) {
  const atual = unwrap(message)
  const citada = mensagemCitada(atual)
  const fonte = citada || atual

  if (fonte?.audioMessage) {
    return { media: fonte.audioMessage, tipo: 'audio' }
  }

  if (fonte?.videoMessage) {
    return { media: fonte.videoMessage, tipo: 'video' }
  }

  return null
}

function tempo(ms) {
  const total = Math.max(0, Math.floor(Number(ms || 0) / 1000))
  if (!total) return 'Não informado'

  const minutos = Math.floor(total / 60)
  const segundos = String(total % 60).padStart(2, '0')

  return `${minutos}:${segundos}`
}

function normalizar(resultado) {
  const faixa =
    resultado?.metadata?.music?.[0] ||
    resultado?.metadata?.custom_files?.[0]

  if (!faixa) return null

  const youtube =
    faixa?.external_metadata?.youtube?.vid ||
    faixa?.external_metadata?.youtube?.video?.id ||
    ''

  const spotify =
    faixa?.external_metadata?.spotify?.track?.id ||
    ''

  const deezer =
    faixa?.external_metadata?.deezer?.track?.id ||
    ''

  const titulo = String(
    faixa?.title ||
    faixa?.name ||
    'Música desconhecida'
  )

  const artista = Array.isArray(faixa?.artists)
    ? faixa.artists.map(item => item?.name).filter(Boolean).join(', ')
    : String(faixa?.artist || 'Desconhecido')

  const album = String(
    faixa?.album?.name ||
    faixa?.album ||
    'Não informado'
  )

  const genero = Array.isArray(faixa?.genres)
    ? faixa.genres.map(item => item?.name).filter(Boolean).join(', ') || 'Não informado'
    : String(faixa?.genre || 'Não informado')

  return {
    titulo,
    artista: artista || 'Desconhecido',
    album,
    genero,
    data: String(
      faixa?.release_date ||
      faixa?.release_date_utc ||
      'Não informada'
    ),
    duracao: tempo(faixa?.duration_ms),
    score: Number.isFinite(Number(faixa?.score))
      ? `${Number(faixa.score)}%`
      : 'Não informado',
    acrid: String(faixa?.acrid || ''),
    youtube,
    spotify,
    deezer,
    thumb: youtube
      ? `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg`
      : ''
  }
}

dylan.setCommand({
  nome: 'shazam',
  comandos: [
    'shazam',
    'identificarmusica',
    'reconhecermusica'
  ],
  categoria: 'downloads',

  info: {
    descricao: 'Identifica uma música em áudio, voz ou vídeo.',
    uso: 'shazam (respondendo um áudio ou vídeo)',
    categoria: 'downloads'
  },

  async executar(ctx) {
    with (ctx) {
      try {
        const alvo = localizarMidia(
          ctx.mensagem ||
          ctx.info?.message
        )

        if (!alvo) {
          return reply(mess.shazamUso(prefix))
        }

        const config = credenciais(ctx)

        if (
          !config.host ||
          !config.access_key ||
          !config.access_secret
        ) {
          await reagir(from, '⚙️').catch(() => {})
          return reply(mess.shazamSemConfig())
        }

        await reagir(from, '🔎')
        await reply(mess.shazamAnalisando())

        const buffer = await getFileBuffer(
          alvo.media,
          alvo.tipo
        )

        if (!Buffer.isBuffer(buffer) || !buffer.length) {
          await reagir(from, '❌').catch(() => {})
          return reply(
            mess.shazamErro(
              'Não consegui baixar a mídia marcada.'
            )
          )
        }

        if (buffer.length > MAX_SAMPLE) {
          await reagir(from, '❌').catch(() => {})
          return reply(mess.shazamMidiaGrande())
        }

        const acr = new ACRCloud(config)
        const resultado = await acr.identify(buffer)

        const codigo = Number(
          resultado?.status?.code ?? 0
        )

        const musica = normalizar(resultado)

        if (!musica || codigo !== 0) {
          await reagir(from, '❌').catch(() => {})
          return reply(mess.shazamNaoEncontrada())
        }

        const caption = mess.shazamResultado(
          musica,
          prefix
        )

        const contextInfo = {
          ...newsletter,
          mentionedJid: [sender]
        }

        if (musica.thumb) {
          try {
            await tokito.sendMessage(
              from,
              {
                image: { url: musica.thumb },
                caption,
                contextInfo
              },
              { quoted: selo }
            )
          } catch {
            await tokito.sendMessage(
              from,
              {
                text: caption,
                contextInfo
              },
              { quoted: selo }
            )
          }
        } else {
          await tokito.sendMessage(
            from,
            {
              text: caption,
              contextInfo
            },
            { quoted: selo }
          )
        }

        await reagir(from, '✅')
      } catch (e) {
        console.log(
          '[SHAZAM]',
          ctx.modulos?.sanitizarErro
            ? ctx.modulos.sanitizarErro(e, [])
            : e?.message || e
        )

        await reagir(from, '❌').catch(() => {})

        return reply(
          mess.shazamErro(
            e?.message ||
            'Não foi possível identificar a música.'
          )
        )
      }
    }
  }
})
