/*
 * TOKITO BOT V10 — PlayCall
 * Usa a mesma busca do Play e somente inicia áudio após confirmação de chamada conectada.
 * VoIP experimental: nunca apresenta sinalização como áudio transmitido.
 */
'use strict'

const dylan = require('../../database/lib/comandos')
const axios = require('axios')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { pipeline } = require('node:stream/promises')

const chamadas = global.__TOKITO_PLAYCALL_ATIVAS__ ||= new Map()
const estadosAtivos = new Set(['connected', 'established', 'in_call', 'active', 'media_connected'])
const estadosFinais = new Set(['ended', 'terminate', 'terminated', 'rejected', 'reject', 'declined', 'timeout', 'failed', 'disconnected', 'error'])

const jidContato = (ctx) => {
  const marcados = [
    ...(Array.isArray(ctx.mentionedList) ? ctx.mentionedList : []),
    ...(Array.isArray(ctx.menc_jid2) ? ctx.menc_jid2 : []),
    ...(Array.isArray(ctx.menc_os2) ? ctx.menc_os2 : []),
    ctx.menc_prt
  ].filter(Boolean)
  const primeiro = marcados[0]
  if (!primeiro) return ''
  const jid = String(ctx.nJid ? ctx.nJid(primeiro) : primeiro)
  return jid.endsWith('@s.whatsapp.net') ? jid : ''
}

const pesquisaEntrada = (q) => String(q || '').trim()
  .replace(/^\s*@[\d]+\s*/, '')
  .trim()

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
    return { pasta, arquivo }
  } catch (erro) {
    await fs.promises.rm(pasta, { recursive: true, force: true }).catch(() => {})
    throw erro
  }
}

const ident = jid => String(jid || '').split('@')[0].replace(/\D/g, '')

dylan.setCommand({
  nome: 'playcall',
  comandos: ['playcall'],
  categoria: 'downloads',
  info: {
    descricao: 'Liga para o contato marcado e toca uma música após a chamada conectar (VoIP experimental).',
    uso: 'playcall @pessoa nome da música | playcall @pessoa link do YouTube',
    categoria: 'downloads',
    permissao: 'Dono'
  },
  async executar(ctx) {
    const { tokito, from, reply, prefix, q, sender } = ctx
    if (!ctx.SoDono) return reply(ctx.mess?.onlyOwner?.() || 'Apenas o dono pode iniciar ligações.')
    const destino = jidContato(ctx)
    const entrada = pesquisaEntrada(q)
    if (!destino || !entrada) {
      return reply('🎧 *PLAYCALL*\n> Uso: ' + prefix + 'playcall @pessoa nome da música\n> Ou: ' + prefix + 'playcall @pessoa link-do-YouTube')
    }
    if (destino === ctx.botNumber) return reply('Não é possível ligar para a própria conta do bot.')
    const calls = tokito.calls
    if (!calls || typeof calls.enableVoip !== 'function' || typeof calls.startCall !== 'function') {
      return reply('📞 A Stone instalada ainda não disponibiliza o motor VoIP.')
    }
    const sessao = String(tokito.user?.id || ctx.botNumber || 'bot')
    if (chamadas.has(sessao)) return reply('📞 Já existe uma chamada PlayCall ativa neste bot. Aguarde encerrar.')
    chamadas.set(sessao, { fase: 'preparando', destino, origem: from, musica: entrada })

    let temporario = null
    let callId = null
    let ouvindo = false
    let finalizado = false
    let tocando = false
    let timer = null
    let timerFim = null
    let mensagemStatus = null
    let musica = null

    const aviso = async descricao => {
      if (finalizado) return
      try {
        const atualizado = mensagemStatus?.key
          ? await tokito.sendMessage(from, { text: descricao, edit: mensagemStatus.key })
          : await tokito.sendMessage(from, { text: descricao, contextInfo: { mentionedJid: [destino, sender] } }, { quoted: ctx.selo })
        if (!mensagemStatus) mensagemStatus = atualizado
      } catch {
        await tokito.sendMessage(from, { text: descricao, contextInfo: { mentionedJid: [destino] } }).catch(() => {})
      }
    }
    const encerrar = async motivo => {
      if (finalizado) return
      finalizado = true
      if (timer) clearTimeout(timer)
      if (timerFim) clearTimeout(timerFim)
      if (ouvindo) calls.off?.('state', observar)
      chamadas.delete(sessao)
      if (callId && motivo === 'tempo') await calls.endCall(callId).catch(() => {})
      if (temporario) await fs.promises.rm(temporario.pasta, { recursive: true, force: true }).catch(() => {})
      const descricao = motivo === 'tempo' ? '⏰ Chamada não atendida ou conexão de áudio não confirmada.'
        : motivo === 'falha' ? '❌ A ligação foi interrompida.'
        : '📵 Chamada encerrada.'
      await tokito.sendMessage(from, { text: '🎧 *PLAYCALL*\n> 👤 @' + ident(destino) + '\n> ' + descricao,
        contextInfo: { mentionedJid: [destino] } }).catch(() => {})
    }
    const observar = item => {
      if (finalizado || !callId || String(item?.callId || item?.id || '') !== String(callId)) return
      const estado = String(item?.stateData?.state || item?.status || '').toLowerCase()
      if (estadosFinais.has(estado)) {
        void encerrar('encerrada')
        return
      }
      if (!estadosAtivos.has(estado) || tocando) return
      tocando = true
      void (async () => {
        try {
          if (timer) clearTimeout(timer)
          await calls.loadAudio(callId, temporario.arquivo)
          chamadas.set(sessao, { fase: 'transmitindo', destino, origem: from, musica: musica.titulo, callId })
          await aviso('🎧 *𝙿𝙻𝙰𝚈 𝙲𝙰𝙻𝙻*\n> ✅ @' + ident(destino) + ' conectou à chamada!\n> 🎵 ' + musica.titulo + '\n> 🔊 Reprodução entregue ao motor VoIP experimental.')
          const avatar = await tokito.profilePictureUrl(destino, 'image').catch(() => '')
          if (avatar) await tokito.sendMessage(from, {
            image: { url: avatar }, caption: '👤 Contato conectado: @' + ident(destino),
            contextInfo: { mentionedJid: [destino] }
          }).catch(() => {})
        } catch (e) {
          await aviso('⚠️ Chamada conectada, mas não foi possível carregar o áudio: ' + String(e?.message || e).slice(0, 160))
          await encerrar('falha')
        }
      })()
    }

    try {
      const cap = await calls.enableVoip()
      if (!cap?.startCall || !cap?.audioFiles) throw new Error('Motor VoIP ou arquivos de áudio não disponíveis nesta instalação. Verifique FFmpeg e codecs.')
      musica = await localizar(ctx, entrada)
      temporario = await prepararAudio(ctx, musica.url)
      chamadas.set(sessao, { fase: 'chamando', destino, origem: from, musica: musica.titulo })
      const texto = '• *𝙼𝚄́𝚂𝙸𝙲𝙰 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰* 🎧\n' +
        '> 🎵 ᴛɪ́ᴛᴜʟᴏ: ' + musica.titulo + '\n' +
        '> 👨‍🎤 ᴀᴜᴛᴏʀ: ' + musica.artista + '\n' +
        '> ⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ' + musica.duracao + '\n' +
        '> 👤 ᴅᴇsᴛɪɴᴏ: @' + ident(destino) + '\n' +
        '> 📞 ᴇsᴛᴀᴅᴏ: ᴄʜᴀᴍᴀɴᴅᴏ...'
      if (musica.capa) {
        await tokito.sendMessage(from, { image: { url: musica.capa }, caption: texto,
          contextInfo: { mentionedJid: [destino] } }, { quoted: ctx.selo })
          .catch(() => tokito.sendMessage(from, { text: texto, contextInfo: { mentionedJid: [destino] } }))
      } else {
        await tokito.sendMessage(from, { text: texto, contextInfo: { mentionedJid: [destino] } })
      }
      await aviso('📞 *𝙿𝙻𝙰𝚈 𝙲𝙰𝙻𝙻*\n> Aguardando @' + ident(destino) + ' atender...\n> A música só será iniciada após a conexão confirmada.')
      calls.on('state', observar)
      ouvindo = true
      callId = await calls.startCall({ peerJid: destino, isVideo: false })
      chamadas.set(sessao, { fase: 'chamando', destino, origem: from, musica: musica.titulo, callId })
      timer = setTimeout(() => { if (!tocando) void encerrar('tempo') }, 60000)
      timer.unref?.()
      timerFim = setTimeout(() => { void encerrar('tempo') }, 12 * 60 * 1000)
      timerFim.unref?.()
      const atual = calls.getCall(callId)
      if (atual) observar(atual)
    } catch (erro) {
      const texto = String(erro?.message || erro || 'Erro desconhecido').slice(0, 220)
      if (!finalizado) {
        if (timer) clearTimeout(timer)
        if (timerFim) clearTimeout(timerFim)
        if (ouvindo) calls.off?.('state', observar)
        chamadas.delete(sessao)
        finalizado = true
        if (temporario) await fs.promises.rm(temporario.pasta, { recursive: true, force: true }).catch(() => {})
      }
      await reply('❌ *PLAYCALL INDISPONÍVEL*\n> ' + texto + '\n> O VoIP da Stone 1.0.7 ainda é experimental.')
    }
  }
})
