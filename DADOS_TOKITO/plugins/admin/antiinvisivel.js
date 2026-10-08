/*
 * Tokito Bot V10 - Anti-Invisivel
 * Autor: Dylan Modz
 */
const dylan = require('../../database/lib/comandos')
const toggle = require('../../sistemas/toggle.js')

dylan.setCommand({
  nome: 'antiinvisivel',
  comandos: ['antiinvisivel'],
  categoria: 'grupo',
  info: {
    descricao: 'Ativa ou desativa a protecao contra rajadas invisiveis.',
    uso: 'antiinvisivel 1/0',
    permissao: 'ADM'
  },
  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm())
    if (!ctx.isBotGroupAdmins) return ctx.reply(ctx.mess.botadm())

    const acao = String(ctx.q || '').trim()
    if (acao === '1' && ctx.dataGp?.[0]) {
      ctx.dataGp[0].funcoes ||= {}
      // Uma unica ativacao: modera apenas rajadas repetidas com remetente identificado.
      ctx.dataGp[0].funcoes.antiinvisivelModo = 'remover'
    }

    return toggle({
      grupo: ctx.from,
      dataGp: ctx.dataGp,
      setGp: ctx.setGp,
      campo: 'antiinvisivel',
      q: acao,
      prefix: ctx.prefix,
      command: ctx.command,
      reply: ctx.reply,
      emoji: '🛡️',
      titulo: '𝙰𝙽𝚃𝙸-𝙸𝙽𝚅𝙸𝚂𝙸́𝚅𝙴𝙻',
      descricao: 'ᴍᴏɴɪᴛᴏʀᴀ ᴇ ʙʟᴏǫᴜᴇɪᴀ ʀᴀᴊᴀᴅᴀs ʀᴇᴘᴇᴛɪᴅᴀs ᴄᴏᴍ ᴀᴜᴛᴏʀ ɪᴅᴇɴᴛɪғɪᴄᴀᴅᴏ.'
    })
  }
})
