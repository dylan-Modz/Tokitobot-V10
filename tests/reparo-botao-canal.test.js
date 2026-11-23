'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const root = path.resolve(__dirname, '..')
const LINK = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'
const JID = '120363423684523217@newsletter'
const cfg = { channel: JID, channeldl: JID, channelLink: LINK, channelName: 'Teste' }

test('Ver canal usa os campos reais do contexto legado, não cta_url', () => {
  const mensagem = canal.contextoNativo(cfg, {}, 'TokitoBot-V10-MD', ['123@s.whatsapp.net'])
  assert.equal(mensagem.isForwarded, true)
  assert.equal(mensagem.forwardingScore, 1)
  assert.equal(mensagem.forwardedNewsletterMessageInfo.newsletterJid, JID)
  assert.equal(mensagem.forwardedNewsletterMessageInfo.newsletterName, 'Teste')
  assert.equal(mensagem.forwardedNewsletterMessageInfo.serverMessageId, '')
  assert.equal(mensagem.externalAdReply, undefined)
  assert.deepEqual(mensagem.mentionedJid, ['123@s.whatsapp.net'])
})

test('link sem JID não fabrica encaminhamento e canal desligado continua sem botão', () => {
  const apenasLink = canal.contextoNativo({
    channel: LINK, channeldl: '0@newsletter', channelLink: LINK
  }, {}, 'TokitoBot-V10-MD')
  const desligado = canal.contextoNativo({ channel:'0@newsletter', channeldl:'0@newsletter' },
    {}, 'TokitoBot-V10-MD')
  assert.equal(apenasLink.forwardedNewsletterMessageInfo, undefined)
  assert.equal(apenasLink.externalAdReply, undefined)
  assert.equal(desligado.forwardedNewsletterMessageInfo, undefined)
})

test('resposta mantém texto original, contexto de canal e fallback simples', async () => {
  const fonte = fs.readFileSync(path.join(root, 'tokito.js'), 'utf8')
  const inicio = fonte.indexOf('const reply = async (text, mentions = []) => {')
  const fim = fonte.indexOf('const enviarbuton = botoes =>', inicio)
  assert.ok(inicio >= 0 && fim > inicio)
  const chamadas = []
  const reply = new Function(
    'modulos','API_KEY_TOKITO','runtimeSub','configAtual','canalOficial',
    'tokito','from','selo','canalInfo','console',
    fonte.slice(inicio,fim) + '\nreturn reply'
  )(
    {sanitizarErro: x => x}, '', {isSubBot:false}, cfg, canal,
    {sendMessage: async (_jid,msg,opts) => {
      chamadas.push({msg,opts})
      if (chamadas.length === 1) throw new Error('contexto não aceito')
      return {ok:true}
    }},
    '123@s.whatsapp.net', {key:{id:'abc'}},
    mentions => canal.contextoNativo(cfg, {}, 'TokitoBot-V10-MD', mentions),
    {warn: () => {}}
  )
  assert.deepEqual(await reply('Atualização concluída'), {ok:true})
  assert.equal(chamadas.length,2)
  assert.equal(chamadas[0].msg.text, 'Atualização concluída')
  assert.equal(chamadas[0].msg.contextInfo.forwardedNewsletterMessageInfo.newsletterJid, JID)
  assert.equal(chamadas[1].msg.text, 'Atualização concluída')
  assert.equal(chamadas[1].msg.contextInfo.forwardedNewsletterMessageInfo, undefined)
})

test('menus não incluem CTA artificial nem URL no texto', () => {
  const bot = fs.readFileSync(path.join(root,'tokito.js'),'utf8')
  const menu = fs.readFileSync(path.join(root,'DADOS_TOKITO/plugins/menus/menu.js'),'utf8')
  assert.doesNotMatch(bot, /textoSeguro \+ '\\n\\n- 📢/)
  assert.doesNotMatch(menu, /texto \+ \(linkCanalMenu/)
  assert.doesNotMatch(menu, /name: 'cta_url'/)
  assert.doesNotMatch(bot.slice(bot.indexOf('const dylanModz ='),bot.indexOf('const limpar =')), /botaoCanal/)
  assert.match(menu, /\.\.\.canalInfo\(\[sender\]\)/)
  assert.match(bot, /const contextInfo = canalInfo\(\[sender\]\)/)
})

test('versão não é incrementada por reparação do cartão nativo', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'))
  const m = JSON.parse(fs.readFileSync(path.join(root,'DADOS_TOKITO/INFO_DADOS/update.json'),'utf8'))
  assert.equal(pkg.version, '10.3.44')
  assert.equal(m.version, '10.3.44')
  assert.equal(m.repair, true)
  assert.equal(m.repairId, 'ver-canal-nativo-20261123-1')
  assert.equal(m.releases.at(-1).repairId, m.repairId)
})
