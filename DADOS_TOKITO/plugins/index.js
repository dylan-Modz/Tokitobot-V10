const fs = require('fs')
const path = require('path')
const modulosSistema = require('../sistemas/modulos')
const dadosSistema = require('../sistemas/dados')

const mapa = new Map()

const modulos = new Set()

const eventos = []

const pasta = __dirname

const normal = valor => String(valor || '').trim().toLowerCase()

const aliasesModulo = mod => {
  const lista = []
  if (mod?.nome)
    lista.push(mod.nome)
  if (Array.isArray(mod?.comandos))
    lista.push(...mod.comandos)
  if (Array.isArray(mod?.aliases))
    lista.push(...mod.aliases)
  return [...new Set(lista.map(normal).filter(Boolean))]
}

const ler = dir => {
  for (const nome of fs.readdirSync(dir).sort((a, b) => a.localeCompare(b, 'pt-BR'))) {
    const local = path.join(dir, nome)
    const stat = fs.statSync(local)
    if (stat.isDirectory()) {
      ler(local)
      continue
    }
    if (!nome.endsWith('.js') || nome === 'index.js' || nome.startsWith('_'))
      continue
    const mod = require(local)
    if (!mod || typeof mod !== 'object')
      continue
    const aliases = aliasesModulo(mod)
    if (!aliases.length && typeof mod.evento !== 'function')
      continue
    const canonico = normal(mod.nome || aliases[0])
    mod.nome = canonico
    mod.comandos = aliases
    mod.categoria = mod.categoria || mod.info?.categoria || path.basename(path.dirname(local))
    mod.arquivo = local
    if (aliases.length)
      modulos.add(mod)
    for (const cmd of aliases) {
      const existente = mapa.get(cmd)
      if (existente && existente !== mod) {
        console.warn(`[PLUGIN] Alias duplicado "${cmd}" em ${path.relative(pasta, local)}; mantendo ${path.relative(pasta, existente.arquivo || '')}.`)
        continue
      }
      mapa.set(cmd, mod)
    }
    if (typeof mod.evento === 'function' && !eventos.includes(mod))
      eventos.push(mod)
  }
}

const carregar = () => {
  mapa.clear()
  modulos.clear()
  eventos.length = 0

  const acesso = dadosSistema.localLicenseStatus()
  if (!acesso.ok) {
    console.warn('[PLUGIN] Acesso local do Tokito V10 ainda não foi validado.')
    return 0
  }
  for (const chave of Object.keys(require.cache)) {
    if (chave.startsWith(pasta) && chave !== __filename)
      delete require.cache[chave]
  }
  ler(pasta)
  return mapa.size
}

const resolver = comando => {
  const cmd = normal(comando)
  const mod = mapa.get(cmd)
  if (!mod)
    return null
  return {
    mod,
    comando: cmd,
    canonico: normal(mod.nome || mod.comandos?.[0] || cmd)
  }
}

const executar = async (comando, ctx = {}) => {
  const achado = resolver(comando)
  if (!achado || typeof achado.mod.executar !== 'function')
    return false
  await achado.mod.executar({
    ...ctx,
    command: achado.comando,
    comandoCanonico: achado.canonico,
    plugin: achado.mod
  })
  return true
}

const evento = async (ctx = {}, fase = 'normal') => {
  for (const mod of eventos) {
    try {
      const faseModulo = String(mod.fase || 'normal').toLowerCase()
      if (faseModulo !== String(fase || 'normal').toLowerCase())
        continue
      const bloqueou = await mod.evento({
        ...ctx,
        plugin: mod
      })
      if (bloqueou === true)
        return true
    }
    catch (error) {
      console.log('[PLUGIN EVENTO]', mod?.nome || mod?.arquivo || '', modulosSistema.sanitizarErro(error) || 'Erro sem detalhes')
    }
  }
  return false
}

const comandos = () => [...mapa.keys()]

const catalogo = () => [...modulos].map(mod => ({
  nome: normal(mod.nome || mod.comandos?.[0]),
  aliases: [...new Set((mod.comandos || []).filter(cmd => cmd !== normal(mod.nome)))],
  categoria: mod.categoria || 'outros',
  info: mod.info || {},
  arquivo: mod.arquivo
}))

const contar = () => ({
  canonicos: modulos.size,
  aliases: mapa.size - modulos.size,
  total: mapa.size
})

carregar()

module.exports = {
  carregar,
  executar,
  evento,
  resolver,
  comandos,
  catalogo,
  contar
}
