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

const jidContato = (ctx) => {
  const marcados = [
    ...(Array.isArray(ctx.mentionedList) ? ctx.mentionedList : []),
    ...(Array.isArray(ctx.menc_jid2) ? ctx.menc_jid2 : []),
    ...(Array.isArray(ctx.menc_os2) ? ctx.menc_os2 : []),
    ctx.menc_jid2,
    ctx.menc_os2,
    ctx.menc_prt
  ].filter(value => typeof value === 'string' ? Boolean(value) : Boolean(value && !Array.isArray(value) && typeof value === 'object'))
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

const ident = jid => String(jid || '').split('@')[0].replace(/\D/g, '')
const rotulo = nome => String(nome || '—').replace(/\s+/g, ' ').trim()
const tituloPlayCall = '• \`𝙿𝙻𝙰𝚈 𝙲𝙰𝙻𝙻\` 📞'
const textoEncerramento = (contato, duracao, motivo) => [
  tituloPlayCall,
  '> 📴 \`𝙲𝙷𝙰𝙼𝙰𝙳𝙰 𝙴𝙽𝙲𝙴𝚁𝚁𝙰𝙳𝙰\`',
  '',
  '> 👤 ᴄᴏɴᴛᴀᴛᴏ: @' + contato,
  ...(duracao ? ['> ⏱️ ᴛᴇᴍᴘᴏ: ' + duracao] : []),
  '> 📲 ᴇsᴛᴀᴅᴏ: ' + (motivo === 'nao-atendida' ? 'ɴᴀ̃ᴏ ᴀᴛᴇɴᴅɪᴅᴀ' : 'ғɪɴᴀʟɪᴢᴀᴅᴀ'),
  '',
  motivo === 'nao-atendida' ? '> ⚠️ O contato não atendeu a chamada.' : '> 🎧 Chamada finalizada.'
].join('\n')

dylan.setCommand({
  nome: 'playcall',
  comandos: ['playcall'],
  categoria: 'downloads',
  info: {
    descricao: 'Liga para o contato marcado e carrega uma música na chamada após conectar (VoIP experimental).',
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
      return reply([
        tituloPlayCall,
        '> ℹ️ \`𝙲𝙾𝙼𝙾 𝚄𝚂𝙰𝚁\`',
        '',
        '> 🎧 ' + prefix + 'playcall @pessoa nome da música',
        '> 🔗 ' + prefix + 'playcall @pessoa link-do-YouTube',
        '',
        '> 📞 Marque o contato e informe a música.'
      ].join('\n'))
    }
    if (destino === ctx.botNumber) return reply('❌ Não é possível ligar para a própria conta do bot.')
    const calls = tokito.calls
    if (!calls || typeof calls.enableVoip !== 'function' || typeof calls.startCall !== 'function' || typeof calls.loadAudio !== 'function') {
      return reply('📞 O motor de chamadas e música ainda não está disponível nesta instalação.')
    }
    const sessao = String(tokito.user?.id || ctx.botNumber || 'bot')
    if (chamadas.has(sessao)) return reply('📞 Já existe uma chamada PlayCall ativa. Encerre-a antes de iniciar outra.')
    chamadas.set(sessao, { fase: 'preparando', destino, origem: from, musica: entrada })

    let temporario = null
    let musica = null
    let callId = null
    let ouvindo = false
    let finalizado = false
    let conectado = false
    let carregando = false
    let audioCarregado = false
    let iniciadoEm = null
    let timerAtendimento = null
    let mensagemStatus = null

    const mencoes = [destino, sender].filter(Boolean)
    const canalInfo = (ids = mencoes) => typeof ctx.canalInfo === 'function'
      ? ctx.canalInfo(ids)
      : { mentionedJid: ids }
    // Mesmo formato do comando play: citação do selo e metadados do canal.
    const enviar = (conteudo, ids = mencoes) => tokito.sendMessage(from,
      { ...conteudo, contextInfo: { ...canalInfo(ids), ...(conteudo.contextInfo || {}), mentionedJid: ids } },
      { quoted: ctx.selo })
    const aviso = async texto => {
      if (finalizado) return
      if (mensagemStatus?.key) {
        try {
          await tokito.sendMessage(from, { text: texto, edit: mensagemStatus.key, contextInfo: canalInfo(mencoes) })
          return
        } catch {
          // Alguns clientes não aceitam edição: envia nova resposta citando o selo.
        }
      }
      try {
        const enviada = await enviar({ text: texto })
        if (!mensagemStatus?.key && enviada?.key) mensagemStatus = enviada
      } catch (erro) {
        console.warn('[PLAYCALL MENSAGEM]', String(erro?.message || erro).slice(0, 160))
      }
    }
    const apresentarStatus = (estado, audio) => [
      tituloPlayCall,
      '> ℹ️ \`𝙴𝚂𝚃𝙰𝙳𝙾 𝙳𝙰 𝙲𝙷𝙰𝙼𝙰𝙳𝙰\`',
      '',
      '> 👤 ᴅᴇsᴛɪɴᴏ: @' + ident(destino),
      '> 📲 sᴛᴀᴛᴜs: ' + estado,
      '> 🎼 ᴀ́ᴜᴅɪᴏ: ' + audio
    ].join('\n')
    const duracao = () => {
      if (!iniciadoEm) return ''
      const segundos = Math.max(0, Math.floor((Date.now() - iniciadoEm) / 1000))
      return String(Math.floor(segundos / 60)).padStart(2, '0') + ':' + String(segundos % 60).padStart(2, '0')
    }
    const encerrar = async motivo => {
      if (finalizado) return
      finalizado = true
      if (timerAtendimento) clearTimeout(timerAtendimento)
      if (ouvindo) calls.off?.('state', observar)
      chamadas.delete(sessao)
      // Somente chamada sem atendimento expira. Depois de conectar, o
      // encerramento depende do evento real da Stone/WhatsApp.
      if (callId && motivo === 'nao-atendida') await calls.endCall(callId).catch(() => {})
      if (temporario) await fs.promises.rm(temporario.pasta, { recursive: true, force: true }).catch(() => {})
      await enviar({ text: textoEncerramento(ident(destino), duracao(), motivo) }, [destino]).catch(() => {})
    }
    const carregarNaChamada = async () => {
      if (finalizado || !conectado || carregando || !callId || !temporario) return
      carregando = true
      chamadas.set(sessao, { fase: 'carregando-audio', destino, origem: from, musica: musica.titulo, callId })
      await aviso(apresentarStatus('ᴄᴏɴᴇᴄᴛᴀᴅᴏ ✅', 'ᴘʀᴇᴘᴀʀᴀɴᴅᴏ ᴏ sᴏᴍ...'))
      try {
        // Envia PCM somente depois que a pessoa atende e o motor recebe
        // o estado conectado. Não confundir startCall com transmissão.
        await calls.loadAudio(callId, temporario.arquivo)
        if (finalizado) return
        audioCarregado = true
        chamadas.set(sessao, { fase: 'audio-carregado', destino, origem: from, musica: musica.titulo, callId })
        await aviso([
          tituloPlayCall,
          '> ✅ \`𝙲𝙷𝙰𝙼𝙰𝙳𝙰 𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙳𝙰\`',
          '',
          '> 👤 ᴄᴏɴᴛᴀᴛᴏ: @' + ident(destino),
          '> 🎵 ᴍᴜ́sɪᴄᴀ: ' + rotulo(musica.titulo),
          '> 🎼 ᴀ́ᴜᴅɪᴏ: ᴄᴀʀʀᴇɢᴀᴅᴏ ɴᴏ ᴍᴏᴛᴏʀ',
          '',
          '> 🎧 A chamada continua até alguém desligar.'
        ].join('\n'))
      } catch (erro) {
        if (finalizado) return
        chamadas.set(sessao, { fase: 'erro-audio', destino, origem: from, musica: musica.titulo, callId })
        console.warn('[PLAYCALL ÁUDIO]', String(erro?.message || erro).slice(0, 200))
        await aviso([
          tituloPlayCall,
          '> ⚠️ \`𝙵𝙰𝙻𝙷𝙰 𝙽𝙾 𝙰́𝚄𝙳𝙸𝙾\`',
          '',
          '> 📞 ᴄʜᴀᴍᴀᴅᴀ: ᴄᴏɴᴇᴄᴛᴀᴅᴀ',
          '> 🎵 ᴍᴜ́sɪᴄᴀ: ' + rotulo(musica.titulo),
          '> 🔇 Não foi possível carregar o som no VoIP.',
          '> 📍 ' + String(erro?.message || erro).slice(0, 120),
          '',
          '> 📴 Desligue a chamada para encerrar.'
        ].join('\n'))
      } finally {
        carregando = false
      }
    }
    const observar = item => {
      if (finalizado || !callId || String(item?.callId || item?.id || '') !== String(callId)) return
      const estado = String(item?.stateData?.state || item?.status || '').toLowerCase()
      if (estadosFinais.has(estado)) {
        void encerrar('encerrada')
        return
      }
      if (!estadosAtivos.has(estado) || conectado) return
      conectado = true
      iniciadoEm = Date.now()
      if (timerAtendimento) clearTimeout(timerAtendimento)
      timerAtendimento = null
      // A chamada conectada não recebe temporizador de desligamento.
      void carregarNaChamada()
      void (async () => {
        const foto = await tokito.profilePictureUrl(destino, 'image').catch(() => '')
        if (foto && !finalizado) await enviar({
          image: { url: foto },
          caption: '> 👤 ᴄᴏɴᴛᴀᴛᴏ ᴄᴏɴᴇᴄᴛᴀᴅᴏ: @' + ident(destino)
        }, [destino]).catch(() => {})
      })()
    }

    try {
      const cap = await calls.enableVoip()
      if (!cap?.startCall || !cap?.audioFiles) throw new Error('Motor VoIP ou FFmpeg não disponível nesta instalação.')
      musica = await localizar(ctx, entrada)
      temporario = await prepararAudio(ctx, musica.url)
      const descricao = [
        '• \`𝙼𝚄́𝚂𝙸𝙲𝙰 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰\` 🎧',
        '> ℹ️ \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂\`',
        '',
        '> ✏️ ᴛɪ́ᴛᴜʟᴏ: ' + rotulo(musica.titulo),
        '> ⏱️ ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ: ' + rotulo(musica.duracao),
        '> 👨‍🎤 ᴀᴜᴛᴏʀ: ' + rotulo(musica.artista),
        '> 🔗 ʟɪɴᴋ: ' + musica.url,
        '',
        '• \`𝙿𝙻𝙰𝚈 𝙲𝙰𝙻𝙻\` 📞',
        '> 👤 ᴅᴇsᴛɪɴᴏ: @' + ident(destino),
        '> 📲 sᴛᴀᴛᴜs: ᴄʜᴀᴍᴀɴᴅᴏ...',
        '> 🎼 ᴀ́ᴜᴅɪᴏ: ᴘʀᴏɴᴛᴏ ᴘᴀʀᴀ ᴇɴᴠɪᴏ'
      ].join('\n')
      if (musica.capa) {
        await enviar({ image: { url: musica.capa }, caption: descricao })
          .catch(() => enviar({ text: descricao }))
      } else await enviar({ text: descricao })
      await aviso(apresentarStatus('ᴄʜᴀᴍᴀɴᴅᴏ...', 'ᴀɢᴜᴀʀᴅᴀɴᴅᴏ ᴄᴏɴᴇxᴀ̃ᴏ'))
      calls.on('state', observar)
      ouvindo = true
      callId = await calls.startCall({ peerJid: destino, isVideo: false })
      chamadas.set(sessao, { fase: 'chamando', destino, origem: from, musica: musica.titulo, callId })
      // Evita chamada não atendida presa. Não se aplica após conectar.
      timerAtendimento = setTimeout(() => {
        if (!conectado) void encerrar('nao-atendida')
      }, 90000)
      timerAtendimento.unref?.()
      const atual = calls.getCall(callId)
      if (atual) observar(atual)
    } catch (erro) {
      const texto = String(erro?.message || erro || 'Erro desconhecido').slice(0, 200)
      if (!finalizado) {
        finalizado = true
        if (timerAtendimento) clearTimeout(timerAtendimento)
        if (ouvindo) calls.off?.('state', observar)
        chamadas.delete(sessao)
        if (callId && !conectado) await calls.endCall(callId).catch(() => {})
        if (temporario) await fs.promises.rm(temporario.pasta, { recursive: true, force: true }).catch(() => {})
      }
      await reply([
        tituloPlayCall,
        '> ❌ \`𝙽𝙰̃𝙾 𝙵𝙾𝙸 𝙿𝙾𝚂𝚂𝙸́𝚅𝙴𝙻 𝙸𝙽𝙸𝙲𝙸𝙰𝚁\`',
        '',
        '> ⚠️ ' + texto
      ].join('\n'))
    }
  }
})
