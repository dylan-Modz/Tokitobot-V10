const path = require('path')

const configPath = path.join(__dirname, '..', '..', 'INFO_DADOS', 'config-all.json')

const config = () => {
  try {
    delete require.cache[require.resolve(configPath)]
    return require(configPath)
  }
  catch {
    return {}
  }
}

const tokenSala = ctx => {
  const cfg = config()
  return String(cfg.TOKEN_SALA || process.env.TOKEN_SALA || ctx.API_KEY_TOKITO || '').trim()
}

const tokenLikes = ctx => {
  const cfg = config()
  return String(cfg.TOKEN_LIKE_FF || process.env.TOKEN_LIKE_FF || ctx.API_KEY_TOKITO || '').trim()
}

const apiErro = (error, padrao = 'Não foi possível concluir a solicitação.') => {
  const d = error?.response?.data
  return String(d?.mensagem || d?.message || d?.error || d?.msg || error?.message || padrao)
}

const retornoErro = data => String(data?.mensagem || data?.message || data?.error || data?.msg || 'Não foi possível concluir a solicitação.')

const enviar = async (ctx, texto, botoes = [], mentions = []) => {
  if (ctx.isBotoes && botoes.length)
    return ctx.botaozin(texto, botoes, mentions)
  return ctx.reply(texto, mentions)
}

const botoesSala = (ctx, sessionId, opcoes = ['ver', 'jogadores', 'iniciar', 'parar']) => {
  if (!sessionId)
    return []
  const mapa = {
    ver: {
      texto: ctx.mess.botaoVerSala(),
      id: `${ctx.prefix}versala ${sessionId}`
    },
    jogadores: {
      texto: ctx.mess.botaoJogadoresSala(),
      id: `${ctx.prefix}jogadoressala ${sessionId}`
    },
    iniciar: {
      texto: ctx.mess.botaoIniciarSala(),
      id: `${ctx.prefix}iniciarsala ${sessionId}`
    },
    parar: {
      texto: ctx.mess.botaoPararSala(),
      id: `${ctx.prefix}pararsala ${sessionId}`
    }
  }
  return opcoes.map(x => mapa[x]).filter(Boolean)
}

const dataBR = valor => {
  if (!valor)
    return 'N/A'
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date(valor))
  }
  catch {
    return 'N/A'
  }
}

module.exports = {
  config,
  tokenSala,
  tokenLikes,
  apiErro,
  retornoErro,
  enviar,
  botoesSala,
  dataBR
}
