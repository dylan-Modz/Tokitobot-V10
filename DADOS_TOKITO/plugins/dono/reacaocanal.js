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
  nome: 'reacaocanal',
  comandos: ['reacaocanal'],
  categoria: 'dono',
  info: {
    descricao: 'Reage a uma publicação de canal.',
    uso: 'reacaocanal link emoji',
    permissao: 'DONO'
  },

  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner());

    try {
      const args = String(ctx.q || '').trim().split(/\s+/).filter(Boolean);
      const uso = () => ctx.reply(ctx.mess.padraoUso({
        emoji: '❤️', titulo: 'REAÇÃO NO CANAL',
        uso: ctx.prefix + 'reacaocanal link-da-publicação ❤️',
        descricao: 'Informe o link da publicação e o emoji.'
      }));
      
      let endereco, id, emoji;
      if (/whatsapp\.com\/channel\//i.test(args[0] || '')) {
        const match = args[0].match(/\/channel\/[A-Za-z0-9_-]+\/(\d+)/);
        if (!match || args.length < 2) return uso();
      
        endereco = args[0];
        id = match[1];
        emoji = args.slice(1).join(' ');
      } else {
        if (args.length < 3) return uso();
      
        endereco = args[0];
        id = args[1];
        emoji = args.slice(2).join(' ');
      }
      
      if (!/^\d+$/.test(id) || !emoji || emoji.length > 20) return uso();
      const jid = await resolverCanal(ctx.tokito, endereco);
      
      if (!jid) return uso();
      if (typeof ctx.tokito.newsletterReactMessage !== 'function') {
        throw new Error('Método de reação indisponível');
      }
      
      await ctx.tokito.newsletterReactMessage(jid, id, emoji);
      return ctx.reply(ctx.mess.padraoSucesso({
        emoji: '❤️', titulo: 'REAÇÃO NO CANAL',
        descricao: 'Reação enviada à publicação.'
      }));
    } catch (error) {
      console.log('[REACAOCANAL]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'REAÇÃO NO CANAL',
        descricao: 'Não foi possível concluir essa ação.'
      }));
    }
  }
});
