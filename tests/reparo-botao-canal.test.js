'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const root = path.resolve(__dirname, '..')
const LINK = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'

test('botão de acesso é CTA nativo e não texto de URL', () => {
  const botao = canal.botaoAcesso({channel: LINK, channelLink: LINK, channeldl: '0@newsletter'})
  assert.equal(botao.name, 'cta_url')
  const dados = JSON.parse(botao.buttonParamsJson)
  assert.equal(dados.display_text, '📢 Acessar canal')
  assert.equal(dados.url, LINK)
  assert.equal(dados.merchant_url, LINK)
  assert.equal(canal.botaoAcesso({channel:'0@newsletter'}), null)
})

test('reply normal e fallback do menu não acrescentam link solto', () => {
  const bot = fs.readFileSync(path.join(root,'tokito.js'),'utf8')
  const menu = fs.readFileSync(path.join(root,'DADOS_TOKITO/plugins/menus/menu.js'),'utf8')
  assert.doesNotMatch(bot, /textoSeguro \+ '\\n\\n- 📢/)
  assert.doesNotMatch(menu, /texto \+ \(linkCanalMenu/)
  assert.match(bot, /const textoFinal = textoSeguro/)
  assert.match(menu, /canalOficial\.botaoAcesso/)
})

function obterMenuEmMemoria(config, isBotoes) {
  const fonte = fs.readFileSync(path.join(root, 'tokito.js'), 'utf8')
  const inicio = fonte.indexOf("const dylanModz = async (texto, emoji = '🧊', botoes = []) => {")
  const fim = fonte.indexOf('const limpar =', inicio)
  assert.ok(inicio > 0 && fim > inicio)
  const envios = []
  const proto = { Message: { InteractiveMessage: {
    Header: {create: valor => valor},
    Body: {create: valor => valor},
    Footer: {create: valor => valor},
    NativeFlowMessage: {create: valor => valor},
    create: valor => valor
  }}}
  const tokito = {
    user: { id: '123@s.whatsapp.net' },
    sendMessage: async (_jid, msg) => {envios.push(msg); return {ok:true}},
    relayMessage: async (_jid, msg) => {envios.push(msg); return {ok:true}}
  }
  const mockModulos = { midiaMenu: async () => null, globalCfg: () => ({}) }
  const variaveis = [
    'reagir','from','path','__dirname','canalInfo','sender','isBotoes',
    'tokito','modulos','proto','generateWAMessageFromContent','selo',
    'runtimeSub','configAtual','canalOficial','enviarbuton','console','API_KEY_TOKITO',
    'fs'
  ]
  const valores = [
    async () => true,'123@s.whatsapp.net',path,root,() => ({mentionedJid:[]}),
    '123@s.whatsapp.net',isBotoes,tokito,mockModulos,proto,
    (_jid, msg) => ({message:msg,key:{id:'a'}}),{message:{}},
    {isSubBot:false},config,canal,
    botoes => botoes.map(b => ({name:'quick_reply',buttonParamsJson:JSON.stringify({display_text:b.texto,id:b.id})})),
    console,'',fs
  ]
  const cmd = new Function(...variaveis, fonte.slice(inicio,fim) + '\nreturn dylanModz')(...valores)
  return {cmd,envios}
}

test('menu gera botão do canal mesmo com os outros botões desativados', async () => {
  const teste = obterMenuEmMemoria({channel: LINK,channelLink: LINK,channeldl:'0@newsletter'}, false)
  await teste.cmd('MENU')
  assert.equal(teste.envios.length,1)
  const msg = teste.envios[0].interactiveMessage
  assert.ok(msg)
  const botoes = msg.nativeFlowMessage.buttons
  assert.equal(botoes.length,1)
  assert.equal(botoes[0].name,'cta_url')
  assert.equal(JSON.parse(botoes[0].buttonParamsJson).url,LINK)
  assert.equal(msg.body.text,'MENU')
})

test('menu com comando mantém botões existentes mais Acessar canal', async () => {
  const teste = obterMenuEmMemoria({channel:LINK,channelLink:LINK,channeldl:'0@newsletter'}, true)
  await teste.cmd('MENU','🧊',[{texto:'Voltar',id:'/menu'}])
  const botoes = teste.envios[0].interactiveMessage.nativeFlowMessage.buttons
  assert.deepEqual(botoes.map(x=>x.name),['quick_reply','cta_url'])
})

test('canal desligado mantém envio simples sem CTA', async () => {
  const teste = obterMenuEmMemoria({channel:'0@newsletter',channeldl:'0@newsletter'}, false)
  await teste.cmd('MENU')
  assert.equal(teste.envios[0].text,'MENU')
  assert.equal(teste.envios[0].interactiveMessage,undefined)
})

test('reparo mantém a mesma versão sem perder o histórico', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root,'DADOS_TOKITO/INFO_DADOS/update.json'),'utf8'))
  const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'))
  assert.equal(pkg.version,'10.3.44')
  assert.equal(manifest.version,'10.3.44')
  assert.equal(manifest.repairId,'botao-nativo-canal-20261123-1')
  assert.equal(manifest.releases.at(-1).repairId,'botao-nativo-canal-20261123-1')
  assert.equal(manifest.notify,true)
  assert.equal(manifest.mode,'incremental')
})
