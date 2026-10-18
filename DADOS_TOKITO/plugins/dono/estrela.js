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

  const key = { remoteJid: ctx.from, id: contexto.stanzaId, fromMe };
  if (ctx.isGroup && participante) key.participant = participante;

  return { key, contexto, fromMe };
};

dylan.setCommand({
  nome: 'estrela',
  comandos: ['estrela'],
  categoria: 'dono',
  info: {
    descricao: 'Marca uma mensagem como favorita na conta do bot.',
    uso: 'estrela (responder)',
    permissao: 'DONO'
  },

  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner());

    try {
      const citada = obterCitada(ctx);
      if (!citada) return ctx.reply(ctx.mess.padraoUso({
        emoji: '⭐', titulo: 'MARCAR ESTRELA',
        uso: ctx.prefix + 'estrela',
        descricao: 'Responda à mensagem que deseja favoritar.'
      }));
      
      if (typeof ctx.tokito.star !== 'function') throw new Error('Método de estrela indisponível');
      await ctx.tokito.star(ctx.from, [{ id: citada.key.id, fromMe: citada.key.fromMe }], true);
      
      return ctx.reply(ctx.mess.padraoSucesso({
        emoji: '⭐', titulo: 'MENSAGEM FAVORITA',
        descricao: 'Mensagem marcada com estrela na conta do bot.'
      }));
    } catch (error) {
      console.log('[ESTRELA]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'MARCAR ESTRELA',
        descricao: 'Não foi possível concluir essa ação.'
      }));
    }
  }
});
