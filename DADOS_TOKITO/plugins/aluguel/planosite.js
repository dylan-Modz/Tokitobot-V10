'use strict';

const dylan = require('../../database/lib/comandos');
const site = require('../../sistemas/planos-site');

const titulos = (ctx, lista) => {
  if (!lista.length) return ctx.mess.sitePlanoIndisponivel();
  const tick = String.fromCharCode(96);
  return '- 💎 ' + tick + '𝙿𝙻𝙰𝙽𝙾𝚂 𝚃𝙾𝙺𝙸𝚃𝙾 𝙰𝙿𝙸𝚂' + tick + '\n\n' +
    lista.map(item => '> 💎 ׄ ( ' + item.nome + ' — R$ ' + site.dinheiro(item.preco) +
      ' — ' + item.dias + ' dias. )').join('\n') +
    '\n\n> 💳 ׄ ( Escolha um plano no terceiro card ou use ' + ctx.prefix + 'planosite ID. )';
};
const msgErro = (ctx, text) => ctx.reply(ctx.mess.sitePlanoErro(String(text || 'Tente novamente.').slice(0, 160)));

dylan.setCommand({
  nome: 'planosite',
  comandos: ['planosite', 'planosapi', 'vincularsite'],
  categoria: 'aluguel',
  info: { descricao: 'Planos da Tokito APIs, renovação e vínculo do WhatsApp.', uso: 'planosite', categoria: 'aluguel' },
  async executar(ctx) {
    const cmd = String(ctx.command || '').toLowerCase();
    const input = String(ctx.q || '').trim();
    if (cmd === 'vincularsite') {
      if (ctx.isGroup) return msgErro(ctx, 'Por segurança, faça o vínculo somente no privado do bot.');
      if (!input) return site.enviarLink(ctx, 'https://tokito-apis.com.br/painel/vincular-bot',
        ctx.mess.sitePlanoVincular(ctx.prefix), '🔗﹚𝐕𝐈𝐍𝐂𝐔𝐋𝐀𝐑 𝐂𝐎𝐍𝐓𝐀﹙🔗');
      const telefone = site.numero(ctx.sender);
      if (!telefone) return msgErro(ctx, 'Não foi possível confirmar seu número do WhatsApp. Abra uma conversa privada usando seu número.');
      try {
        const conta = await site.vincular(telefone, input);
        return ctx.reply(ctx.mess.sitePlanoVinculado(conta));
      } catch (error) { return msgErro(ctx, error?.message); }
    }
    if (!input) {
      try { return ctx.reply(titulos(ctx, await site.planos())); }
      catch { return ctx.reply(ctx.mess.sitePlanoIndisponivel()); }
    }
    if (ctx.isGroup) return msgErro(ctx, 'Para proteger seus dados de pagamento, escolha o plano no privado do bot.');
    const telefone = site.numero(ctx.sender);
    if (!telefone) return msgErro(ctx, 'Não foi possível identificar seu número. Use o WhatsApp privado com número confirmado.');
    try {
      const lista = await site.planos();
      const plano = lista.find(item => item.id === input.toLowerCase());
      if (!plano) return ctx.reply(titulos(ctx, lista));
      let conta;
      try { conta = await site.conta(telefone); }
      catch { return site.enviarLink(ctx, 'https://tokito-apis.com.br/painel/vincular-bot',
        ctx.mess.sitePlanoVincular(ctx.prefix), '🔗﹚𝐕𝐈𝐍𝐂𝐔𝐋𝐀𝐑 𝐂𝐎𝐍𝐓𝐀﹙🔗'); }
      const result = await site.checkout(telefone, { planoId: plano.id });
      return site.enviarLink(ctx, result.checkoutUrl, ctx.mess.sitePlanoCheckout({
        nome: plano.nome, preco: site.dinheiro(result.amount), vencimento: site.dataBR(conta?.plan?.vencimento)
      }));
    } catch (error) { return msgErro(ctx, error?.message); }
  }
});
