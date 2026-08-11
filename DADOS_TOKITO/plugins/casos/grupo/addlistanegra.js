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
nome: "addlistanegra",
comandos: ["addlistanegra"],
categoria: "grupo",
info: {
"descricao": "Executa o comando addlistanegra.",
"uso": "addlistanegra",
"categoria": "grupo"
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
const alvo = alvoPorMarcacaoOuNumero()
if (!alvo)
return reply(mess.listaNegraUso(prefix, command))
if (alvo === botNormalizado)
return reply(mess.nobot())
if (numerodono.includes(alvo))
return reply(mess.nodono())
if (dataGp[0].listanegra.includes(alvo))
return reply(mess.listaNegraJaExiste(alvo))
dataGp[0].listanegra.push(alvo)
setGp(dataGp)
await reagir(from, '✅')
return reply(mess.listaNegraAdicionado(alvo), [alvo])
}
}
}
}
