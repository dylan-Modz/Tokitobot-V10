'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const ler = nome => fs.readFileSync(path.join(root, nome), 'utf8')
const manifesto = JSON.parse(ler('DADOS_TOKITO/INFO_DADOS/update.json'))
const pkg = JSON.parse(ler('package.json'))
const menu = ler('DADOS_TOKITO/mensagens/menus.js')

test('versão publicada segue 10.3.43 → 10.3.44 sem saltos', () => {
  assert.equal(pkg.version, '10.3.44')
  assert.equal(manifesto.version, '10.3.44')
  assert.equal(manifesto.publicVersion, '10.3.44')
  assert.equal(manifesto.fromVersion, '10.3.43')
  assert.equal(manifesto.releases.at(-1).version, '10.3.44')
  assert.equal(manifesto.releases.at(-1).fromVersion, '10.3.43')
  assert.equal(manifesto.mode, 'incremental')
  assert.equal(manifesto.notify, true)
  assert.equal(manifesto.repair, true)
  assert.equal(manifesto.repairId, 'deteccao-reparo-20261123-1')
})

test('comandos estão publicados na categoria de figurinhas', () => {
  for (const cmd of ['rgfigaudio', 'figaudio', 'verfigaudio', 'delfigaudio', 'autostickeraudio']) {
    assert.ok(menu.includes('${prefix}' + cmd), 'comando ausente no menu: ' + cmd)
  }
  assert.ok(menu.includes('🎭 ${prefix}autostickeraudio 1/0'))
  assert.ok(!menu.includes('autofigaudio 1/0'))
  assert.match(ler('DADOS_TOKITO/plugins/figurinhas/figaudio.js'), /categoria: 'figurinhas'/)
  assert.match(ler('DADOS_TOKITO/plugins/figurinhas/autostickeraudio.js'), /categoria: 'figurinhas'/)
})

test('evento automático evita respostas a áudios do próprio bot e comandos', () => {
  const evento = ler('DADOS_TOKITO/plugins/eventos/autostickeraudio.js')
  assert.match(evento, /ctx\.info\?\.key\?\.fromMe/)
  assert.match(evento, /ctx\.isCmd/)
  assert.match(evento, /ctx\.mensagem\?\.audioMessage/)
})

test('mídia é registrada em diretório protegido pelo atualizador', () => {
  const motor = ler('DADOS_TOKITO/sistemas/sticker-audio.js')
  assert.match(motor, /database', 'sistemas', 'sticker-audio\.webp'/)
  assert.match(motor, /prepareWAMessageMedia/)
  assert.match(motor, /audioStickerMessage/)
  const arquivos = new Set(manifesto.files.map(f => f.path))
  assert.ok(arquivos.has('DADOS_TOKITO/sistemas/sticker-audio.js'))
  assert.ok(!arquivos.has('DADOS_TOKITO/database/sistemas/sticker-audio.webp'))
  assert.ok(!arquivos.has('DADOS_TOKITO/INFO_DADOS/config-all.json'))
})
