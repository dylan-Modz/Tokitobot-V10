'use strict';

const dylan = require('../../database/lib/comandos');
const site = require('../../sistemas/planos-site');

const textoPlanos = (ctx, lista) => {
  if (!lista.length) return ctx.mess.sitePlanoIndisponivel();
  const tick = String.fromCharCode(96);
  return '- 💎 ' + tick + '𝙿𝙻𝙰𝙽𝙾𝚂 𝚃𝙾𝙺𝙸𝚃𝙾 𝙰𝙿𝙸𝚂' + tick + '\n\n' +
    lista.map(item => '> 💎 ׄ ( ' + item.nome + ' — R$ ' + site.dinheiro(item.preco) +
      ' — ' + item.dias + ' dias. )').join('\n') +
    '\n\n> 💳 ׄ ( Escolha um plano no terceiro card ou use ' + ctx.prefix + 'planosite ID. )';
};
const falha = (ctx, message) => ctx.reply(ctx.mess.sitePlanoErro(String(message || 'Tente novamente.').slice(0, 150)));
const checkoutPage = planId => 'https://tokito-apis.com.br/pagamento/plano/' + encodeURIComponent(planId);

dylan.setCommand({
  nome: 'planosite',
  comandos: ['planosite', 'planosapi'],
  categoria: 'aluguel',
  info: { descricao: 'Consultar e renovar planos da Tokito APIs.', uso: 'planosite', categoria: 'aluguel' },
  async executar(ctx) {
    const input = String(ctx.q || '').trim().toLowerCase();
    if (!input) {
      try { return ctx.reply(textoPlanos(ctx, await site.planos())); }
      catch (_) { return ctx.reply(ctx.mess.sitePlanoIndisponivel()); }
    }
    try {
      const lista = await site.planos();
      const plano = lista.find(item => item.id === input);
      if (!plano) return ctx.reply(textoPlanos(ctx, lista));
      // O botão abre o método de pagamento desse plano na conta que a pessoa
      // autenticar no site. Nunca pagamos o plano do dono por engano.
      return site.enviarLink(ctx, checkoutPage(plano.id), ctx.mess.sitePlanoCheckout({
        nome: plano.nome, preco: site.dinheiro(plano.preco)
      }), '💳﹚𝐄𝐒𝐂𝐎𝐋𝐇𝐄𝐑 𝐏𝐀𝐆𝐀𝐌𝐄𝐍𝐓𝐎﹙💳');
    } catch (error) { return falha(ctx, error?.message); }
  }
});
