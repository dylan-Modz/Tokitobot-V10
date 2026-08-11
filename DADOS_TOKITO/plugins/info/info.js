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

const plugins = require('../index')

module.exports = {
nome: 'info',
comandos: ['info', 'infocmd'],
categoria: 'info',
info: {
descricao: 'Mostra como usar qualquer comando carregado.',
uso: 'info comando',
categoria: 'info'
},
async executar(ctx) {
const nome = String(ctx.q || '').trim().toLowerCase()
if (!nome)
return ctx.reply(ctx.mess.infoUso(ctx.prefix))
const r = plugins.resolver(nome)
if (!r)
return ctx.reply(ctx.mess.infoNaoExiste(nome))
const mod = r.mod
const meta = mod.info || {}
return ctx.reply(ctx.mess.infoComando({
nome: r.canonico,
aliases: (mod.comandos || []).filter(x => x !== r.canonico),
categoria: mod.categoria || meta.categoria || 'outros',
descricao: meta.descricao || `Executa o comando ${r.canonico}.`,
uso: meta.uso ? `${ctx.prefix}${meta.uso}` : `${ctx.prefix}${r.canonico}`,
permissao: meta.permissao || 'Todos',
requisitos: meta.requisitos || ''
}))
}
}
