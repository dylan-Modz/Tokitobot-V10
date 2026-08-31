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

const adv = require('../../sistemas/advertencias')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'deladv',
comandos: ['deladv', 'rmadv', 'limparadv'],
categoria: 'admin',
info: {
descricao: 'Remove advertência de um membro.',
uso: 'deladv @usuario [tudo]',
permissao: 'ADM',
categoria: 'admin'
},
async executar(ctx) {
const { isGroup, isGroupAdmins, SoDono, menc_jid2, menc_prt, q, dataGp, setGp, reply, mess, normalizar } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isGroupAdmins && !SoDono)
return reply(mess.soadm())
const alvo = normalizar((menc_jid2 || [])[0] || menc_prt || '')
if (!alvo)
return reply(mess.delAdvUso(ctx.prefix))
const r = adv.remover({
dataGp,
setGp,
grupo: ctx.from,
jid: alvo,
tudo: /\btudo\b/i.test(String(q || ''))
})
return reply(r.ok ? mess.advRemovida(alvo, r.quantidade) : mess.advNenhuma(alvo), [alvo])
}
}
)
