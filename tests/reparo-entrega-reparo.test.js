'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const ler = nome => fs.readFileSync(path.join(root, nome), 'utf8')

test('versão permanece 10.3.44 e reparo novo consta no manifesto', () => {
  const m = JSON.parse(ler('DADOS_TOKITO/INFO_DADOS/update.json'))
  const pkg = JSON.parse(ler('package.json'))
  assert.equal(pkg.version, '10.3.44')
  assert.equal(m.version, '10.3.44')
  assert.equal(m.publicVersion, '10.3.44')
  assert.equal(m.repair, true)
  assert.equal(m.repairId, 'ver-canal-sem-cta-20261123-1')
  assert.equal(m.releases.at(-1).repairId, 'ver-canal-sem-cta-20261123-1')
  assert.equal(m.notify, true)
  assert.equal(m.mode, 'incremental')
})

test('update destino aqui reconhece LID e número alternativo sem mexer no dono', async () => {
  const src = ler('DADOS_TOKITO/plugins/dono/update.js')
  const config = { ownerNumber: '' }
  let comando = null
  let reply = ''
  const mockFs = {
    readFileSync() { return JSON.stringify(config) },
    writeFileSync(_arquivo, texto) { Object.assign(config, JSON.parse(texto)) },
    renameSync() {}
  }
  const carregar = nome => {
    if (nome === 'fs') return mockFs
    if (nome === 'path') return path
    if (nome.includes('/sistemas/dados')) return {}
    if (nome.includes('/database/lib/comandos')) {
      return { setCommand: value => { comando = value } }
    }
    throw Error('Módulo não previsto: ' + nome)
  }
  new Function('require', '__dirname', src)(
    carregar, path.join(root, 'DADOS_TOKITO/plugins/dono')
  )
  assert.ok(comando)
  await comando.executar({
    SoDono: true,
    isGroup: false,
    info: { key: {
      remoteJid: '38951729000000@lid',
      remoteJidAlt: '5511987654321@s.whatsapp.net',
      fromMe: false
    } },
    sender: '38951729000000@lid',
    args: ['destino', 'aqui'], q: 'destino aqui', prefix: '/',
    mess: { onlyOwner: () => 'DONO' },
    reply: texto => { reply = texto }
  })
  assert.equal(config.ownerNumber, '5511987654321')
  assert.match(reply, /𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝙳𝙾𝚂/)
})

test('GitHub Contents oferece fallback com cache de cinco minutos', async () => {
  const c = ler('DADOS_TOKITO/sistemas/dados.js')
  const inicio = c.indexOf('const GITHUB_MANIFEST_TTL_MS')
  const fim = c.indexOf('async function verificarUpdate()', inicio)
  assert.ok(inicio > 0 && fim > inicio)
  const modulo = c.slice(inicio, fim)
  let requisicoes = 0
  const fakeAxios = {
    async get(url) {
      requisicoes++
      assert.match(url, /^https:\/\/api\.github\.com\/repos\/dylan-Modz\/Tokitobot-V10\/contents\//)
      return { status: 200, data: { encoding: 'base64', content:
        Buffer.from(JSON.stringify({ version: '10.3.44', repairId: 'teste', files: [] })).toString('base64')
      } }
    }
  }
  const helpers = new Function('axios', 'Buffer', modulo +
    '\nreturn { githubManifestUrl, consultarManifestoGithub }')(
    fakeAxios, Buffer
  )
  const info = { repository: 'dylan-Modz/Tokitobot-V10', ref: 'main' }
  const primeiro = await helpers.consultarManifestoGithub(info)
  const segundo = await helpers.consultarManifestoGithub(info)
  assert.equal(primeiro.manifest?.repairId, 'teste')
  assert.equal(segundo.manifest?.repairId, 'teste')
  assert.equal(requisicoes, 1)
})

test('avisos excedidos retornam em no máximo um dia', () => {
  const c = ler('DADOS_TOKITO/sistemas/dados.js')
  const inicial = c.indexOf('const UPDATE_NOTICE_RETRY_MS')
  const final = c.indexOf('function registrarAvisoUpdate', inicial)
  assert.ok(inicial > 0 && final > inicial)
  const trecho = c.slice(inicial, final)
  const agora = Date.now()
  let salvo = {
    lastNotifiedPrincipalVersion: '10.3.44@reparo:teste',
    lastNotifiedPrincipalJid: '5511987654321@s.whatsapp.net',
    lastNotifiedPrincipalAttempts: 4,
    lastNotifiedAt: new Date(agora - 25 * 60 * 60 * 1000).toISOString()
  }
  const avisar = new Function('state', trecho + '\nreturn deveAvisarUpdate')(() => salvo)
  assert.equal(avisar('10.3.44@reparo:teste', salvo.lastNotifiedPrincipalJid), true)
  salvo.lastNotifiedAt = new Date(agora - 60 * 60 * 1000).toISOString()
  assert.equal(avisar('10.3.44@reparo:teste', salvo.lastNotifiedPrincipalJid), false)
  assert.equal(avisar('10.3.44@reparo:novo', salvo.lastNotifiedPrincipalJid), true)
})
