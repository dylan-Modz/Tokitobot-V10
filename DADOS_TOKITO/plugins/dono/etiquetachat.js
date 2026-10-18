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
  nome: 'etiquetachat',
  comandos: ['etiquetachat'],
  categoria: 'dono',
  info: {
    descricao: 'Adiciona ou remove uma etiqueta da conversa.',
    uso: 'etiquetachat id|off id',
    permissao: 'DONO'
  },

  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner());

    try {
      const args = String(ctx.q || '').trim().split(/\s+/).filter(Boolean);
      const remover = ['off', 'remover'].includes(String(args[0] || '').toLowerCase());
      const id = remover ? args[1] : args[0];
      
      if (!id || !/^[A-Za-z0-9_-]{1,80}$/.test(id) || args.length !== (remover ? 2 : 1)) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '🏷️', titulo: 'ETIQUETA DA CONVERSA',
          uso: ctx.prefix + 'etiquetachat id',
          descricao: 'Para remover: ' + ctx.prefix + 'etiquetachat off id.'
        }));
      }
      
      const metodo = remover ? 'removeChatLabel' : 'addChatLabel';
      if (typeof ctx.tokito[metodo] !== 'function') throw new Error('Método de etiqueta indisponível');
      
      await ctx.tokito[metodo](ctx.from, id);
      return ctx.reply(ctx.mess.padraoSucesso({
        emoji: '🏷️', titulo: 'ETIQUETA DA CONVERSA',
        descricao: remover ? 'Etiqueta removida.' : 'Etiqueta adicionada.'
      }));
    } catch (error) {
      console.log('[ETIQUETACHAT]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'ETIQUETA DA CONVERSA',
        descricao: 'Não foi possível concluir essa ação.'
      }));
    }
  }
});
