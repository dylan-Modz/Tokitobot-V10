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
nome: 'modoia',
comandos: ['modoia'],
categoria: 'admin',
info: {
descricao: 'Ativa a Tokito IA no grupo em modo texto ou áudio.',
uso: 'modoia 1 texto|audio',
permissao: 'ADM',
categoria: 'admin'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())
const p = String(ctx.q || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
if (!p.length)
return ctx.reply(ctx.mess.modoIaUso(ctx.prefix))
let cfg = ctx.dataGp[0].funcoes.modoia
if (!cfg || typeof cfg !== 'object')
cfg = {
ativo: false,
tipo: 'texto'
}
if (p[0] === '0') {
cfg.ativo = false
}
else if (['texto', 'audio', 'áudio'].includes(p[0])) {
cfg.ativo = true
cfg.tipo = p[0].startsWith('a') ? 'audio' : 'texto'
}
else if (p[0] === '1') {
cfg.ativo = true
if (['texto', 'audio', 'áudio'].includes(p[1]))
cfg.tipo = p[1].startsWith('a') ? 'audio' : 'texto'
}
else
return ctx.reply(ctx.mess.modoIaUso(ctx.prefix))
ctx.dataGp[0].funcoes.modoia = cfg
ctx.setGp(ctx.dataGp)
return ctx.reply(ctx.mess.modoIaAlterado(cfg.ativo, cfg.tipo))
}
}
