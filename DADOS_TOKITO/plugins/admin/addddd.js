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
nome: "addddd",
comandos: ["addddd"],
categoria: "grupo",
info: {
"descricao": "Executa o comando addddd.",
"uso": "addddd",
"categoria": "grupo"
},
async executar(ctx) {
with (ctx) {
{
if (!isGroup)
return reply(mess.sogrupo())
if (!isGroupAdmins)
return reply(mess.soadm())
const ddds = [
...new Set(String(q || '').split(/[\s,;|]+/).map(v => v.replace(/\D/g, '')).filter(v => /^\d{2}$/.test(v) && v !== '00'))
]
if (!ddds.length)
return reply(mess.dddUso(prefix, command))
const lista = dataGp[0].funcoes.antiddd.listaProibidos
const novos = ddds.filter(ddd => !lista.includes(ddd))
if (!novos.length)
return reply(mess.dddJaCadastrado(ddds))
dataGp[0].funcoes.antiddd.listaProibidos = [...lista, ...novos]
setGp(dataGp)
await reagir(from, '✅')
return reply(mess.dddAdicionado(novos))
}
}
}
}
)
