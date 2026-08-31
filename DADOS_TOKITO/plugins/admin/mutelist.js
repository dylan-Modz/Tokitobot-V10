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
nome: 'mutelist',
comandos: ['mutelist', 'listamute'],
categoria: 'admin',
info: {
descricao: 'Lista membros silenciados.',
uso: 'mutelist',
permissao: 'ADM',
categoria: 'admin'
},
async executar(ctx) {
const { isGroup, isGroupAdmins, SoDono, dataGp, reply, mess } = ctx
if (!isGroup)
return reply(mess.sogrupo())
if (!isGroupAdmins && !SoDono)
return reply(mess.soadm())
const lista = Array.isArray(dataGp?.[0]?.silenciados) ? dataGp[0].silenciados : []
return reply(mess.muteLista(lista), lista.map(x => x.id))
}
}
)
