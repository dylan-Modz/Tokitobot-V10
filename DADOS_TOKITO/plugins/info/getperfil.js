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
nome: "getperfil",
comandos: ["getperfil"],
categoria: "info",
info: {
"descricao": "Executa o comando getperfil.",
"uso": "getperfil",
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
const padrao = 'https://raw.githubusercontent.com/dylanModz/uploadsgg/main/midias/imagens/9841648c3df.jpg'
await reagir(from, '⚡')
await reply(mess.getPerfilCarregando())
let foto = await tokito
.profilePictureUrl(dados.consulta, 'image')
.catch(() => null)
if (!foto &&
dados.consulta !== dados.alvo) {
foto = await tokito
.profilePictureUrl(dados.alvo, 'image')
.catch(() => null)
}
if (!foto)
foto = padrao
await tokito.sendMessage(from, {
image: {
url: foto
},
caption: mess.getPerfilResultado({
numero: dados.numero,
prefix
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
console.log('Erro getperfil:', e)
await reagir(from, '❌').catch(() => {
})
return reply(mess.error())
}
}
}
}
}
)
