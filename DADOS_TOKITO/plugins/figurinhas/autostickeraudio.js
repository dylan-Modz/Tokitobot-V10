/*
 * TOKITO BOT V10 — ativar/desativar o áudio em figurinha automaticamente.
 * Author: Dylan Modz
 */
'use strict'

const dylan = require('../../database/lib/comandos')
const sistema = require('../../sistemas/sticker-audio')
const emoji = '🎭'
const titulo = '𝙰𝚄𝚃𝙾 𝚂𝚃𝙸𝙲𝙺𝙴𝚁 𝙰́𝚄𝙳𝙸𝙾'
const descricao = 'ᴛʀᴀɴsғᴏʀᴍᴀ ᴀ́ᴜᴅɪᴏs ᴅᴏ ɢʀᴜᴘᴏ ᴇᴍ ғɪɢᴜʀɪɴʜᴀs ᴄᴏᴍ sᴏᴍ.'

dylan.setCommand({
  nome: 'autostickeraudio',
  comandos: ['autostickeraudio'],
  categoria: 'figurinhas',
  info: {
    descricao: 'Ativa a figurinha sonora automática para áudios recebidos no grupo.',
    uso: 'autostickeraudio 1/0',
    permissao: 'ADM'
  },
  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm())
    const acao = String(ctx.q || '').trim()
    if (acao !== '1' && acao !== '0') {
      return ctx.reply(ctx.mess.funcaoUso(
        emoji, titulo, ctx.prefix, 'autostickeraudio', descricao
      ))
    }
    if (acao === '1' && !sistema.registrada()) {
      return ctx.reply(ctx.mess.padraoAviso({
        emoji, titulo: 'FIGURINHA NÃO REGISTRADA',
        descricao: `Registre uma figurinha com ${ctx.prefix}rgfigaudio. O comando está liberado para todos.`
      }))
    }
    const ativo = acao === '1'
    if (!ctx.dataGp?.[0] || typeof ctx.setGp !== 'function') {
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'ERRO NA CONFIGURAÇÃO',
        descricao: 'Não foi possível encontrar as configurações deste grupo.'
      }))
    }
    ctx.dataGp[0].funcoes ||= {}
    ctx.dataGp[0].funcoes.autostickeraudio = ativo
    ctx.setGp(ctx.dataGp)
    if (typeof ctx.reagir === 'function') {
      await ctx.reagir(ctx.from, ativo ? '✅' : '❌').catch(() => {})
    }
    return ctx.reply(ativo
      ? ctx.mess.funcaoAtivada(emoji, titulo, descricao)
      : ctx.mess.funcaoDesativada(emoji, titulo, descricao))
  }
})
