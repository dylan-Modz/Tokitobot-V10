/*
 * TOKITO BOT V10 — PlayCall
 * Busca música como o Play, prepara áudio e envia depois do atendimento.
 * Exibe somente números telefônicos reais; nunca apresenta LID como telefone.
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
const estadosFinais = new Set(['ended', 'terminate', 'terminated', 'rejected', 'reject', 'declined', 'timeout'])

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
const numeroPN = valor => {
  if (typeof valor !== 'string') return ''
  const entrada = valor.trim().replace(/:\d+(?=@)/, '')
  if (!entrada || /@(?:lid|hosted\.lid|g\.us)$/i.test(entrada)) return ''
  if (entrada.includes('@') && !/@(?:s\.whatsapp\.net|c\.us)$/i.test(entrada)) return ''
  if (!/^\+?[\d\s().-]+(?:@(?:s\.whatsapp\.net|c\.us))?$/i.test(entrada)) return ''
  const numero = digits(entrada)
  return /^\d{10,15}$/.test(numero) ? numero : ''
}
const telefone = numero => numero ? '+' + numero : 'Número indisponível'
const limpo = x => String(x || '—').replace(/\s+/g, ' ').trim()
const etiqueta = valor => String.fromCharCode(96) + valor + String.fromCharCode(96)
const montar = (titulo, emoji, linhas) => [
  '• ' + etiqueta(titulo) + ' ' + emoji, '',
  ...linhas.filter(Boolean).map(linha => '> ' + linha),
  '', '> 🧊 ᴛᴏᴋɪᴛᴏ ʙᴏᴛ ᴠ10'
].join('\n')
const cardMusica = (m, numero) => montar('𝙼𝚄́𝚂𝙸𝙲𝙰 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰', '🎧', [
  '🎵 ᴛɪ́ᴛᴜʟᴏ: *' + limpo(m.titulo) + '*',
  '🎤 ᴀᴜᴛᴏʀ: ' + limpo(m.artista),
  '⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ' + limpo(m.duracao),
  '🔗 ʟɪɴᴋ: ' + m.url,
  '',
  '📞 ᴄʜᴀᴍᴀᴅᴀ: ' + telefone(numero),
  '🟡 ᴇsᴛᴀᴅᴏ: Preparando a ligação'
])
const cardChamando = (numero, m) => montar('𝙲𝙷𝙰𝙼𝙰𝙽𝙳𝙾', '📞', [
  '🟡 ᴇsᴛᴀᴅᴏ: Chamando...',
  '📱 ᴛᴇʟᴇғᴏɴᴇ: ' + telefone(numero),
  '🎵 ᴍᴜ́sɪᴄᴀ: ' + limpo(m.titulo),
  '💬 Aguardando a pessoa atender.'
])
const cardPreparando = numero => montar('𝙲𝙷𝙰𝙼𝙰𝙳𝙰 𝙰𝚃𝙴𝙽𝙳𝙸𝙳𝙰', '✅', [
  '📱 ᴛᴇʟᴇғᴏɴᴇ: ' + telefone(numero),
  '🎶 Preparando a música para a ligação...'
])
const cardConectou = (numero, m) => montar('𝙼𝚄́𝚂𝙸𝙲𝙰 𝙽𝙰 𝙲𝙷𝙰𝙼𝙰𝙳𝙰', '🎧', [
  '✅ ᴇsᴛᴀᴅᴏ: Ligação atendida',
  '📱 ᴛᴇʟᴇғᴏɴᴇ: ' + telefone(numero),
  '🎵 ᴍᴜ́sɪᴄᴀ: *' + limpo(m.titulo) + '*',
  '▶️ Reprodução iniciada.',
  '📞 A ligação continua até ser desligada.'
])
const cardSemAudio = (numero, m) => montar('𝙼𝚄́𝚂𝙸𝙲𝙰 𝙸𝙽𝙳𝙸𝚂𝙿𝙾𝙽𝙸́𝚅𝙴𝙻', '⚠️', [
  '📱 ᴛᴇʟᴇғᴏɴᴇ: ' + telefone(numero),
  '🎵 ᴍᴜ́sɪᴄᴀ: ' + limpo(m.titulo),
  '🔇 Não foi possível tocar a música.',
  '📞 A ligação permanece aberta.'
])
const cardFim = (numero, tempo, conectou) => montar('𝙲𝙷𝙰𝙼𝙰𝙳𝙰 𝙴𝙽𝙲𝙴𝚁𝚁𝙰𝙳𝙰', '📴', [
  '📱 ᴛᴇʟᴇғᴏɴᴇ: ' + telefone(numero),
  ...(tempo ? ['⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ' + tempo] : []),
  '📞 ᴇsᴛᴀᴅᴏ: ' + (conectou ? 'Ligação finalizada.' : 'Não atendida.')
])
const cardUso = p => montar('𝙿𝙻𝙰𝚈𝙲𝙰𝙻𝙻', '🎧', [
  '📞 Ligue para alguém e toque uma música.',
  '',
  '📱 ᴘᴏʀ ɴᴜ́ᴍᴇʀᴏ:',
  p + 'playcall 5511999999999 vem cá',
  '',
  '👤 ᴘᴏʀ ᴍᴇɴᴄ̧ᴀ̃ᴏ:',
  p + 'playcall @pessoa vem cá',
  '🔗 Também aceita link do YouTube.'
])
const cardSemNumero = p => montar('𝙿𝙻𝙰𝚈𝙲𝙰𝙻𝙻', '⚠️', [
  'Não consegui identificar o telefone dessa pessoa.',
  '📱 Digite o número real com DDI e DDD:',
  p + 'playcall 5511999999999 nome da música'
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

const lidNormalizado = jid => String(jid || '').trim().replace(/:\d+(?=@)/, '')
const porMencao = async (ctx, texto) => {
  const contexto = ctx.ctxMsg || {}
  const origem = [
    ...(Array.isArray(contexto.mentionedJid) ? contexto.mentionedJid : []),
    ...(Array.isArray(ctx.mentionedList) ? ctx.mentionedList : []),
    ...(Array.isArray(ctx.mentions) ? ctx.mentions : []),
    ...(Array.isArray(ctx.menc_jid2) ? ctx.menc_jid2 : []),
    ctx.menc_os2, ctx.menc_prt
  ]
  const marcado = origem.find(jid => typeof jid === 'string' &&
    /@(?:lid|hosted\.lid|s\.whatsapp\.net|c\.us)$/i.test(jid))
  if (!marcado) return null
  const busca = String(texto || '').replace(/^@\S+\s*/, '').trim()
  if (!busca) return null

  let numero = ''
  const lid = /@(?:lid|hosted\.lid)$/i.test(marcado) ? lidNormalizado(marcado) : ''
  if (lid) {
    const membros = Array.isArray(ctx.groupMembers) ? ctx.groupMembers : []
    const membro = membros.find(item => [
      item?.lid, item?.id, item?.jid, item?.participant
    ].some(valor => lidNormalizado(valor) === lid))
    const candidatos = [
      membro?.phoneNumber, membro?.participantPn, membro?.participantAlt,
      membro?.jid, membro?.id
    ]
    for (const valor of candidatos) {
      numero = numeroPN(valor)
      if (numero) break
    }
    if (!numero && typeof ctx.tokito?.signalRepository?.lidMapping?.getPNForLID === 'function') {
      try {
        const pn = await ctx.tokito.signalRepository.lidMapping.getPNForLID(lid)
        numero = numeroPN(pn)
      } catch {}
    }
  } else {
    numero = numeroPN(marcado)
  }
  // Não inventar telefone nem converter dígitos de @lid em número.
  return numero ? { destino: numero + '@s.whatsapp.net', numero, busca } : null
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
    const pedido = porNumero(ctx.q) || await porMencao(ctx, ctx.q)
    if (!pedido) return reply(String(ctx.q || '').trim().startsWith('@') ? cardSemNumero(prefix) : cardUso(prefix))
    const { destino, busca } = pedido
    const numero = numeroPN(destino)
    if (!numero) return reply(cardSemNumero(prefix))
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
    const ids = [destino, ...(numeroPN(sender) ? [sender] : [])]
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
      await aviso(cardFim(numero, duracao(), conectado))
    }
    const tocar = async () => {
      if (!conectado || finalizado || carregando || !mp3 || !callId) return
      carregando = true
      await aviso(cardPreparando(numero))
      try {
        await calls.loadAudio(callId, mp3.arquivo)
        if (finalizado) return
        chamadas.set(sessao, { fase: 'musica-enviada', destino, origem: from, musica: musica.titulo, callId })
        await aviso(cardConectou(numero, musica))
      } catch (e) {
        if (!finalizado) {
          console.warn('[PLAYCALL ÁUDIO]', String(e?.message || e).slice(0, 130))
          chamadas.set(sessao, { fase: 'sem-audio', destino, origem: from, musica: musica.titulo, callId })
          await aviso(cardSemAudio(numero, musica))
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
        await enviar({ image: { url: musica.capa }, caption: cardMusica(musica, numero) })
          .catch(() => enviar({ text: cardMusica(musica, destino) }))
      } else await enviar({ text: cardMusica(musica, destino) })
      calls.on('state', observar)
      ouvindo = true
      callId = await calls.startCall({ peerJid: destino, isVideo: false })
      chamadas.set(sessao, { fase: 'chamando', destino, origem: from, musica: musica.titulo, callId })
      const atual = calls.getCall(callId)
      if (atual) observar(atual)
      if (!conectado && !finalizado) await aviso(cardChamando(numero, musica))
    } catch(e) {
      if (!finalizado) {
        finalizado = true
        if (ouvindo) calls.off?.('state', observar)
        chamadas.delete(sessao)
        if (callId && !conectado) await calls.endCall(callId).catch(() => {})
        if (mp3) await fs.promises.rm(mp3.pasta, { recursive: true, force: true }).catch(() => {})
      }
      console.warn('[PLAYCALL FALHA]', String(e?.message || e).slice(0, 130))
      return reply(montar('𝙿𝙻𝙰𝚈𝙲𝙰𝙻𝙻', '⚠️', [
        'Não foi possível iniciar a ligação.',
        '📱 Confira o número e tente novamente.'
      ]))
    }
  }
})
