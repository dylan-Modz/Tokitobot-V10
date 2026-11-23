'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const root = path.join(__dirname, '..')
const LINK = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'

const cfg = {
  channel: '120363999999999999@newsletter',
  channeldl: '120363999999999999@newsletter',
  channelLink: LINK,
  channelName: 'Canal de teste',
  channelServerMessageId: 268
}

test('cartão nativo usa JID, nome e ID da postagem de verdade', () => {
  const contexto = canal.contextoNativo(cfg, ['5511987654321@s.whatsapp.net'])
  assert.deepEqual(contexto.forwardedNewsletterMessageInfo, {
    newsletterJid: cfg.channeldl,
    newsletterName: cfg.channelName,
    serverMessageId: 268
  })
  assert.equal(contexto.isForwarded, true)
  assert.equal(contexto.forwardingScore, 1)
  assert.equal(contexto.externalAdReply, undefined)
  assert.deepEqual(contexto.mentionedJid, ['5511987654321@s.whatsapp.net'])
})

test('sem ID real de postagem não inventa botão nem cola link', () => {
  for (const valor of [null, undefined, 0, -1, 2.5, 2147483648, 'invalido']) {
    const resultado = canal.contextoNativo({ ...cfg, channelServerMessageId: valor })
    assert.deepEqual(resultado, { mentionedJid: [] })
  }
  assert.deepEqual(canal.contextoNativo({ ...cfg, channel:'0@newsletter', channeldl:'0@newsletter' }), { mentionedJid: [] })
})

test('não associa cartão nativo a canal sem nome ou JID', () => {
  assert.deepEqual(canal.contextoNativo({ ...cfg, channelName:'' }), { mentionedJid: [] })
  assert.deepEqual(canal.contextoNativo({ ...cfg, channeldl:'0@newsletter' }), { mentionedJid: [] })
})

test('respostas e menu não acrescentam o link ao texto', () => {
  const core = fs.readFileSync(path.join(root, 'tokito.js'), 'utf8')
  const menu = fs.readFileSync(path.join(root, 'DADOS_TOKITO/plugins/menus/menu.js'), 'utf8')
  const projetos = fs.readFileSync(path.join(root, 'DADOS_TOKITO/sistemas/divulgacao-projetos.js'), 'utf8')
  assert.match(core, /return canalOficial\.contextoNativo\(cfgCanal, mentions\)/)
  assert.doesNotMatch(core, /textoSeguro\s*\+\s*'\\n\\n- 📢/)
  assert.doesNotMatch(menu, /return texto \+ \(linkCanalMenu/)
  assert.match(menu, /canalOficial\.botaoAcesso/)
  assert.doesNotMatch(projetos, /texto \+= '\\n\\n- 📢/)
})

test('sub-bot mantém referência real da postagem separadamente', () => {
  const src = fs.readFileSync(path.join(root, 'DADOS_TOKITO/sub/runtime.js'), 'utf8')
  const channel = fs.readFileSync(path.join(root, 'DADOS_TOKITO/plugins/dono/channel.js'), 'utf8')
  assert.match(src, /channelServerMessageId: Number\(local\.channelServerMessageId\) \|\| null/)
  assert.match(channel, /const mesmaOrigem = Boolean\(jid && citado\?\.jid === jid\)/)
  assert.match(channel, /channelServerMessageId = mesmaOrigem \? citado\.serverMessageId : null/)
})

test('manifesto anuncia reparo sem subir da versão 10.3.44', () => {
  const m = JSON.parse(fs.readFileSync(path.join(root, 'DADOS_TOKITO/INFO_DADOS/update.json'), 'utf8'))
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  assert.equal(m.version, '10.3.44')
  assert.equal(pkg.version, '10.3.44')
  assert.equal(m.repairId, 'botao-nativo-canal-20261123-1')
  assert.equal(m.releases.at(-1).repairId, m.repairId)
})
