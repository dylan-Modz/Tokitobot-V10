/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')
const midiaCitada = require('../../sistemas/midia-citada')

dylan.setCommand({
  nome: 's',
  comandos: ['s', 'sticker', 'figurinha', 'fig'],
  categoria: 'figurinhas',
  info: {
    descricao: 'Cria figurinha a partir de imagem ou vídeo.',
    uso: 's',
    categoria: 'figurinhas'
  },
  async executar(ctx) {
    const { fontes, referencia } = midiaCitada.preparar(ctx)
    const imagens = midiaCitada.candidatos(fontes, 'image')
    const videos = midiaCitada.candidatos(fontes, 'video')
    const dados = {
      packname: `🧊 ${ctx.NomeDoBot}`,
      author: ctx.pushname
    }

    if (!imagens.length && !videos.length) {
      return ctx.reply(ctx.mess.padraoUso({
        emoji: '🧊',
        titulo: 'FIGURINHA',
        uso: `${ctx.prefix}${ctx.command} respondendo uma imagem ou vídeo`,
        descricao: 'Marque uma imagem ou vídeo de até 9,9 segundos.'
      }))
    }

    const video = videos[0]
    if (!imagens.length && Number(video?.seconds || 0) >= 10) {
      return ctx.reply(ctx.mess.padraoUso({
        emoji: '🧊',
        titulo: 'FIGURINHA',
        uso: `${ctx.prefix}${ctx.command} respondendo um vídeo curto`,
        descricao: 'Vídeos precisam ter menos de 10 segundos.'
      }))
    }

    let arquivo
    try {
      if (imagens.length) {
        const buffer = await midiaCitada.baixar(ctx, 'image', imagens, referencia)
        arquivo = await ctx.sendImageAsSticker2(ctx.tokito, ctx.from, buffer, ctx.selo, dados)
      } else {
        const buffer = await midiaCitada.baixar(ctx, 'video', videos, referencia)
        arquivo = await ctx.sendVideoAsSticker2(ctx.tokito, ctx.from, buffer, ctx.selo, dados)
      }
      return true
    } catch (error) {
      console.warn('[STICKER]', error?.code || error?.message || 'falha')
      const descricao = error?.code === 'SEM_CHAVE'
        ? 'A mensagem chegou sem a chave de mídia. Não foi possível criar a figurinha.'
        : error?.code === 'SEM_CAMINHO'
        ? 'O WhatsApp não disponibilizou o arquivo da mensagem citada.'
        : 'Não foi possível baixar ou converter essa mídia em figurinha.'
      return ctx.reply(ctx.mess.padraoErro({ titulo: 'ERRO NA FIGURINHA', descricao }))
    } finally {
      if (arquivo) {
        try { await ctx.DLT_FL(arquivo) } catch {}
      }
    }
  }
})
