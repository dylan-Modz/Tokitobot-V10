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
nome: "bemvindo2",
comandos: ["bemvindo2"],
categoria: "grupo",
info: {
"descricao": "Executa o comando bemvindo2.",
"uso": "bemvindo2",
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
dataGp[0].wellcome[1].bemvindo2 = !isWelkom2
setGp(dataGp)
await reagir(from, dataGp[0].wellcome[1].bemvindo2 ? '✅' : '❌')
return reply(mess.bemvindoModo(2, dataGp[0].wellcome[1].bemvindo2))
}
catch (e) {
console.log('Erro no bemvindo2:', e)
return reply(mess.error())
}
}
}
}
}
