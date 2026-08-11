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
nome: "getbio",
comandos: ["getbio"],
categoria: "info",
info: {
"descricao": "Executa o comando getbio.",
"uso": "getbio",
"categoria": "info"
},
async executar(ctx) {
with (ctx) {
{
try {
const dados = await destino()
if (!dados) {
return reply(mess.getUsuarioUso({
prefix,
command
}))
}
await reagir(from, '🗿')
await reply(mess.getBioCarregando())
let status = await tokito
.fetchStatus(dados.consulta)
.catch(() => null)
if (!status &&
dados.consulta !== dados.alvo) {
status = await tokito
.fetchStatus(dados.alvo)
.catch(() => null)
}
const bio = status?.status?.status ||
status?.status ||
status?.[0]?.status?.status ||
status?.[0]?.status ||
'Privado ou sem recado'
await tokito.sendMessage(from, {
text: mess.getBioResultado({
numero: dados.numero,
bio
}),
mentions: [dados.mencao],
contextInfo: {
...canalInfo([dados.mencao]),
mentionedJid: [dados.mencao]
}
}, {
quoted: selo
})
await reagir(from, '✅')
}
catch (e) {
console.log('Erro getbio:', e)
await reagir(from, '❌').catch(() => {
})
return reply(mess.error())
}
}
}
}
}
