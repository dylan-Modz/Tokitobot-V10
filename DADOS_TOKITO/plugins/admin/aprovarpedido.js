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
nome: "aprovarpedido",
comandos: ["aprovarpedido"],
categoria: "grupo",
info: {
"descricao": "Executa o comando aprovarpedido.",
"uso": "aprovarpedido",
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
const resultado = await funcoes.aprovacao.decidir({
tokito,
grupo: from,
alvo: q,
acao: 'approve'
})
if (resultado.vazio)
return reply(mess.semPedidos())
if (resultado.indisponivel)
return reply(mess.pedidoIndisponivel(funcoes.base.numero(resultado.jid)))
await tokito.sendMessage(from, {
text: mess.pedidoAprovado(funcoes.base.numero(resultado.jid)),
contextInfo: {
...newsletter,
mentionedJid: [resultado.jid]
}
}, { quoted: selo })
}
catch (error) {
console.log('[APROVAR PEDIDO]', error)
await reply(mess.error())
}
}
}
}
}
)
