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
  nome: 'linkchamada',
  comandos: ['linkchamada'],
  categoria: 'dono',
  info: {
    descricao: 'Gera links de chamadas de áudio ou vídeo.',
    uso: 'linkchamada audio|video',
    permissao: 'DONO'
  },

  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner());

    try {
      const tipo = String(ctx.q || 'audio').trim().toLowerCase();
      if (!['audio', 'video'].includes(tipo)) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '📞', titulo: 'LINK DE CHAMADA',
          uso: ctx.prefix + 'linkchamada audio',
          descricao: 'Escolha áudio ou vídeo.'
        }));
      }
      
      if (typeof ctx.tokito.createCallLink !== 'function') {
        throw new Error('Método de chamada indisponível');
      }
      
      const token = await ctx.tokito.createCallLink(tipo);
      if (typeof token !== 'string' || !token) throw new Error('Token não retornado');
      
      const link = token.startsWith('https://') ? token : 'https://call.whatsapp.com/' + token;
      return ctx.reply(ctx.mess.padraoInfo({
        emoji: '📞', titulo: 'LINK DE CHAMADA',
        linhas: [
          { rotulo: '📌 TIPO', valor: tipo === 'audio' ? 'Áudio' : 'Vídeo' },
          { rotulo: '🔗 LINK', valor: link }
        ]
      }));
    } catch (error) {
      console.log('[LINKCHAMADA]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'LINK DE CHAMADA',
        descricao: 'Não foi possível concluir essa ação.'
      }));
    }
  }
});
