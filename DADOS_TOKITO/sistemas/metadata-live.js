'use strict'

const normalizarJid = valor => {
  const texto = String(valor || '').trim().replace('@c.us', '@s.whatsapp.net')
  const indice = texto.indexOf('@')
  if (indice < 0) return ''
  return texto.slice(0, indice).split(':')[0] + texto.slice(indice)
}

const identidades = participante => {
  if (typeof participante === 'string') return [normalizarJid(participante)].filter(Boolean)
  if (!participante || typeof participante !== 'object') return []
  return [...new Set([
    participante.id, participante.jid, participante.participant,
    participante.lid, participante.phoneNumber, participante.participantAlt,
    participante.participantPn, participante.pn, participante.user
  ].map(normalizarJid).filter(Boolean))]
}

/**
 * Aplica imediatamente promoções/rebaixamentos no cache de metadados.
 * Eventos pouco completos invalidam a entrada, para não manter permissões erradas.
 */
const aplicarAtualizacaoParticipantes = (cache, update) => {
  const jid = update?.id
  if (!jid || !cache?.has?.(jid)) return false
  const registro = cache.get(jid)
  if (!registro?.dados?.participants || !Array.isArray(update?.participants)) {
    cache.delete(jid)
    return false
  }
  if (!['promote', 'demote'].includes(update.action)) {
    cache.delete(jid)
    return false
  }
  const alvos = update.participants.map(identidades).filter(ids => ids.length)
  if (!alvos.length || alvos.length !== update.participants.length) {
    cache.delete(jid)
    return false
  }
  const encontrados = new Set()
  const participants = registro.dados.participants.map(item => {
    const ids = identidades(item)
    const indice = alvos.findIndex(alvo => alvo.some(id => ids.includes(id)))
    if (indice < 0) return item
    encontrados.add(indice)
    return { ...item, admin: update.action === 'promote' ? 'admin' : null }
  })
  if (encontrados.size !== alvos.length) {
    cache.delete(jid)
    return false
  }
  cache.set(jid, {
    ...registro,
    dados: { ...registro.dados, participants },
    tempo: Date.now()
  })
  return true
}

module.exports = { aplicarAtualizacaoParticipantes }
