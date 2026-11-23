'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const root = path.resolve(__dirname, '..')
const JID = '120363999999999999@newsletter'
const LINK = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'
const config = {
  channel: JID, channeldl: JID, channelLink: LINK,
  channelName: 'Canal de teste', channelServerMessageId: 268
}

test('Ver canal usa identificação nativa de postagem real, não CTA_url', () => {
  const contexto = canal.contextoNativo(config, ['123@s.whatsapp.net'])
  assert.equal(contexto.isForwarded, true)
  assert.equal(contexto.forwardedNewsletterMessageInfo.newsletterJid, JID)
  assert.equal(contexto.forwardedNewsletterMessageInfo.newsletterName, 'Canal de teste')
  assert.equal(contexto.forwardedNewsletterMessageInfo.serverMessageId, 268)
  assert.equal(contexto.externalAdReply, undefined)
})

test('sem postagem real e canal desligado não forja Ver canal', () => {
  assert.deepEqual(canal.contextoNativo({...config, channelServerMessageId:null}),
    {mentionedJid:[]})
  assert.deepEqual(canal.contextoNativo({channel:'0@newsletter',channeldl:'0@newsletter'}),
    {mentionedJid:[]})
})

const carregarMenu = (isBotoes, cfg) => {
  const src = fs.readFileSync(path.join(root, 'tokito.js'), 'utf8')
  const inicio = src.indexOf("const dylanModz = async (texto, emoji = '🧊', botoes = []) => {")
  const fim = src.indexOf('const limpar =', inicio)
  assert.ok(inicio >= 0 && fim > inicio)
  const envios = []
  const proto = {Message: {InteractiveMessage: {
    Header:{create:x=>x},Body:{create:x=>x},Footer:{create:x=>x},
    NativeFlowMessage:{create:x=>x},create:x=>x
  }}}
  const tokito = {
    user:{id:'bot@s.whatsapp.net'},
    sendMessage:async (_jid,msg) => {envios.push(msg);return {ok:true}},
    relayMessage:async (_jid,msg) => {envios.push(msg);return {ok:true}}
  }
  const mockModulos = {midiaMenu:async()=>null, globalCfg:()=>({}), sanitizarErro:x=>x}
  const args=[
    'reagir','from','path','__dirname','canalInfo','sender','isBotoes',
    'tokito','modulos','proto','generateWAMessageFromContent','selo',
    'runtimeSub','configAtual','canalOficial','enviarbuton','console',
    'API_KEY_TOKITO','fs','reply'
  ]
  const values=[
    async()=>true,'123@s.whatsapp.net',path,root,
    ids=>canal.contextoNativo(cfg,ids), '123@s.whatsapp.net',isBotoes,
    tokito,mockModulos,proto,
    (_jid,msg)=>({message:msg,key:{id:'abc'}}),
    {message:{}},{isSubBot:false},cfg,canal,
    items=>items.map(x=>({name:'quick_reply',buttonParamsJson:JSON.stringify({id:x.id,display_text:x.texto})})),
    {log:()=>{}},'',fs,async texto=>{envios.push({text:texto});return {ok:true}}
  ]
  const command = new Function(...args,src.slice(inicio,fim)+'\nreturn dylanModz')(...values)
  return {command,envios}
}

test('menu de texto recebe encaminhamento nativo sem URL adicional', async () => {
  const {command,envios} = carregarMenu(false,config)
  await command('MENU')
  assert.equal(envios[0].text,'MENU')
  assert.equal(envios[0].contextInfo.forwardedNewsletterMessageInfo.serverMessageId,268)
})

test('menu interativo mantém botões próprios, sem CTA artificial', async () => {
  const {command,envios} = carregarMenu(true,config)
  await command('MENU','🧊',[{texto:'Voltar',id:'/menu'}])
  const msg = envios[0].interactiveMessage
  assert.deepEqual(msg.nativeFlowMessage.buttons.map(b=>b.name),['quick_reply'])
  assert.equal(msg.contextInfo.forwardedNewsletterMessageInfo.newsletterJid,JID)
})

test('manifesto continua na versão 10.3.44', () => {
  const m = JSON.parse(fs.readFileSync(path.join(root,'DADOS_TOKITO/INFO_DADOS/update.json'),'utf8'))
  assert.equal(m.version,'10.3.44')
  assert.equal(m.repairId,'ver-canal-sem-cta-20261123-1')
  assert.equal(m.releases.at(-1).repairId,m.repairId)
  assert.equal(m.notify,true)
})
