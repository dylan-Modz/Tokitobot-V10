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

const r = require('../../sistemas/rpg')

module.exports = {
nome: 'ranklevel',
comandos: ['ranklevel', 'rankpatente', 'rankinglevel'],
categoria: 'rpg',
info: {
descricao: 'Ranking de XP/Level do grupo.',
uso: 'ranklevel',
requisitos: 'Modo RPG',
categoria: 'rpg'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!r.temRpg(ctx))
return ctx.reply(ctx.mess.rpgDesativado(ctx.prefix))
const l = r.rank(ctx, 'xp').slice(0, 10)
return ctx.reply(ctx.mess.levelRank(l), l.map(x => x.jid))
}
}
