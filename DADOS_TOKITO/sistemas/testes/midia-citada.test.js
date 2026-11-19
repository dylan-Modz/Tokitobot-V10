'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const midia = require('../midia-citada')

const MEDIA = { mediaKey: Buffer.from('key'), directPath: '/file', seconds: 2 }
const jid = '120363123@g.us'
const id = 'abc123'
const socket = {
  __tokitoMidiasOriginais: new Map([[
    `${jid}|${id}`,
    { at: Date.now(), key: { remoteJid: jid }, message: {
      viewOnceMessageV2: { message: { imageMessage: MEDIA } }
    } }
  ]])
}
const contexto = {
  stanzaId: id,
  quotedMessage: { viewOnceMessageV2: { message: { imageMessage: {} } } }
}

test('usa a mídia original quando a citação não inclui mediaKey', () => {
  const preparo = midia.preparar({ tokito: socket, from: jid, ctxMsg: contexto })
  assert.equal(midia.candidatos(preparo.fontes, 'image')[0], MEDIA)
})

test('respeita jid do grupo e ID da mensagem', () => {
  assert.equal(midia.obterOriginal(socket, 'outro@g.us', id), null)
  assert.equal(midia.obterOriginal(socket, jid, 'outro'), null)
})

test('expira registros antigos', () => {
  const antigo = { __tokitoMidiasOriginais: new Map([[
    `${jid}|${id}`,
    { at: Date.now() - 11 * 60 * 1000, key: { remoteJid: jid }, message: { imageMessage: MEDIA } }
  ]]) }
  assert.equal(midia.obterOriginal(antigo, jid, id), null)
  assert.equal(antigo.__tokitoMidiasOriginais.size, 0)
})

test('baixa imagem válida recebida no cache', async () => {
  const preparo = midia.preparar({ tokito: socket, from: jid, ctxMsg: contexto })
  const buffer = await midia.baixar(
    { getFileBuffer: async () => Buffer.from('ok') },
    'image', midia.candidatos(preparo.fontes, 'image'), preparo.referencia
  )
  assert.equal(buffer.toString(), 'ok')
})

test('tenta atualizar o caminho da mídia expirada', async () => {
  let tentativas = 0
  const media = { ...MEDIA }
  const buffer = await midia.baixar({
    from: jid,
    getFileBuffer: async () => {
      if (++tentativas === 1) {
        const e = new Error('404')
        e.statusCode = 404
        throw e
      }
      return Buffer.from('renovada')
    },
    tokito: { updateMediaMessage: async () => { media.directPath = '/novo' } }
  }, 'image', [media], { stanzaId: id })
  assert.equal(buffer.toString(), 'renovada')
  assert.equal(tentativas, 2)
})

test('erro claro quando não existe a chave', async () => {
  await assert.rejects(
    midia.baixar({ getFileBuffer: async () => Buffer.alloc(0) }, 'image', [{}]),
    { code: 'SEM_CHAVE' }
  )
})

test('reconhece vídeo de visualização única', () => {
  assert.equal(midia.extrair({
    viewOnceMessage: { message: { videoMessage: MEDIA } }
  }, 'video'), MEDIA)
})

const Module = require('node:module')
const carregarOriginal = Module._load
let comando
try {
  Module._load = function(pedido) {
    if (pedido === '../../database/lib/comandos') {
      return { setCommand: definicao => { comando = definicao } }
    }
    return carregarOriginal.apply(this, arguments)
  }
  require('../../plugins/figurinhas/s.js')
} finally {
  Module._load = carregarOriginal
}

const contextoComando = extra => {
  const resultado = { arquivo: null, replies: [] }
  return {
    resultado,
    ctx: {
      from: jid, tokito: socket, ctxMsg: contexto,
      NomeDoBot: 'Tokito', pushname: 'Teste', prefix: '/', command: 's',
      selo: {},
      getFileBuffer: async () => Buffer.from('imagem'),
      sendImageAsSticker2: async (_socket, _jid, buffer) => {
        resultado.arquivo = buffer.toString()
        return '/tmp/test-sticker.webp'
      },
      DLT_FL: async () => { resultado.limpo = true },
      reply: message => { resultado.replies.push(message) },
      mess: {
        padraoUso: args => args.descricao,
        padraoErro: args => args.descricao
      },
      ...extra
    }
  }
}

test('comando /s usa cache e converte foto de visualização única', async () => {
  const { ctx, resultado } = contextoComando()
  await comando.executar(ctx)
  assert.equal(resultado.arquivo, 'imagem')
  assert.equal(resultado.limpo, true)
  assert.equal(resultado.replies.length, 0)
})

test('comando /s informa quando a chave não foi recebida', async () => {
  const { ctx, resultado } = contextoComando({ tokito: {} })
  await comando.executar(ctx)
  assert.equal(resultado.arquivo, null)
  assert.match(resultado.replies[0], /chave|imagem ou vídeo/i)
})


test('cache recebe mídia view-once e preserva a chave original', () => {
  const conexao = {}
  const chave = { remoteJid: 'cache@g.us', id: 'view-once-1', isViewOnce: true }
  const media = { mediaKey: Buffer.from('segredo-exemplo'), directPath: '/media' }
  midia.vincularCache(conexao)
  midia.registrarRecebidas(conexao, [{
    key: chave,
    message: { viewOnceMessageV2: { message: { imageMessage: media } } }
  }])
  const original = midia.obterOriginal(conexao, chave.remoteJid, chave.id)
  assert.equal(midia.extrair(original.message, 'image'), media)
})

test('stub de visualização única não inventa mídia no cache', () => {
  const conexao = {}
  midia.vincularCache(conexao)
  midia.registrarRecebidas(conexao, [{
    key: { remoteJid: 'cache@g.us', id: 'stub-1', isViewOnce: true }
  }])
  assert.equal(midia.obterOriginal(conexao, 'cache@g.us', 'stub-1'), null)
})

test('evento parcial não substitui mídia original', () => {
  const conexao = {}
  midia.vincularCache(conexao)
  const key = { remoteJid: 'cache@g.us', id: 'view-once-2' }
  const media = { mediaKey: Buffer.from('chave'), directPath: '/origem' }
  midia.registrarRecebidas(conexao, [{
    key, message: { viewOnceMessageV2: { message: { imageMessage: media } } }
  }])
  midia.registrarRecebidas(conexao, [{
    key, update: { message: { imageMessage: { viewOnce: true } } }
  }])
  assert.equal(midia.extrair(midia.obterOriginal(conexao, key.remoteJid, key.id).message, 'image'), media)
})

test('cache em RAM acompanha reconexão sem acessar outro chat', () => {
  const novoSocket = {}
  midia.vincularCache(novoSocket)
  assert.ok(midia.obterOriginal(novoSocket, 'cache@g.us', 'view-once-1'))
  assert.equal(midia.obterOriginal(novoSocket, 'outro@g.us', 'view-once-1'), null)
})
