'use strict'
// Canal do Tokito: mantém links personalizados e o estado desligado.
// O cartão nativo depende do JID real; sem ele, exibe link clicável,
// sem inventar seguidores ou metadados de mensagens encaminhadas.
const TOKEN_ATUAL = '0029VbCAgovIyPtbjBhrIi3u'
const TOKEN_ANTIGO = '0029VbBbHVs7oQhTLxKWBW2q'
const JID_ANTIGO = '120363421690941003@newsletter'
const BASE = 'https://whatsapp.com/channel/'
const LINK_ATUAL = BASE + TOKEN_ATUAL
const LINK_ANTIGO = BASE + TOKEN_ANTIGO
const TEMPO_TENTATIVA = 60000
const cachePorSocket = new WeakMap()

const parse = value => String(value || '').trim()
const isJid = value => /^\d{8,25}@newsletter$/i.test(parse(value)) &&
  parse(value) !== '0@newsletter'
const isUrl = value => /^https:\/\/(?:www\.)?whatsapp\.com\/channel\/[A-Za-z0-9_-]{15,128}\/?$/i.test(parse(value))
const canon = value => {
  const valor = parse(value)
  if (!isUrl(valor)) return ''
  const codigo = valor.match(/\/channel\/([A-Za-z0-9_-]+)\/?$/i)?.[1]
  return BASE + (codigo === TOKEN_ANTIGO ? TOKEN_ATUAL : codigo)
}

const ativo = config => {
  const cfg = config || {}
  const canal = parse(cfg.channel)
  if (!canal || canal === '0' || canal === '0@newsletter') return false
  const jid = parse(cfg.channeldl)
  if (jid === '0@newsletter' && !isUrl(canal) && !isUrl(cfg.channelLink)) return false
  return true
}

const canalPadrao = config => {
  const cfg = config || {}
  if (!ativo(cfg)) return false
  const canal = parse(cfg.channel)
  const link = parse(cfg.channelLink)
  const jid = parse(cfg.channeldl)
  if (isJid(jid) && jid !== JID_ANTIGO) return false
  if (isUrl(link) && canon(link) !== LINK_ATUAL) return false
  if (isUrl(canal) && canon(canal) !== LINK_ATUAL) return false
  return jid === JID_ANTIGO || canal === JID_ANTIGO ||
    canon(canal) === LINK_ATUAL || canon(link) === LINK_ATUAL
}

const link = config => {
  const cfg = config || {}
  if (!ativo(cfg)) return ''
  return canon(cfg.channelLink) || canon(cfg.channel) ||
    (canalPadrao(cfg) ? LINK_ATUAL : '')
}

const informacoes = (config, socket) => {
  const cfg = config || {}
  if (!ativo(cfg)) return { jid: '', link: '', name: '', subscribers: null }
  const url = link(cfg)
  const atual = parse(cfg.channeldl)
  const direto = isJid(atual) && (!canalPadrao(cfg) || atual !== JID_ANTIGO)
    ? atual
    : (isJid(cfg.channel) && parse(cfg.channel) !== JID_ANTIGO ? parse(cfg.channel) : '')

  let item
  const cacheKey = url || direto
  if (socket && (typeof socket.newsletterMetadata === 'function') && cacheKey) {
    let porLink = cachePorSocket.get(socket)
    if (!porLink) {
      porLink = new Map()
      cachePorSocket.set(socket, porLink)
    }
    item = porLink.get(cacheKey) || { jid: '', name: '', subscribers: null, ultima: 0, promise: null }
    if (!porLink.has(cacheKey)) porLink.set(cacheKey, item)
    if (!item.promise && Date.now() - item.ultima >= TEMPO_TENTATIVA &&
        !(direto && item.name)) {
      item.ultima = Date.now()
      const token = url ? url.split('/').pop() : ''
      const tipo = direto ? 'jid' : 'invite'
      const chave = direto || token
      item.promise = Promise.resolve()
        .then(() => socket.newsletterMetadata(tipo, chave))
        .then(meta => {
          const id = parse(meta?.jid || meta?.id || meta?.result?.jid || meta?.result?.id)
          if (isJid(id) && id !== JID_ANTIGO) item.jid = id
          const nome = parse(meta?.name || meta?.thread_metadata?.name?.text)
          if (nome) item.name = nome.slice(0, 120)
          const brutoCount = meta?.subscribers ?? meta?.thread_metadata?.subscribers_count
          if (brutoCount !== undefined && brutoCount !== null && brutoCount !== '') {
            const count = Number(brutoCount)
            if (Number.isFinite(count) && count >= 0) item.subscribers = Math.round(count)
          }
        })
        .catch(e => console.log('[TOKITO CANAL]', 'Metadados do canal indisponíveis:', e?.code || e?.message || 'erro'))
        .finally(() => { item.promise = null })
    }
  }
  return {
    jid: direto || item?.jid || '',
    link: url,
    name: item?.name || parse(cfg.channelName) || '',
    subscribers: item?.subscribers ?? null
  }
}

// Botão de URL suportado pelo fluxo interativo do WhatsApp.
// Não deve ser substituído por texto/link inserido no fim dos comandos.
const botaoAcesso = config => {
  const url = link(config)
  if (!url) return null
  return {
    name: 'cta_url',
    buttonParamsJson: JSON.stringify({
      display_text: '📢 Acessar canal',
      url,
      merchant_url: url
    })
  }
}

// Compatibilidade com o cartão antigo "Ver canal" do WhatsApp.
// Diferentemente de cta_url, este contexto usa o JID de newsletter
// configurado e preserva o formato utilizado pela V10 anterior.
const contextoNativo = (config, socket, nomeBot, mentionedJid = []) => {
  const base = contextoSeguro(mentionedJid)
  const dados = informacoes(config, socket)
  if (!isJid(dados.jid)) return base
  return {
    ...base,
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
      newsletterJid: dados.jid,
      newsletterName: dados.name || parse(nomeBot) || 'Canal WhatsApp',
      // O cliente antigo do Tokito esperava esta propriedade em branco.
      serverMessageId: ''
    }
  }
}

const jid = (config, socket) => informacoes(config, socket).jid

// Respostas comuns precisam de contextInfo mínimo. O cartão de canal
// experimental não deve ser injetado em textos, botões e mídias de todos
// os comandos: alguns clientes ignoram a resposta inteira.
const contextoSeguro = (mentionedJid = []) => ({
  mentionedJid: Array.isArray(mentionedJid) ? mentionedJid : []
})

// Contexto rico reservado para mensagens que anunciam explicitamente um canal.
const contexto = (config, socket, nomeBot, mentionedJid = []) => {
  const dados = informacoes(config, socket)
  const base = { mentionedJid }
  if (dados.jid) {
    return {
      ...base,
      isForwarded: true,
      forwardingScore: 1,
      forwardedNewsletterMessageInfo: {
        newsletterJid: dados.jid,
        newsletterName: dados.name || parse(nomeBot) || 'Canal WhatsApp'
      }
    }
  }
  // Sem JID real não há como gerar o cartão de canal encaminhado.
  // Fallback mantém o acesso clicável, sem atribuir uma mensagem inexistente.
  if (dados.link) {
    const seguidores = Number.isInteger(dados.subscribers)
      ? ' • ' + dados.subscribers.toLocaleString('pt-BR') + ' seguidores'
      : ''
    return {
      ...base,
      externalAdReply: {
        title: '📢 Acessar canal',
        body: (dados.name || 'Canal do WhatsApp') + seguidores,
        sourceUrl: dados.link,
        mediaType: 1,
        showAdAttribution: false,
        renderLargerThumbnail: false
      }
    }
  }
  return base
}

module.exports = {
  LINK_ATUAL, ativo, canalPadrao, link, jid, informacoes, contexto, contextoSeguro, botaoAcesso, contextoNativo
}
