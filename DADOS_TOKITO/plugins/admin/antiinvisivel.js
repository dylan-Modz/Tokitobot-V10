/*
 * Tokito Bot V10 - Anti-Invisivel
 * Author: Dylan Modz
 */
const dylan = require('../../database/lib/comandos')
const monitor = require('../../sistemas/antiinvisivel.js')

dylan.setCommand({
  nome: 'antiinvisivel',
  comandos: ['antiinvisivel'],
  categoria: 'grupo',
  info: {
    descricao: 'Monitora falhas de descriptografia e rajadas com pagamentos citados.',
    uso: 'antiinvisivel 1/0/status/alerta/remover',
    permissao: 'ADM'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())

    const acao = String(ctx.q || '').trim().toLowerCase()
    const funcoes = ctx.dataGp?.[0]?.funcoes || {}
    if (!ctx.dataGp?.[0])
      return ctx.reply('Os dados deste grupo ainda nao estao disponiveis.')
    ctx.dataGp[0].funcoes = funcoes

    if (acao === 'status') {
      const config = monitor.status(ctx.from)
      return ctx.reply(ctx.mess.antiInvisivelStatus(config))
    }

    if (!['1', '0', 'alerta', 'remover'].includes(acao))
      return ctx.reply(ctx.mess.antiInvisivelUso(ctx.prefix, ctx.command))

    if (acao !== '0' && !ctx.isBotGroupAdmins)
      return ctx.reply(ctx.mess.botadm())

    if (acao === '1') {
      funcoes.antiinvisivel = true
      if (!['alerta', 'remover'].includes(funcoes.antiinvisivelModo))
        funcoes.antiinvisivelModo = 'alerta'
    }
    else if (acao === '0') {
      funcoes.antiinvisivel = false
    }
    else {
      funcoes.antiinvisivel = true
      funcoes.antiinvisivelModo = acao
    }

    ctx.setGp(ctx.dataGp)
    const ativo = funcoes.antiinvisivel === true
    await ctx.reagir(ctx.from, ativo ? '✅' : '❌').catch(() => {})
    return ctx.reply(
      ctx.mess.antiInvisivelAlterado(ativo, funcoes.antiinvisivelModo || 'alerta')
    )
  }
})
