'use strict'
// Fundos personalizados ficam em LOGOS; os padrões oficiais ficam nos assets atualizáveis.
const fs = require('fs')
const path = require('path')
const os = require('os')
const { promisify } = require('util')
const { execFile } = require('child_process')
const modulos = require('./modulos')
const pasta = path.join(__dirname, '..', 'INFO_DADOS', 'LOGOS')
const nomes = { erro: 'fundoerro', prefixo: 'fundoprefix' }
const cache = new Map()
const opcoes = tipo => {
  const base = path.join(pasta, nomes[tipo] || '')
  return [
    { path: base + '.gif.mp4', tipo: 'video', gif: true },
    { path: base + '.mp4', tipo: 'video', gif: false },
    { path: base + '.png', tipo: 'image', gif: false }
  ]
}
const padrao = tipo => path.join(__dirname, '..', 'assets', 'fundos', (nomes[tipo] || '') + '.png')
const bloqueio = tipo => path.join(pasta, '.' + (nomes[tipo] || '') + '.disabled')
const existe = item => fs.existsSync(item.path) && fs.statSync(item.path).size > 0
const atual = tipo => {
  if (!nomes[tipo]) return null
  const personalizado = opcoes(tipo).find(existe)
  if (personalizado) return personalizado
  if (fs.existsSync(bloqueio(tipo))) return null
  const base = { path: padrao(tipo), tipo: 'image', gif: false }
  return existe(base) ? base : null
}
const limpar = tipo => {
  let ok = false
  for (const item of opcoes(tipo)) {
    if (fs.existsSync(item.path)) { fs.unlinkSync(item.path); ok = true }
  }
  fs.mkdirSync(pasta, { recursive: true })
  fs.writeFileSync(bloqueio(tipo), 'disabled\n')
  cache.delete(tipo)
  return ok
}
async function salvar(ctx, tipo) {
  const m = modulos.mediaAtual(ctx)
  const midia = m.video || m.image || (/image\/gif/i.test(m.document?.mimetype || '') ? m.document : null)
  if (!midia) return null
  const origem = m.video ? 'video' : m.image ? 'image' : 'document'
  const gif = midia.gifPlayback === true || /image\/gif/i.test(midia.mimetype || '')
  const converter = gif && origem !== 'video'
  const buffer = await ctx.getFileBuffer(midia, origem)
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw new Error('Mídia vazia.')
  if (buffer.length > 35 * 1024 * 1024) throw new Error('O fundo deve ter até 35 MB.')
  fs.mkdirSync(pasta, { recursive: true })
  const entrada = path.join(os.tmpdir(), 'tokito-' + nomes[tipo] + '-' + Date.now() + '-' + Math.random().toString(36).slice(2))
  const saida = entrada + '.mp4'
  const local = path.join(pasta, nomes[tipo] + (gif ? '.gif.mp4' : origem === 'video' ? '.mp4' : '.png'))
  try {
    if (converter) {
      fs.writeFileSync(entrada + '.gif', buffer)
      try {
        await promisify(execFile)('ffmpeg', [
          '-y', '-hide_banner', '-loglevel', 'error',
          '-i', entrada + '.gif', '-vf', 'fps=12,scale=trunc(iw/2)*2:trunc(ih/2)*2',
          '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart', saida
        ], { timeout: 90000 })
      } catch {
        throw new Error('Para usar GIF original, instale o FFmpeg.')
      }
    } else fs.writeFileSync(saida, buffer)
    if (!fs.statSync(saida).size) throw new Error('Mídia inválida.')
    fs.copyFileSync(saida, local)
    for (const item of opcoes(tipo)) if (item.path !== local && fs.existsSync(item.path)) fs.unlinkSync(item.path)
    if (fs.existsSync(bloqueio(tipo))) fs.unlinkSync(bloqueio(tipo))
    cache.delete(tipo)
    return gif ? 'GIF' : origem === 'video' ? 'VÍDEO' : 'FOTO'
  } finally {
    for (const f of [entrada + '.gif', saida])
      try { if (fs.existsSync(f)) fs.unlinkSync(f) } catch {}
  }
}
async function preparar(ctx, tipo) {
  const file = atual(tipo)
  if (!file) return null
  const stat = fs.statSync(file.path)
  const chave = file.path + ':' + stat.mtimeMs + ':' + stat.size
  if (cache.get(tipo)?.chave === chave) return cache.get(tipo).promise
  const promise = (async () => {
    const b = await fs.promises.readFile(file.path)
    const midia = await ctx.prepareWAMessageMedia(
      file.tipo === 'video' ? { video: b, gifPlayback: file.gif } : { image: b },
      { upload: ctx.tokito.waUploadToServer, logger: ctx.tokito.logger }
    )
    if (file.gif && midia.videoMessage) midia.videoMessage.gifPlayback = true
    return { ...file, midia }
  })()
  cache.set(tipo, { chave, promise })
  try { return await promise } catch (e) { cache.delete(tipo); throw e }
}
async function enviar(ctx, tipo, texto, botoes = []) {
  const fallback = () => botoes.length && ctx.botaozin
    ? ctx.botaozin(texto, botoes, [ctx.sender])
    : ctx.reply(texto, [ctx.sender])
  if (!atual(tipo)) return fallback()
  try {
    const media = await preparar(ctx, tipo)
    const contexto = ctx.canalInfo ? ctx.canalInfo([ctx.sender]) : { mentionedJid: [ctx.sender] }
    const i = ctx.proto?.Message?.InteractiveMessage
    let conteudo
    if (ctx.isBotoes && botoes.length && i) {
      conteudo = { interactiveMessage: i.create({
        contextInfo: contexto,
        header: i.Header.create({
          hasMediaAttachment: true,
          ...(media.tipo === 'video'
            ? { videoMessage: media.midia.videoMessage }
            : { imageMessage: media.midia.imageMessage })
        }),
        body: i.Body.create({ text: texto }),
        footer: i.Footer.create({ text: '' }),
        nativeFlowMessage: i.NativeFlowMessage.create({
          buttons: botoes.map(b => ({
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: b.texto, id: b.id })
          }))
        })
      }) }
    } else conteudo = media.tipo === 'video'
      ? { videoMessage: { ...media.midia.videoMessage, caption: texto, contextInfo: contexto } }
      : { imageMessage: { ...media.midia.imageMessage, caption: texto, contextInfo: contexto } }
    const msg = ctx.generateWAMessageFromContent(ctx.from, conteudo, {
      quoted: ctx.selo, userJid: ctx.tokito.user?.id
    })
    return await ctx.tokito.relayMessage(ctx.from, msg.message, { messageId: msg.key.id })
  } catch (e) {
    console.log('[TOKITO FUNDO]', tipo, e.message)
    return fallback()
  }
}
module.exports = { salvar, limpar, atual, enviar }
