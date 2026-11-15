/*
 * TOKITO BOT V10 — PlayCall
 * Busca por nome/link como Play, prepara MP3 e carrega a mídia no motor
 * VoIP via loadAudio(callId, arquivo) após iniciar a chamada.
 * Chamada conectada não comprova áudio transmitido: não confundir estados.
 */
'use strict'

const dylan = require('../../database/lib/comandos')
const axios = require('axios')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { pipeline } = require('node:stream/promises')
const { execFile } = require('node:child_process')
const { promisify } = require('node:util')
const executarFfmpeg = promisify(execFile)

const chamadas = global.__TOKITO_PLAYCALL_ATIVAS__ ||= new Map()
const estadosAtivos = new Set(['connected', 'established', 'in_call', 'active', 'media_connected'])
const estadosFinais = new Set(['ended', 'terminate', 'terminated', 'rejected', 'reject', 'declined', 'timeout', 'failed', 'disconnected', 'error'])

const youtubeUrl = (value) => {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    if (host === 'youtu.be') return /^[\w-]{11}$/.test(url.pathname.slice(1)) ? 'https://www.youtube.com/watch?v=' + url.pathname.slice(1) : ''
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const id = url.pathname.startsWith('/shorts/') ? url.pathname.split('/')[2] : url.searchParams.get('v')
      return id && /^[\w-]{11}$/.test(id) ? 'https://www.youtube.com/watch?v=' + id : ''
    }
  } catch {}
  return ''
}

async function localizar(ctx, entrada) {
  const direta = youtubeUrl(entrada)
  if (/^https?:\/\//i.test(entrada) && !direta) throw new Error('Use um link do YouTube ou informe o nome da música.')
  const termo = direta || entrada
  const url = String(ctx.API_URL || '').replace(/\/+$/, '') +
    '/api/youtube-search?query=' + encodeURIComponent(termo) +
    '&apikey=' + encodeURIComponent(ctx.API_KEY_TOKITO || '')
  const res = await axios.get(url, { timeout: 20000, validateStatus: () => true })
  const lista = Array.isArray(res.data?.resultado) ? res.data.resultado : []
  const item = lista.find(v => v?.type === 'video' && v?.url) || lista.find(v => v?.url)
  if (!item && !direta) throw new Error('Não encontrei essa música na pesquisa.')
  const videoUrl = direta || String(item.url)
  const id = /[?&]v=([\w-]{11})/.exec(videoUrl)?.[1] || ''
  return {
    url: videoUrl,
    titulo: String(item?.title || 'Música selecionada').slice(0, 130),
    artista: String(item?.author?.name || 'YouTube').slice(0, 90),
    duracao: String(item?.timestamp || item?.duration?.timestamp || '—'),
    capa: String(item?.image || item?.thumbnail || (id ? 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg' : ''))
  }
}

async function prepararAudio(ctx, videoUrl) {
  const pasta = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'tokito-playcall-'))
  const arquivo = path.join(pasta, 'musica.mp3')
  try {
    const url = String(ctx.API_URL || '').replace(/\/+$/, '') +
      '/api/youtube-audio?q=' + encodeURIComponent(videoUrl) +
      '&apikey=' + encodeURIComponent(ctx.API_KEY_TOKITO || '')
    const resposta = await axios.get(url, {
      responseType: 'stream', timeout: 60000, maxRedirects: 3,
      validateStatus: () => true
    })
    if (resposta.status !== 200) {
      resposta.data?.destroy?.()
      throw new Error('A API de áudio não retornou a música (HTTP ' + resposta.status + ').')
    }
    const tipo = String(resposta.headers?.['content-type'] || '').toLowerCase()
    if (tipo.includes('json') || tipo.includes('text/html')) {
      resposta.data?.destroy?.()
      throw new Error('A API não retornou um arquivo de áudio válido.')
    }
    const tamanho = Number(resposta.headers?.['content-length'] || 0)
    if (tamanho > 35 * 1024 * 1024) {
      resposta.data?.destroy?.()
      throw new Error('O áudio excedeu o limite de 35 MB.')
    }
    let bytes = 0
    resposta.data.on('data', chunk => {
      bytes += chunk.length
      if (bytes > 35 * 1024 * 1024) resposta.data.destroy(new Error('O áudio excedeu o limite de 35 MB.'))
    })
    await pipeline(resposta.data, fs.createWriteStream(arquivo))
    if (bytes < 1024) throw new Error('O arquivo de áudio recebido está vazio ou incompleto.')
    // O content-type sozinho não comprova que a resposta é áudio decodificável.
    // Usa o mesmo FFmpeg necessário ao motor VoIP, sem tocar música no chat.
    const { stdout } = await executarFfmpeg(process.env.FFMPEG_PATH || 'ffmpeg', [
      '-nostdin', '-hide_banner', '-loglevel', 'error', '-i', arquivo,
      '-t', '3', '-vn', '-sn', '-dn', '-ac', '1', '-ar', '16000',
      '-f', 's16le', 'pipe:1'
    ], { timeout: 20000, maxBuffer: 512 * 1024, encoding: 'buffer' })
    if (!stdout || stdout.length < 3200) throw new Error('A música não pôde ser decodificada pelo FFmpeg.')
    return { pasta, arquivo }
  } catch (erro) {
    await fs.promises.rm(pasta, { recursive: true, force: true }).catch(() => {})
    throw erro
  }
}


const digits = x => String(x || '').split('@')[0].split(':')[0].replace(/\D/g, '')
const tel = jid => '+' + digits(jid)
const limpo = x => String(x || '—').replace(/\s+/g, ' ').trim()
const borda = '╰━━━━━━━━━━━━━━━━━━╯'
const formatar = (topo, itens, fim = borda) => [topo, ...itens.map(linha => '┃ ' + linha), fim].join('\n')
const cardMusica = (m, jid) => formatar('╭━━〔 🎧 *𝙿𝙻𝙰𝚈𝙲𝙰𝙻𝙻* 〕━━╮', [
  '🎶 *MÚSICA ENCONTRADA!*', '',
  '🎵 *' + limpo(m.titulo) + '*',
  '🎤 ᴀᴜᴛᴏʀ: ' + limpo(m.artista),
  '⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ' + limpo(m.duracao),
  '🔗 ' + m.url, '',
  '━━━━〔 ☎️ *LIGAÇÃO* 〕━━━━',
  '👤 ɴᴜ́ᴍᴇʀᴏ: ' + tel(jid),
  '🟡 *CHAMANDO...*'
])
const cardChamando = (jid, m) => formatar('╭━━〔 ☎️ *PLAYCALL* 〕━━╮', [
  '🟡 *CHAMANDO...*', '',
  '👤 ' + tel(jid),
  '🎵 ' + limpo(m.titulo), '',
  '📲 Aguardando atender'
])
const cardPreparando = jid => formatar('╭━━〔 ✅ *ATENDEU!* 〕━━╮', [
  '👤 ' + tel(jid),
  '🎶 Preparando sua música...'
])
const cardConectou = (jid, m) => formatar('╭━━〔 🎧 *PLAYCALL* 〕━━╮', [
  '✅ *CHAMADA CONECTADA!*', '',
  '👤 ɴᴜ́ᴍᴇʀᴏ: ' + tel(jid),
  '🎵 *' + limpo(m.titulo) + '*',
  '🔊 Música enviada para a ligação!', '',
  '🎶 Aproveite o som!'
])
const cardSemAudio = (jid, m) => formatar('╭━━〔 ⚠️ *PLAYCALL* 〕━━╮', [
  '🔇 *SEM ÁUDIO*', '',
  '👤 ' + tel(jid),
  '🎵 ' + limpo(m.titulo),
  '❌ Não foi possível enviar a música.', '',
  '☎️ A ligação continua ativa.'
])
const cardFim = (jid, tempo, conectou) => formatar('╭━━〔 📴 *CHAMADA ENCERRADA* 〕━━╮', [
  '🎧 *PLAYCALL FINALIZADO*', '',
  '👤 ɴᴜ́ᴍᴇʀᴏ: ' + tel(jid),
  ...(tempo ? ['⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ' + tempo] : []),
  '📞 ' + (conectou ? 'Chamada finalizada.' : 'Não atendida.')
])
const cardUso = p => formatar('╭━━〔 🎧 *PLAYCALL* 〕━━╮', [
  '🎶 *Música por ligação*', '',
  '📲 *USAR NÚMERO*',
  p + 'playcall 5511999999999 vem cá', '',
  '👤 *OU MARCAR ALGUÉM*',
  p + 'playcall @pessoa vem cá', '',
  '🔗 Aceita link do YouTube.'
])

// Consome apenas o telefone inicial, preservando a música ou link integral.
const porNumero = entrada => {
  const texto = String(entrada || '').trim().replace(/^@(?=\+?\d)/, '')
  const tokens = texto.split(/\s+/)
  let resultado = null
  for (let n = 1; n < tokens.length && n <= 6; n++) {
    const candidato = tokens.slice(0, n).join(' ')
    if (!/^\+?[\d().\-\s]+$/.test(candidato)) break
    let numero = candidato.replace(/\D/g, '')
    if (!numero.startsWith('55') && [10, 11].includes(numero.length)) numero = '55' + numero
    if (numero.length >= 10 && numero.length <= 15) {
      resultado = { destino: numero + '@s.whatsapp.net', busca: tokens.slice(n).join(' ').trim() }
    }
  }
  return resultado?.busca ? resultado : null
}
const porMencao = (ctx, texto) => {
  const arr = [
    ...(Array.isArray(ctx.mentionedList) ? ctx.mentionedList : []),
    ...(Array.isArray(ctx.menc_jid2) ? ctx.menc_jid2 : []),
    ctx.menc_os2, ctx.menc_prt
  ]
  const raw = arr.find(x => typeof x === 'string' && x.endsWith('@s.whatsapp.net'))
  if (!raw) return null
  const destino = String(ctx.nJid ? ctx.nJid(raw) : raw)
  if (!/^\d+(?::\d+)?@s\.whatsapp\.net$/.test(destino)) return null
  const busca = String(texto || '').replace(/^@\S+\s*/, '').trim()
  return busca ? { destino, busca } : null
}

dylan.setCommand({
  nome: 'playcall',
  comandos: ['playcall'],
  categoria: 'downloads',
  info: {
    descricao: 'Liga para um número ou contato marcado e toca uma música na ligação.',
    uso: 'playcall 5511999999999 música | playcall @pessoa música',
    categoria: 'downloads', permissao: 'Dono'
  },
  async executar(ctx) {
    const { tokito, from, reply, prefix, sender } = ctx
    if (!ctx.SoDono) return reply(ctx.mess?.onlyOwner?.() || 'Apenas o dono pode iniciar ligações.')
    const pedido = porNumero(ctx.q) || porMencao(ctx, ctx.q)
    if (!pedido) return reply(cardUso(prefix))
    const { destino, busca } = pedido
    if (!digits(destino) || digits(destino) === digits(ctx.botNumber)) {
      return reply('❌ Informe o número de outra pessoa.')
    }
    const calls = tokito.calls
    if (!calls || typeof calls.enableVoip !== 'function' ||
      typeof calls.startCall !== 'function' || typeof calls.loadAudio !== 'function') {
      return reply('📞 Não foi possível iniciar a ligação agora.')
    }
    const sessao = String(tokito.user?.id || ctx.botNumber || 'bot')
    if (chamadas.has(sessao)) return reply('☎️ Já existe uma ligação PlayCall ativa.')
    chamadas.set(sessao, { fase: 'preparando', destino, origem: from, musica: busca })
    let mp3 = null, musica = null, callId = null
    let ouvindo = false, finalizado = false, conectado = false, carregando = false
    let inicio = null
    const ids = [destino, sender].filter(Boolean)
    const ctxMsg = para => typeof ctx.canalInfo === 'function'
      ? { ...ctx.canalInfo(para), mentionedJid: para }
      : { mentionedJid: para }
    // NÃO editar a mensagem antiga: cada etapa ganha um cartão de texto novo,
    // sempre citando o selo do bot e usando o canal configurado (igual Play).
    const enviar = (payload, para = ids) => tokito.sendMessage(from,
      { ...payload, contextInfo: ctxMsg(para) }, { quoted: ctx.selo })
    const aviso = async texto => {
      try { await enviar({ text: texto }) }
      catch (e) { console.warn('[PLAYCALL MENSAGEM]', String(e?.message || e).slice(0, 120)) }
    }
    const duracao = () => {
      if (!inicio) return ''
      const s = Math.max(0, Math.floor((Date.now() - inicio) / 1000))
      return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
    }
    const terminar = async () => {
      if (finalizado) return
      finalizado = true
      if (ouvindo) calls.off?.('state', observar)
      chamadas.delete(sessao)
      if (mp3) await fs.promises.rm(mp3.pasta, { recursive: true, force: true }).catch(() => {})
      await aviso(cardFim(destino, duracao(), conectado))
    }
    const tocar = async () => {
      if (!conectado || finalizado || carregando || !mp3 || !callId) return
      carregando = true
      await aviso(cardPreparando(destino))
      try {
        await calls.loadAudio(callId, mp3.arquivo)
        if (finalizado) return
        chamadas.set(sessao, { fase: 'musica-enviada', destino, origem: from, musica: musica.titulo, callId })
        await aviso(cardConectou(destino, musica))
      } catch (e) {
        if (!finalizado) {
          console.warn('[PLAYCALL ÁUDIO]', String(e?.message || e).slice(0, 130))
          chamadas.set(sessao, { fase: 'sem-audio', destino, origem: from, musica: musica.titulo, callId })
          await aviso(cardSemAudio(destino, musica))
        }
      } finally { carregando = false }
    }
    const observar = evento => {
      if (finalizado || !callId || String(evento?.callId || evento?.id || '') !== String(callId)) return
      const estado = String(evento?.stateData?.state || evento?.status || '').toLowerCase()
      if (estadosFinais.has(estado)) { void terminar(); return }
      if (!estadosAtivos.has(estado) || conectado) return
      conectado = true
      inicio = Date.now()
      // Chamada conectada só termina com o evento real do WhatsApp.
      void tocar()
    }
    try {
      const cap = await calls.enableVoip()
      if (!cap?.startCall || !cap?.audioFiles) throw new Error('Áudio indisponível')
      musica = await localizar(ctx, busca)
      mp3 = await prepararAudio(ctx, musica.url)
      if (musica.capa) {
        await enviar({ image: { url: musica.capa }, caption: cardMusica(musica, destino) })
          .catch(() => enviar({ text: cardMusica(musica, destino) }))
      } else await enviar({ text: cardMusica(musica, destino) })
      await aviso(cardChamando(destino, musica))
      calls.on('state', observar)
      ouvindo = true
      callId = await calls.startCall({ peerJid: destino, isVideo: false })
      chamadas.set(sessao, { fase: 'chamando', destino, origem: from, musica: musica.titulo, callId })
      const atual = calls.getCall(callId)
      if (atual) observar(atual)
    } catch(e) {
      if (!finalizado) {
        finalizado = true
        if (ouvindo) calls.off?.('state', observar)
        chamadas.delete(sessao)
        if (callId && !conectado) await calls.endCall(callId).catch(() => {})
        if (mp3) await fs.promises.rm(mp3.pasta, { recursive: true, force: true }).catch(() => {})
      }
      console.warn('[PLAYCALL FALHA]', String(e?.message || e).slice(0, 130))
      return reply(formatar('╭━━〔 ⚠️ *PLAYCALL* 〕━━╮', [
        'Não foi possível iniciar a ligação.',
        'Confira o número e tente novamente.'
      ]))
    }
  }
})
