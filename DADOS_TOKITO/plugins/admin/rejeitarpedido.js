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
  nome: 'rejeitarpedido',
  comandos: ['rejeitarpedido'],
  categoria: 'admin',
  info: {
    descricao: 'Rejeita uma solicitação de entrada pendente.',
    uso: 'rejeitarpedido [jid]',
    permissao: 'ADM'
  },

  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo());
    if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm());
    if (!ctx.isBotGroupAdmins) return ctx.reply(ctx.mess.botadm());

    try {
      const aprovacao = ctx.funcoes?.aprovacao;
      if (typeof aprovacao?.decidir !== 'function') {
        return ctx.reply(ctx.mess.padraoErro({
          titulo: 'REJEITAR PEDIDO',
          descricao: 'O sistema de solicitações está indisponível.'
        }));
      }

      const resultado = await aprovacao.decidir({
        tokito: ctx.tokito,
        grupo: ctx.from,
        alvo: String(ctx.q || '').trim(),
        acao: 'reject'
      });

      if (resultado?.vazio || resultado?.indisponivel) {
        return ctx.reply(ctx.mess.padraoAviso({
          emoji: '📭',
          titulo: 'SOLICITAÇÕES',
          descricao: resultado.vazio
            ? 'Nenhuma solicitação pendente.'
            : 'Solicitação não encontrada.'
        }));
      }

      return ctx.reply(ctx.mess.padraoSucesso({
        emoji: '✅',
        titulo: 'PEDIDO REJEITADO',
        descricao: 'Solicitação rejeitada com sucesso.'
      }));
    } catch (error) {
      console.log('[REJEITAR PEDIDO]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'REJEITAR PEDIDO',
        descricao: 'Não foi possível rejeitar a solicitação.'
      }));
    }
  }
});
