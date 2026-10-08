/*
 * Tokito Bot V10 - Protecao contra rajadas de mensagens.
 * Autor: Dylan Modz
 * Monitora a conexao principal sem fabricar mensagens ou pagamentos.
 */
const base = require('./grupos.js')
const antiPay = require('../plugins/admin/antipay.js')
const runtimeSub = require('../sub/runtime.js')
const mess = require('../mensagens/mensagens.js')

const JANELA_MS = 15000
const COOLDOWN_MS = 60000
const ALERTA_PAGAMENTO = 3
const REMOCAO_PAGAMENTO = 6
const ALERTA_CITACAO = 4
const REMOCAO_CITACAO = 8

const vistos = new Map()
const rajadas = new Map()
const avisos = new Map()
const moderacoes = new Map()
const diagnosticos = new Map()
const normal = value => base.normalizar(value)
const ids = membro => [
  membro?.id, membro?.jid, membro?.lid, membro?.phoneNumber,
  membro?.participant, membro?.participantAlt, membro?.participantPn
].map(normal).filter(Boolean)
const igualdade = (a, b) => {
  const x = normal(a), y = normal(b)
  return !!(x && y && x === y)
}

const atualizarDiagnostico = (grupo, tipo, razao) => {
  const anterior = diagnosticos.get(grupo) || {
    observadas: 0, candidatas: 0, alertas: 0, removidas: 0,
    semAutor: 0, desativadas: 0, foraPadrao: 0, duplicadas: 0,
    ultimaRazao: '-', ultimaRecepcao: 0
  }
  anterior.ultimaRecepcao = Date.now()
  anterior.ultimaRazao = razao || tipo
  if (tipo && Object.prototype.hasOwnProperty.call(anterior, tipo))
    anterior[tipo]++
  diagnosticos.set(grupo, anterior)
}

const diagnostico = grupo => ({
  observadas: 0, candidatas: 0, alertas: 0, removidas: 0,
  semAutor: 0, desativadas: 0, foraPadrao: 0, duplicadas: 0,
  ultimaRazao: 'nenhuma', ultimaRecepcao: 0,
  ...(diagnosticos.get(String(grupo || '')) || {})
})

const limpar = agora => {
  for (const [id, tempo] of vistos)
    if (agora - tempo > COOLDOWN_MS * 2) vistos.delete(id)
  for (const [id, tempo] of avisos)
    if (agora - tempo > COOLDOWN_MS) avisos.delete(id)
  for (const [id, tempo] of moderacoes)
    if (agora - tempo > COOLDOWN_MS) moderacoes.delete(id)
  for (const [id, eventos] of rajadas) {
    const recentes = eventos.filter(e => agora - e.tempo <= JANELA_MS)
    if (recentes.length) rajadas.set(id, recentes)
    else rajadas.delete(id)
  }
}

const contextoDaMensagem = mensagem => {
  const msg = base.desenrolar(mensagem)
  return msg?.extendedTextMessage?.contextInfo ||
    msg?.imageMessage?.contextInfo ||
    msg?.videoMessage?.contextInfo ||
    msg?.documentMessage?.contextInfo ||
    msg?.buttonsMessage?.contextInfo ||
    msg?.contextInfo || null
}

const assinaturaTexto = texto => String(texto || '')
  .normalize('NFKC')
  .replace(/[\u200b-\u200f\u2060\ufeff]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase()
  .slice(0, 450)

const classificar = mensagem => {
  if (!mensagem || typeof mensagem !== 'object') return null
  const contexto = contextoDaMensagem(mensagem)
  const citada = contexto?.quotedMessage
  const temCitacao = Boolean(citada || contexto?.stanzaId)
  const assinatura = assinaturaTexto(base.texto(mensagem))
  if (!assinatura) return null

  const pagamentoCitado = Boolean(citada && antiPay.detectar(citada))
  const possuiLink = /(?:https?:\/\/|\bwww\.|\bt\.me\/|\bwhatsapp\.com\/)/i.test(assinatura)

  // A prévia de um pagamento citado pode não ser incluída no evento recebido.
  // Nesses casos, uma rajada promocional com link continua sendo analisada.
  const divulgacao = possuiLink && assinatura.length >= 45
  if (!pagamentoCitado && !divulgacao) return null

  const tipo = pagamentoCitado ? 'pagamento' : temCitacao ? 'citacao' : 'divulgacao'
  return {
    tipo,
    familia: divulgacao ? 'promocao' : 'pagamento',
    assinatura,
    alerta: pagamentoCitado ? ALERTA_PAGAMENTO : ALERTA_CITACAO,
    remocao: pagamentoCitado ? REMOCAO_PAGAMENTO : REMOCAO_CITACAO
  }
}

const verificar = async (tokito, info) => {
  const chave = info?.key
  const grupo = String(chave?.remoteJid || '')
  if (!tokito || !grupo.endsWith('@g.us') || chave?.fromMe)
    return { verificado: false, motivo: 'fora-do-grupo' }

  atualizarDiagnostico(grupo, 'observadas', 'mensagem-recebida')
  const msgId = String(chave?.id || '')
  const autor = normal(chave?.participantAlt || chave?.senderAlt ||
    chave?.participant || info?.participant || info?.participantAlt || '')

  if (!msgId || !autor) {
    atualizarDiagnostico(grupo, 'semAutor', 'id-ou-autor-ausente')
    return { verificado: false, motivo: 'id-ou-autor-ausente' }
  }

  const config = base.config(grupo)
  if (config.antiinvisivel !== true && config.antipay !== true) {
    atualizarDiagnostico(grupo, 'desativadas', 'protecao-desativada')
    return { verificado: false, motivo: 'desativado' }
  }

  const tipo = classificar(info.message)
  if (!tipo || (tipo.tipo !== 'pagamento' && config.antiinvisivel !== true)) {
    atualizarDiagnostico(grupo, 'foraPadrao', 'sem-padrao-de-rajada')
    return { verificado: false, motivo: 'fora-do-padrao' }
  }

  atualizarDiagnostico(grupo, 'candidatas', tipo.tipo)
  const agora = Date.now()
  limpar(agora)
  const unica = `${grupo}|${msgId}`
  if (vistos.has(unica)) {
    atualizarDiagnostico(grupo, 'duplicadas', 'id-repetido')
    return { verificado: false, motivo: 'duplicado' }
  }
  vistos.set(unica, agora)

  const chaveAutor = `${grupo}|${autor}`
  // Agrupa pelo texto mesmo que a previsualizacao da citacao desapareca.
  const chaveRajada = `${chaveAutor}|${tipo.familia}|${tipo.assinatura}`
  const ultimos = (rajadas.get(chaveRajada) || [])
    .filter(e => agora - e.tempo <= JANELA_MS)
  ultimos.push({ tempo: agora, id: msgId })
  rajadas.set(chaveRajada, ultimos)

  const total = ultimos.length
  const modo = config.antiinvisivel === true &&
    config.antiinvisivelModo === 'remover' ? 'remover' : 'alerta'
  const limiteAlerta = tipo.familia === 'pagamento'
    ? ALERTA_PAGAMENTO : ALERTA_CITACAO
  const limiteRemocao = tipo.familia === 'pagamento'
    ? REMOCAO_PAGAMENTO : REMOCAO_CITACAO
  const podeAlertar = total >= limiteAlerta && !avisos.has(chaveAutor)
  const podeRemover = modo === 'remover' && total >= limiteRemocao &&
    !moderacoes.has(chaveAutor)
  if (!podeAlertar && !podeRemover)
    return { verificado: true, total, tipo: tipo.tipo }

  let removido = false
  let acao = 'registrado'
  let alvo = autor
  if (podeRemover) {
    moderacoes.set(chaveAutor, agora)
    try {
      const meta = await tokito.groupMetadata(grupo)
      const participantes = meta?.participants || []
      const autorIds = [
        chave?.participantAlt, chave?.senderAlt, chave?.participant,
        info?.participant, info?.participantAlt
      ].map(normal).filter(Boolean)
      const usuario = participantes.find(p => ids(p).some(jid => autorIds.includes(jid)))
      const botIds = [tokito.user?.id, tokito.user?.lid].map(normal).filter(Boolean)
      const bot = participantes.find(p => ids(p).some(jid => botIds.includes(jid)))
      const dono = normal(meta?.owner)
      const donoBot = runtimeSub.config?.() || {}
      const donosBot = [donoBot.ownerNumber, donoBot.owner].map(normal).filter(Boolean)
      const protegido = !usuario || usuario.admin === 'superadmin' ||
        ids(usuario).some(jid => igualdade(jid, dono) || botIds.includes(jid) ||
          donosBot.some(item => igualdade(item, jid)))
      alvo = usuario
        ? ids(usuario).find(jid => jid.endsWith('@s.whatsapp.net')) ||
          ids(usuario).find(jid => jid.endsWith('@lid')) || autor
        : autor
      const botAdmin = !!bot && ['admin', 'superadmin'].includes(bot.admin)
      if (!botAdmin) acao = 'semPermissao'
      else if (protegido) acao = 'protegido'
      else {
        if (usuario.admin === 'admin')
          await tokito.groupParticipantsUpdate(grupo, [alvo], 'demote')
        await tokito.groupParticipantsUpdate(grupo, [alvo], 'remove')
        removido = true
        acao = 'removido'
        rajadas.delete(chaveRajada)
        atualizarDiagnostico(grupo, 'removidas', 'removido')
      }
    } catch (erro) {
      acao = 'falha'
      console.warn('[ANTI-INVISIVEL] Falha na moderacao:', erro?.message || erro)
    }
  }

  if (podeAlertar || removido || acao !== 'registrado') {
    avisos.set(chaveAutor, agora)
    atualizarDiagnostico(grupo, 'alertas', 'alerta-enviado')
    const numero = base.numero(alvo || autor) || 'desconhecido'
    await tokito.sendMessage(grupo, {
      text: mess.antiInvisivelFloodPagamento(numero, total, tipo.tipo, modo, acao),
      mentions: alvo ? [alvo] : []
    }).catch(error => {
      console.warn('[ANTI-INVISIVEL] Aviso nao enviado:', error?.message || error)
    })
  }

  return { verificado: true, total, tipo: tipo.tipo, modo, removido, acao }
}

module.exports = {
  verificar, classificar, diagnostico, JANELA_MS,
  ALERTA_PAGAMENTO, REMOCAO_PAGAMENTO, ALERTA_CITACAO, REMOCAO_CITACAO
}
