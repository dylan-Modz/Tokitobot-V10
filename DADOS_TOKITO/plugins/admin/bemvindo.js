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
nome: "bemvindo",
comandos: ["bemvindo"],
categoria: "grupo",
info: {
"descricao": "Executa o comando bemvindo.",
"uso": "bemvindo",
"categoria": "grupo"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!isGroup)
return reply(mess.sogrupo())
if (!isGroupAdmins)
return reply(mess.soadm())
if (!isBotGroupAdmins)
return reply(mess.botadm())
dataGp[0].name = groupName
dataGp[0].wellcome[0].bemvindo1 = !isWelkom
setGp(dataGp)
await reagir(from, dataGp[0].wellcome[0].bemvindo1 ? '✅' : '❌')
return reply(mess.bemvindo(dataGp[0].wellcome[0].bemvindo1))
}
catch (e) {
console.log('Erro no bemvindo:', e)
return reply(mess.error())
}
}
}
}
}
)
