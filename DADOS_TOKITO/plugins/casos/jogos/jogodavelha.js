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
nome: "jogodavelha",
comandos: ["jogodavelha", "jogov", "jv", "velha"],
categoria: "jogos",
info: {
"descricao": "Executa o comando jogodavelha.",
"uso": "jogodavelha",
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
const jogoExiste = getVelhaGame(from)
if (jogoExiste)
return reply(mess.velhaEmAndamento())
if (!menc_os2)
return reply(mess.jogoMarquePessoa(prefix, command))
if (mesmoJid(menc_os2, sender))
return reply(mess.jogoNaoPodeDesafiar())
const novoGame = {
grupo: from,
X: sender,
O: menc_os2,
board: criarTabuleiroVelha(),
turno: 'X',
status: false,
finalizado: false,
vencedor: null,
iniciadoEm: Date.now()
}
saveVelhaGame(novoGame)
await reagir(from, '❌')
await enviarTextoJogos(contextoJogos(command), mess.jogoConviteVelha(mencionarJogo(menc_os2), mencionarJogo(sender), prefix), [menc_os2, sender], [
{
texto: mess.botaoAceitar(),
id: 's'
},
{
texto: mess.botaoRecusar(),
id: 'n'
}
])
}
catch (e) {
console.log('[JOGO DA VELHA]', e?.message || e)
await reply(mess.velhaErro())
}
}
}
}
}
