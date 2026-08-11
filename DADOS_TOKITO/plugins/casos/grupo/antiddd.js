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
nome: "antiddd",
comandos: ["antiddd"],
categoria: "grupo",
info: {
"descricao": "Executa o comando antiddd.",
"uso": "antiddd",
"categoria": "grupo"
},
async executar(ctx) {
with (ctx) {
{
if (!isGroup)
return reply(mess.sogrupo())
if (!isGroupAdmins)
return reply(mess.soadm())
if (!isBotGroupAdmins)
return reply(mess.botadm())
const acao = String(q || '').trim()
if (!['0', '1'].includes(acao))
return reply(mess.funcaoUsoSimples(prefix, command))
dataGp[0].funcoes.antiddd.ativo = acao === '1'
setGp(dataGp)
await reagir(from, acao === '1' ? '✅' : '❌')
return reply(mess.funcaoAlterada('ANTI-DDD', acao === '1'))
}
}
}
}
