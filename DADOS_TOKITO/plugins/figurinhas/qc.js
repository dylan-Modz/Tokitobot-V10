/*
 * TOKITO BOT V10 — QC
 * Transforma a arte /canvas/qc em figurinha com avatar e nome.
 */
'use strict'

const axios = require('axios')
const dylan = require('../../database/lib/comandos')

const limparTexto = value => String(value || '').trim().replace(/\s+/g, ' ')
const jidLimpo = jid => String(jid || '').split('@')[0].split(':')[0]

async function nomeUsuario(ctx, jid) {
  if (!jid || jid === ctx.sender) return limparTexto(ctx.pushname) || 'Usuário'

  const lista = ctx.groupMembers || ctx.groupMetadata?.participants || []
  const alvo = Array.isArray(lista) ? lista.find(p => {
    const id = String(p?.id || p?.jid || '')
    return id === jid || id.split('@')[0] === jid.split('@')[0]
  }) : null
  const conhecido = limparTexto(alvo?.notify || alvo?.name || alvo?.pushName)
  if (conhecido) return conhecido

  if (typeof ctx.tokito?.getName === 'function') {
    try {
      const nome = limparTexto(await ctx.tokito.getName(jid))
      if (nome && nome !== jid) return nome
    } catch {}
  }
  return jidLimpo(jid) || 'Usuário'
}

async function buscarImagem(ctx, nick, texto, avatar) {
  const base = String(ctx.API_URL || '').replace(/\/+$/, '')
  const resposta = await axios.get(base + '/canvas/qc', {
    params: {
      nick: nick.slice(0, 50),
      texto: texto.slice(0, 220),
      ...(avatar ? { avatar } : {}),
      apikey: ctx.API_KEY_TOKITO
    },
    responseType: 'arraybuffer',
    timeout: 45000,
    maxContentLength: 8 * 1024 * 1024,
    validateStatus: () => true,
    headers: { Accept: 'image/png', 'User-Agent': 'TokitoBot-QC/10' }
  })
  const bytes = Buffer.from(resposta.data || [])
  const png = bytes.length > 8 &&
    bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
  return {
    status: Number(resposta.status || 0),
    imagem: png ? bytes : null
  }
}

dylan.setCommand({
  nome: 'qc',
  comandos: ['qc'],
  categoria: 'figurinhas',
  info: {
    descricao: 'Cria figurinha QC com texto, avatar e nome do usuário.',
    uso: 'qc texto',
    categoria: 'figurinhas'
  },
  async executar(ctx) {
    const texto = limparTexto(ctx.q).replace(/@\d{5,20}(?=\s|$)/g, '').trim()
    if (!texto) {
      return ctx.reply(ctx.mess.padraoUso({
        emoji: '🧊',
        titulo: 'FIGURINHA QC',
        uso: `${ctx.prefix}qc sua mensagem`,
        descricao: 'Digite sua mensagem. Você também pode marcar ou responder alguém.'
      }))
    }
    if (Array.from(texto).length > 220) {
      return ctx.reply(ctx.mess.padraoAviso({
        emoji: '🧊',
        titulo: 'FIGURINHA QC',
        descricao: 'A mensagem deve ter no máximo 220 caracteres.'
      }))
    }

    const alvo = ctx.menc_jid2?.[0] || ctx.quotedParticipant || ctx.sender
    const nick = (await nomeUsuario(ctx, alvo)).slice(0, 50)
    let avatar = ''
    try {
      const foto = await ctx.tokito.profilePictureUrl(alvo, 'image')
      if (typeof foto === 'string' && /^https:\/\//i.test(foto)) avatar = foto
    } catch {}

    try {
      let resultado = await buscarImagem(ctx, nick, texto, avatar)
      // Foto privada ou indisponível? A imagem QC usa o avatar padrão.
      if (resultado.status === 422 && avatar) {
        resultado = await buscarImagem(ctx, nick, texto, '')
      }
      if (resultado.status !== 200 || !resultado.imagem) {
        throw new Error('QC_IMAGE_' + (resultado.status || 'INVALID'))
      }
      const arquivo = await ctx.sendImageAsSticker2(
        ctx.tokito,
        ctx.from,
        resultado.imagem,
        ctx.selo,
        { packname: `🧊 ${ctx.NomeDoBot}`, author: ctx.pushname || 'Tokito' }
      )
      if (arquivo) {
        try { await ctx.DLT_FL(arquivo) } catch {}
      }
      return true
    } catch (e) {
      console.warn('[QC]', e?.code || e?.message?.slice(0, 90) || 'falha')
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'ERRO NO QC',
        descricao: 'Não consegui gerar a figurinha agora. Confira sua chave da Tokito APIs e tente novamente.'
      }))
    }
  }
})
