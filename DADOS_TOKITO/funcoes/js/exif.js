const fs = require('fs')
const { tmpdir } = require('os')
const Crypto = require('crypto')
const ff = require('fluent-ffmpeg')
const webp = require('node-webpmux')
const path = require('path')

const temporario = ext => {
  return path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}${ext}`
  )
}

const apagar = arquivo => {
  try {
    if (arquivo && fs.existsSync(arquivo)) {
      fs.unlinkSync(arquivo)
    }
  }
  catch {
  }
}

async function imageToWebp(media) {
  const tmpFileOut = temporario('.webp')
  const tmpFileIn = temporario('.jpg')

  fs.writeFileSync(tmpFileIn, media)

  try {
    await new Promise((resolve, reject) => {
      ff(tmpFileIn)
        .on('error', reject)
        .on('end', () => resolve(true))
        .addOutputOptions([
          '-vcodec',
          'libwebp',

          '-vf',
          'scale=512:512',

          '-frames:v',
          '1',

          '-lossless',
          '0',

          '-compression_level',
          '6',

          '-q:v',
          '80',

          '-preset',
          'picture',

          '-an'
        ])
        .toFormat('webp')
        .save(tmpFileOut)
    })

    if (
      !fs.existsSync(tmpFileOut) ||
      !fs.statSync(tmpFileOut).size
    ) {
      throw new Error(
        'O FFmpeg não gerou a figurinha.'
      )
    }

    return fs.readFileSync(tmpFileOut)
  }
  finally {
    apagar(tmpFileIn)
    apagar(tmpFileOut)
  }
}

async function videoToWebp(media) {
  const tmpFileOut = temporario('.webp')
  const tmpFileIn = temporario('.mp4')

  fs.writeFileSync(tmpFileIn, media)

  try {
    await new Promise((resolve, reject) => {
      ff(tmpFileIn)
        .on('error', reject)
        .on('end', () => resolve(true))
        .addOutputOptions([
          '-vcodec',
          'libwebp',

          '-vf',
          'fps=10,scale=512:512',

          '-t',
          '9.5',

          '-lossless',
          '0',

          '-compression_level',
          '6',

          '-q:v',
          '40',

          '-loop',
          '0',

          '-preset',
          'default',

          '-an'
        ])
        .toFormat('webp')
        .save(tmpFileOut)
    })

    if (
      !fs.existsSync(tmpFileOut) ||
      !fs.statSync(tmpFileOut).size
    ) {
      throw new Error(
        'O FFmpeg não gerou a figurinha animada.'
      )
    }

    return fs.readFileSync(tmpFileOut)
  }
  finally {
    apagar(tmpFileIn)
    apagar(tmpFileOut)
  }
}

const criarExif = metadata => {
  const json = {
    'sticker-pack-id':
      metadata?.packId ||
      'TOKITOBOT-V10',

    'sticker-pack-name':
      metadata?.packname ||
      'TokitoBot V10',

    'sticker-pack-publisher':
      metadata?.author ||
      'dylan Modz',

    'emojis':
      Array.isArray(metadata?.categories)
        ? metadata.categories
        : ['🧊']
  }

  const exifAttr = Buffer.from([
    0x49,
    0x49,
    0x2A,
    0x00,
    0x08,
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    0x41,
    0x57,
    0x07,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x16,
    0x00,
    0x00,
    0x00
  ])

  const jsonBuff = Buffer.from(
    JSON.stringify(json),
    'utf8'
  )

  const exif = Buffer.concat([
    exifAttr,
    jsonBuff
  ])

  exif.writeUIntLE(
    jsonBuff.length,
    14,
    4
  )

  return exif
}

async function adicionarExifWebp(media, metadata = {}) {
  const tmpFileIn = temporario('.webp')
  const tmpFileOut = temporario('.webp')

  fs.writeFileSync(
    tmpFileIn,
    media
  )

  try {
    const img = new webp.Image()

    await img.load(
      tmpFileIn
    )

    img.exif = criarExif(
      metadata
    )

    await img.save(
      tmpFileOut
    )

    apagar(tmpFileIn)

    return tmpFileOut
  }
  catch (e) {
    apagar(tmpFileIn)
    apagar(tmpFileOut)
    throw e
  }
}

async function writeExifImg(media, metadata = {}) {
  const wMedia = await imageToWebp(
    media
  )

  return adicionarExifWebp(
    wMedia,
    metadata
  )
}

async function writeExifVid(media, metadata = {}) {
  const wMedia = await videoToWebp(
    media
  )

  return adicionarExifWebp(
    wMedia,
    metadata
  )
}

async function writeExif(media, metadata = {}) {
  const mimetype = String(
    media?.mimetype || ''
  ).toLowerCase()

  let wMedia

  if (
    mimetype.includes('webp')
  ) {
    wMedia = media.data
  }

  else if (
    mimetype.includes('image')
  ) {
    wMedia = await imageToWebp(
      media.data
    )
  }

  else if (
    mimetype.includes('video')
  ) {
    wMedia = await videoToWebp(
      media.data
    )
  }

  else {
    throw new Error(
      'Tipo de mídia não suportado.'
    )
  }

  return adicionarExifWebp(
    wMedia,
    metadata
  )
}

module.exports = {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExif
}