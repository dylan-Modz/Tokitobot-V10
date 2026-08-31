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
nome: "getbanner",
comandos: ["getbanner"],
categoria: "info",
info: {
"descricao": "Executa o comando getbanner.",
"uso": "getbanner",
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
await reagir(from, '🖼️')
await reply(mess.getBannerCarregando())
let biz = await tokito
.getBusinessProfile(dados.consulta)
.catch(() => null)
if (!biz &&
dados.consulta !== dados.alvo) {
biz = await tokito
.getBusinessProfile(dados.alvo)
.catch(() => null)
}
const banner = biz?.coverPhotoUrl ||
biz?.cover_photo?.url ||
biz?.coverPhoto?.url ||
biz?.coverPhoto ||
null
if (!banner) {
await reagir(from, '❌')
return reply(mess.getBannerNaoEncontrado({
numero: dados.numero
}), [dados.mencao])
}
await tokito.sendMessage(from, {
image: {
url: banner
},
caption: mess.getBannerResultado({
numero: dados.numero
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
console.log('Erro getbanner:', e)
await reagir(from, '❌').catch(() => {
})
return reply(mess.error())
}
}
}
}
}
)
