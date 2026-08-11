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
nome: "verificado",
comandos: ["verificado", "selo"],
categoria: "dono",
info: {
"descricao": "Executa o comando verificado.",
"uso": "verificado",
"categoria": "dono"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(Res_SoDono)
nescessario.verificado = !nescessario.verificado
fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
selo = nescessario.verificado ? SeloMeta : info
if (nescessario.verificado) {
await reply(mess.verifiedEnabled())
}
else {
await reply(mess.verifiedDisabled())
}
}
}
}
}
