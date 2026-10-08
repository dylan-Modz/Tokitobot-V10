/*
 * Tokito Bot V10 - Protecao contra rajadas com pagamento citado.
 * Autor: Dylan Modz
 * Nenhuma mensagem de pagamento artificial e criada.
 */
const base = require('./grupos.js')
const antiPay = require('../plugins/admin/filtro-antipay.js')
const runtimeSub = require('../sub/runtime.js')
const mess = require('../mensagens/mensagens.js')

const JANELA_MS = 15000
const ALERTA_PAGAMENTO = 3
const REMOCAO_PAGAMENTO = 6
const ALERTA_CITACAO = 4
const REMOCAO_CITACAO = 7
const COOLDOWN_MS = 60000

const vistos = new Map()
const rajadas = new Map()
const avisos = new Map()
const moderacoes = new Map()

const normal = value => base.normalizar(value)
const ids = membro => [
  membro?.id, membro?.jid, membro?.lid, membro?.phoneNumber,
  membro?.participant, membro?.participantAlt, membro?.participantPn
].map(normal).filter(Boolean)
const igualdade = (a, b) => {
  const x = normal(a), y = normal(b)
  return !!(x && y && x === y)
}

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

const classificar = mensagem => {
  if (!mensagem || typeof mensagem !== 'object') return null
  const contexto = contextoDaMensagem(mensagem)
  const citada = contexto?.quotedMessage
  const possuiCitacao = Boolean(citada || contexto?.stanzaId)
  if (!possuiCitacao) return null

  const texto = base.texto(mensagem).replace(/\s+/g, ' ').trim()
  if (!texto) return null

  // So considera pagamento quando a estrutura citada realmente o identifica.
  const pagamentoCitado = Boolean(citada && antiPay.detectar(citada))
  const citacaoComLink = !pagamentoCitado &&
    texto.length >= 45 &&
    /(?:https?:\/\/|\bt\.me\/|\bwhatsapp\.com\/)/i.test(texto)

  if (!pagamentoCitado && !citacaoComLink) return null

  return {
    tipo: pagamentoCitado ? 'pagamento' : 'citacao',
    assinatura: texto.toLowerCase().slice(0, 450),
    alerta: pagamentoCitado ? ALERTA_PAGAMENTO : ALERTA_CITACAO,
    remocao: pagamentoCitado ? REMOCAO_PAGAMENTO : REMOCAO_CITACAO
  }
}

const verificar = async (tokito, info) => {
  const chave = info?.key
  const grupo = String(chave?.remoteJid || '')
  const msgId = String(chave?.id || '')
  const autorBruto = chave?.participantAlt || chave?.senderAlt || chave?.participant || info?.participant || ''
  const autor = normal(autorBruto)
  if (!tokito || !grupo.endsWith('@g.us') || !msgId || chave?.fromMe || !autor)
    return { verificado: false, motivo: 'dados-ausentes' }

  const config = base.config(grupo)
  if (config.antiinvisivel !== true && config.antipay !== true)
    return { verificado: false, motivo: 'desativado' }

  const tipo = classificar(info.message)
  if (!tipo) return { verificado: false, motivo: 'fora-do-padrao' }

  const agora = Date.now()
  limpar(agora)
  const unica = `${grupo}|${msgId}`
  if (vistos.has(unica)) return { verificado: false, motivo: 'duplicado' }
  vistos.set(unica, agora)

  const chaveAutor = `${grupo}|${autor}`
  const chaveRajada = `${chaveAutor}|${tipo.tipo}|${tipo.assinatura}`
  const ultimos = (rajadas.get(chaveRajada) || [])
    .filter(e => agora - e.tempo <= JANELA_MS)
  ultimos.push({ tempo: agora, id: msgId })
  rajadas.set(chaveRajada, ultimos)

  const total = ultimos.length
  const modo = config.antiinvisivel === true &&
    config.antiinvisivelModo === 'remover' ? 'remover' : 'alerta'
  const podeAlertar = total >= tipo.alerta && !avisos.has(chaveAutor)
  const podeRemover = modo === 'remover' && total >= tipo.remocao &&
    !moderacoes.has(chaveAutor)
  if (!podeAlertar && !podeRemover)
    return { verificado: true, total, tipo: tipo.tipo }

  let removido = false
  let acao = 'registrado'
  let alvo = autor

  if (podeRemover) {
    // Trava a moderacao antes de chamadas externas para evitar expulsao duplicada.
    moderacoes.set(chaveAutor, agora)
    try {
      const meta = await tokito.groupMetadata(grupo)
      const participantes = meta?.participants || []
      const autorIds = [chave?.participantAlt, chave?.senderAlt, chave?.participant, info?.participant]
        .map(normal).filter(Boolean)
      const usuario = participantes.find(p => ids(p).some(jid => autorIds.includes(jid)))
      const botIds = [tokito.user?.id, tokito.user?.lid].map(normal).filter(Boolean)
      const bot = participantes.find(p => ids(p).some(jid => botIds.includes(jid)))
      const dono = normal(meta?.owner)
      const donoBot = runtimeSub.config?.() || {}
      const donosBot = [donoBot.ownerNumber, donoBot.owner].map(normal).filter(Boolean)
      const protegido = !usuario || usuario.admin === 'superadmin' ||
        ids(usuario).some(jid => igualdade(jid, dono) || botIds.includes(jid) ||
          donosBot.some(item => igualdade(item, jid)))
      alvo = ids(usuario).find(jid => jid.endsWith('@s.whatsapp.net')) ||
        ids(usuario).find(jid => jid.endsWith('@lid')) || autor
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
      }
    } catch (erro) {
      acao = 'falha'
      console.warn('[ANTI-INVISIVEL FLOOD] Moderacao:', erro?.message || erro)
    }
  }

  if (podeAlertar || removido || acao !== 'registrado') {
    avisos.set(chaveAutor, agora)
    const numero = base.numero(alvo || autor) || 'desconhecido'
    await tokito.sendMessage(grupo, {
      text: mess.antiInvisivelFloodPagamento(numero, total, tipo.tipo, modo, acao),
      mentions: alvo ? [alvo] : []
    }).catch(() => {})
  }

  return { verificado: true, total, tipo: tipo.tipo, modo, removido, acao }
}

module.exports = { verificar, classificar, JANELA_MS, ALERTA_PAGAMENTO, REMOCAO_PAGAMENTO }
