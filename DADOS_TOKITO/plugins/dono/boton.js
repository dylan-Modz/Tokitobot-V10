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
nome: "boton",
comandos: ["boton", "botoff"],
categoria: "dono",
info: {
"descricao": "Executa o comando boton.",
"uso": "boton",
"categoria": "dono"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(mess.onlyOwner())
if (!isBotoff) {
nescessario.botoff = true
fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
await reagir(from, '🔴')
await reply(mess.padraoStatus({
emoji: '🤖',
titulo: 'BOT',
ativo: false,
descricao: 'O uso do bot por membros e administradores foi pausado.'
}))
}
else {
nescessario.botoff = false
fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
await reagir(from, '🟢')
await reply(mess.padraoStatus({
emoji: '🤖',
titulo: 'BOT',
ativo: true,
descricao: 'O uso do bot por membros e administradores foi liberado novamente.'
}))
}
}
}
}
}
)
