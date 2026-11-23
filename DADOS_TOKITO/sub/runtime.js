const fs = require('fs')
const path = require('path')
const canalOficial = require('../sistemas/canal-oficial')

const DADOS = path.resolve(__dirname, '..')
const ROOT = path.resolve(DADOS, '..')
const DB = path.join(DADOS, 'database')
const SUBS = path.join(DB, 'subs')
const GLOBAL_CONFIG = path.join(DADOS, 'INFO_DADOS', 'config-all.json')

const digits = value => String(value || '').replace(/\D/g, '')
const isSubBot = process.env.TOKITO_SUBBOT === '1'
const id = digits(process.env.TOKITO_SUB_ID || process.env.TOKITO_SUB_NUMBER)
const ownerFromStore = () => {
  if (!isSubBot || !id) return ''
  try {
    const registry = readJson(path.join(SUBS, 'subs.json'), {})
    return digits(registry?.[id]?.owner)
  } catch {
    return ''
  }
}

const owner = () => ownerFromStore()

const baseDir = isSubBot && id ? path.join(SUBS, id) : DB
const sessionDir = isSubBot && id ? path.join(baseDir, 'qrcode') : path.join(DB, 'qrcode')
const groupsDir = isSubBot && id
  ? path.join(baseDir, 'grupos', 'ATIVAÇÕES-TOKITO')
  : path.join(DB, 'grupos', 'ATIVAÇÕES-TOKITO')
const horarioFile = isSubBot && id
  ? path.join(baseDir, 'grupos', 'horario.json')
  : path.join(DB, 'grupos', 'horario.json')
const mediaDir = isSubBot && id ? path.join(baseDir, 'midiabv') : path.join(DB, 'midiabv')
const configFile = isSubBot && id ? path.join(baseDir, 'config.json') : GLOBAL_CONFIG

const ensure = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

const readJson = (file, fallback = {}) => {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    return data && typeof data === 'object' ? data : fallback
  } catch {
    return { ...fallback }
  }
}

const writeJson = (file, data) => {
  ensure(path.dirname(file))
  const tmp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n')
  fs.renameSync(tmp, file)
  return data
}

const globalConfig = () => canalOficial.normalizar(readJson(GLOBAL_CONFIG, {}))

const subConfig = () => {
  if (!isSubBot || !id) return {}
  const current = readJson(configFile, {})
  return {
    prefix: String(current.prefix || '!'),
    channel: String(current.channel || '0@newsletter'),
    channelLink: String(current.channelLink || '')
  }
}

const config = () => {
  const main = globalConfig()
  if (!isSubBot || !id) return main

  const local = subConfig()
  const channel = String(local.channel || '0@newsletter')

  return canalOficial.normalizar({
    ...main,
    prefix: String(local.prefix || main.prefix || '!'),
    channel,
    channeldl: channel,
    channelLink: String(local.channelLink || ''),
    ownerNumber: owner() || main.ownerNumber || ''
  })
}

const updateSubConfig = patch => {
  if (!isSubBot || !id) throw new Error('NAO_E_SUBBOT')
  const current = subConfig()
  const next = { ...current }

  if (Object.prototype.hasOwnProperty.call(patch || {}, 'prefix')) {
    const value = String(patch.prefix || '').trim()
    if (value) next.prefix = value.slice(0, 4)
  }

  if (Object.prototype.hasOwnProperty.call(patch || {}, 'channel')) {
    next.channel = String(patch.channel || '0@newsletter').trim() || '0@newsletter'
  }
  if (Object.prototype.hasOwnProperty.call(patch || {}, 'channelLink')) {
    next.channelLink = String(patch.channelLink || '').trim()
  }

  return writeJson(configFile, next)
}

const ensureRuntime = () => {
  ensure(SUBS)
  ensure(sessionDir)
  ensure(groupsDir)
  ensure(path.dirname(horarioFile))
  ensure(mediaDir)

  if (isSubBot && id && !fs.existsSync(configFile)) {
    writeJson(configFile, { prefix: '!', channel: '0@newsletter' })
  }

  if (!fs.existsSync(horarioFile)) writeJson(horarioFile, {})
}

ensureRuntime()

module.exports = {
  ROOT,
  DADOS,
  DB,
  SUBS,
  GLOBAL_CONFIG,
  isSubBot,
  id,
  get owner() { return owner() },
  ownerFromStore,
  baseDir,
  sessionDir,
  groupsDir,
  horarioFile,
  mediaDir,
  configFile,
  ensure,
  readJson,
  writeJson,
  globalConfig,
  subConfig,
  config,
  updateSubConfig,
  ensureRuntime,
  digits
}