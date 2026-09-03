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

const r = require('../../sistemas/rpg/index')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'coins',
  comandos: ['coins'],
  categoria: 'coins',
  info: {
    descricao: 'Mostra saldo e estatísticas de N-Coins.',
    uso: 'coins',
    requisitos: 'Modo Coins',
    categoria: 'coins'
  },

  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())

    if (!r.temCoins(ctx))
      return ctx.reply(ctx.mess.coinsDesativado(ctx.prefix))

    const usuario = r.eco(ctx)
    const minerar = Number(usuario.chances?.minerar || 0)
    const cassino = Number(usuario.chances?.cassino || 0)
    const banco = Number(usuario.cidade?.saldoBanco || 0)
    const legenda = ctx.mess.coinsCard(
      ctx.sender,
      usuario.coins,
      banco,
      minerar,
      cassino,
      ctx.prefix
    )

    r.salvar(ctx)

    const fotoPadrao = 'https://raw.githubusercontent.com/dylanModz/uploads/main/midias/imagens/799qek6w4.jpg'
    const foto = await ctx.tokito
      .profilePictureUrl(ctx.sender, 'image')
      .catch(() => fotoPadrao)

    try {
      return await ctx.tokito.sendMessage(ctx.from, {
        image: { url: foto },
        caption: legenda,
        mentions: [ctx.sender]
      }, { quoted: ctx.selo })
    }
    catch (error) {
      console.log('[COINS]', error?.message || error)
      return ctx.reply(legenda, [ctx.sender])
    }
  }
})
