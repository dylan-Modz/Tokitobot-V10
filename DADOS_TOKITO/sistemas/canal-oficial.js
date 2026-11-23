'use strict'
// Link oficial do Channel-TK. Converte apenas o canal padrão antigo,
// preservando canais personalizados e o estado OFF do comando setchannel.
const TOKEN_ATUAL = '0029VbCAgovIyPtbjBhrIi3u'
const TOKEN_ANTIGO = '0029VbBbHVs7oQhTLxKWBW2q'
const JID_ANTIGO = '120363421690941003@newsletter'
const BASE = 'https://whatsapp.com/channel/'
const LINK_ATUAL = BASE + TOKEN_ATUAL
const LINK_ANTIGO = BASE + TOKEN_ANTIGO

const cacheJid = new WeakMap()
const parse = value => String(value || '').trim()
const isJid = value => /^\d+@newsletter$/i.test(parse(value))
const isUrl = value => /^https:\/\/(?:www\.)?whatsapp\.com\/channel\/[A-Za-z0-9_-]+\/?$/i.test(parse(value))
const canon = value => {
  const entrada = parse(value)
  if (!isUrl(entrada)) return ''
  const codigo = entrada.match(/\/channel\/([A-Za-z0-9_-]+)\/?$/i)?.[1]
  return codigo === TOKEN_ANTIGO ? LINK_ATUAL : entrada
}

const ativo = config => {
  const cfg = config || {}
  const canal = parse(cfg.channel)
  const jid = parse(cfg.channeldl)
  if (!canal || canal === '0' || canal === '0@newsletter') return false
  if (jid === '0@newsletter' && !isUrl(canal) && !isUrl(cfg.channelLink)) return false
  return true
}

const canalPadrao = config => {
  const cfg = config || {}
  if (!ativo(cfg)) return false
  const canal = parse(cfg.channel)
  const link = parse(cfg.channelLink)
  const jid = parse(cfg.channeldl)
  // Um canal configurado explicitamente com outro JID tem prioridade.
  if (isJid(jid) && jid !== JID_ANTIGO && jid !== '0@newsletter') return false
  if (isUrl(link) && ![LINK_ANTIGO, LINK_ATUAL].includes(canon(link) === LINK_ATUAL ? LINK_ATUAL : link)) return false
  if (isUrl(canal) && canon(canal) !== LINK_ATUAL) return false
  return jid === JID_ANTIGO || canal === JID_ANTIGO ||
    canon(canal) === LINK_ATUAL || canon(link) === LINK_ATUAL
}

const link = config => {
  const cfg = config || {}
  if (!ativo(cfg)) return ''
  const direto = canon(cfg.channelLink) || canon(cfg.channel)
  if (direto) return direto
  return canalPadrao(cfg) ? LINK_ATUAL : ''
}

// A configuração local é protegida pelo atualizador e pode conter o JID antigo.
// Até resolver o novo JID com o WhatsApp, evita encaminhar mensagens
// atribuindo-as ao canal antigo. A apresentação ainda usa o link novo.
const jid = (config, socket) => {
  const cfg = config || {}
  if (!ativo(cfg)) return ''
  const atual = parse(cfg.channeldl)
  if (!canalPadrao(cfg)) return isJid(atual) && atual !== '0@newsletter'
    ? atual : (isJid(cfg.channel) && parse(cfg.channel) !== '0@newsletter' ? parse(cfg.channel) : '')
  if (!socket || typeof socket.newsletterMetadata !== 'function') return ''
  const item = cacheJid.get(socket) || { tentativa: 0, valor: '', promise: null }
  if (isJid(item.valor) && item.valor !== JID_ANTIGO) return item.valor
  if (!item.promise && Date.now() - item.tentativa >= 60000) {
    item.tentativa = Date.now()
    item.promise = Promise.resolve()
      .then(() => socket.newsletterMetadata('invite', TOKEN_ATUAL))
      .then(meta => {
        const id = parse(meta?.jid || meta?.id)
        if (isJid(id) && id !== JID_ANTIGO) item.valor = id
      })
      .catch(e => console.log('[TOKITO CANAL]', e?.message || 'Não foi possível consultar o canal.'))
      .finally(() => { item.promise = null })
    cacheJid.set(socket, item)
  }
  return isJid(item.valor) && item.valor !== JID_ANTIGO ? item.valor : ''
}

module.exports = { LINK_ATUAL, ativo, canalPadrao, link, jid }
