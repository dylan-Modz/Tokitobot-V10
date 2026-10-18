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
  nome: 'bloqueados',
  comandos: ['bloqueados'],
  categoria: 'dono',
  info: {
    descricao: 'Consulta a quantidade de contatos bloqueados.',
    uso: 'bloqueados',
    permissao: 'DONO'
  },

  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner());

    try {
      if (String(ctx.q || '').trim()) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '🚫', titulo: 'CONTATOS BLOQUEADOS',
          uso: ctx.prefix + 'bloqueados',
          descricao: 'Consulte a lista de bloqueios da conta.'
        }));
      }
      
      if (typeof ctx.tokito.fetchBlocklist !== 'function') {
        throw new Error('Método de bloqueios indisponível');
      }
      
      const lista = await ctx.tokito.fetchBlocklist();
      const total = Array.isArray(lista) ? lista.filter(Boolean).length : 0;
      
      return ctx.reply(ctx.mess.padraoInfo({
        emoji: '🚫', titulo: 'CONTATOS BLOQUEADOS',
        linhas: [{ rotulo: '📊 QUANTIDADE', valor: String(total) }]
      }));
    } catch (error) {
      console.log('[BLOQUEADOS]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'CONTATOS BLOQUEADOS',
        descricao: 'Não foi possível concluir essa ação.'
      }));
    }
  }
});
