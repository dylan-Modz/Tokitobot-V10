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
nome: "mines",
comandos: ["mines"],
categoria: "jogos",
info: {
"descricao": "Executa o comando mines.",
"uso": "mines",
"categoria": "jogos"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!isGroup)
return reply(mess.sogrupo())
if (!modoJogosAtivo(from, dataGp))
return reply(mess.modoJogosDesativado(prefix))
const jogoExiste = getMinesGame(from)
if (jogoExiste)
return reply(mess.minesEmAndamento())
const novoGame = criarMinesGame(from, sender)
saveMinesGame(novoGame)
await reagir(from, '💣')
await enviarMines(contextoJogos('mines'), novoGame)
}
catch (e) {
console.log('[MINES]', e?.message || e)
await reply(mess.minesErro())
}
}
}
}
}
)
