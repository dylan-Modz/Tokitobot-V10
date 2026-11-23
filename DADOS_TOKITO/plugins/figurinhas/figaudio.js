/*
 * TOKITO BOT V10 — registrar, visualizar e enviar figurinha com áudio
 * Author: Dylan Modz
 */
'use strict'

const dylan = require('../../database/lib/comandos')
const sistema = require('../../sistemas/sticker-audio')

const aviso = (ctx, titulo, descricao) =>
  ctx.reply(ctx.mess.padraoAviso({ emoji: '🎭', titulo, descricao }))
const sucesso = (ctx, titulo, descricao, detalhe = '') =>
  ctx.reply(ctx.mess.padraoSucesso({ emoji: '🎭', titulo, descricao, detalhe }))
const erro = (ctx, titulo, descricao) =>
  ctx.reply(ctx.mess.padraoErro({ titulo, descricao }))

dylan.setCommand({
  nome: 'figaudio',
  comandos: ['figaudio', 'rgfigaudio', 'verfigaudio', 'delfigaudio'],
  categoria: 'figurinhas',
  info: {
    descricao: 'Registra e reutiliza uma figurinha com o áudio marcado.',
    uso: 'rgfigaudio | figaudio | verfigaudio | delfigaudio',
    permissao: 'Livre (registro exclusivo do dono)'
  },
  async executar(ctx) {
    const comando = ctx.command
    const dono = ctx.SoDono === true
    if (['rgfigaudio', 'delfigaudio'].includes(comando) && !dono) {
      return ctx.reply(ctx.mess.onlyOwner())
    }

    try {
      if (comando === 'rgfigaudio') {
        if (!sistema.stickerAtual(ctx)) return ctx.reply(ctx.mess.padraoUso({
          emoji: '🎭', titulo: 'REGISTRAR FIGURINHA COM ÁUDIO',
          uso: `${ctx.prefix}rgfigaudio`,
          descricao: 'Responda à figurinha que deseja usar com os áudios.'
        }))
        await sistema.registrar(ctx)
        return sucesso(ctx, 'FIGURINHA REGISTRADA',
          'A figurinha foi salva para os envios com áudio.',
          `Responda a um áudio com ${ctx.prefix}figaudio.`)
      }

      if (comando === 'delfigaudio') {
        if (!sistema.remover()) return aviso(ctx, 'FIGURINHA NÃO REGISTRADA',
          `Registre uma figurinha com ${ctx.prefix}rgfigaudio.`)
        return sucesso(ctx, 'FIGURINHA REMOVIDA',
          'O registro da figurinha com áudio foi apagado.')
      }

      if (!sistema.registrada()) {
        return aviso(ctx, 'FIGURINHA NÃO REGISTRADA',
          `Responda a uma figurinha com ${ctx.prefix}rgfigaudio primeiro.`)
      }

      if (comando === 'verfigaudio') {
        await sistema.visualizar(ctx)
        return true
      }

      const audio = sistema.audioAtual(ctx)
      if (!audio) return ctx.reply(ctx.mess.padraoUso({
        emoji: '🎭', titulo: 'FIGURINHA COM ÁUDIO',
        uso: `${ctx.prefix}figaudio`,
        descricao: 'Responda a uma mensagem de áudio para enviar com a figurinha registrada.'
      }))

      await sistema.enviar(ctx, audio)
      if (typeof ctx.reagir === 'function') {
        await ctx.reagir(ctx.from, '✅').catch(() => {})
      }
      return sucesso(ctx, 'FIGURINHA COM ÁUDIO ENVIADA',
        'A tentativa de envio foi concluída.',
        'A reprodução do áudio depende da versão do WhatsApp de quem recebe.')
    } catch (e) {
      console.warn('[FIGAUDIO]', e?.message || e)
      return erro(ctx, 'FALHA NA FIGURINHA COM ÁUDIO',
        String(e?.message || 'Não foi possível concluir a operação.'))
    }
  }
})
