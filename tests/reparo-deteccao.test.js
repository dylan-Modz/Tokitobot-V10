'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const dados = require('../DADOS_TOKITO/sistemas/dados')
const manifesto = JSON.parse(fs.readFileSync(
  path.join(root, 'DADOS_TOKITO/INFO_DADOS/update.json'), 'utf8'
))
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

test('reparo usa 10.3.44 e preserva histórico de versões', () => {
  assert.equal(pkg.version, '10.3.44')
  assert.equal(manifesto.version, '10.3.44')
  assert.equal(manifesto.publicVersion, '10.3.44')
  assert.equal(manifesto.repair, true)
  assert.equal(manifesto.repairId, 'botao-canal-20261123-1')
  assert.equal(manifesto.mode, 'incremental')
  assert.equal(manifesto.notify, true)
  assert.equal(manifesto.releases.at(-1).version, '10.3.44')
})

test('identifica uma reparação nova mesmo na mesma versão', () => {
  assert.equal(dados.reparacaoIdDiferente(
    { version: '10.3.44', repairId: 'audio-canal-20261123-1' },
    { version: '10.3.44', repairId: 'botao-canal-20261123-1', repair: true }
  ), true)
})

test('não repete reparação quando ID local já corresponde ao GitHub', () => {
  assert.equal(dados.reparacaoIdDiferente(
    { version: '10.3.44', repairId: 'botao-canal-20261123-1' },
    { version: '10.3.44', repairId: 'botao-canal-20261123-1', repair: true }
  ), false)
})

test('um release normal não é confundido com reparação', () => {
  assert.equal(dados.reparacaoIdDiferente(
    { version: '10.3.43' },
    { version: '10.3.44', repairId: 'botao-canal-20261123-1', repair: true }
  ), false)
  assert.equal(dados.reparacaoIdDiferente(
    { version: '10.3.44' },
    { version: '10.3.44', repairId: 'botao-canal-20261123-1', repair: false }
  ), false)
  assert.equal(dados.reparacaoIdDiferente(
    { version: '10.3.44' },
    { version: '10.3.44', repair: true }
  ), false)
})

test('instalador suporta atualização apenas do manifesto quando não há arquivos', () => {
  const src = fs.readFileSync(path.join(root, 'DADOS_TOKITO/sistemas/dados.js'), 'utf8')
  assert.match(src, /check\.repairIdPendente === true/)
  assert.match(src, /manifestOnly: true/)
  assert.match(src, /installedRepairId: check\.remote\.repairId/)
  assert.match(src, /reparacaoIdDiferente\(local, remote\)/)
})

test('avisos de reparação usam ID estável e diagnóstico mostra IDs', () => {
  const connect = fs.readFileSync(path.join(root, 'DADOS_TOKITO/connect.js'), 'utf8')
  const comando = fs.readFileSync(path.join(root, 'DADOS_TOKITO/plugins/dono/update.js'), 'utf8')
  assert.match(connect, /'@reparo:' \+ String\(check\.remote\?\.repairId/)
  assert.match(connect, /repairIdRemoto/)
  assert.match(comando, /check\?\.remote\?\.repairId/)
  assert.match(comando, /check\?\.repairIdPendente/)
})

test('manifesto inclui componentes e preserva dados protegidos', () => {
  const arquivos = new Set(manifesto.files.map(x => x.path))
  for (const f of [
    'DADOS_TOKITO/sistemas/dados.js',
    'DADOS_TOKITO/plugins/dono/update.js',
    'DADOS_TOKITO/connect.js',
    'tests/reparo-deteccao.test.js'
  ]) assert.ok(arquivos.has(f), f)
  assert.ok(!arquivos.has('DADOS_TOKITO/INFO_DADOS/config-all.json'))
  assert.ok(!arquivos.has('DADOS_TOKITO/database/sistemas/estado.json'))
})
