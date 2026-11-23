'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const root = path.resolve(__dirname, '..')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const link = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'

test('canal por link mantém prévia clicável quando JID não existe', () => {
  const cfg = { channel: link, channeldl: '0@newsletter', channelLink: link }
  assert.equal(canal.ativo(cfg), true)
  assert.equal(canal.link(cfg), link)
  const contexto = canal.contexto(cfg, {}, 'Tokito', [])
  assert.equal(contexto.externalAdReply.sourceUrl, link)
  assert.equal(contexto.externalAdReply.title, '📢 Acessar canal')
  assert.equal(contexto.forwardedNewsletterMessageInfo, undefined)
})

test('canal desligado não produz cartão nem metadados falsos', () => {
  const cfg = { channel: '0@newsletter', channeldl: '0@newsletter', channelLink: '' }
  const contexto = canal.contexto(cfg, {}, 'Tokito', [])
  assert.equal(contexto.externalAdReply, undefined)
  assert.equal(contexto.forwardedNewsletterMessageInfo, undefined)
})

test('JID conhecido gera contexto nativo com identificador real', () => {
  const cfg = { channel: '120363999999999999@newsletter', channeldl: '120363999999999999@newsletter', channelLink: link }
  const contexto = canal.contexto(cfg, {}, 'Tokito', [])
  assert.equal(contexto.forwardedNewsletterMessageInfo.newsletterJid, cfg.channeldl)
  assert.equal(contexto.externalAdReply, undefined)
  assert.equal(contexto.forwardedNewsletterMessageInfo.serverMessageId, undefined)
})

test('resolução assíncrona recupera nome, JID e seguidores reais', async () => {
  const cfg = { channel: link, channelLink: link, channeldl: '0@newsletter' }
  const socket = { async newsletterMetadata(type, key) {
    assert.equal(type, 'invite')
    assert.equal(key, '0029VbCAgovIyPtbjBhrIi3u')
    return { id: '120363888888888888@newsletter', name: 'Canal de testes', subscribers: 33 }
  } }
  canal.contexto(cfg, socket, 'Tokito')
  await new Promise(resolve => setTimeout(resolve, 0))
  const atualizado = canal.contexto(cfg, socket, 'Tokito')
  assert.equal(atualizado.forwardedNewsletterMessageInfo.newsletterJid, '120363888888888888@newsletter')
  assert.equal(atualizado.forwardedNewsletterMessageInfo.newsletterName, 'Canal de testes')
})

function motorEmMemoria() {
  const arquivo = fs.readFileSync(path.join(root, 'DADOS_TOKITO/sistemas/sticker-audio.js'), 'utf8')
  const tags = []
  const writer = {
    uint32(n) { tags.push(n); return this },
    fork() { return this },
    ldelim() { return this }
  }
  const proto = {
    Message: {
      encode() { return writer },
      fromObject(obj) { return { ...obj, stickerMessage: { ...obj.stickerMessage } } },
      StickerMessage: { encode(value, output) { return output || writer } },
      AudioMessage: { encode(value, output) { return output || writer } }
    }
  }
  const modulos = { mediaAtual: () => ({}), audioAtual: () => null }
  const fakeRequire = mod => {
    if (mod === '@stone-wpp/ofc') return { proto, prepareWAMessageMedia() { throw new Error('unused') } }
    if (mod === './modulos') return modulos
    return require(mod)
  }
  const sandbox = { module: { exports: {} }, require: fakeRequire, Buffer, process, console,
    __dirname: path.join(root, 'DADOS_TOKITO/sistemas') }
  vm.runInNewContext(arquivo, sandbox, { filename: 'sticker-audio.js' })
  return { sistema: sandbox.module.exports, proto, tags, writer }
}

test('envio codifica áudio no campo 26 da figurinha sem wrapper externo', () => {
  const { sistema, proto, tags, writer } = motorEmMemoria()
  const som = { mediaKey: Buffer.alloc(32, 1), directPath: '/v/t62/teste', mimetype: 'audio/ogg; codecs=opus' }
  const msg = sistema.construirMensagem({ stickerMessage: { mimetype: 'image/webp' } },
    { audioMessage: som })
  assert.equal(msg.audioStickerMessage, undefined)
  assert.equal(msg.stickerMessage.audioMessage, som)
  proto.Message.StickerMessage.encode(msg.stickerMessage, writer)
  assert.ok(tags.includes(210), 'field 26 esperado (tag 210)')
  sistema.patchProtocolo()
  tags.length = 0
  proto.Message.StickerMessage.encode(msg.stickerMessage, writer)
  assert.equal(tags.filter(x => x === 210).length, 1, 'não duplicar áudio ao reaplicar patch')
})

test('clip OGG/Opus curto não depende de FFmpeg', async () => {
  const { sistema } = motorEmMemoria()
  const buffer = Buffer.concat([Buffer.from('OggS'), Buffer.alloc(20), Buffer.from('OpusHead'), Buffer.alloc(20)])
  const audio = await sistema.normalizarAudio({ getFileBuffer: async () => buffer }, {
    seconds: 5, mimetype: 'audio/ogg; codecs=opus'
  })
  assert.ok(audio.equals(buffer))
  assert.equal(sistema.MAX_SEGUNDOS, 10)
})

test('manifesto mantém reparação na versão 10.3.44', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const m = JSON.parse(fs.readFileSync(path.join(root, 'DADOS_TOKITO/INFO_DADOS/update.json'), 'utf8'))
  assert.equal(pkg.version, '10.3.44')
  assert.equal(m.version, '10.3.44')
  assert.equal(m.publicVersion, '10.3.44')
  assert.equal(m.repair, true)
  assert.equal(m.repairId, 'respostas-seguras-20261123-2')
  assert.equal(m.mode, 'incremental')
  assert.equal(m.notify, true)
})
