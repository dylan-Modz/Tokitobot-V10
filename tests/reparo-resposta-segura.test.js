'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const texto = fs.readFileSync(path.join(__dirname, '..', 'tokito.js'), 'utf8')
const inicio = texto.indexOf('const reply = async (text, mentions = []) => {')
const fim = texto.indexOf('const enviarbuton = botoes =>', inicio)
const criar = (config, sender) => {
  assert.ok(inicio > 0 && fim > inicio)
  return new Function('modulos', 'API_KEY_TOKITO', 'runtimeSub', 'configAtual',
    'canalOficial', 'tokito', 'from', 'selo', 'canalInfo',
    texto.slice(inicio, fim) + '\nreturn reply')(
    { sanitizarErro: x => x }, '', { isSubBot: false }, config,
    canal, { sendMessage: sender }, '123@s.whatsapp.net',
    { key: { id: 'MSG-CITADA' } }, mentions => canal.contextoSeguro(mentions)
  )
}
const url = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'
const cfg = { channel: url, channelLink: url, channeldl: '0@newsletter' }

test('resposta normal preserva texto sem URL colada', async () => {
  const chamadas = []
  const reply = criar(cfg, async (_, msg) => { chamadas.push(msg); return true })
  await reply('Pong')
  assert.equal(chamadas.length, 1)
  assert.ok(chamadas[0].text.includes('Pong'))
  assert.equal(chamadas[0].text, 'Pong')
  assert.equal(chamadas[0].contextInfo.externalAdReply, undefined)
})

test('em falha de citação tenta resposta simples mais uma vez', async () => {
  const chamadas = []
  const reply = criar(cfg, async (_, msg, opts) => {
    chamadas.push({ msg, opts })
    if (chamadas.length === 1) throw new Error('contexto incompatível')
    return { ok: true }
  })
  const result = await reply('Comando executado', ['123@s.whatsapp.net'])
  assert.equal(result.ok, true)
  assert.equal(chamadas.length, 2)
  assert.equal(chamadas[1].opts, undefined)
  assert.deepEqual(chamadas[1].msg.contextInfo, { mentionedJid: ['123@s.whatsapp.net'] })
})

test('JSON do comando get continua íntegro', async () => {
  const chamadas = []
  const reply = criar(cfg, async (_, msg) => { chamadas.push(msg); return true })
  const json = '{"key":{"id":"abc"},"message":{"text":"teste"}}'
  await reply(json)
  assert.equal(chamadas[0].text, json)
  assert.deepEqual(JSON.parse(chamadas[0].text), JSON.parse(json))
})

test('sem canal configurado não acrescenta links', async () => {
  const chamadas = []
  const reply = criar({ channel:'0@newsletter', channeldl:'0@newsletter' },
    async (_, msg) => { chamadas.push(msg); return true })
  await reply('OK')
  assert.equal(chamadas[0].text, 'OK')
})
