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
nome: "pornhub",
comandos: ["pornhub", "deadpool", "thor", "captainamerica"],
categoria: "logos",
info: {
"descricao": "Executa o comando pornhub.",
"uso": "pornhub",
"categoria": "logos"
},
async executar(ctx) {
with (ctx) {
{
try {
const partes = String(q || '')
.split('|')
.map(item => item.trim())
if (partes.length < 2 ||
!partes[0] ||
!partes[1]) {
return reply(mess.usodupla(prefix, command))
}
await reagir(from, '🎨')
const texto = `${partes[0]}|${partes[1]}`
const url = `${API_URL}/api/${command}?texto=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
await tokito.sendMessage(from, {
image: { url },
caption: mess.logofeita(command),
contextInfo: canalInfo([sender])
}, {
quoted: selo
})
await reagir(from, '✅')
}
catch (erro) {
console.log('[ERRO LOGO DUPLA]', modulos.sanitizarErro(erro, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
return reply(mess.erroApi(API_URL))
}
}
}
}
}
