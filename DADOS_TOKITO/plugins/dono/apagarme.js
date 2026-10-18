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

const obterTimestamp = (ctx, citada) => {
  const bruto = citada.contexto?.quotedMessage?.messageTimestamp;
  const citado = Number(bruto?.toNumber?.() ?? bruto?.low ?? bruto ?? 0);
  const salvo = ctx.tokito.__tokitoMessageTimestamps?.get(ctx.from + '|' + citada.key.id);
  const valor = Number.isSafeInteger(citado) && citado > 1000000000 ? citado : Number(salvo || 0);

  return Number.isSafeInteger(valor) &&
    valor > 1000000000 &&
    valor <= Math.floor(Date.now() / 1000) + 300
    ? valor
    : null;
};

dylan.setCommand({
  nome: 'apagarme',
  comandos: ['apagarme'],
  categoria: 'dono',
  info: {
    descricao: 'Remove a mensagem só da conta do bot.',
    uso: 'apagarme (responder)',
    permissao: 'DONO'
  },

  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner());

    try {
      const citada = obterCitada(ctx);
      
      if (!citada || String(ctx.q || '').trim()) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '🗑️', titulo: 'APAGAR PARA MIM',
          uso: ctx.prefix + 'apagarme',
          descricao: 'Responda à mensagem que deseja apagar apenas no bot.'
        }));
      }
      
      const timestamp = obterTimestamp(ctx, citada);
      if (!timestamp) {
        return ctx.reply(ctx.mess.padraoAviso({
          emoji: '🗑️', titulo: 'APAGAR PARA MIM',
          descricao: 'Não tenho o registro original dessa mensagem. Tente uma mensagem nova recebida após iniciar o bot.'
        }));
      }
      
      if (typeof ctx.tokito.deleteMessageForMe !== 'function') {
        throw new Error('Método de exclusão indisponível');
      }
      
      await ctx.tokito.deleteMessageForMe(ctx.from, citada.key, timestamp);
      return ctx.reply(ctx.mess.padraoSucesso({
        emoji: '🗑️', titulo: 'MENSAGEM REMOVIDA',
        descricao: 'Exclusão solicitada somente na conta do bot.'
      }));
    } catch (error) {
      console.log('[APAGARME]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'APAGAR PARA MIM',
        descricao: 'Não foi possível concluir essa ação.'
      }));
    }
  }
});
