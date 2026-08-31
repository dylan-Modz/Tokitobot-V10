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
nome: "modojogos",
comandos: ["modojogos"],
categoria: "jogos",
info: {
"descricao": "Executa o comando modojogos.",
"uso": "modojogos",
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
return reply(mess.funcaoUso('🎮', '𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂', prefix, command, mess.modoJogosDescricao()))
const ativo = modoJogosAtivo(from, dataGp)
if (acao === '1' && ativo)
return reply(mess.modoJogosJaAtivado())
if (acao === '0' && !ativo)
return reply(mess.modoJogosJaDesativado())
if (!dataGp?.[0]?.funcoes)
dataGp[0].funcoes = {}
dataGp[0].funcoes.modojogos = acao === '1'
setGp(dataGp)
await reply(acao === '1'
? mess.funcaoAtivada('🎮', '𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂', mess.modoJogosDescricao())
: mess.funcaoDesativada('🎮', '𝙼𝙾𝙳𝙾 𝙹𝙾𝙶𝙾𝚂', mess.modoJogosDesligadoDescricao()))
}
}
}
}
)
