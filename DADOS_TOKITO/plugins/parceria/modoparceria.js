/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Dev: Dylan Modz
 * ============================================================
 */

const parcerias = require('../../sistemas/parcerias')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'modoparceria',
  comandos: ['modoparceria', 'parceriamodo'],
  categoria: 'admin',
  info: {
    descricao: 'Ativa ou desativa o sistema de parcerias no grupo.',
    uso: 'modoparceria 1/0',
    permissao: 'ADM',
    categoria: 'admin'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())

    const acao = String(ctx.q || '').trim()

    if (!['0', '1'].includes(acao))
      return ctx.reply(ctx.mess.modoParceriaUso(ctx.prefix, ctx.command))

    const atual = parcerias.modoAtivo(ctx.from)
    const ativar = acao === '1'

    if (ativar && atual)
      return ctx.reply(ctx.mess.modoParceriaJaAtivado())

    if (!ativar && !atual)
      return ctx.reply(ctx.mess.modoParceriaJaDesativado())

    parcerias.setModo(ctx.from, ativar)

    return ctx.reply(
      ativar
        ? ctx.mess.modoParceriaAtivado()
        : ctx.mess.modoParceriaDesativado()
    )
  }
})
