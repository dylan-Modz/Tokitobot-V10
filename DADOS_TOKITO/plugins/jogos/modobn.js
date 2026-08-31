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
nome: "modobn",
comandos: ["modobn", "modobrincadeira", "modobrincadeiras"],
categoria: "jogos",
info: {
"descricao": "Executa o comando modobn.",
"uso": "modobn",
"categoria": "jogos"
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
return reply(mess.modoBnUso(prefix, command))
if (acao === '1' && isModobn)
return reply(mess.modoBnJaAtivado())
if (acao === '0' && !isModobn)
return reply(mess.modoBnJaDesativado())
dataGp[0].jogos = acao === '1'
setGp(dataGp)
await reagir(from, acao === '1' ? '✅' : '❌')
await reply(acao === '1' ? mess.modoBnAtivado() : mess.modoBnDesativado())
}
}
}
}
)
