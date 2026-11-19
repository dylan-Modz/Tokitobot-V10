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

test('WhatsApp Normal faz primeiro pareamento no browser original', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokito-tipo-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  salvarTipo(dir, 'normal')
  assert.equal(lerTipo(dir), 'normal')
  assert.deepEqual(navegador('normal', undefined, false), ['Linux', 'Opera', '10.0.22631'])
})

test('WhatsApp Normal usa Browsers.android(13) depois de registrado', () => {
  const chamadas = []
  const Browsers = { android: nome => {
    chamadas.push(nome)
    return [nome, 'Android', '']
  } }
  assert.deepEqual(navegador('normal', Browsers, true), ['13', 'Android', ''])
  assert.deepEqual(chamadas, ['13'])
})

test('WhatsApp Business usa SMB_ANDROID somente apos registrar', () => {
  const Browsers = { android: nome => [nome, 'Android', ''] }
  assert.deepEqual(navegador('business', Browsers, false), ['Linux', 'Opera', '10.0.22631'])
  assert.deepEqual(navegador('business', Browsers, true), ['SMB_ANDROID', 'Android', ''])
})

test('perfil registrado precisa de Browsers.android da Stone', () => {
  assert.throws(() => navegador('normal', {}, true), /STONE_BROWSER_ANDROID_INDISPONIVEL/)
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
