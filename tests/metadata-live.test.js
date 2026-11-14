'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const { aplicarAtualizacaoParticipantes } = require('../DADOS_TOKITO/sistemas/metadata-live.js')

const jid = 'grupo@g.us'
const metadados = () => new Map([[jid, { dados: { id: jid, participants: [
  { id: '100@lid', phoneNumber: '5511999999999@s.whatsapp.net', admin: null },
  { id: '200@lid', phoneNumber: '5511888888888@s.whatsapp.net', admin: 'superadmin' }
] }, tempo: Date.now() - 600000 }]])

test('promocao recebida por LID ativa admin sem reiniciar', () => {
  const cache = metadados()
  assert.equal(aplicarAtualizacaoParticipantes(cache, { id: jid, action: 'promote', participants: ['100@lid'] }), true)
  assert.equal(cache.get(jid).dados.participants[0].admin, 'admin')
  assert.equal(cache.get(jid).dados.participants[1].admin, 'superadmin')
})
test('rebaixamento por numero desativa admin imediatamente', () => {
  const cache = metadados()
  cache.get(jid).dados.participants[0].admin = 'admin'
  assert.equal(aplicarAtualizacaoParticipantes(cache, { id: jid, action: 'demote',
    participants: [{ jid: '100@lid', phoneNumber: '5511999999999@s.whatsapp.net' }] }), true)
  assert.equal(cache.get(jid).dados.participants[0].admin, null)
})
test('alvo nao mapeado invalida metadados para consulta nova', () => {
  const cache = metadados()
  assert.equal(aplicarAtualizacaoParticipantes(cache, { id: jid, action: 'promote', participants: ['404@lid'] }), false)
  assert.equal(cache.has(jid), false)
})
test('adicao ou remocao invalida roster, sem inventar admins', () => {
  const cache = metadados()
  aplicarAtualizacaoParticipantes(cache, { id: jid, action: 'add', participants: ['300@lid'] })
  assert.equal(cache.has(jid), false)
})
