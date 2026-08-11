const fs = require('fs')
const axios = require('axios')
const { imageToWebp2: imageToWebp, videoToWebp2: videoToWebp, writeExifImg2: writeExifImg, writeExifVid2: writeExifVid } = require('./exif2.js')

const obterBuffer = async (media) => {
  if (Buffer.isBuffer(media))
    return media
  if (media instanceof Uint8Array)
    return Buffer.from(media)
  if (typeof media !== 'string')
    return Buffer.alloc(0)
  if (/^data:.*?\/.*?;base64,/i.test(media))
    return Buffer.from(media.split(',')[1], 'base64')
  if (/^https?:\/\//i.test(media)) {
    const resposta = await axios.get(media, {
      responseType: 'arraybuffer',
      timeout: 60000
    })
    return Buffer.from(resposta.data)
  }
  if (fs.existsSync(media))
    return fs.readFileSync(media)
  return Buffer.alloc(0)
}

const sendImageAsSticker = async (conn, jid, media, quoted, options = {}) => {
  const buff = await obterBuffer(media)
  if (!buff.length)
    throw new Error('Imagem vazia ou inválida.')
  const arquivo = options?.packname || options?.author
    ? await writeExifImg(buff, options)
    : await imageToWebp(buff)
  await conn.sendMessage(jid, { sticker: { url: arquivo } }, { quoted })
  return arquivo
}

const sendVideoAsSticker = async (conn, jid, media, quoted, options = {}) => {
  const buff = await obterBuffer(media)
  if (!buff.length)
    throw new Error('Vídeo vazio ou inválido.')
  const arquivo = options?.packname || options?.author
    ? await writeExifVid(buff, options)
    : await videoToWebp(buff)
  await conn.sendMessage(jid, { sticker: { url: arquivo } }, { quoted })
  return arquivo
}

module.exports = {
  sendVideoAsSticker,
  sendImageAsSticker
}
