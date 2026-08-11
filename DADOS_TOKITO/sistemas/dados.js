const fs = require('fs')
const path = require('path')
const os = require('os')
const crypto = require('crypto')
const axios = require('axios')
const { spawnSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..', '..')
const INFO = path.join(ROOT, 'DADOS_TOKITO', 'INFO_DADOS')
const STATE_DIR = path.join(ROOT, 'DADOS_TOKITO', 'database', 'sistemas')
const STATE_FILE = path.join(STATE_DIR, 'estado.json')
const BACKUP_DIR = path.join(STATE_DIR, 'backup-update')
const CONFIG_FILE = path.join(INFO, 'config-all.json')
const UPDATE_FILE = path.join(INFO, 'update.json')

const PUBLIC_KEY = Buffer.from('LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUNvd0JRWURLMlZ3QXlFQW5OcGdWWU5nL1U0OE1odHVhL04xYmJoYjNORXBOWXRRM05qMFBiRTJxdGM9Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=', 'base64').toString('utf8')
const SYNC_INTERVAL_MS = 3 * 60 * 60 * 1000
const REQUEST_TIMEOUT = 15000

const PROTECTED = [
  '.git/',
  'node_modules/',
  '.env',
  'DADOS_TOKITO/database/qrcode/',
  'DADOS_TOKITO/database/grupos/',
  'DADOS_TOKITO/database/membros/',
  'DADOS_TOKITO/database/aluguel/',
  'DADOS_TOKITO/database/brincadeiras/',
  'DADOS_TOKITO/database/sistemas/',
  'DADOS_TOKITO/funcoes/jogos/partidas/',
  'DADOS_TOKITO/INFO_DADOS/config-all.json',
  'DADOS_TOKITO/INFO_DADOS/nescessario.json',
  'DADOS_TOKITO/INFO_DADOS/LOGOS/'
]

const ensure = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const readJson = (file, fallback = {}) => {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    return data && typeof data === 'object' ? data : fallback
  } catch {
    return JSON.parse(JSON.stringify(fallback))
  }
}

const writeJson = (file, data) => {
  ensure(path.dirname(file))
  const tmp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n')
  fs.renameSync(tmp, file)
  return data
}

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex')
const config = () => readJson(CONFIG_FILE, {})
const localInfo = () => readJson(UPDATE_FILE, {
  version: '10.0.0',
  channel: 'stable',
  repository: 'dylan-Modz/Tokitobot-V10',
  ref: 'main'
})
const apiBase = () => String(config().API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, '')
const apiToken = () => String(config().API_KEY_TOKITO || '').trim()
const tokenHash = () => sha256(apiToken())

function state() {
  const current = readJson(STATE_FILE, {})
  if (!current.installationId) {
    current.installationId = `tki_${crypto.randomBytes(18).toString('base64url')}`
    current.createdAt = new Date().toISOString()
    writeJson(STATE_FILE, current)
  }
  return current
}

function saveState(next) {
  return writeJson(STATE_FILE, { ...state(), ...next })
}

function decodeLicense(envelope) {
  if (!envelope?.payload || !envelope?.signature)
    throw new Error('Licença local incompleta.')

  const ok = crypto.verify(
    null,
    Buffer.from(envelope.payload),
    PUBLIC_KEY,
    Buffer.from(envelope.signature, 'base64url')
  )

  if (!ok)
    throw new Error('Assinatura da licença inválida.')

  return JSON.parse(Buffer.from(envelope.payload, 'base64url').toString('utf8'))
}

function localLicenseStatus() {
  try {
    const current = state()
    const license = decodeLicense(current.license)

    if (license.bot !== 'tokito-v10')
      throw new Error('Licença não pertence ao Tokito V10.')

    if (license.installationId !== current.installationId)
      throw new Error('Licença pertence a outra instalação.')

    if (license.tokenHash !== tokenHash())
      throw new Error('O token foi alterado desde a última validação.')

    if (license.planExpiresAt && new Date(license.planExpiresAt).getTime() <= Date.now())
      return { ok: false, reason: 'PLAN_EXPIRED', license }

    if (!license.offlineUntil || new Date(license.offlineUntil).getTime() <= Date.now())
      return { ok: false, reason: 'SYNC_REQUIRED', license }

    return { ok: true, license }
  } catch (error) {
    return {
      ok: false,
      reason: 'INVALID_LOCAL_LICENSE',
      error: error.message
    }
  }
}

async function callLicense(endpoint = '/sync') {
  const token = apiToken()

  if (!token || !token.startsWith('tokito_')) {
    const error = new Error(
      'Configure seu token tokito_ em DADOS_TOKITO/INFO_DADOS/config-all.json antes de iniciar.'
    )
    error.code = 'TOKEN_REQUIRED'
    error.definitive = true
    throw error
  }

  const current = state()
  const info = localInfo()

  try {
    const response = await axios.post(
      `${apiBase()}/api/bot/v10${endpoint}`,
      {
        installationId: current.installationId,
        version: info.version || '10.0.0',
        channel: info.channel || 'stable'
      },
      {
        timeout: REQUEST_TIMEOUT,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': `TokitoBot-V10/${info.version || '10.0.0'}`
        },
        validateStatus: () => true
      }
    )

    const data = response.data && typeof response.data === 'object'
      ? response.data
      : {}

    if (
      response.status >= 200 &&
      response.status < 300 &&
      data.authorized === true &&
      data.license
    ) {
      const decoded = decodeLicense(data.license)

      if (
        decoded.installationId !== current.installationId ||
        decoded.tokenHash !== tokenHash()
      ) {
        throw new Error('A licença recebida não corresponde a esta instalação.')
      }

      saveState({
        license: data.license,
        lastSyncAt: new Date().toISOString(),
        lastServerStatus: 'online',
        plan: data.plan || null,
        lastLicenseCode: 'AUTHORIZED'
      })

      return {
        ok: true,
        online: true,
        data,
        license: decoded
      }
    }

    const error = new Error(
      String(
        data.mensagem ||
        `Servidor recusou a licença (HTTP ${response.status}).`
      )
    )

    error.code = data.code || `HTTP_${response.status}`
    error.status = response.status
    error.definitive = response.status >= 400 && response.status < 500
    throw error
  } catch (error) {
    if (error.definitive)
      throw error

    error.network = true
    throw error
  }
}

async function validarInicio() {
  const current = state()

  try {
    const result = await callLicense(
      current.license ? '/sync' : '/activate'
    )

    return {
      allowed: true,
      online: true,
      license: result.license,
      message: `Licença validada · ${result.data?.plan?.nome || 'Plano ativo'}`
    }
  } catch (error) {
    if (error.definitive) {
      saveState({
        lastServerStatus: 'denied',
        lastLicenseCode: error.code,
        lastLicenseError: error.message,
        lastSyncAttemptAt: new Date().toISOString()
      })

      return {
        allowed: false,
        online: true,
        code: error.code,
        message: error.message
      }
    }

    const local = localLicenseStatus()

    saveState({
      lastServerStatus: 'offline',
      lastLicenseError: error.message,
      lastSyncAttemptAt: new Date().toISOString()
    })

    if (local.ok) {
      return {
        allowed: true,
        online: false,
        license: local.license,
        code: 'OFFLINE_LICENSE',
        message: 'Tokito APIs indisponível; usando a última licença local válida.'
      }
    }

    return {
      allowed: false,
      online: false,
      code: local.reason || 'SERVER_UNAVAILABLE',
      message: 'Não foi possível validar a licença e não existe uma licença local válida.'
    }
  }
}

async function sincronizar() {
  try {
    return await callLicense('/sync')
  } catch (error) {
    if (error.definitive) {
      return {
        ok: false,
        definitive: true,
        code: error.code,
        message: error.message
      }
    }

    const local = localLicenseStatus()

    if (!local.ok && ['SYNC_REQUIRED', 'PLAN_EXPIRED', 'INVALID_LOCAL_LICENSE'].includes(local.reason)) {
      return {
        ok: false,
        definitive: true,
        code: local.reason,
        message: local.reason === 'PLAN_EXPIRED'
          ? 'O plano da licença local expirou e precisa ser renovado.'
          : 'A tolerância offline terminou. Conecte o bot à Tokito APIs para renovar a licença.'
      }
    }

    return {
      ok: false,
      definitive: false,
      code: 'SERVER_OFFLINE',
      message: error.message
    }
  }
}

function iniciarSincronizacao(onBlocked) {
  if (global.__TOKITO_LICENSE_TIMER__)
    return global.__TOKITO_LICENSE_TIMER__

  const tick = async () => {
    const result = await sincronizar()

    if (
      !result.ok &&
      result.definitive &&
      typeof onBlocked === 'function'
    ) {
      onBlocked(result)
    }
  }

  global.__TOKITO_LICENSE_TIMER__ = setInterval(
    tick,
    SYNC_INTERVAL_MS
  )

  global.__TOKITO_LICENSE_TIMER__.unref?.()
  return global.__TOKITO_LICENSE_TIMER__
}

function versionParts(value) {
  return String(value || '0')
    .replace(/^v/i, '')
    .split(/[.-]/)
    .slice(0, 3)
    .map(value => Number(value) || 0)
}

function compareVersions(a, b) {
  const A = versionParts(a)
  const B = versionParts(b)

  for (let i = 0; i < 3; i++) {
    if (A[i] > B[i]) return 1
    if (A[i] < B[i]) return -1
  }

  return 0
}

function rawUpdateUrl(info = localInfo()) {
  const repo = String(info.repository || '').trim()
  const ref = String(info.ref || 'main').trim()

  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo))
    throw new Error('Repositório de atualização inválido em update.json.')

  if (!/^[A-Za-z0-9_./-]+$/.test(ref))
    throw new Error('Referência de atualização inválida em update.json.')

  return `https://raw.githubusercontent.com/${repo}/${ref}/DADOS_TOKITO/INFO_DADOS/update.json`
}

async function verificarUpdate() {
  const local = localInfo()

  try {
    const response = await axios.get(
      `${rawUpdateUrl(local)}?t=${Date.now()}`,
      {
        timeout: REQUEST_TIMEOUT,
        validateStatus: () => true,
        headers: {
          'User-Agent': `TokitoBot-V10/${local.version || '10.0.0'}`
        }
      }
    )

    if (response.status === 404) {
      return {
        ok: false,
        available: false,
        local,
        remote: null,
        reason: 'not_published',
        error: 'Atualização ainda não publicada.'
      }
    }

    if (
      response.status !== 200 ||
      !response.data ||
      typeof response.data !== 'object'
    ) {
      throw new Error(`Servidor de atualização indisponível (${response.status}).`)
    }

    const remote = response.data

    if (
      String(remote.repository || local.repository) !==
      String(local.repository)
    ) {
      throw new Error('O update.json remoto aponta para outro repositório.')
    }

    return {
      ok: true,
      available: compareVersions(remote.version, local.version) > 0,
      local,
      remote
    }
  } catch (error) {
    return {
      ok: false,
      available: false,
      local,
      remote: null,
      error: error.message
    }
  }
}

const normalizedRel = value => String(value || '')
  .replace(/\\/g, '/')
  .replace(/^\.\//, '')

function isProtected(rel) {
  const item = normalizedRel(rel)

  return PROTECTED.some(rule => {
    if (rule.endsWith('/'))
      return item === rule.slice(0, -1) || item.startsWith(rule)

    return item === rule
  })
}

function safeInside(root, rel) {
  const full = path.resolve(root, rel)

  if (full !== root && !full.startsWith(root + path.sep))
    throw new Error(`Caminho inseguro: ${rel}`)

  return full
}

function createBackup() {
  ensure(BACKUP_DIR)

  const file = path.join(
    BACKUP_DIR,
    `tokito-${Date.now()}.tar.gz`
  )

  const args = [
    '-czf',
    file,
    '--exclude=./node_modules',
    '--exclude=./.git',
    '--exclude=./.env',
    '--exclude=./DADOS_TOKITO/database/qrcode',
    '--exclude=./DADOS_TOKITO/database/grupos',
    '--exclude=./DADOS_TOKITO/database/membros',
    '--exclude=./DADOS_TOKITO/database/aluguel',
    '--exclude=./DADOS_TOKITO/database/brincadeiras',
    '--exclude=./DADOS_TOKITO/database/sistemas',
    '--exclude=./DADOS_TOKITO/funcoes/jogos/partidas',
    '--exclude=./DADOS_TOKITO/INFO_DADOS/config-all.json',
    '--exclude=./DADOS_TOKITO/INFO_DADOS/nescessario.json',
    '--exclude=./DADOS_TOKITO/INFO_DADOS/LOGOS',
    '.'
  ]

  const run = spawnSync('tar', args, {
    cwd: ROOT,
    stdio: 'pipe'
  })

  if (run.status !== 0) {
    throw new Error(
      `Não foi possível criar backup: ${String(run.stderr || '').trim() || 'tar indisponível'}`
    )
  }

  return file
}

function extractTar(file, destination) {
  ensure(destination)

  const run = spawnSync(
    'tar',
    ['-xzf', file, '-C', destination],
    { stdio: 'pipe' }
  )

  if (run.status !== 0) {
    throw new Error(
      `Não foi possível extrair atualização: ${String(run.stderr || '').trim() || 'tar indisponível'}`
    )
  }
}

function listFiles(root, base = root, out = []) {
  if (!fs.existsSync(root))
    return out

  for (const name of fs.readdirSync(root)) {
    const full = path.join(root, name)
    const stat = fs.statSync(full)

    if (stat.isDirectory())
      listFiles(full, base, out)
    else
      out.push(normalizedRel(path.relative(base, full)))
  }

  return out
}

function copyIncoming(srcRoot, remote) {
  const added = []
  const files = listFiles(srcRoot)

  for (const rel of files) {
    if (isProtected(rel))
      continue

    const source = safeInside(srcRoot, rel)
    const target = safeInside(ROOT, rel)

    if (!fs.existsSync(target))
      added.push(rel)

    ensure(path.dirname(target))
    fs.copyFileSync(source, target)
  }

  for (const relRaw of Array.isArray(remote.delete) ? remote.delete : []) {
    const rel = normalizedRel(relRaw)

    if (!rel || isProtected(rel))
      continue

    const target = safeInside(ROOT, rel)

    if (fs.existsSync(target))
      fs.rmSync(target, { recursive: true, force: true })
  }

  return added
}

function restoreBackup(file, added = []) {
  for (const rel of added || []) {
    if (isProtected(rel))
      continue

    const target = safeInside(ROOT, rel)

    if (fs.existsSync(target))
      fs.rmSync(target, { recursive: true, force: true })
  }

  const run = spawnSync(
    'tar',
    ['-xzf', file, '-C', ROOT],
    { stdio: 'pipe' }
  )

  if (run.status !== 0)
    throw new Error(`Falha ao restaurar backup: ${String(run.stderr || '').trim()}`)
}

async function instalarUpdate(onProgress = () => {}) {
  const check = await verificarUpdate()

  if (!check.ok)
    throw new Error(check.error || 'Não foi possível verificar atualização.')

  if (!check.available) {
    return {
      updated: false,
      version: check.local.version,
      remote: check.remote
    }
  }

  const localLicense = localLicenseStatus()

  if (!localLicense.ok) {
    const online = await validarInicio()

    if (!online.allowed)
      throw new Error(online.message || 'Licença inválida para atualizar.')
  }

  const repo = String(
    check.remote.repository || check.local.repository
  )

  const ref = String(
    check.remote.ref || `v${check.remote.version}` || 'main'
  )

  if (
    !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo) ||
    !/^[A-Za-z0-9_./-]+$/.test(ref)
  ) {
    throw new Error('Destino de atualização inválido.')
  }

  const temp = fs.mkdtempSync(
    path.join(os.tmpdir(), 'tokito-v10-')
  )

  const archive = path.join(temp, 'source.tar.gz')
  let backup = ''
  let added = []

  try {
    onProgress('Baixando a versão oficial do Tokito...')

    const url = `https://codeload.github.com/${repo}/tar.gz/${encodeURIComponent(ref)}`

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 120000,
      maxContentLength: 100 * 1024 * 1024,
      validateStatus: () => true,
      headers: {
        'User-Agent': `TokitoBot-V10/${check.local.version}`
      }
    })

    if (response.status !== 200)
      throw new Error(`Servidor de atualização respondeu HTTP ${response.status}.`)

    const buffer = Buffer.from(response.data)

    if (
      check.remote.archiveSha256 &&
      sha256(buffer) !== String(check.remote.archiveSha256).toLowerCase()
    ) {
      throw new Error('SHA-256 da atualização não confere.')
    }

    fs.writeFileSync(archive, buffer)

    onProgress('Criando backup da versão atual...')
    backup = createBackup()

    onProgress('Preparando arquivos da atualização...')

    const extracted = path.join(temp, 'src')
    extractTar(archive, extracted)

    const dirs = fs.readdirSync(extracted)
      .map(name => path.join(extracted, name))
      .filter(item => fs.statSync(item).isDirectory())

    if (!dirs.length)
      throw new Error('O pacote de atualização não contém o projeto.')

    const srcRoot = dirs[0]
    const incomingInfo = readJson(
      path.join(srcRoot, 'DADOS_TOKITO', 'INFO_DADOS', 'update.json'),
      {}
    )

    if (
      String(incomingInfo.version || '') !==
      String(check.remote.version || '')
    ) {
      throw new Error('A versão do pacote não corresponde ao update.json remoto.')
    }

    const packageFile = path.join(ROOT, 'package.json')
    const packageBefore = fs.existsSync(packageFile)
      ? sha256(fs.readFileSync(packageFile))
      : ''

    onProgress('Aplicando arquivos oficiais e preservando seus dados...')
    added = copyIncoming(srcRoot, check.remote)

    const packageAfter = fs.existsSync(packageFile)
      ? sha256(fs.readFileSync(packageFile))
      : ''

    if (packageBefore !== packageAfter) {
      onProgress('Dependências alteradas; executando npm install...')

      const npm = process.platform === 'win32'
        ? 'npm.cmd'
        : 'npm'

      const run = spawnSync(
        npm,
        ['install', '--omit=dev'],
        {
          cwd: ROOT,
          stdio: 'pipe',
          timeout: 180000
        }
      )

      if (run.status !== 0) {
        throw new Error(
          `npm install falhou: ${String(run.stderr || run.stdout || '').slice(-1200)}`
        )
      }
    }

    saveState({
      lastBackup: backup,
      lastUpdateAt: new Date().toISOString(),
      previousVersion: check.local.version,
      installedVersion: check.remote.version,
      addedByLastUpdate: added
    })

    return {
      updated: true,
      from: check.local.version,
      version: check.remote.version,
      backup,
      remote: check.remote
    }
  } catch (error) {
    if (backup && fs.existsSync(backup)) {
      try {
        restoreBackup(backup, added)
      } catch {}
    }

    throw error
  } finally {
    try {
      fs.rmSync(temp, { recursive: true, force: true })
    } catch {}
  }
}

function rollback() {
  const current = state()
  const backup = current.lastBackup

  if (!backup || !fs.existsSync(backup))
    throw new Error('Nenhum backup de atualização disponível para restaurar.')

  restoreBackup(
    backup,
    current.addedByLastUpdate || []
  )

  saveState({
    lastRollbackAt: new Date().toISOString(),
    installedVersion: current.previousVersion || null,
    lastBackup: null,
    addedByLastUpdate: []
  })

  return {
    ok: true,
    version: current.previousVersion || 'anterior'
  }
}

module.exports = {
  validarInicio,
  sincronizar,
  iniciarSincronizacao,
  verificarUpdate,
  instalarUpdate,
  rollback,
  localInfo,
  localLicenseStatus,
  state
}
