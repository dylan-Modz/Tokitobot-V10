const fs = require('fs')
const path = require('path')
const runtime = require('./runtime')

const ROOT = runtime.SUBS
const REGISTRY = path.join(ROOT, 'subs.json')
const PAYMENTS = path.join(ROOT, 'pagamentos.json')

const plans = [7, 15, 20, 30, 40, 50, 60].map(dias => ({
  id: `${dias}d`,
  dias,
  valor: dias,
  nome: `${dias} dias`
}))

runtime.ensure(ROOT)
if (!fs.existsSync(REGISTRY)) runtime.writeJson(REGISTRY, {})
if (!fs.existsSync(PAYMENTS)) runtime.writeJson(PAYMENTS, [])

const normalize = value => runtime.digits(value)
const nowIso = () => new Date().toISOString()

const all = () => {
  const data = runtime.readJson(REGISTRY, {})
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
}

const saveAll = data => runtime.writeJson(REGISTRY, data)
const get = number => all()[normalize(number)] || null
const list = () => Object.values(all())

const plan = days => plans.find(p => p.dias === Number(days)) || null

const ensureSubDir = number => {
  const id = normalize(number)
  if (!id) throw new Error('NUMERO_SUB_INVALIDO')
  const dir = path.join(ROOT, id)
  runtime.ensure(path.join(dir, 'qrcode'))
  runtime.ensure(path.join(dir, 'grupos', 'ATIVAÇÕES-TOKITO'))
  runtime.ensure(path.join(dir, 'midiabv'))
  const cfg = path.join(dir, 'config.json')
  if (!fs.existsSync(cfg)) runtime.writeJson(cfg, { prefix: '!', channel: '0@newsletter' })
  const horario = path.join(dir, 'grupos', 'horario.json')
  if (!fs.existsSync(horario)) runtime.writeJson(horario, {})
  return dir
}

const upsert = (number, data = {}) => {
  const id = normalize(number)
  if (!id) throw new Error('NUMERO_SUB_INVALIDO')
  const db = all()
  const old = db[id] || {}
  const createdAt = old.createdAt || nowIso()
  db[id] = {
    ...old,
    ...data,
    number: id,
    owner: normalize(data.owner ?? old.owner),
    createdAt,
    updatedAt: nowIso()
  }
  ensureSubDir(id)
  saveAll(db)
  return db[id]
}

const create = ({ owner, number, days, paid = false, buyer = '', originChat = '', originRequester = '' }) => {
  const p = plan(days)
  if (!p) throw new Error('PLANO_SUB_INVALIDO')
  const id = normalize(number)
  const dono = normalize(owner)
  if (id.length < 10 || id.length > 15) throw new Error('NUMERO_SUB_INVALIDO')
  if (dono.length < 10 || dono.length > 15) throw new Error('NUMERO_DONO_INVALIDO')

  const start = Date.now()
  return upsert(id, {
    owner: dono,
    buyer: normalize(buyer),
    originChat: String(originChat || ''),
    originRequester: normalize(originRequester),
    plan: p.id,
    days: p.dias,
    value: p.valor,
    paid: paid === true,
    status: 'aguardando_conexao',
    startsAt: new Date(start).toISOString(),
    expiresAt: new Date(start + p.dias * 86400000).toISOString()
  })
}

const update = (number, patch = {}) => upsert(number, patch)

const remove = number => {
  const id = normalize(number)
  const db = all()
  if (!db[id]) return false
  delete db[id]
  saveAll(db)
  try { fs.rmSync(path.join(ROOT, id), { recursive: true, force: true }) } catch {}
  return true
}

const byOwner = owner => {
  const id = normalize(owner)
  return list().filter(item => normalize(item.owner) === id)
}

const active = () => {
  const now = Date.now()
  return list().filter(item => {
    const exp = new Date(item.expiresAt || 0).getTime()
    return Number.isFinite(exp) && exp > now && item.status !== 'removido'
  })
}

const expire = () => {
  const db = all()
  let changed = false
  for (const [id, item] of Object.entries(db)) {
    const exp = new Date(item.expiresAt || 0).getTime()
    if (item.status !== 'expirado' && Number.isFinite(exp) && exp <= Date.now()) {
      item.status = 'expirado'
      item.updatedAt = nowIso()
      changed = true
    }
  }
  if (changed) saveAll(db)
  return db
}

const readPayments = () => {
  const data = runtime.readJson(PAYMENTS, [])
  return Array.isArray(data) ? data : []
}
const savePayments = data => runtime.writeJson(PAYMENTS, Array.isArray(data) ? data : [])

module.exports = {
  ROOT,
  REGISTRY,
  PAYMENTS,
  plans,
  normalize,
  plan,
  all,
  list,
  get,
  upsert,
  create,
  update,
  remove,
  byOwner,
  active,
  expire,
  ensureSubDir,
  readPayments,
  savePayments
}