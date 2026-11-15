const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')

const filename = path.join(__dirname, '../DADOS_TOKITO/plugins/admin/open.js')
let command
vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
  require: () => ({ setCommand: c => { command = c } }),
  console: { log: () => {} },
  module: { exports: {} },
  Buffer, Promise, setTimeout, Date, global: {}
})
assert.ok(command?.comandos?.includes('revelar'))

const create = ({ quoted, cached, unavailable, type = 'image', stanzaId = 'MSG' } = {}) => {
  const result = { downloads: [], messages: [], replies: [] }
  const key = 'group@g.us|' + stanzaId
  const tokito = {
    __tokitoMidiasOriginais: cached ? new Map([[key, {
      message: cached, key: { participant: 'participant@lid' }, at: Date.now()
    }]]) : new Map(),
    __tokitoEstadoMidia: unavailable ? new Map([[key, { motivo: unavailable, at: Date.now() }]]) : new Map(),
    sendMessage: async (jid, data) => { result.messages.push(data) },
    sendPresenceUpdate: async () => {},
    updateMediaMessage: async () => {}
  }
  const ctx = {
    isGroup: true, isGroupAdmins: true, from: 'group@g.us', tokito,
    ctxMsg: { stanzaId, quotedMessage: quoted },
    info: { message: { extendedTextMessage: { contextInfo: { stanzaId, quotedMessage: quoted } } } },
    getFileBuffer: async (media, mediaType) => {
      result.downloads.push({ media, mediaType })
      return Buffer.from('sample')
    },
    reagir: async () => {},
    reply: async v => { result.replies.push(v) },
    mess: { sogrupo: () => '', soadm: () => '', padraoErro: e => e.descricao },
    prefix: '#', command: 'revelar', sender: 'admin@s.whatsapp.net',
    selo: {}, canalInfo: () => ({})
  }
  return { ctx, result, type }
}

test('normal photo with key and URL can be processed', async () => {
  const { ctx, result } = create({ quoted: { imageMessage: { mediaKey: Buffer.from([1]), directPath: '/media', mimetype: 'image/jpeg' } } })
  await command.executar(ctx)
  assert.equal(result.downloads[0].mediaType, 'image')
  assert.equal(result.messages.length, 1)
})

test('normal video and audio types are preserved', async () => {
  for (const type of ['video', 'audio']) {
    const key = type + 'Message'
    const { ctx, result } = create({ quoted: { [key]: { mediaKey: Buffer.from([1]), directPath: '/media' } } })
    await command.executar(ctx)
    assert.equal(result.downloads[0].mediaType, type)
    assert.equal(result.messages.length, 1)
  }
})

test('cached complete metadata is preferred over incomplete quotation', async () => {
  const { ctx, result } = create({
    quoted: { imageMessage: {} },
    cached: { imageMessage: { mediaKey: Buffer.from([2]), directPath: '/cached' } }
  })
  await command.executar(ctx)
  assert.equal(result.messages.length, 1)
  assert.equal(result.downloads[0].media.directPath, '/cached')
})

test('missing quotation key is reported without inventing a media key', async () => {
  const { ctx, result } = create({ quoted: { imageMessage: {} } })
  await command.executar(ctx)
  assert.equal(result.messages.length, 0)
  assert.match(result.replies[0], /n[aã]o cont[eé]m a chave/i)
})

test('Stone unavailable event yields distinct clear message', async () => {
  const { ctx, result } = create({
    quoted: { imageMessage: {} },
    unavailable: 'view_once_unavailable'
  })
  await command.executar(ctx)
  assert.equal(result.messages.length, 0)
  assert.match(result.replies[0], /n[aã]o est[aá] dispon[ií]vel/i)
})
