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
nome: 'addcoins',
comandos: ['addcoins', 'removecoins', 'tirarcoins'],
categoria: 'dono',
info: {
descricao: 'Adiciona ou remove N-Coins de um usuário.',
uso: 'addcoins @usuario valor',
permissao: 'Dono',
categoria: 'coins'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
const alvo = ctx.normalizar((ctx.menc_jid2 || [])[0] || ctx.menc_prt || ctx.sender)
const valor = Number(String(ctx.q || '').replace(/@\S+/g, '').replace(/\D/g, ''))
if (!valor)
return ctx.reply(ctx.mess.coinsGerenciarUso(ctx.prefix, ctx.command))
const u = r.eco(ctx, alvo)
const rem = /remove|tirar/.test(ctx.command)
u.coins = Math.max(0, Number(u.coins || 0) + (rem ? -valor : valor))
r.salvar(ctx)
return ctx.reply(ctx.mess.coinsGerenciado(alvo, u.coins, rem), [alvo])
}
}
)
