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
nome: "legendabv2",
comandos: ["legendabv2", "legendasaiu2", "legendabv3", "legendasaiu3"],
categoria: "grupo",
info: {
"descricao": "Executa o comando legendabv2.",
"uso": "legendabv2",
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
if (!q)
return reply(mess.tags(prefix, command))
const indice = command.endsWith('2') ? 1 : 2
const campo = command.startsWith('legendabv') ? `legendabv${indice + 1}` : `legendasaiu${indice + 1}`
dataGp[0].wellcome[indice][campo] = String(q).trim()
setGp(dataGp)
await reagir(from, '✅')
return reply(mess.legendaModo(indice + 1, campo.startsWith('legendabv') ? 'entrada' : 'saída'))
}
catch (e) {
console.log('Erro nas legendas extras do bem-vindo:', e)
return reply(mess.error())
}
}
}
}
}
)
