/*
 * TOKITO BOT V10 - memória e continuidade do Agente IA
 * Author: Dylan Modz
 */

const fs = require('fs')
const path = require('path')

const pasta = path.join(__dirname, '..', 'database', 'ia')
const arquivoMemoria = path.join(pasta, 'memoria.json')
const arquivoContexto = path.join(pasta, 'contexto.json')
const arquivoEstado = path.join(pasta, 'estado-agente.json')

if (!fs.existsSync(pasta)) {
  fs.mkdirSync(pasta, { recursive: true })
}

const ler = (arquivo, fallback = {}) => {
  try {
    const data = JSON.parse(fs.readFileSync(arquivo, 'utf8'))
    return data && typeof data === 'object' ? data : fallback
  } catch {
    return fallback
  }
}

let memoria = ler(arquivoMemoria, {})
let contexto = ler(arquivoContexto, {})
let estado = ler(arquivoEstado, {})
let timer = null

const agora = () => Date.now()
const LIMITE_USUARIO = 20
const LIMITE_GRUPO = 35
const TTL_USUARIO = 30 * 24 * 60 * 60 * 1000
const TTL_GRUPO = 12 * 60 * 60 * 1000
const TTL_PENDENTE = 15 * 60 * 1000
const TTL_MODO = 7 * 24 * 60 * 60 * 1000

const salvar = () => {
  if (timer) return

  timer = setTimeout(async () => {
    timer = null

    try {
      await Promise.all([
        fs.promises.writeFile(
          arquivoMemoria,
          JSON.stringify(memoria, null, 2) + '\n'
        ),
        fs.promises.writeFile(
          arquivoContexto,
          JSON.stringify(contexto, null, 2) + '\n'
        ),
        fs.promises.writeFile(
          arquivoEstado,
          JSON.stringify(estado, null, 2) + '\n'
        )
      ])
    } catch {}
  }, 700)

  timer.unref?.()
}

const chaveUsuario = ctx => {
  return `${String(ctx.from || '')}|${String(ctx.sender || '')}`
}

const chaveGrupo = ctx => String(ctx.from || '')

const historico = ctx => {
  const chave = chaveUsuario(ctx)
  const lista = Array.isArray(memoria[chave]) ? memoria[chave] : []

  const validos = lista
    .filter(item => agora() - Number(item?.time || 0) <= TTL_USUARIO)
    .slice(-LIMITE_USUARIO)

  if (validos.length) {
    memoria[chave] = validos
  } else {
    delete memoria[chave]
  }

  return validos
}

const lembrar = (ctx, pergunta, resposta, extra = {}) => {
  const p = String(pergunta || '').replace(/\s+/g, ' ').trim()
  const r = String(resposta || '').replace(/\s+/g, ' ').trim()

  if (!p || !r) return

  const chave = chaveUsuario(ctx)
  const lista = historico(ctx)

  lista.push({
    pergunta: p.slice(0, 1200),
    resposta: r.slice(0, 2200),
    action: String(extra?.action || '').slice(0, 80),
    time: agora()
  })

  memoria[chave] = lista.slice(-LIMITE_USUARIO)
  salvar()
}

const limpar = ctx => {
  const chave = chaveUsuario(ctx)

  delete memoria[chave]
  delete estado[chave]

  salvar()
}

const obterEstado = ctx => {
  const chave = chaveUsuario(ctx)
  const atual = estado[chave]

  if (!atual || typeof atual !== 'object') {
    estado[chave] = {}
    return estado[chave]
  }

  return atual
}

const pendente = ctx => {
  const atual = obterEstado(ctx)
  const item = atual?.pendente

  if (!item || typeof item !== 'object') return null

  if (agora() - Number(item.time || 0) > TTL_PENDENTE) {
    delete atual.pendente
    salvar()
    return null
  }

  return item
}

const definirPendente = (ctx, dados = {}) => {
  const command = String(dados.command || '').trim().toLowerCase()

  if (!command) return null

  const atual = obterEstado(ctx)

  atual.pendente = {
    command,
    tipo: String(dados.tipo || 'argumento').trim(),
    pergunta: String(dados.pergunta || '').trim().slice(0, 500),
    mention: Boolean(dados.mention),
    time: agora()
  }

  salvar()
  return atual.pendente
}

const limparPendente = ctx => {
  const atual = obterEstado(ctx)

  if (atual?.pendente) {
    delete atual.pendente
    salvar()
  }
}

const modoResposta = ctx => {
  const atual = obterEstado(ctx)
  const modo = atual?.modoResposta

  if (!modo || !['audio', 'texto'].includes(modo.tipo)) {
    return ''
  }

  if (agora() - Number(modo.time || 0) > TTL_MODO) {
    delete atual.modoResposta
    salvar()
    return ''
  }

  return modo.tipo
}

const definirModoResposta = (ctx, tipo) => {
  const valor = String(tipo || '').toLowerCase()

  if (!['audio', 'texto'].includes(valor)) return ''

  const atual = obterEstado(ctx)

  atual.modoResposta = {
    tipo: valor,
    time: agora()
  }

  salvar()
  return valor
}

const registrarGrupo = ctx => {
  if (!ctx?.isGroup || ctx?.info?.key?.fromMe) return

  const texto = String(ctx.body || '').replace(/\s+/g, ' ').trim()

  if (!texto || texto.length < 3 || texto.startsWith(String(ctx.prefix || '.'))) {
    return
  }

  const chave = chaveGrupo(ctx)
  const lista = Array.isArray(contexto[chave]) ? contexto[chave] : []
  const nome = String(ctx.pushname || '').replace(/\s+/g, ' ').trim() ||
    String(ctx.sender || '').split('@')[0]

  lista.push({
    nome: nome.slice(0, 40),
    texto: texto.slice(0, 300),
    time: agora()
  })

  contexto[chave] = lista
    .filter(item => agora() - Number(item?.time || 0) <= TTL_GRUPO)
    .slice(-LIMITE_GRUPO)

  salvar()
}

const contextoGrupo = ctx => {
  const chave = chaveGrupo(ctx)
  const lista = Array.isArray(contexto[chave]) ? contexto[chave] : []

  const validos = lista
    .filter(item => agora() - Number(item?.time || 0) <= TTL_GRUPO)
    .slice(-12)

  contexto[chave] = validos
  return validos
}

const textoContexto = ctx => {
  return contextoGrupo(ctx)
    .map(item => `${item.nome}: ${item.texto}`)
    .join('\n')
    .slice(0, 1800)
}

const espontaneo = global.__TOKITO_IA_ESPONTANEO__ ||= new Map()

const podeInteragir = ctx => {
  const chave = chaveGrupo(ctx)
  const ultimo = Number(espontaneo.get(chave) || 0)

  if (agora() - ultimo < 3 * 60 * 1000) return false

  const texto = String(ctx.body || '').trim()
  if (texto.length < 5) return false
  if (texto.startsWith(String(ctx.prefix || '.'))) return false

  const pergunta = /\?|\b(?:quem|qual|quais|como|porque|por que|pq|onde|quando|algu[eé]m|ser[aá]|vale a pena|o que|oque)\b/i.test(texto)
  const chance = pergunta ? 1 : 0.18

  if (Math.random() > chance) return false

  espontaneo.set(chave, agora())
  return true
}

module.exports = {
  historico,
  lembrar,
  limpar,
  pendente,
  definirPendente,
  limparPendente,
  modoResposta,
  definirModoResposta,
  registrarGrupo,
  contextoGrupo,
  textoContexto,
  podeInteragir
}
