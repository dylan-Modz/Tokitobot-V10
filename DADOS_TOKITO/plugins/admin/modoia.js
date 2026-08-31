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

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
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
const responderModoIa = async texto => {
const mensagem = String(texto || '').trim() || ' '
try {
return await ctx.tokito.sendMessage(ctx.from, { text: mensagem }, { quoted: ctx.selo })
} catch {
return ctx.tokito.sendMessage(ctx.from, { text: mensagem })
}
}
if (!ctx.isGroup)
return responderModoIa(ctx.mess.sogrupo())
if (!ctx.isGroupAdmins && !ctx.SoDono)
return responderModoIa(ctx.mess.soadm())
const p = String(ctx.q || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
if (!p.length)
return responderModoIa(ctx.mess.modoIaUso(ctx.prefix))
let cfg = ctx.dataGp[0].funcoes.modoia
if (!cfg || typeof cfg !== 'object')
cfg = {
ativo: false,
tipo: 'texto',
espontaneo: true
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
else if (p[0] === 'espontaneo' || p[0] === 'espontâneo') {
cfg.espontaneo = p[1] !== '0'
if (cfg.espontaneo) {
cfg.ativo = true
if (!['texto', 'audio'].includes(String(cfg.tipo || '').toLowerCase())) cfg.tipo = 'texto'
}
}
else
return responderModoIa(ctx.mess.modoIaUso(ctx.prefix))
ctx.dataGp[0].funcoes.modoia = cfg
ctx.setGp(ctx.dataGp)
return responderModoIa(ctx.mess.modoIaAlterado(cfg.ativo, cfg.tipo))
}
}
)
