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
const page = 'https://tokito-apis.com.br/painel/planos';
const linkPublico = ctx => site.enviarLink(ctx, page,
  ctx.mess.sitePlanoSiteExterno(), '💎﹚𝐀𝐁𝐑𝐈𝐑 𝐌𝐄𝐔𝐒 𝐏𝐋𝐀𝐍𝐎𝐒﹙💎');

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
    if (ctx.isGroup) return falha(ctx, 'Para abrir seu pagamento, chame o bot no privado.');
    // O token de API no config-all é uma credencial única do dono deste bot,
    // não uma identificação de todos os membros de grupos.
    if (!site.ehDonoDaConta(ctx.sender)) return linkPublico(ctx);
    try {
      const lista = await site.planos();
      const plano = lista.find(item => item.id === input);
      if (!plano) return ctx.reply(textoPlanos(ctx, lista));
      const account = await site.conta();
      if (!site.confereTelefone(account)) return linkPublico(ctx);
      const payment = await site.checkout({ planoId: plano.id });
      return site.enviarLink(ctx, payment.checkoutUrl, ctx.mess.sitePlanoCheckout({
        nome: plano.nome, preco: site.dinheiro(payment.amount)
      }));
    } catch (error) { return falha(ctx, error?.message); }
  }
});
