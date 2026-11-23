'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')

const root = path.resolve(__dirname, '..')
const source = fs.readFileSync(path.join(root, 'tokito.js'), 'utf8')
const start = source.indexOf('const reply = async (text, mentions = []) => {')
const end = source.indexOf('const enviarbuton = botoes =>', start)

const fabrica = (config, send) => {
  assert.ok(start >= 0 && end > start)
  const bloco = source.slice(start, end)
  const socket = { sendMessage: send }
  const args = ['modulos', 'API_KEY_TOKITO', 'runtimeSub', 'configAtual',
    'canalOficial', 'tokito', 'from', 'selo', 'canalInfo']
  const params = [
    { sanitizarErro: x => x }, '', { isSubBot: false }, config,
    canal, socket, 'grupo@g.us', { key: { id: 'quoted-message' } },
    mentions => canal.contexto(config, socket, 'Tokito', mentions)
  ]
  return new Function(...args, bloco + '\nreturn reply')(...params)
}

test('resposta mantém texto se a primeira tentativa de envio falhar', async () => {
  const url = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'
  const config = { channel: url, channeldl: '0@newsletter', channelLink: url }
  const tentativas = []
  const reply = fabrica(config, async (_jid, message, opts) => {
    tentativas.push({ message, opts })
    if (tentativas.length === 1) throw new Error('Invalid contextInfo')
    return { status: 'enviado' }
  })
  const resposta = await reply('COMANDO EXECUTADO')
  assert.equal(resposta.status, 'enviado')
  assert.equal(tentativas.length, 2)
  assert.ok(tentativas[0].message.text.includes('COMANDO EXECUTADO'))
  assert.ok(tentativas[0].message.text.includes(url))
  assert.equal(tentativas[1].opts, undefined)
  assert.equal(tentativas[1].message.contextInfo.forwardedNewsletterMessageInfo, undefined)
  assert.equal(tentativas[1].message.contextInfo.externalAdReply, undefined)
})

test('JID e serverMessageId de encaminhamento preservam cartão nativo', async () => {
  const url = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'
  const cfg = {
    channel: '120363423684523217@newsletter',
    channeldl: '120363423684523217@newsletter',
    channelLink: url, channelMessageId: 268, channelName: 'Teste'
  }
  const enviadas = []
  const reply = fabrica(cfg, async (_, m) => { enviadas.push(m); return { ok: true } })
  const out = await reply('TESTE')
  assert.equal(out.ok, true)
  assert.equal(enviadas.length, 1)
  assert.equal(enviadas[0].contextInfo.forwardedNewsletterMessageInfo.newsletterJid, cfg.channeldl)
  assert.equal(enviadas[0].contextInfo.forwardedNewsletterMessageInfo.serverMessageId, 268)
  assert.equal(enviadas[0].contextInfo.forwardedNewsletterMessageInfo.newsletterName, 'Teste')
})
