'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const JID = '120363555555555555@newsletter'
const LINK = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'
const ler = p => fs.readFileSync(path.join(root, p), 'utf8')

test('regressão exata do selo de encaminhamento usado na V10.3.41', () => {
  const cfg = { channeldl: JID, channel: JID, channelLink: LINK }
  const contexto = canal.contextoV1041(cfg, 'TokitoBot V10', ['5511987654321@s.whatsapp.net'])
  assert.deepEqual(contexto, {
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
      newsletterJid: JID, newsletterName: 'TokitoBot V10', serverMessageId: ''
    },
    mentionedJid: ['5511987654321@s.whatsapp.net']
  })
})

test('somente link, JID desconhecido e opção 0 não inventam selo', () => {
  for (const x of ['0@newsletter', '', LINK, 'abc@newsletter']) {
    const resultado = canal.contextoV1041({ channel: LINK, channeldl: x }, 'Tokito')
    assert.deepEqual(resultado, { mentionedJid: [] })
  }
})

test('reply mantém a resposta normal e inclui selo nativo se configurado JID', async () => {
  const fonte = ler('tokito.js')
  const inicio = fonte.indexOf('const reply = async (text, mentions = []) => {')
  const fim = fonte.indexOf('const enviarbuton = botoes =>', inicio)
  assert.ok(inicio > 0 && fim > inicio)
  const envios = []
  const config = { channel: JID, channeldl: JID, channelLink: LINK }
  const reply = new Function('modulos', 'API_KEY_TOKITO', 'runtimeSub', 'configAtual',
    'canalOficial', 'tokito', 'from', 'selo', 'canalInfo',
    fonte.slice(inicio, fim) + '\nreturn reply')(
      { sanitizarErro: v => v }, '', { isSubBot: false }, config, canal,
      { sendMessage: async (_to, msg) => { envios.push(msg); return { ok: true } } },
      '123@s.whatsapp.net', { key: { id: 'ORIGINAL' } },
      mentions => canal.contextoV1041(config, 'TokitoBot V10', mentions)
    )
  await reply('Comando executado', ['123@s.whatsapp.net'])
  assert.equal(envios.length, 1)
  assert.equal(envios[0].text, 'Comando executado')
  assert.equal(envios[0].contextInfo.forwardedNewsletterMessageInfo.newsletterJid, JID)
  assert.equal(envios[0].contextInfo.forwardedNewsletterMessageInfo.serverMessageId, '')
})

test('restaura também conexão, mídia do menu e os comandos anteriores', () => {
  const tokito = ler('tokito.js')
  const connect = ler('DADOS_TOKITO/connect.js')
  const menu = ler('DADOS_TOKITO/plugins/menus/menu.js')
  assert.match(tokito, /return canalOficial\.contextoV1041\(cfgCanal, NomeDoBot, mentions\)/)
  assert.match(connect, /return canalOficial\.contextoV1041\(cfgCanal, NomeDoBot, mentions\)/)
  assert.match(tokito, /if \(!isBotoes \|\| !botoes\.length\)/)
  assert.match(tokito, /buttons: enviarbuton\(botoes\)/)
  assert.doesNotMatch(tokito, /botaoCanal/)
  assert.match(menu, /name: 'single_select'/)
  assert.doesNotMatch(menu, /botaoCanalMenu|name: 'cta_url'/)
  const audio = ler('DADOS_TOKITO/plugins/figurinhas/figaudio.js')
  assert.match(audio, /comandos: \['figaudio', 'rgfigaudio', 'verfigaudio', 'delfigaudio'\]/)
})

test('manifesto oferece reparo da mesma versão 10.3.44', () => {
  const pkg = JSON.parse(ler('package.json'))
  const update = JSON.parse(ler('DADOS_TOKITO/INFO_DADOS/update.json'))
  assert.equal(pkg.version, '10.3.44')
  assert.equal(update.version, '10.3.44')
  assert.equal(update.repair, true)
  assert.equal(update.repairId, 'restaurar-canal-1041-20261123-1')
})
