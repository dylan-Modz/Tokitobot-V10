/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * ============================================================
 */

const { spawn } = require('child_process')
const WebP = require('node-webpmux')
const dylan = require('../../database/lib/comandos')

const extrair = message => {
  let atual = message || {}

  for (let i = 0; i < 6; i++) {
    const proxima =
      atual?.ephemeralMessage?.message ||
      atual?.viewOnceMessage?.message ||
      atual?.viewOnceMessageV2?.message ||
      atual?.viewOnceMessageV2Extension?.message ||
      atual

    if (proxima === atual)
      break

    atual = proxima
  }

  return atual
}

const pegarSticker = ctx => {
  const contexto =
    ctx.ctxMsg ||
    ctx.mensagem?.extendedTextMessage?.contextInfo ||
    ctx.info?.message?.extendedTextMessage?.contextInfo ||
    {}

  const marcada = extrair(contexto?.quotedMessage)

  return (
    marcada?.stickerMessage ||
    extrair(ctx.mensagem)?.stickerMessage ||
    extrair(ctx.info?.message)?.stickerMessage ||
    null
  )
}

const copiarFrame = (
  canvas,
  frame,
  pixels,
  canvasWidth
) => {
  const largura = Number(frame?.width || 0)
  const altura = Number(frame?.height || 0)
  const offsetX = Number(frame?.x || 0)
  const offsetY = Number(frame?.y || 0)

  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      const origem = (y * largura + x) * 4
      const destino =
        ((offsetY + y) * canvasWidth + (offsetX + x)) * 4

      pixels.copy(
        canvas,
        destino,
        origem,
        origem + 4
      )
    }
  }
}

const primeiroFrame = async buffer => {
  const imagem = new WebP.Image()

  await imagem.load(buffer)
  await imagem.initLib()

  const width = Number(imagem.width || 0)
  const height = Number(imagem.height || 0)

  if (!width || !height)
    throw new Error('WEBP_INVALIDO')

  if (
    imagem.hasAnim &&
    Array.isArray(imagem.frames) &&
    imagem.frames.length
  ) {
    const frame = imagem.frames[0]
    const pixels = Buffer.from(await imagem.getFrameData(0))
    const canvas = Buffer.alloc(width * height * 4)

    copiarFrame(
      canvas,
      frame,
      pixels,
      width
    )

    return {
      width,
      height,
      pixels: canvas
    }
  }

  return {
    width,
    height,
    pixels: Buffer.from(await imagem.getImageData())
  }
}

const png = async ({
  width,
  height,
  pixels
}) => {
  return new Promise((resolve, reject) => {
    const processo = spawn(
      'ffmpeg',
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-f',
        'rawvideo',
        '-pix_fmt',
        'rgba',
        '-s',
        `${width}x${height}`,
        '-i',
        'pipe:0',
        '-frames:v',
        '1',
        '-f',
        'image2pipe',
        '-vcodec',
        'png',
        'pipe:1'
      ],
      {
        stdio: [
          'pipe',
          'pipe',
          'pipe'
        ]
      }
    )

    const saida = []
    const erros = []

    processo.stdout.on(
      'data',
      chunk => saida.push(chunk)
    )

    processo.stderr.on(
      'data',
      chunk => erros.push(chunk)
    )

    processo.on(
      'error',
      reject
    )

    processo.on(
      'close',
      codigo => {
        if (codigo !== 0) {
          return reject(
            new Error(
              Buffer.concat(erros)
                .toString()
                .trim() ||
              `FFMPEG_${codigo}`
            )
          )
        }

        resolve(
          Buffer.concat(saida)
        )
      }
    )

    processo.stdin.end(pixels)
  })
}

dylan.setCommand({
  nome: 'toimg',
  comandos: [
    'toimg',
    'stickerimg'
  ],
  categoria: 'figurinhas',

  info: {
    descricao: 'Converte uma figurinha em imagem PNG.',
    uso: 'toimg',
    categoria: 'figurinhas'
  },

  async executar(ctx) {
    const sticker = pegarSticker(ctx)

    if (!sticker) {
      const mensagem =
        typeof ctx.mess?.toimgUso === 'function'
          ? ctx.mess.toimgUso(ctx.prefix)
          : ctx.mess.padraoUso({
              emoji: '🖼️',
              titulo: 'TOIMG',
              uso: `${ctx.prefix}${ctx.command} respondendo uma figurinha`,
              descricao: 'Responda a uma figurinha para converter em imagem.'
            })

      return ctx.reply(mensagem)
    }

    try {
      const buffer = await ctx.getFileBuffer(
        sticker,
        'sticker'
      )

      if (!buffer?.length)
        throw new Error('STICKER_VAZIO')

      const frame = await primeiroFrame(buffer)
      const imagem = await png(frame)

      if (!imagem?.length)
        throw new Error('PNG_VAZIO')

      await ctx.tokito.sendMessage(
        ctx.from,
        {
          image: imagem,
          mimetype: 'image/png'
        },
        {
          quoted: ctx.selo
        }
      )

      return true
    }
    catch (error) {
      console.log(
        '[TOIMG]',
        error?.message || error
      )

      const mensagem =
        typeof ctx.mess?.toimgErro === 'function'
          ? ctx.mess.toimgErro()
          : ctx.mess.padraoErro({
              titulo: 'ERRO NO TOIMG',
              descricao: 'Não foi possível converter a figurinha em imagem.'
            })

      return ctx.reply(mensagem)
    }
  }
})
