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


const dylan = require('../../database/lib/comandos');

dylan.setCommand({
  nome: 'tempmsg',
  comandos: ['tempmsg'],
  categoria: 'admin',
  info: {
    descricao: 'Configura mensagens temporárias do grupo.',
    uso: 'tempmsg off|24h|7d|90d',
    permissao: 'ADM'
  },

  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo());
    if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm());
    if (!ctx.isBotGroupAdmins) return ctx.reply(ctx.mess.botadm());

    const opcoes = { off: 0, '24h': 86400, '7d': 604800, '90d': 7776000 };
    const duracao = String(ctx.q || '').trim().toLowerCase();

    if (!Object.hasOwn(opcoes, duracao)) {
      return ctx.reply(ctx.mess.padraoUso({
        emoji: '⏳',
        titulo: 'MENSAGENS TEMPORÁRIAS',
        uso: ctx.prefix + 'tempmsg 24h',
        descricao: 'Opções: off, 24h, 7d ou 90d.'
      }));
    }

    try {
      if (typeof ctx.tokito.groupToggleEphemeral !== 'function') {
        throw new Error('groupToggleEphemeral indisponível');
      }

      await ctx.tokito.groupToggleEphemeral(ctx.from, opcoes[duracao]);

      return ctx.reply(ctx.mess.padraoSucesso({
        emoji: '⏳',
        titulo: 'MENSAGENS TEMPORÁRIAS',
        descricao: duracao === 'off'
          ? 'Mensagens temporárias desativadas.'
          : 'Prazo configurado para ' + duracao + '.'
      }));
    } catch (error) {
      console.log('[TEMPS MSG]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'MENSAGENS TEMPORÁRIAS',
        descricao: 'Não foi possível alterar essa configuração.'
      }));
    }
  }
});
