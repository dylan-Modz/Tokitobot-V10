'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

const root = path.resolve(__dirname, '..')
const info = path.join(root, 'DADOS_TOKITO/INFO_DADOS')
const release = JSON.parse(fs.readFileSync(path.join(info, 'update.json'), 'utf8'))
const markerPath = 'DADOS_TOKITO/INFO_DADOS/reparos/10.3.43-canal-tk.json'
const reparacao43 = release.releases.find(x => x.version === '10.3.43')
const marker = JSON.parse(fs.readFileSync(path.join(root, markerPath), 'utf8'))

test('reparo 10.3.43 permanece no histórico após atualizar para 10.3.44', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  assert.equal(pkg.version, '10.3.44')
  assert.equal(release.version, '10.3.44')
  assert.equal(release.publicVersion, '10.3.44')
  assert.equal(release.releases.at(-1).version, '10.3.44')
  assert.ok(reparacao43)
  assert.equal(reparacao43.repair, true)
  assert.equal(marker.version, '10.3.43')
  assert.equal(marker.safety.preserveInstalledVersion, true)
})

test('marcador participa da detecção de reparo pelo hash Git Blob', () => {
  const item = reparacao43.files.find(f => f.path === markerPath)
  assert.ok(item, 'marcador ausente do manifesto de reparação')
  const bytes = fs.readFileSync(path.join(root, markerPath))
  const sha = crypto.createHash('sha1')
    .update('blob ' + bytes.length + '\0').update(bytes).digest('hex')
  assert.equal(item.gitSha, sha)
  assert.equal(item.size, bytes.length)
})

test('manifesto oferece arquivos corrigidos preservando configuração privada', () => {
  const arquivos = new Set(reparacao43.files.map(x => x.path))
  assert.ok(arquivos.has('DADOS_TOKITO/sistemas/canal-oficial.js'))
  assert.ok(arquivos.has('DADOS_TOKITO/sistemas/divulgacao-projetos.js'))
  assert.ok(arquivos.has('DADOS_TOKITO/plugins/dono/update.js'))
  assert.ok(arquivos.has('DADOS_TOKITO/database/lib/update-cli.js'))
  assert.ok(arquivos.has('DADOS_TOKITO/connect.js'))
  assert.ok(!arquivos.has('DADOS_TOKITO/INFO_DADOS/config-all.json'))
  assert.equal(release.mode, 'incremental')
  assert.equal(release.notify, true)
})

test('apresentações usam canal novo e mantêm o canal desligado', async () => {
  const projetos = require('../DADOS_TOKITO/sistemas/divulgacao-projetos')
  const oficial = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'
  const antigo = 'https://whatsapp.com/channel/0029VbBbHVs7oQhTLxKWBW2q'
  assert.equal(await projetos.linkCanal({
    setting: { channel: antigo, channeldl: '120363421690941003@newsletter' }
  }), oficial)
  assert.equal(await projetos.linkCanal({
    setting: { channel: '0@newsletter', channeldl: '0@newsletter' }
  }), '')
})
