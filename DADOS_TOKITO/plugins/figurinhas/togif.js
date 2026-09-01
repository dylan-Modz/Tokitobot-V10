/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * ============================================================
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn } = require('child_process')
const WebP = require('node-webpmux')
const dylan = require('../../database/lib/comandos')

const FPS = 20
const FRAME_MS = 1000 / FPS
const MAX_FRAMES = 300

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

const limparRetangulo = (
  canvas,
  frame,
  canvasWidth,
  cor
) => {
  const largura = Number(frame?.width || 0)
  const altura = Number(frame?.height || 0)
  const offsetX = Number(frame?.x || 0)
  const offsetY = Number(frame?.y || 0)

  const rgba = Array.isArray(cor)
    ? [
        Number(cor[0] || 0),
        Number(cor[1] || 0),
        Number(cor[2] || 0),
        Number(cor[3] || 0)
      ]
    : [0, 0, 0, 0]

  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      const destino =
        ((offsetY + y) * canvasWidth + (offsetX + x)) * 4

      canvas[destino] = rgba[0]
      canvas[destino + 1] = rgba[1]
      canvas[destino + 2] = rgba[2]
      canvas[destino + 3] = rgba[3]
    }
  }
}

const desenharFrame = (
  canvas,
  frame,
  pixels,
  canvasWidth
) => {
  const largura = Number(frame?.width || 0)
  const altura = Number(frame?.height || 0)
  const offsetX = Number(frame?.x || 0)
  const offsetY = Number(frame?.y || 0)
  const blend = frame?.blend !== false

  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      const origem = (y * largura + x) * 4
      const destino =
        ((offsetY + y) * canvasWidth + (offsetX + x)) * 4

      const sr = pixels[origem]
      const sg = pixels[origem + 1]
      const sb = pixels[origem + 2]
      const saByte = pixels[origem + 3]

      if (!blend) {
        canvas[destino] = sr
        canvas[destino + 1] = sg
        canvas[destino + 2] = sb
        canvas[destino + 3] = saByte
        continue
      }

      if (saByte === 0)
        continue

      if (saByte === 255) {
        canvas[destino] = sr
        canvas[destino + 1] = sg
        canvas[destino + 2] = sb
        canvas[destino + 3] = 255
        continue
      }

      const sa = saByte / 255
      const da = canvas[destino + 3] / 255
      const outA = sa + da * (1 - sa)

      if (outA <= 0) {
        canvas[destino] = 0
        canvas[destino + 1] = 0
        canvas[destino + 2] = 0
        canvas[destino + 3] = 0
        continue
      }

      canvas[destino] = Math.round(
        (
          sr * sa +
          canvas[destino] * da * (1 - sa)
        ) / outA
      )

      canvas[destino + 1] = Math.round(
        (
          sg * sa +
          canvas[destino + 1] * da * (1 - sa)
        ) / outA
      )

      canvas[destino + 2] = Math.round(
        (
          sb * sa +
          canvas[destino + 2] * da * (1 - sa)
        ) / outA
      )

      canvas[destino + 3] = Math.round(
        outA * 255
      )
    }
  }
}

const achatar = (
  canvas,
  fundo = [255, 255, 255]
) => {
  const saida = Buffer.alloc(canvas.length)

  for (let i = 0; i < canvas.length; i += 4) {
    const alpha = canvas[i + 3] / 255
    const inverso = 1 - alpha

    saida[i] = Math.round(
      canvas[i] * alpha +
      fundo[0] * inverso
    )

    saida[i + 1] = Math.round(
      canvas[i + 1] * alpha +
      fundo[1] * inverso
    )

    saida[i + 2] = Math.round(
      canvas[i + 2] * alpha +
      fundo[2] * inverso
    )

    saida[i + 3] = 255
  }

  return saida
}

const escrever = (
  stream,
  buffer
) => {
  return new Promise((resolve, reject) => {
    if (stream.destroyed)
      return reject(
        new Error('FFMPEG_FECHADO')
      )

    const erro = error => {
      stream.off('drain', ok)
      reject(error)
    }

    const ok = () => {
      stream.off('error', erro)
      resolve()
    }

    stream.once('error', erro)

    if (stream.write(buffer))
      ok()
    else
      stream.once('drain', ok)
  })
}

const converter = async (
  buffer,
  destino
) => {
  const imagem = new WebP.Image()

  await imagem.load(buffer)
  await imagem.initLib()

  const frames =
    Array.isArray(imagem.frames)
      ? imagem.frames
      : []

  if (!imagem.hasAnim || !frames.length) {
    const erro = new Error('STICKER_NAO_ANIMADO')
    erro.codigo = 'NAO_ANIMADO'
    throw erro
  }

  const width = Number(imagem.width || 0)
  const height = Number(imagem.height || 0)

  if (!width || !height)
    throw new Error('WEBP_INVALIDO')

  const processo = spawn(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-f',
      'rawvideo',
      '-pix_fmt',
      'rgba',
      '-s',
      `${width}x${height}`,
      '-r',
      String(FPS),
      '-i',
      'pipe:0',
      '-an',
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '23',
      '-vf',
      'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      destino
    ],
    {
      stdio: [
        'pipe',
        'ignore',
        'pipe'
      ]
    }
  )

  const erros = []

  processo.stderr.on(
    'data',
    chunk => erros.push(chunk)
  )

  const terminou = new Promise(
    (resolve, reject) => {
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

          resolve()
        }
      )
    }
  )

  const canvas = Buffer.alloc(
    width * height * 4
  )

  const fundo =
    imagem.anim?.bgColor ||
    [0, 0, 0, 0]

  let enviados = 0

  try {
    for (
      let indice = 0;
      indice < frames.length;
      indice++
    ) {
      const frame = frames[indice]
      const pixels =
        await imagem.getFrameData(indice)

      desenharFrame(
        canvas,
        frame,
        pixels,
        width
      )

      const pronto =
        achatar(canvas)

      const delay =
        Math.max(
          FRAME_MS,
          Number(frame?.delay || 100)
        )

      const repeticoes =
        Math.max(
          1,
          Math.round(delay / FRAME_MS)
        )

      for (
        let repetir = 0;
        repetir < repeticoes;
        repetir++
      ) {
        if (enviados >= MAX_FRAMES)
          break

        await escrever(
          processo.stdin,
          pronto
        )

        enviados++
      }

      if (frame?.dispose) {
        limparRetangulo(
          canvas,
          frame,
          width,
          fundo
        )
      }

      if (enviados >= MAX_FRAMES)
        break
    }

    processo.stdin.end()

    await terminou
  }
  catch (error) {
    try {
      processo.stdin.destroy()
    }
    catch {}

    try {
      processo.kill('SIGKILL')
    }
    catch {}

    throw error
  }

  if (
    !fs.existsSync(destino) ||
    fs.statSync(destino).size <= 0
  ) {
    throw new Error('MP4_VAZIO')
  }

  return destino
}

dylan.setCommand({
  nome: 'togif',
  comandos: [
    'togif',
    'tovideo'
  ],
  categoria: 'figurinhas',

  info: {
    descricao: 'Converte uma figurinha animada em vídeo/GIF.',
    uso: 'togif',
    categoria: 'figurinhas'
  },

  async executar(ctx) {
    const sticker = pegarSticker(ctx)

    if (!sticker) {
      const mensagem =
        typeof ctx.mess?.togifUso === 'function'
          ? ctx.mess.togifUso(ctx.prefix)
          : ctx.mess.padraoUso({
              emoji: '🎞️',
              titulo: 'TOGIF',
              uso: `${ctx.prefix}${ctx.command} respondendo uma figurinha animada`,
              descricao: 'Responda a uma figurinha animada para converter em vídeo/GIF.'
            })

      return ctx.reply(mensagem)
    }

    const nome =
      `tokito-togif-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.mp4`

    const destino =
      path.join(
        os.tmpdir(),
        nome
      )

    try {
      const buffer = await ctx.getFileBuffer(
        sticker,
        'sticker'
      )

      if (!buffer?.length)
        throw new Error('STICKER_VAZIO')

      await converter(
        buffer,
        destino
      )

      await ctx.tokito.sendMessage(
        ctx.from,
        {
          video: fs.readFileSync(destino),
          mimetype: 'video/mp4',
          gifPlayback: true,
          fileName: 'tokito-sticker.gif'
        },
        {
          quoted: ctx.selo
        }
      )

      return true
    }
    catch (error) {
      console.log(
        '[TOGIF]',
        error?.message || error
      )

      if (
        error?.codigo === 'NAO_ANIMADO' ||
        error?.message === 'STICKER_NAO_ANIMADO'
      ) {
        const mensagem =
          typeof ctx.mess?.togifNaoAnimada === 'function'
            ? ctx.mess.togifNaoAnimada(ctx.prefix)
            : ctx.mess.padraoAviso({
                emoji: '🎞️',
                titulo: 'FIGURINHA NÃO ANIMADA',
                descricao: 'O comando togif precisa de uma figurinha animada.',
                detalhe: `Para figurinha estática, use ${ctx.prefix}toimg.`
              })

        return ctx.reply(mensagem)
      }

      const mensagem =
        typeof ctx.mess?.togifErro === 'function'
          ? ctx.mess.togifErro()
          : ctx.mess.padraoErro({
              titulo: 'ERRO NO TOGIF',
              descricao: 'Não foi possível converter a figurinha animada.'
            })

      return ctx.reply(mensagem)
    }
    finally {
      try {
        if (fs.existsSync(destino))
          fs.unlinkSync(destino)
      }
      catch {}
    }
  }
})
