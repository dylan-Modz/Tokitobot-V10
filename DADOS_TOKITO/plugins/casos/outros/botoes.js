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
nome: "botoes",
comandos: ["botoes", "botoesbot"],
categoria: "outros",
info: {
"descricao": "Executa o comando botoes.",
"uso": "botoes",
"categoria": "outros"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(mess.onlyOwner())
const acao = String(q || '').trim()
if (!['0', '1'].includes(acao))
return reply(mess.botoesUso(prefix, command))
if (acao === '1' && isBotoes)
return reply(mess.botoesJaAtivados())
if (acao === '0' && !isBotoes)
return reply(mess.botoesJaDesativados())
nescessario.botoes = acao === '1'
fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
await reagir(from, acao === '1' ? '✅' : '❌')
await reply(acao === '1' ? mess.botoesAtivados() : mess.botoesDesativados())
}
}
}
}
