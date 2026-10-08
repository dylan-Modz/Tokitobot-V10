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
    descricao: 'Monitora rajadas de mensagens que falharam na descriptografia.',
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
      return ctx.reply(
        `🛡️ *ANTI-INVISÍVEL*
Status: ${config.ativo ? 'Ativado' : 'Desativado'}
Modo: ${config.modo}
Janela: 15 segundos
Alerta: 4 ocorrências distintas
Remoção: 10 ocorrências e sinais adicionais

Uma falha isolada não causa punição.`
      )
    }

    if (!['1', '0', 'alerta', 'remover'].includes(acao))
      return ctx.reply(
        `🛡️ *ANTI-INVISÍVEL*
${ctx.prefix}antiinvisivel 1 — Ativar
${ctx.prefix}antiinvisivel 0 — Desativar
${ctx.prefix}antiinvisivel status — Verificar
${ctx.prefix}antiinvisivel alerta — Apenas alertar
${ctx.prefix}antiinvisivel remover — Permitir remoção após rajada excepcional

O modo remover também monitora administradores, mas não o dono do grupo.`
      )

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
      `🛡️ *ANTI-INVISÍVEL*
Proteção: ${ativo ? 'Ativada' : 'Desativada'}
Modo: ${funcoes.antiinvisivelModo || 'alerta'}
${ativo
  ? 'O bot vai monitorar rajadas de falhas de descriptografia neste grupo.'
  : 'O monitoramento foi desativado neste grupo.'}`
    )
  }
})
