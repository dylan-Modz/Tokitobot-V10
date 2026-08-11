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

module.exports = {
nome: 'bangp',
comandos: ['bangp', 'unbangp'],
categoria: 'dono',
info: {
descricao: 'Bloqueia/desbloqueia os comandos em um grupo.',
uso: 'bangp',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
ctx.dataGp[0].funcoes.bangp = ctx.command === 'bangp'
ctx.setGp(ctx.dataGp)
return ctx.reply(`🧊 Grupo ${ctx.command === 'bangp' ? 'bloqueado para comandos' : 'desbloqueado'}.`)
}
}
