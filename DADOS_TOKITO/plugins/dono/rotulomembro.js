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
  nome: 'rotulomembro',
  comandos: ['rotulomembro'],
  categoria: 'dono',
  info: {
    descricao: 'Atualiza o rótulo da conta do bot no grupo.',
    uso: 'rotulomembro texto',
    permissao: 'DONO'
  },

  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner());

    try {
      if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo());
      
      const rotulo = String(ctx.q || '').trim();
      if (!rotulo || rotulo.length > 30) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '🪪', titulo: 'RÓTULO DE MEMBRO',
          uso: ctx.prefix + 'rotulomembro seu texto',
          descricao: 'Informe até 30 caracteres.'
        }));
      }
      
      if (typeof ctx.tokito.updateMemberLabel !== 'function') {
        throw new Error('Método de rótulo indisponível');
      }
      
      await ctx.tokito.updateMemberLabel(ctx.from, rotulo);
      return ctx.reply(ctx.mess.padraoSucesso({
        emoji: '🪪', titulo: 'RÓTULO DE MEMBRO',
        descricao: 'Rótulo atualizado para: ' + rotulo
      }));
    } catch (error) {
      console.log('[ROTULOMEMBRO]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'RÓTULO DE MEMBRO',
        descricao: 'Não foi possível concluir essa ação.'
      }));
    }
  }
});
