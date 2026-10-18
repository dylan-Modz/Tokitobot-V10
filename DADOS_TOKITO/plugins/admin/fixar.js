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

const obterCitada = ctx => {
  const contexto = ctx.ctxMsg?.stanzaId ? ctx.ctxMsg : (
    ctx.mensagem?.extendedTextMessage?.contextInfo ||
    ctx.mensagem?.imageMessage?.contextInfo ||
    ctx.mensagem?.videoMessage?.contextInfo ||
    ctx.mensagem?.audioMessage?.contextInfo ||
    ctx.mensagem?.documentMessage?.contextInfo ||
    ctx.mensagem?.stickerMessage?.contextInfo ||
    {}
  );

  if (!contexto.stanzaId) return null;

  const participante = contexto.participantAlt || contexto.participant || '';
  const meusIds = [ctx.tokito?.user?.id, ctx.tokito?.user?.lid]
    .filter(Boolean)
    .map(id => ctx.nJid(id));
  const fromMe = Boolean(participante && meusIds.includes(ctx.nJid(participante)));

  const key = {
    remoteJid: ctx.from,
    id: contexto.stanzaId,
    fromMe
  };

  if (ctx.isGroup && participante) key.participant = participante;

  return { key, contexto, fromMe };
};

dylan.setCommand({
  nome: 'fixar',
  comandos: ['fixar'],
  categoria: 'admin',
  info: {
    descricao: 'Fixa a mensagem respondida por 24h, 7d ou 30d.',
    uso: 'fixar [24h|7d|30d]',
    permissao: 'ADM'
  },

  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo());
    if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm());
    if (!ctx.isBotGroupAdmins) return ctx.reply(ctx.mess.botadm());

    const duracoes = { '24h': 86400, '7d': 604800, '30d': 2592000 };
    const duracao = String(ctx.q || '24h').trim().toLowerCase();
    const citada = obterCitada(ctx);

    if (!Object.hasOwn(duracoes, duracao) || !citada) {
      return ctx.reply(ctx.mess.padraoUso({
        emoji: '📌',
        titulo: 'FIXAR MENSAGEM',
        uso: ctx.prefix + 'fixar 24h',
        descricao: 'Responda à mensagem e escolha 24h, 7d ou 30d.'
      }));
    }

    try {
      await ctx.tokito.sendMessage(ctx.from, {
        pin: citada.key,
        type: 1,
        time: duracoes[duracao]
      });

      return ctx.reply(ctx.mess.padraoSucesso({
        emoji: '📌',
        titulo: 'MENSAGEM FIXADA',
        descricao: 'Mensagem fixada por ' + duracao + '.'
      }));
    } catch (error) {
      console.log('[FIXAR]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'FIXAR MENSAGEM',
        descricao: 'Não foi possível fixar essa mensagem.'
      }));
    }
  }
});
