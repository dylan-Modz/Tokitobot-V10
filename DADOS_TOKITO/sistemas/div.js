/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: div.js
 *  Função : Controle de campanhas de divulgação visíveis
 *  Dev    : Dylan Modz
 * ============================================================
 */

const fs = require('fs')
const path = require('path')

const DB_FILE = path.join(__dirname, '..', 'database', 'div.json')
const MAX_POR_RODADA = 20
const MIN_INTERVALO = 10
const MAX_INTERVALO = 3600

function padrao() {
  return {
    texto: '',
    intervalo: 20,
    grupos: [],
    atualizadoEm: null
  }
}

function garantirBanco() {
  const pasta = path.dirname(DB_FILE)
  if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true })
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(padrao(), null, 2))
  }
}

function ler() {
  try {
    garantirBanco()
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
    return {
      ...padrao(),
      ...(data && typeof data === 'object' ? data : {}),
      grupos: Array.isArray(data?.grupos) ? data.grupos : []
    }
  } catch {
    return padrao()
  }
}

function salvar(next) {
  garantirBanco()
  const data = {
    ...padrao(),
    ...next,
    grupos: Array.isArray(next?.grupos) ? next.grupos : [],
    atualizadoEm: new Date().toISOString()
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
  return data
}

const runtime = global.__TOKITO_DIV__ || {
  catalogo: [],
  executando: false,
  parar: false,
  status: {
    total: 0,
    enviados: 0,
    falhas: 0,
    restantes: 0,
    inicio: null,
    fim: null,
    ultimoGrupo: null,
    ultimoErro: null
  }
}

global.__TOKITO_DIV__ = runtime

function dormir(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function nomeGrupo(g = {}) {
  return String(g.subject || g.name || g.id || 'Grupo').trim()
}

async function carregarGrupos(tokito) {
  if (!tokito || typeof tokito.groupFetchAllParticipating !== 'function') {
    throw new Error('groupFetchAllParticipating não está disponível nesta build da Baileys.')
  }

  const bruto = await tokito.groupFetchAllParticipating()
  const grupos = Object.values(bruto || {})
    .filter(g => g?.id && String(g.id).endsWith('@g.us'))
    .map(g => ({ id: g.id, nome: nomeGrupo(g), participantes: Array.isArray(g.participants) ? g.participants.length : null }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  runtime.catalogo = grupos
  return grupos
}

function catalogoAtual() {
  return Array.isArray(runtime.catalogo) ? runtime.catalogo : []
}

function localizarGrupo(chave) {
  const catalogo = catalogoAtual()
  const texto = String(chave || '').trim()
  if (!texto) return null

  if (/^\d+$/.test(texto)) {
    const idx = Number(texto) - 1
    return catalogo[idx] || null
  }

  return catalogo.find(g => g.id === texto) || null
}

function adicionar(chaves = []) {
  const state = ler()
  const atuais = new Map(state.grupos.map(g => [g.id, g]))
  const adicionados = []
  const ignorados = []

  for (const chave of chaves) {
    const grupo = localizarGrupo(chave)
    if (!grupo) {
      ignorados.push(String(chave))
      continue
    }
    if (!atuais.has(grupo.id)) {
      atuais.set(grupo.id, grupo)
      adicionados.push(grupo)
    }
  }

  salvar({ ...state, grupos: [...atuais.values()] })
  return { adicionados, ignorados }
}

function remover(chaves = []) {
  const state = ler()
  const removerIds = new Set()
  const removidos = []
  const ignorados = []

  for (const chave of chaves) {
    const texto = String(chave || '').trim()
    let grupo = localizarGrupo(texto)

    if (!grupo && /^\d+$/.test(texto)) {
      const idx = Number(texto) - 1
      grupo = state.grupos[idx] || null
    }

    if (!grupo) {
      ignorados.push(texto)
      continue
    }

    removerIds.add(grupo.id)
    removidos.push(grupo)
  }

  salvar({ ...state, grupos: state.grupos.filter(g => !removerIds.has(g.id)) })
  return { removidos, ignorados }
}

function definirTexto(texto) {
  const state = ler()
  return salvar({ ...state, texto: String(texto || '').trim() })
}

function definirIntervalo(segundos) {
  const n = Number(segundos)
  if (!Number.isInteger(n) || n < MIN_INTERVALO || n > MAX_INTERVALO) {
    throw new Error(`O intervalo deve ficar entre ${MIN_INTERVALO} e ${MAX_INTERVALO} segundos.`)
  }
  const state = ler()
  return salvar({ ...state, intervalo: n })
}

function limpar() {
  if (runtime.executando) throw new Error('Pare a campanha antes de limpar.')
  return salvar(padrao())
}

function obterStatus() {
  return {
    config: ler(),
    runtime: { ...runtime.status, executando: runtime.executando, parar: runtime.parar },
    limites: { maxPorRodada: MAX_POR_RODADA, minIntervalo: MIN_INTERVALO, maxIntervalo: MAX_INTERVALO }
  }
}

async function preview(tokito, jid) {
  const state = ler()
  if (!state.texto) throw new Error('Nenhuma mensagem de divulgação foi configurada.')
  return tokito.sendMessage(jid, { text: state.texto })
}

async function enviar(tokito, quantidade) {
  if (runtime.executando) throw new Error('Já existe uma campanha em andamento.')

  const state = ler()
  if (!state.texto) throw new Error('Configure a mensagem com divmsg antes de enviar.')
  if (!state.grupos.length) throw new Error('Nenhum grupo foi selecionado.')

  const limite = Number(quantidade)
  if (!Number.isInteger(limite) || limite < 1 || limite > MAX_POR_RODADA) {
    throw new Error(`A quantidade deve ser de 1 até ${MAX_POR_RODADA}.`)
  }

  const fila = state.grupos.slice(0, limite)
  runtime.executando = true
  runtime.parar = false
  runtime.status = {
    total: fila.length,
    enviados: 0,
    falhas: 0,
    restantes: fila.length,
    inicio: new Date().toISOString(),
    fim: null,
    ultimoGrupo: null,
    ultimoErro: null
  }

  try {
    for (let i = 0; i < fila.length; i++) {
      if (runtime.parar) break

      const grupo = fila[i]
      runtime.status.ultimoGrupo = grupo.nome

      try {
        await tokito.sendMessage(grupo.id, { text: state.texto })
        runtime.status.enviados++
      } catch (error) {
        runtime.status.falhas++
        runtime.status.ultimoErro = String(error?.message || error)
      }

      runtime.status.restantes = Math.max(0, fila.length - (runtime.status.enviados + runtime.status.falhas))

      if (i < fila.length - 1 && !runtime.parar) {
        await dormir(state.intervalo * 1000)
      }
    }
  } finally {
    runtime.executando = false
    runtime.status.fim = new Date().toISOString()
  }

  return obterStatus()
}

function parar() {
  if (!runtime.executando) return false
  runtime.parar = true
  return true
}

module.exports = {
  DB_FILE,
  MAX_POR_RODADA,
  MIN_INTERVALO,
  MAX_INTERVALO,
  ler,
  salvar,
  carregarGrupos,
  catalogoAtual,
  adicionar,
  remover,
  definirTexto,
  definirIntervalo,
  limpar,
  obterStatus,
  preview,
  enviar,
  parar
}
