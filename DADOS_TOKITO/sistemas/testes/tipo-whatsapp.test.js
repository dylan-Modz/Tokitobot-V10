'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { lerTipo, salvarTipo, nomeTipo, navegador } = require('../tipo-whatsapp.js')

test('sessão antiga preserva identificação original', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokito-tipo-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  assert.equal(lerTipo(dir), 'business')
  assert.deepEqual(navegador(lerTipo(dir)), ['Linux', 'Opera', '10.0.22631'])
})

test('WhatsApp Normal usa perfil web Android experimental', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokito-tipo-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  salvarTipo(dir, 'normal')
  assert.equal(lerTipo(dir), 'normal')
  assert.equal(nomeTipo(lerTipo(dir)), 'WhatsApp Normal')
  let navegadorRecebido = null
  const Browsers = { android: nome => {
    navegadorRecebido = nome
    return [nome, 'Android', '']
  } }
  assert.deepEqual(navegador(lerTipo(dir), Browsers), ['13', 'Android', ''])
  assert.equal(navegadorRecebido, '13')
})

test('WhatsApp Business conserva navegador atual do bot', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokito-tipo-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  salvarTipo(dir, 'business')
  assert.equal(lerTipo(dir), 'business')
  assert.equal(nomeTipo(lerTipo(dir)), 'WhatsApp Business')
})

test('o modo Android exige a funcao Browsers.android da Stone', () => {
  assert.throws(() => navegador('normal', {}), /STONE_BROWSER_ANDROID_INDISPONIVEL/)
})

test('não sobrescreve creds.json', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokito-tipo-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const creds = path.join(dir, 'creds.json')
  fs.writeFileSync(creds, '{"registered":true,"sensitive":"preservado"}')
  salvarTipo(dir, 'normal')
  assert.equal(fs.readFileSync(creds, 'utf8'), '{"registered":true,"sensitive":"preservado"}')
})

test('valida tipos de sessão antes de salvar', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokito-tipo-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  assert.throws(() => salvarTipo(dir, 'desconhecido'), /TIPO_WHATSAPP_INVALIDO/)
})
