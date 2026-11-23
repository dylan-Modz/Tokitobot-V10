'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const canalOficial = require('../DADOS_TOKITO/sistemas/canal-oficial')
const fonte = fs.readFileSync(path.join(__dirname, '..', 'DADOS_TOKITO', 'plugins', 'dono', 'channel.js'), 'utf8')
const LINK = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'

const criar = ({ subBot = false, metadata } = {}) => {
  let comando
  let escrita = ''
  let arquivoFinal = ''
  let subGravado
  let chamadas = 0
  const avisos = []
  const disco = {
    writeFileSync: (arquivo, dados) => { escrita = String(dados) },
    renameSync: (_temporario, arquivo) => { arquivoFinal = arquivo },
    rmSync: () => {}
  }
  const runtime = {
    isSubBot: subBot,
    GLOBAL_CONFIG: '/fake/config-all.json',
    updateSubConfig: cfg => { subGravado = cfg }
  }
  const requisitos = nome => {
    if (nome === 'fs') return disco
    if (nome.includes('database/lib/comandos')) return { setCommand: x => { comando = x } }
    if (nome.includes('sub/runtime')) return runtime
    if (nome.includes('sistemas/canal-oficial')) return canalOficial
    throw new Error('Módulo não autorizado no teste: ' + nome)
  }
  const sandbox = {
    require: requisitos, console: { warn: (...a) => avisos.push(a) },
    process: { pid: 1234 }, setTimeout, clearTimeout
  }
  vm.runInNewContext(fonte, sandbox, { filename: 'channel.js' })
  const ctx = entrada => {
    const respostas = []
    const setting = {
      prefix: '/',
      NomeDoBot: 'Tokito',
      channel: '0@newsletter',
      channeldl: '0@newsletter'
    }
    return {
      setting, respostas, q: entrada, prefix: '/', command: 'setchannel',
      SoDono: true,
      tokito: {
        async newsletterMetadata(tipo, token) {
          chamadas++
          if (metadata) return metadata(tipo, token)
          return { id: '120363999999999999@newsletter' }
        }
      },
      mess: {
        onlyOwner: () => 'DONO',
        channelRequired: () => 'NECESSARIO',
        channelDisabled: () => 'DESATIVADO',
        channelEnabled: (jid, link) => 'ATIVADO ' + jid + ' ' + link,
        channelLinkEnabled: link => 'LINK ATIVO ' + link,
        padraoUso: () => 'USO INVALIDO',
        padraoErro: () => 'ERRO AO SALVAR'
      },
      reply: x => { respostas.push(x); return x }
    }
  }
  return {
    comando, ctx, avisos,
    get chamadas() { return chamadas },
    get escrita() { return escrita },
    get arquivoFinal() { return arquivoFinal },
    get subGravado() { return subGravado }
  }
}

test('JSON inválido da Stone mantém link e ativa Acessar canal', async () => {
  const ambiente = criar({ metadata: () => { throw new SyntaxError('Unexpected token') } })
  const ctx = ambiente.ctx(LINK)
  await ambiente.comando.executar(ctx)
  assert.equal(ctx.respostas[0], 'LINK ATIVO ' + LINK)
  assert.equal(ctx.setting.channelLink, LINK)
  assert.equal(ctx.setting.channel, LINK)
  assert.equal(ctx.setting.channeldl, '0@newsletter')
  assert.equal(ambiente.chamadas, 1)
  assert.equal(canalOficial.link(ctx.setting), LINK)
  assert.equal(ambiente.arquivoFinal, '/fake/config-all.json')
  assert.equal(JSON.parse(ambiente.escrita).channelLink, LINK)
  assert.equal(ambiente.avisos.length, 1)
})

test('sucesso de metadata salva JID verdadeiro e link', async () => {
  const ambiente = criar()
  const ctx = ambiente.ctx(LINK)
  await ambiente.comando.executar(ctx)
  assert.equal(ctx.setting.channeldl, '120363999999999999@newsletter')
  assert.equal(ctx.setting.channelLink, LINK)
  assert.match(ctx.respostas[0], /^ATIVADO/)
})

test('JID direto não depende da consulta do WhatsApp', async () => {
  const ambiente = criar({ metadata: () => { throw new Error('não chamar') } })
  const ctx = ambiente.ctx('120363999999999999@newsletter')
  await ambiente.comando.executar(ctx)
  assert.equal(ctx.setting.channeldl, '120363999999999999@newsletter')
  assert.equal(ambiente.chamadas, 0)
})

test('desativar com 0 zera os campos sem consultar a Stone', async () => {
  const ambiente = criar()
  const ctx = ambiente.ctx('0')
  await ambiente.comando.executar(ctx)
  assert.equal(ctx.setting.channel, '0@newsletter')
  assert.equal(ctx.setting.channeldl, '0@newsletter')
  assert.equal(ctx.setting.channelLink, '')
  assert.equal(ctx.respostas[0], 'DESATIVADO')
  assert.equal(ambiente.chamadas, 0)
})

test('URL externa inválida não altera a configuração', async () => {
  const ambiente = criar()
  const ctx = ambiente.ctx('https://site-invalido.example/channel/0029VbCAgovIyPtbjBhrIi3u')
  await ambiente.comando.executar(ctx)
  assert.equal(ctx.respostas[0], 'USO INVALIDO')
  assert.equal(ctx.setting.channel, '0@newsletter')
  assert.equal(ambiente.chamadas, 0)
  assert.equal(ambiente.escrita, '')
})

test('sub-bot com falha de consulta salva link sem JID no próprio config', async () => {
  const ambiente = criar({ subBot: true, metadata: () => { throw new SyntaxError('Invalid JSON') } })
  const ctx = ambiente.ctx(LINK)
  await ambiente.comando.executar(ctx)
  assert.equal(ambiente.subGravado.channel, LINK)
  assert.equal(ambiente.subGravado.channelLink, LINK)
  assert.equal(ambiente.escrita, '')
  assert.equal(ctx.respostas[0], 'LINK ATIVO ' + LINK)
})

test('só o dono pode configurar canal', async () => {
  const ambiente = criar()
  const ctx = ambiente.ctx(LINK)
  ctx.SoDono = false
  await ambiente.comando.executar(ctx)
  assert.equal(ctx.respostas[0], 'DONO')
  assert.equal(ambiente.chamadas, 0)
})


test('JID e nome do canal encaminhado citado são preservados sem consultar metadados', async () => {
  const ambiente = criar({ metadata: () => { throw new Error('consulta não deveria ocorrer') } })
  const ctx = ambiente.ctx(LINK)
  ctx.ctxMsg = { quotedMessage: {
    extendedTextMessage: { contextInfo: { forwardedNewsletterMessageInfo: {
      newsletterJid: '120363423684523217@newsletter',
      newsletterName: 'Teste',
      serverMessageId: 268
    } } }
  } }
  await ambiente.comando.executar(ctx)
  assert.equal(ambiente.chamadas, 0)
  assert.equal(ctx.setting.channeldl, '120363423684523217@newsletter')
  assert.equal(ctx.setting.channelName, 'Teste')
  assert.equal(ctx.setting.channelLink, LINK)
  assert.equal(JSON.parse(ambiente.escrita).channelName, 'Teste')
})
