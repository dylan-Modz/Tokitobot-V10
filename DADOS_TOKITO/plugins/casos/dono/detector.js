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
nome: "detector",
comandos: ["detector"],
categoria: "dono",
info: {
"descricao": "Executa o comando detector.",
"uso": "detector",
"categoria": "dono"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(mess.onlyOwner())
try {
const acao = String(q || '').trim()
if (!acao)
return reply(mess.detectorUso(prefix))
if (acao.toLowerCase() === 'status') {
return reply(mess.detectorStatus(detector.status()))
}
if (['sair', 'off', '0'].includes(acao.toLowerCase())) {
await detector.sair()
return reply(mess.detectorSaiu())
}
const numero = acao.replace(/\D/g, '')
if (numero.length < 11 || numero.length > 15)
return reply(mess.detectorNumero(prefix))
const dados = await detector.parear(numero, tokito)
if (dados.registrado)
return reply(mess.detectorConectado(dados.numero, dados.conectado))
return reply(mess.detectorCodigo(numero, dados.codigo))
}
catch (error) {
console.log('[DETECTOR]', error?.message || error)
return reply(mess.detectorErro())
}
}
}
}
}
