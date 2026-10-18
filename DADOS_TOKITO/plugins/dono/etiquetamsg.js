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
  nome: 'etiquetamsg',
  comandos: ['etiquetamsg'],
  categoria: 'dono',
  info: {
    descricao: 'Adiciona ou remove uma etiqueta de mensagem.',
    uso: 'etiquetamsg id (responder)',
    permissao: 'DONO'
  },

  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner());

    try {
      const args = String(ctx.q || '').trim().split(/\s+/).filter(Boolean);
      const remover = ['off', 'remover'].includes(String(args[0] || '').toLowerCase());
      const id = remover ? args[1] : args[0];
      const citada = obterCitada(ctx);
      
      if (!id || !/^[A-Za-z0-9_-]{1,80}$/.test(id) || args.length !== (remover ? 2 : 1) || !citada) {
        return ctx.reply(ctx.mess.padraoUso({
          emoji: '🏷️', titulo: 'ETIQUETA DA MENSAGEM',
          uso: ctx.prefix + 'etiquetamsg id',
          descricao: 'Responda à mensagem. Para remover, use ' + ctx.prefix + 'etiquetamsg off id.'
        }));
      }
      
      const metodo = remover ? 'removeMessageLabel' : 'addMessageLabel';
      if (typeof ctx.tokito[metodo] !== 'function') throw new Error('Método de etiqueta indisponível');
      
      await ctx.tokito[metodo](ctx.from, citada.key.id, id);
      return ctx.reply(ctx.mess.padraoSucesso({
        emoji: '🏷️', titulo: 'ETIQUETA DA MENSAGEM',
        descricao: remover ? 'Etiqueta removida.' : 'Etiqueta adicionada.'
      }));
    } catch (error) {
      console.log('[ETIQUETAMSG]', error?.message || error);
      return ctx.reply(ctx.mess.padraoErro({
        titulo: 'ETIQUETA DA MENSAGEM',
        descricao: 'Não foi possível concluir essa ação.'
      }));
    }
  }
});
