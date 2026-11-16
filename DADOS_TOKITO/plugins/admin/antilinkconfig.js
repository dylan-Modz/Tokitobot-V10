/*
 * TOKITO BOT V10
 * Author: Dylan Modz
 * Gerenciamento do Anti-Link por grupo.
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'antilinkconfig',
  comandos: ['antilinkconfig', 'antilinkpermitir', 'antilinkbloquear'],
  categoria: 'grupo',
  info: {
    descricao: 'Consulta o Anti-Link e gerencia sites liberados.',
    uso: 'antilinkconfig | antilinkpermitir dominio.com | antilinkbloquear dominio.com',
    permissao: 'ADM'
  },
  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm())

    if (ctx.command === 'antilinkconfig')
      return ctx.reply(ctx.funcoes.antilink.status(ctx))

    if (!ctx.q || !String(ctx.q).trim())
      return ctx.reply(ctx.mess.antilinkDominio('invalido', '—'))

    return ctx.reply(ctx.funcoes.antilink.dominio(
      ctx,
      ctx.command === 'antilinkpermitir' ? 'adicionar' : 'remover',
      ctx.q
    ))
  }
})
