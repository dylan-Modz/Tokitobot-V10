'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const ler = arquivo => fs.readFileSync(path.join(root, arquivo), 'utf8')
const link = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'
const config = { channel: link, channelLink: link, channeldl: '0@newsletter' }

test('canal ativo oferece botão cta_url com o link correto', () => {
  const botao = canal.botaoAcessar(config)
  assert.equal(botao.name, 'cta_url')
  const data = JSON.parse(botao.buttonParamsJson)
  assert.deepEqual(data, { display_text: 'Acessar canal', url: link, merchant_url: link })
  assert.equal(canal.botaoAcessar({ channel: '0@newsletter', channeldl: '0@newsletter' }), null)
})

test('respostas comuns não recebem endereço de canal como rodapé', () => {
  const fonte = ler('tokito.js')
  const a = fonte.indexOf('const reply = async (text, mentions = []) => {')
  const b = fonte.indexOf('const enviarbuton = botoes =>', a)
  assert.ok(a > 0 && b > a)
  const trecho = fonte.slice(a, b)
  assert.doesNotMatch(trecho, /𝙰𝙲𝙴𝚂𝚂𝙰𝚁 𝙲𝙰𝙽𝙰𝙻/)
  assert.doesNotMatch(trecho, /textoSeguro \+.*linkCanal/)
  assert.match(trecho, /const textoFinal = textoSeguro/)
})

test('menu de comandos conserva quick_reply e acrescenta botão do canal', async () => {
  const fonte = ler('tokito.js')
  const a = fonte.indexOf('const enviarbuton = botoes =>')
  const b = fonte.indexOf('const limpar = valor =>', a)
  assert.ok(a > 0 && b > a)
  const capturas = []
  const idem = x => x
  const proto = { Message: { InteractiveMessage: {
    create: idem,
    Header: { create: idem },
    Body: { create: idem },
    Footer: { create: idem },
    NativeFlowMessage: { create: idem }
  } } }
  const socket = {
    user: { id: 'bot@s.whatsapp.net' },
    sendMessage: async () => true,
    relayMessage: async (_, msg) => { capturas.push(msg); return true }
  }
  const mock = {
    runtimeSub: { isSubBot: false }, configAtual: config, canalOficial: canal,
    isBotoes: true, tokito: socket, from: '123@s.whatsapp.net', sender: '123@s.whatsapp.net',
    info: { key: { id: 'TEST' } }, selo: { key: { id: 'TEST' } }, proto,
    modulos: { midiaMenu: async () => ({ imageMessage: { url: 'https://example.org/menu.jpg' } }),
      globalCfg: () => ({ audioMenu: false }), sanitizarErro: x => x },
    generateWAMessageFromContent: (_jid, msg) => ({ message: msg, key: { id: 'TEST-MENU' } }),
    canalInfo: mentions => canal.contextoSeguro(mentions),
    __dirname: root, path, fs, console, API_KEY_TOKITO: ''
  }
  const args = Object.keys(mock)
  const fn = new Function(...args, fonte.slice(a, b) + '\nreturn { dylanModz, enviarbuton }')
  const { dylanModz, enviarbuton } = fn(...Object.values(mock))
  const resultado = enviarbuton([{ texto: 'ADM', id: '/menuadm' }])
  assert.equal(resultado.length, 2)
  assert.deepEqual(resultado.map(b => b.name), ['quick_reply', 'cta_url'])
  await dylanModz('MENU SEM RODAPÉ', '🧊', [{ texto: 'ADM', id: '/menuadm' }])
  const enviado = capturas[0]?.interactiveMessage
  assert.ok(enviado)
  assert.equal(enviado.body.text, 'MENU SEM RODAPÉ')
  const botoes = enviado.nativeFlowMessage.buttons
  assert.equal(botoes[0].name, 'quick_reply')
  assert.equal(botoes[1].name, 'cta_url')
  assert.equal(JSON.parse(botoes[1].buttonParamsJson).url, link)
})

test('menu inicial e cards de projetos não acrescentam link ao texto', () => {
  const menu = ler('DADOS_TOKITO/plugins/menus/menu.js')
  const projetos = ler('DADOS_TOKITO/sistemas/divulgacao-projetos.js')
  assert.match(menu, /canalOficial\.botaoAcessar/)
  assert.doesNotMatch(menu, /Acessar canal:\*/)
  assert.doesNotMatch(projetos, /texto \+= '\\n\\n- 📢/)
  assert.match(projetos, /botaoUrl\('Acessar canal', canal\)/)
})

test('reparação de botão não incrementa a versão', () => {
  const pkg = JSON.parse(ler('package.json'))
  const manifest = JSON.parse(ler('DADOS_TOKITO/INFO_DADOS/update.json'))
  assert.equal(pkg.version, '10.3.44')
  assert.equal(manifest.version, '10.3.44')
  assert.equal(manifest.repairId, 'botao-canal-nativo-20261123-1')
  assert.equal(manifest.repair, true)
  assert.equal(manifest.notify, true)
  assert.equal(manifest.releases.at(-1).repairId, manifest.repairId)
})
