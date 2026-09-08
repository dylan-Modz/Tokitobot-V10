/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *  Arquivo: div.js
 *  Função : Divulgação + payment + fluxo
 *  Dev    : Dylan Modz
 * ============================================================
 */

const fs = require('fs')
const path = require('path')

const {
  proto,
  generateWAMessageFromContent,
  jidNormalizedUser
} = require('../database/lib/exports.js')

const DB_FILE = path.join(__dirname, '..', 'database', 'div.json')

const MAX_POR_RODADA = 100
const TEMPO_ESPERA = 3 * 60 * 1000

function padrao() {
  return {
    texto: '',
    grupos: [],
    atualizadoEm: null
  }
}

function garantirBanco() {
  const pasta = path.dirname(DB_FILE)

  if (!fs.existsSync(pasta)) {
    fs.mkdirSync(pasta, { recursive: true })
  }

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
  }
  catch {
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

const runtime = global.__TOKITO_DIV_V4__ || {
  catalogo: [],
  esperas: new Map(),
  executando: false,
  parar: false,

  status: {
    total: 0,
    enviados: 0,
    falhas: 0,
    restantes: 0,
    ultimoGrupo: null,
    ultimoErro: null
  }
}

global.__TOKITO_DIV_V4__ = runtime


function chaveEspera(sender, from) {
  return `${String(sender || '')}|${String(from || '')}`
}

function aguardar(sender, from, etapa) {
  runtime.esperas.set(
    chaveEspera(sender, from),
    {
      etapa,
      expiraEm: Date.now() + TEMPO_ESPERA
    }
  )
}

function espera(sender, from) {
  const chave = chaveEspera(sender, from)
  const atual = runtime.esperas.get(chave)

  if (!atual) return null

  if (Date.now() > atual.expiraEm) {
    runtime.esperas.delete(chave)
    return null
  }

  return atual
}

function limparEspera(sender, from) {
  runtime.esperas.delete(chaveEspera(sender, from))
}

async function carregarGrupos(tokito) {
  if (!tokito || typeof tokito.groupFetchAllParticipating !== 'function') {
    throw new Error('Não foi possível buscar os grupos.')
  }

  const bruto = await tokito.groupFetchAllParticipating()

  const grupos = Object.values(bruto || {})
    .filter(g => g?.id && String(g.id).endsWith('@g.us'))
    .map(g => ({
      id: g.id,
      nome: String(g.subject || g.name || g.id || 'Grupo').trim(),
      participantes: Array.isArray(g.participants) ? g.participants.length : null
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  runtime.catalogo = grupos
  return grupos
}

function catalogoAtual() {
  return Array.isArray(runtime.catalogo) ? runtime.catalogo : []
}

function localizarGrupo(chave) {
  const texto = String(chave || '').trim()
  const catalogo = catalogoAtual()

  if (!texto) return null

  if (/^\d+$/.test(texto)) {
    return catalogo[Number(texto) - 1] || null
  }

  return catalogo.find(g => g.id === texto) || null
}

function alternarGrupo(chave) {
  const state = ler()
  const grupo = localizarGrupo(chave)

  if (!grupo) {
    throw new Error('Grupo não encontrado.')
  }

  const existe = state.grupos.some(g => g.id === grupo.id)

  const grupos = existe
    ? state.grupos.filter(g => g.id !== grupo.id)
    : [...state.grupos, grupo]

  salvar({
    ...state,
    grupos,
    texto: ''
  })

  return {
    grupo,
    ativo: !existe,
    total: grupos.length
  }
}

function limparSelecao() {
  const state = ler()

  return salvar({
    ...state,
    grupos: [],
    texto: '',
  })
}

function definirTexto(texto) {
  const state = ler()

  return salvar({
    ...state,
    texto: String(texto || '').trim(),
  })
}

/*
 * Selo do próprio bot em formato de contato.
 * Não usa externalAdReply/foto/preview patrocinado.
 */
function seloBot(tokito, jid, NomeDoBot = 'Tokito Bot V10') {
  const botJid = jidNormalizedUser(tokito.user?.id || '')
  const numero = String(botJid || '')
    .split('@')[0]
    .split(':')[0]
    .replace(/\D/g, '')

  if (!numero) return null

  return {
    key: {
      participant: botJid,
      remoteJid: jid,
      fromMe: true,
      id: 'TOKITO-DIV-PAYMENT'
    },

    message: {
      contactMessage: {
        displayName: NomeDoBot,

        vcard:
          `BEGIN:VCARD\n` +
          `VERSION:3.0\n` +
          `N:;${NomeDoBot};;;\n` +
          `FN:${NomeDoBot}\n` +
          `item1.TEL;waid=${numero}:${numero}\n` +
          `item1.X-ABLabel:Bot\n` +
          `END:VCARD`
      }
    }
  }
}

async function membrosGrupo(tokito, jid) {
  if (!String(jid || '').endsWith('@g.us')) {
    return []
  }

  const metadata = await tokito.groupMetadata(jid)
  const bot = jidNormalizedUser(tokito.user?.id || '')

  return [
    ...new Set(
      (metadata?.participants || [])
        .map(p => p?.id || p?.jid || '')
        .filter(Boolean)
        .map(jidNormalizedUser)
        .filter(jid => jid && jid !== bot)
    )
  ]
}

/*
 * Mesmo princípio do totag:
 * contextInfo.mentionedJid recebe os membros do grupo.
 */
function montarPayment(texto, mencoes = []) {
  return proto.Message.fromObject({
    requestPaymentMessage: {
      currencyCodeIso4217: 'BRL',
      amount1000: 0,

      noteMessage: {
        extendedTextMessage: {
          text: String(texto || '').trim(),

          contextInfo: {
            mentionedJid: Array.isArray(mencoes) ? mencoes : []
          }
        }
      }
    }
  })
}

async function enviarPayment(tokito, jid, texto, opcoes = {}) {
  const corpo = String(texto || '').trim()

  if (!corpo) {
    throw new Error('A divulgação está vazia.')
  }

  const mencoes = opcoes.marcarTodos === false
    ? []
    : await membrosGrupo(tokito, jid)

  const quoted = seloBot(
    tokito,
    jid,
    opcoes.NomeDoBot || 'Tokito Bot V10'
  )

  const gerada = generateWAMessageFromContent(
    jid,
    montarPayment(corpo, mencoes),
    {
      userJid: tokito.user?.id,
      ...(quoted ? { quoted } : {})
    }
  )

  await tokito.relayMessage(
    jid,
    gerada.message,
    { messageId: gerada.key.id }
  )

  return {
    mensagem: gerada,
    mencoes
  }
}

async function enviar(tokito, opcoes = {}) {
  if (runtime.executando) {
    throw new Error('Já existe um envio em andamento.')
  }

  const state = ler()

  if (!state.texto) {
    throw new Error('A divulgação ainda não foi informada.')
  }

  if (!state.grupos.length) {
    throw new Error('Nenhum grupo foi selecionado.')
  }

  /*
   * Um envio por grupo selecionado.
   * Máximo de 100 grupos por rodada.
   * Sem intervalo artificial.
   */
  const fila = state.grupos.slice(
    0,
    MAX_POR_RODADA
  )

  runtime.executando = true
  runtime.parar = false

  runtime.status = {
    total: fila.length,
    enviados: 0,
    falhas: 0,
    restantes: fila.length,
    ultimoGrupo: null,
    ultimoErro: null
  }

  try {
    for (let i = 0; i < fila.length; i++) {
      if (runtime.parar) break

      const grupo = fila[i]
      runtime.status.ultimoGrupo = grupo.nome

      try {
        await enviarPayment(
          tokito,
          grupo.id,
          state.texto,
          {
            marcarTodos: true,
            NomeDoBot: opcoes.NomeDoBot
          }
        )

        runtime.status.enviados++
      }
      catch (error) {
        runtime.status.falhas++
        runtime.status.ultimoErro = String(error?.message || error)
      }

      runtime.status.restantes = Math.max(
        0,
        fila.length - (runtime.status.enviados + runtime.status.falhas)
      )

    }
  }
  finally {
    runtime.executando = false
  }

  return obterStatus()
}

function parar() {
  if (!runtime.executando) return false

  runtime.parar = true
  return true
}

function obterStatus() {
  return {
    config: ler(),

    runtime: {
      ...runtime.status,
      executando: runtime.executando,
      parar: runtime.parar
    }
  }
}

module.exports = {
  DB_FILE,
  MAX_POR_RODADA,
  ler,
  salvar,

  aguardar,
  espera,
  limparEspera,

  carregarGrupos,
  catalogoAtual,
  localizarGrupo,
  alternarGrupo,
  limparSelecao,

  definirTexto,

  seloBot,
  membrosGrupo,
  montarPayment,
  enviarPayment,

  enviar,
  parar,
  obterStatus
}
