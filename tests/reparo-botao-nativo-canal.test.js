'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const root = path.resolve(__dirname, '..')
const JID = '120363555555555555@newsletter'
const LINK = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'

test('V10.3.41 cria selo com JID, nome do bot e serverMessageId vazio', () => {
  const contexto = canal.contextoV1041({
    channel: JID,
    channeldl: JID,
    channelLink: LINK
  }, 'Tokito Bot V10', ['5511987654321@s.whatsapp.net'])
  assert.deepEqual(contexto.forwardedNewsletterMessageInfo, {
    newsletterJid: JID,
    newsletterName: 'Tokito Bot V10',
    serverMessageId: ''
  })
  assert.equal(contexto.isForwarded, true)
  assert.equal(contexto.forwardingScore, 1)
  assert.deepEqual(contexto.mentionedJid, ['5511987654321@s.whatsapp.net'])
  assert.equal(contexto.externalAdReply, undefined)
})

test('como na 10.3.41 não exige ID de postagem nem nome armazenado', () => {
  const contexto = canal.contextoV1041({
    channel: JID, channeldl: JID, channelServerMessageId: null,
    channelName: ''
  }, 'Tokito', [])
  assert.equal(contexto.forwardedNewsletterMessageInfo.newsletterJid, JID)
  assert.equal(contexto.forwardedNewsletterMessageInfo.serverMessageId, '')
})

test('sem JID válido não fabrica selo de canal nem muda o texto', () => {
  for (const value of ['0@newsletter', '', 'https://whatsapp.com/channel/teste', '120363555555555555@s.whatsapp.net']) {
    const resultado = canal.contextoV1041({ channel: LINK, channeldl: value }, 'Tokito')
    assert.deepEqual(resultado, { mentionedJid: [] })
  }
})

test('os caminhos de envio do bot usam o contexto histórico', () => {
  const bot = fs.readFileSync(path.join(root, 'tokito.js'), 'utf8')
  const connect = fs.readFileSync(path.join(root, 'DADOS_TOKITO/connect.js'), 'utf8')
  assert.match(bot, /return canalOficial\.contextoV1041\(cfgCanal, NomeDoBot, mentions\)/)
  assert.match(connect, /return canalOficial\.contextoV1041\(cfgCanal, NomeDoBot, mentions\)/)
  assert.doesNotMatch(bot, /textoSeguro \+ '\\n\\n- 📢/)
  assert.doesNotMatch(bot, /const botaoCanal = canalOficial\.botaoAcesso/)
})

test('menu mantém lista antiga sem botão URL adicional', () => {
  const menu = fs.readFileSync(path.join(root, 'DADOS_TOKITO/plugins/menus/menu.js'), 'utf8')
  assert.match(menu, /name: 'single_select'/)
  assert.doesNotMatch(menu, /botaoCanalMenu|name: 'cta_url'/)
})

test('continua na 10.3.44 e novo reparo pode ser detectado', () => {
  const m = JSON.parse(fs.readFileSync(path.join(root, 'DADOS_TOKITO/INFO_DADOS/update.json'), 'utf8'))
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  assert.equal(pkg.version, '10.3.44')
  assert.equal(m.version, '10.3.44')
  assert.equal(m.repairId, 'restaurar-canal-1041-20261123-1')
  assert.equal(m.releases.at(-1).repairId, m.repairId)
  assert.equal(m.notify, true)
})
