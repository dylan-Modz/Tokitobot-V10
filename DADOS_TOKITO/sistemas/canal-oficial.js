'use strict'
// Reparo do canal oficial sem sobrescrever canais personalizados ou canal desligado.
// A configuração privada do bot é protegida pelo atualizador; normalizamos os dados
// antigos durante a leitura e resolvemos o novo JID quando o WhatsApp conectar.
const LINK_OFICIAL = 'https://whatsapp.com/channel/0029VbCAgovIyPtbjBhrIi3u'
const CONVITE = '0029VbCAgovIyPtbjBhrIi3u'
const LINK_LEGADO = 'https://whatsapp.com/channel/0029VbBbHVs7oQhTLxKWBW2q'
const JID_LEGADO = '120363421690941003@newsletter'
const DESLIGADO = '0@newsletter'
const canalUrl = valor => String(valor || '').trim().replace(/\/+$/, '')
const desligado = config => {
  const channel = String(config?.channel || '').trim()
  return !channel || channel === '0' || channel === DESLIGADO
}
const jidValido = valor => /^\d+@newsletter$/.test(String(valor || '')) &&
  String(valor) !== DESLIGADO && String(valor) !== JID_LEGADO

const normalizar = config => {
  if (!config || typeof config !== 'object') return {}
  const next = { ...config }
  // Um canal desativado nunca deve continuar com metadados de encaminhamento.
  if (desligado(next)) {
    next.channeldl = DESLIGADO
    if (canalUrl(next.channelLink) === LINK_LEGADO) next.channelLink = LINK_OFICIAL
    return next
  }

  const antigo = next.channel === JID_LEGADO ||
    next.channeldl === JID_LEGADO ||
    canalUrl(next.channel) === LINK_LEGADO ||
    canalUrl(next.channelLink) === LINK_LEGADO

  if (antigo) {
    next.channel = LINK_OFICIAL
    next.channeldl = DESLIGADO // Não divulgar com o JID do antigo canal.
    next.channelLink = LINK_OFICIAL
  } else if (canalUrl(next.channel) === LINK_OFICIAL && !jidValido(next.channeldl)) {
    next.channeldl = DESLIGADO
    next.channelLink = LINK_OFICIAL
  }
  return next
}

const deveResolver = config => {
  const cfg = normalizar(config)
  return !desligado(cfg) &&
    (canalUrl(cfg.channel) === LINK_OFICIAL || canalUrl(cfg.channelLink) === LINK_OFICIAL) &&
    !jidValido(cfg.channeldl)
}

async function resolver(tokito, runtime) {
  if (typeof tokito?.newsletterMetadata !== 'function' || !runtime?.config) return false
  if (!deveResolver(runtime.config())) return false

  let meta
  try {
    meta = await tokito.newsletterMetadata('invite', CONVITE)
  } catch (error) {
    console.log('[CANAL OFICIAL] Não foi possível consultar o convite:', error?.message || 'Falha')
    return false
  }
  const jid = String(meta?.jid || meta?.id || '').trim()
  if (!jidValido(jid)) return false

  // Verifica novamente após a chamada de rede: o dono pode ter desligado o
  // canal ou selecionado outro enquanto o convite estava sendo consultado.
  const atual = runtime.isSubBot ? runtime.subConfig() : runtime.readJson(runtime.GLOBAL_CONFIG, {})
  if (!deveResolver(atual)) return false

  if (runtime.isSubBot) {
    runtime.updateSubConfig({ channel: jid, channelLink: LINK_OFICIAL })
  } else {
    runtime.writeJson(runtime.GLOBAL_CONFIG, {
      ...atual,
      channel: jid,
      channeldl: jid,
      channelLink: LINK_OFICIAL
    })
  }
  return true
}

module.exports = { LINK_OFICIAL, LINK_LEGADO, JID_LEGADO, DESLIGADO, normalizar, desligado, resolver }
