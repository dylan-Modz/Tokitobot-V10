'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const canal = require('../DADOS_TOKITO/sistemas/canal-oficial')
const projetos = require('../DADOS_TOKITO/sistemas/divulgacao-projetos')

const NOVO_JID = '987654321012345@newsletter'
const antigos = () => ({
  channel: canal.LINK_LEGADO,
  channelLink: canal.LINK_LEGADO,
  channeldl: canal.JID_LEGADO
})

function runtime(entrada, sub = false) {
  let estado = { ...entrada }
  let alteracoes = 0
  return {
    isSubBot: sub,
    GLOBAL_CONFIG: '/config',
    config: () => canal.normalizar(estado),
    subConfig: () => estado,
    readJson: () => estado,
    writeJson: (_, next) => { estado = next; alteracoes++ },
    updateSubConfig: patch => { estado = { ...estado, ...patch, channeldl: patch.channel }; alteracoes++ },
    estado: () => estado,
    alteracoes: () => alteracoes,
    alterar: next => { estado = next }
  }
}

test('troca link legado e não reutiliza o JID antigo', () => {
  const cfg = canal.normalizar(antigos())
  assert.equal(cfg.channel, canal.LINK_OFICIAL)
  assert.equal(cfg.channelLink, canal.LINK_OFICIAL)
  assert.equal(cfg.channeldl, canal.DESLIGADO)
})

test('canal desativado permanece oculto e sem metadados antigos', async () => {
  const cfg = canal.normalizar({
    ...antigos(),
    channel: canal.DESLIGADO
  })
  assert.equal(cfg.channel, canal.DESLIGADO)
  assert.equal(cfg.channeldl, canal.DESLIGADO)
  assert.equal(await projetos.linkCanal({ setting: cfg }), '')
})

test('todas as apresentações usam o mesmo novo link', async () => {
  const link = await projetos.linkCanal({ setting: antigos() })
  assert.equal(link, canal.LINK_OFICIAL)
})

test('preserva canal personalizado', async () => {
  const personalizado = 'https://whatsapp.com/channel/CanalPersonalizado123'
  const cfg = {
    channel: '777888999@newsletter',
    channeldl: '777888999@newsletter',
    channelLink: personalizado
  }
  assert.equal(canal.normalizar(cfg).channelLink, personalizado)
  assert.equal(await projetos.linkCanal({ setting: cfg }), personalizado)
})

test('resolve o JID correto do novo convite no bot principal', async () => {
  const rt = runtime(antigos())
  const changed = await canal.resolver({
    newsletterMetadata: async (type, token) => {
      assert.equal(type, 'invite')
      assert.equal(token, '0029VbCAgovIyPtbjBhrIi3u')
      return { jid: NOVO_JID }
    }
  }, rt)
  assert.equal(changed, true)
  assert.equal(rt.estado().channeldl, NOVO_JID)
  assert.equal(rt.estado().channelLink, canal.LINK_OFICIAL)
  assert.equal(rt.alteracoes(), 1)
})

test('resolve novo canal na configuração local do subbot', async () => {
  const rt = runtime(antigos(), true)
  assert.equal(await canal.resolver({
    newsletterMetadata: async () => ({ jid: NOVO_JID })
  }, rt), true)
  assert.equal(rt.estado().channel, NOVO_JID)
  assert.equal(rt.alteracoes(), 1)
})

test('não altera configurações se o dono desligar durante a consulta', async () => {
  const rt = runtime(antigos())
  const ok = await canal.resolver({
    newsletterMetadata: async () => {
      rt.alterar({ channel: canal.DESLIGADO, channeldl: canal.DESLIGADO })
      return { jid: NOVO_JID }
    }
  }, rt)
  assert.equal(ok, false)
  assert.equal(rt.alteracoes(), 0)
})

test('não substitui outros canais nem faz requisições desnecessárias', async () => {
  const rt = runtime({
    channel: '777888999@newsletter',
    channeldl: '777888999@newsletter',
    channelLink: 'https://whatsapp.com/channel/CanalPersonalizado123'
  })
  let consultas = 0
  assert.equal(await canal.resolver({
    newsletterMetadata: async () => { consultas++; return { jid: NOVO_JID } }
  }, rt), false)
  assert.equal(consultas, 0)
})
