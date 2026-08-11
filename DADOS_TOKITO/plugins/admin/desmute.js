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
nome: 'desmute',
comandos: ['desmute', 'unmute'],
categoria: 'admin',
info: {
descricao: 'Remove o silenciamento de um membro.',
uso: 'desmute @usuario',
permissao: 'ADM',
categoria: 'admin'
},
async executar(ctx) {
const { isGroup, isGroupAdmins, SoDono, menc_jid2, menc_prt, dataGp, setGp, reply, mess, normalizar } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isGroupAdmins && !SoDono)
return reply(mess.soadm())
const alvo = normalizar((menc_jid2 || [])[0] || menc_prt || '')
if (!alvo)
return reply(mess.desmuteUso(ctx.prefix))
if (!Array.isArray(dataGp[0].silenciados))
dataGp[0].silenciados = []
const antes = dataGp[0].silenciados.length
dataGp[0].silenciados = dataGp[0].silenciados.filter(x => x.id !== alvo)
if (antes === dataGp[0].silenciados.length)
return reply(mess.muteNaoAtivo(alvo), [alvo])
setGp(dataGp)
return reply(mess.muteDesativado(alvo), [alvo])
}
}
