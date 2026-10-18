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
  nome: 'privacidade',
  comandos: ['privacidade'],
  categoria: 'dono',
  info: {
    descricao: 'Consulta as configurações de privacidade do bot.',
    uso: 'privacidade',
    permissao: 'DONO'
  },

  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner());

    try {
      if (String(ctx.q || '').trim()) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '🔒', titulo: 'PRIVACIDADE',
          uso: ctx.prefix + 'privacidade',
          descricao: 'Consulta as configurações da conta.'
        }));
      }
      
      if (typeof ctx.tokito.fetchPrivacySettings !== 'function') {
        throw new Error('Método de privacidade indisponível');
      }
      
      const dados = await ctx.tokito.fetchPrivacySettings();
      const campos = ['last', 'online', 'profile', 'status', 'readreceipts', 'groupadd', 'messages', 'calladd'];
      const linhas = campos
        .filter(campo => dados?.[campo] != null)
        .map(campo => ({
          rotulo: '🔒 ' + campo.toUpperCase(),
          valor: String(dados[campo]).slice(0, 80)
        }));
      
      return ctx.reply(ctx.mess.padraoInfo({
        emoji: '🔒', titulo: 'PRIVACIDADE',
        linhas: linhas.length ? linhas : [{ rotulo: 'ℹ️ INFO', valor: 'Nenhuma configuração retornada.' }]
      }));
    } catch (error) {
      console.log('[PRIVACIDADE]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'PRIVACIDADE',
        descricao: 'Não foi possível concluir essa ação.'
      }));
    }
  }
});
