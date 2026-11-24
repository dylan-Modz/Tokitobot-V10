/*
 * TOKITO BOT V10 — figurinha com áudio, vídeo e busca musical.
 * Mantém o registro antigo e usa os mesmos conversores WebP do comando /s.
 * Author: Dylan Modz
 */
'use strict'

const dylan = require('../../database/lib/comandos')
const sistema = require('../../sistemas/sticker-audio')
const midia = require('../../sistemas/midia-citada')

const aviso = (ctx, titulo, descricao) =>
  ctx.reply(ctx.mess.padraoAviso({ emoji: '🎭', titulo, descricao }))
const sucesso = (ctx, titulo, descricao, detalhe = '') =>
  ctx.reply(ctx.mess.padraoSucesso({ emoji: '🎭', titulo, descricao, detalhe }))
const erro = (ctx, titulo, descricao) =>
  ctx.reply(ctx.mess.padraoErro({ titulo, descricao }))

const instrucoes = ctx => ctx.reply(ctx.mess.padraoUso({
  emoji: '🎭', titulo: 'FIGURINHA COM ÁUDIO',
  uso: ctx.prefix + 'figaudio',
  exemplos: [
    ctx.prefix + 'figaudio respondendo um áudio',
    ctx.prefix + 'figaudio respondendo um vídeo de até 9,9 segundos',
    ctx.prefix + 'figaudio respondendo uma imagem com um áudio citado',
    ctx.prefix + 'figaudio nome da música',
    ctx.prefix + 'figaudio link do YouTube'
  ],
  descricao: 'Para usar uma imagem ou figurinha específica com uma música, responda à mídia com o nome ou o link. Sem mídia marcada, usa a figurinha registrada.'
}))

dylan.setCommand({
  nome: 'figaudio',
  comandos: ['figaudio', 'rgfigaudio', 'verfigaudio', 'delfigaudio'],
  categoria: 'figurinhas',
  info: {
    descricao: 'Envia figurinha registrada, imagem ou vídeo curto com áudio; permite buscar música por nome ou link do YouTube.',
    uso: 'figaudio | figaudio nome da música | figaudio link do YouTube | rgfigaudio | verfigaudio | delfigaudio',
    permissao: 'Livre (registro e exclusão exclusivos do dono)'
  },
  async executar(ctx) {
    const comando = String(ctx.command || '').toLowerCase()
    if (['rgfigaudio', 'delfigaudio'].includes(comando) && ctx.SoDono !== true) {
      return ctx.reply(ctx.mess.onlyOwner())
    }
    try {
      if (comando === 'rgfigaudio') {
        if (!sistema.stickerAtual(ctx)) return ctx.reply(ctx.mess.padraoUso({
          emoji: '🎭', titulo: 'REGISTRAR FIGURINHA COM ÁUDIO',
          uso: ctx.prefix + 'rgfigaudio',
          descricao: 'Responda à figurinha que deseja registrar.'
        }))
        await sistema.registrar(ctx)
        return sucesso(ctx, 'FIGURINHA REGISTRADA',
          'Figurinha salva para os envios com áudio.',
          'Responda a um áudio com ' + ctx.prefix + 'figaudio.')
      }
      if (comando === 'delfigaudio') {
        if (!sistema.remover()) return aviso(ctx, 'FIGURINHA NÃO REGISTRADA',
          'Use ' + ctx.prefix + 'rgfigaudio para registrar.')
        return sucesso(ctx, 'FIGURINHA REMOVIDA', 'A figurinha registrada foi removida.')
      }
      if (comando === 'verfigaudio') {
        if (!sistema.registrada()) return aviso(ctx, 'FIGURINHA NÃO REGISTRADA',
          'Use ' + ctx.prefix + 'rgfigaudio para registrar.')
        await sistema.visualizar(ctx)
        return true
      }

      const { fontes, referencia, contexto } = midia.preparar(ctx)
      // Se a mensagem atual tiver imagem e citar um áudio, ambos são preservados.
      // No caso de vídeo curto a trilha é extraída do próprio vídeo.
      const imagens = midia.candidatos(fontes, 'image')
      const videos = midia.candidatos(fontes, 'video')
      const stickers = midia.candidatos(fontes, 'sticker')
      const audios = midia.candidatos(fontes, 'audio')
      const pesquisa = String(ctx.q || '').trim()
      const midiaCitadaOuAtual = Boolean(
        midia.extrair(contexto?.quotedMessage, 'image') ||
        midia.extrair(contexto?.quotedMessage, 'video') ||
        midia.extrair(contexto?.quotedMessage, 'sticker') ||
        midia.extrair(ctx.mensagem, 'image') ||
        midia.extrair(ctx.mensagem, 'video') ||
        midia.extrair(ctx.mensagem, 'sticker')
      )
      let dados = null
      let modo = ''

      if (pesquisa) {
        // Se houver mídia visual marcada, usa ela; caso contrário, usa a registrada.
        // A pesquisa é limitada a uma única música (até 30 s).
        if (videos.length && midiaCitadaOuAtual) {
          return aviso(ctx, 'USE IMAGEM OU FIGURINHA',
            'Para música pesquisada, marque uma imagem ou figurinha. Para vídeo, use ' + ctx.prefix + 'figaudio sem pesquisa.')
        }
        const som = await sistema.baixarMusica(ctx, pesquisa)
        if (stickers.length && midiaCitadaOuAtual) {
          dados = { ...(await sistema.prepararFigurinha(ctx, stickers, referencia)), som }
        } else if (imagens.length && midiaCitadaOuAtual) {
          dados = { ...(await sistema.prepararImagem(ctx, imagens, referencia)), som }
        } else {
          dados = sistema.usarRegistrada(som)
        }
        modo = 'MÚSICA'
      } else if (videos.length && midiaCitadaOuAtual) {
        dados = await sistema.prepararVideo(ctx, videos, referencia)
        modo = 'VÍDEO'
      } else if (imagens.length && audios.length && midiaCitadaOuAtual) {
        const imagem = await sistema.prepararImagem(ctx, imagens, referencia)
        const som = await sistema.normalizarAudio(ctx, audios[0])
        dados = { ...imagem, som }
        modo = 'IMAGEM'
      } else if (stickers.length && audios.length && midiaCitadaOuAtual) {
        const sticker = await sistema.prepararFigurinha(ctx, stickers, referencia)
        const som = await sistema.normalizarAudio(ctx, audios[0])
        dados = { ...sticker, som }
        modo = 'FIGURINHA'
      } else if (audios.length) {
        const som = await sistema.normalizarAudio(ctx, audios[0])
        dados = sistema.usarRegistrada(som)
        modo = 'ÁUDIO'
      } else {
        return instrucoes(ctx)
      }

      await sistema.enviarPersonalizada(ctx, dados)
      if (typeof ctx.reagir === 'function') {
        await ctx.reagir(ctx.from, '✅').catch(() => {})
      }
      const detalhes = {
        'MÚSICA': 'Trecho de até 30 segundos preparado.',
        'VÍDEO': 'Figurinha animada gerada com o som original.',
        'IMAGEM': 'Imagem convertida em figurinha com som.',
        'FIGURINHA': 'Figurinha marcada enviada com áudio.',
        'ÁUDIO': 'Figurinha registrada enviada com áudio.'
      }
      return sucesso(ctx, 'FIGURINHA COM ÁUDIO ENVIADA',
        'Envio concluído.', detalhes[modo] || 'Mídia preparada e enviada.')
    } catch (e) {
      console.warn('[FIGAUDIO]', e?.code || e?.message || e)
      return erro(ctx, 'FALHA NA FIGURINHA COM ÁUDIO',
        String(e?.message || 'Não foi possível concluir a operação.'))
    }
  }
})
