'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const root = path.resolve(__dirname, '..')
const LINK = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'

test('respostas de comandos comuns não recebem cartões experimentais', () => {
  const seguro = canal.contextoSeguro(['123@s.whatsapp.net'])
  assert.deepEqual(seguro, { mentionedJid: ['123@s.whatsapp.net'] })
  assert.equal(seguro.externalAdReply, undefined)
  assert.equal(seguro.forwardedNewsletterMessageInfo, undefined)
  for (const file of ['tokito.js', 'DADOS_TOKITO/connect.js']) {
    const c = fs.readFileSync(path.join(root, file), 'utf8')
    assert.match(c, /return canalOficial\.contextoSeguro\(mentions\)/)
    assert.doesNotMatch(c, /return canalOficial\.contexto\(.*mentions\)/)
  }
})

test('acesso ao canal continua disponível por link para os recursos explícitos', () => {
  const cfg = { channel: LINK, channelLink: LINK, channeldl: '0@newsletter' }
  assert.equal(canal.link(cfg), LINK)
  const rico = canal.contexto(cfg, {}, 'Tokito', [])
  assert.equal(rico.externalAdReply.sourceUrl, LINK)
  assert.equal(rico.forwardedNewsletterMessageInfo, undefined)
})

test('menu adiciona botão do canal, mantendo a lista de menus', async () => {
  const src = fs.readFileSync(path.join(root, 'DADOS_TOKITO/plugins/menus/menu.js'), 'utf8')
  let comando
  const dylan = { setCommand(cmd) { comando = cmd } }
  const fakeRequire = p => {
    if (p.includes('database/lib/comandos')) return dylan
    if (p === '../../../package.json') return { version: '10.3.44' }
    if (p.includes('sistemas/canal-oficial')) return canal
    throw new Error('require inesperado ' + p)
  }
  new Function('require', src)(fakeRequire)
  let enviada
  const ctx = {
    isBotoes: true, isSubBot: false,
    from: '123@s.whatsapp.net', sender: '123@s.whatsapp.net', prefix: '/',
    path, __dirname: root,
    NomeDoBot: 'Tokito', ownerName: 'Dev', pushname: 'Teste',
    isCargo: 'Membro', isChVip: 'Não', whatIsPhone: 'Android',
    stoneVersion: '1.0.7', horaBR: '16:00', setting: {
      channel: LINK, channelLink: LINK, channeldl: '0@newsletter'
    },
    selo: { key: { id: 'abc', remoteJid: '123@s.whatsapp.net' }, message: {} },
    reagir: async () => true, mess: { error: () => 'ERRO' },
    linguagem: { menu: () => 'MENU' },
    modulos: { midiaMenu: async () => ({ imageMessage: { url: 'https://example.org/image.webp' } }) },
    tokito: { relayMessage: async (jid, msg) => { enviada = { jid, msg }; return true } },
    dylanModz: async () => 'MENU'
  }
  await comando.executar(ctx)
  const botoes = enviada.msg.interactiveMessage.carouselMessage.cards[0].nativeFlowMessage.buttons
  const select = botoes.find(b => b.name === 'single_select')
  const cta = botoes.find(b => b.name === 'cta_url')
  assert.ok(select)
  assert.ok(cta)
  assert.equal(JSON.parse(cta.buttonParamsJson).url, LINK)
  assert.equal(JSON.parse(cta.buttonParamsJson).display_text, 'Acessar canal')
})

test('se WhatsApp rejeitar carrossel, menu responde sem URL anexada', async () => {
  const src = fs.readFileSync(path.join(root, 'DADOS_TOKITO/plugins/menus/menu.js'), 'utf8')
  let comando, fallback = ''
  const dylan = { setCommand(cmd) { comando = cmd } }
  new Function('require', src)(p => {
    if (p.includes('database/lib/comandos')) return dylan
    if (p === '../../../package.json') return { version: '10.3.44' }
    if (p.includes('sistemas/canal-oficial')) return canal
    throw Error(p)
  })
  const ctx = {
    isBotoes: true, isSubBot: false,
    from: '123@s.whatsapp.net', sender: '123@s.whatsapp.net', prefix: '/',
    path, __dirname: root,
    NomeDoBot: 'Tokito', ownerName: 'Dev', pushname: 'Teste',
    isCargo: 'Membro', isChVip: 'Não', whatIsPhone: 'Android',
    stoneVersion: '1.0.7', horaBR: '16:00',
    setting: { channel: LINK, channeldl: '0@newsletter', channelLink: LINK },
    selo: { key: { id: 'abc', remoteJid: '123@s.whatsapp.net' }, message: {} },
    reagir: async () => true, mess: { error: () => 'ERRO' },
    linguagem: { menu: () => 'MENU' },
    modulos: { midiaMenu: async () => ({ imageMessage: { url: 'https://example.org/image.webp' } }) },
    tokito: { relayMessage: async () => { throw Error('cliente recusou') } },
    dylanModz: async texto => { fallback = texto; return true },
    reply: async texto => { fallback = texto; return true }
  }
  await comando.executar(ctx)
  assert.match(fallback, /MENU/)
  assert.equal(fallback, 'MENU')
  assert.notEqual(fallback, 'ERRO')
})

test('manifesto continua na 10.3.44 e habilita reparo da mesma versão', () => {
  const m = JSON.parse(fs.readFileSync(path.join(root, 'DADOS_TOKITO/INFO_DADOS/update.json'), 'utf8'))
  assert.equal(m.version, '10.3.44')
  assert.equal(m.publicVersion, '10.3.44')
  assert.equal(m.repair, true)
  assert.equal(m.repairId, 'entrega-reparo-20261123-1')
  assert.equal(m.mode, 'incremental')
  assert.equal(m.notify, true)
  for (const p of ['tokito.js', 'DADOS_TOKITO/connect.js', 'DADOS_TOKITO/plugins/menus/menu.js',
    'DADOS_TOKITO/sistemas/canal-oficial.js', 'DADOS_TOKITO/plugins/dono/channel.js']) {
    assert.ok(m.files.find(f => f.path === p), p + ' faltando no manifesto')
  }
})
