/* Mantém .aprovacao para ligar/desligar o sistema.
 * O alias .solicitacao agora pertence ao comando soli.
 * Dev: Dylan Modz.
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'aprovacao',
  comandos: ['aprovacao'],
  categoria: 'grupo',

  info: {
    descricao: 'Ativa ou desativa o sistema de aprovação de entrada.',
    uso: 'aprovacao 1/0',
    categoria: 'grupo'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())

    if (!ctx.isBotGroupAdmins)
      return ctx.reply(ctx.mess.botadm())

    return ctx.funcoes.aprovacao.configurar({
      grupo: ctx.from,
      dataGp: ctx.dataGp,
      setGp: ctx.setGp,
      q: ctx.q,
      prefix: ctx.prefix,
      command: ctx.command,
      reply: ctx.reply,
      automatico: false
    })
  }
}
)
