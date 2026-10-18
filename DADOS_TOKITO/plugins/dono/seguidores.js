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

const resolverCanal = async (tokito, endereco) => {
  const valor = String(endereco || '').trim();
  if (/^\d+@newsletter$/.test(valor)) return valor;

  const match = valor.match(/(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i);
  if (!match || typeof tokito.newsletterMetadata !== 'function') return '';

  const dados = await tokito.newsletterMetadata('invite', match[1]);
  const jid = dados?.id || dados?.jid || dados?.metadata?.id || '';
  return /^\d+@newsletter$/.test(String(jid)) ? String(jid) : '';
};

dylan.setCommand({
  nome: 'seguidores',
  comandos: ['seguidores'],
  categoria: 'dono',
  info: {
    descricao: 'Consulta a quantidade de seguidores de um canal.',
    uso: 'seguidores link-do-canal',
    permissao: 'DONO'
  },

  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner());

    try {
      const endereco = String(ctx.q || '').trim();
      if (!endereco || endereco.split(/\s+/).length !== 1) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '📊', titulo: 'SEGUIDORES DO CANAL',
          uso: ctx.prefix + 'seguidores link-do-canal',
          descricao: 'Informe o link ou JID do canal.'
        }));
      }
      
      const jid = await resolverCanal(ctx.tokito, endereco);
      if (!jid) {
        return ctx.reply(ctx.mess.padraoAviso({
          emoji: '📊', titulo: 'SEGUIDORES DO CANAL',
          descricao: 'Não consegui identificar esse canal.'
        }));
      }
      if (typeof ctx.tokito.newsletterSubscribers !== 'function') {
        throw new Error('Método de consulta indisponível');
      }
      
      const dados = await ctx.tokito.newsletterSubscribers(jid);
      const total = dados?.subscribers ??
        dados?.count ??
        dados?.subscriberCount ??
        dados?.total ??
        dados?.data?.subscribers ??
        null;
      
      return ctx.reply(ctx.mess.padraoInfo({
        emoji: '📊', titulo: 'SEGUIDORES DO CANAL',
        linhas: [{
          rotulo: '👥 SEGUIDORES',
          valor: total == null ? 'Quantidade não disponibilizada pelo WhatsApp.' : String(total)
        }]
      }));
    } catch (error) {
      console.log('[SEGUIDORES]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'SEGUIDORES DO CANAL',
        descricao: 'Não foi possível concluir essa ação.'
      }));
    }
  }
});
