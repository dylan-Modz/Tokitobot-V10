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
nome: "darkgreen",
comandos: [
"darkgreen",
"glitch",
"write",
"advancedglow",
"typography",
"pixelglitch",
"neonglitch",
"flag",
"flag3d",
"deleting",
"blackpink",
"glowing",
"underwater",
"logomaker",
"cartoon",
"papercut",
"watercolor",
"affectclouds",
"blackpinklogo",
"gradient",
"summerbeach",
"luxurygold",
"sandsummer",
"galaxywallpaper",
"1917",
"markingneon",
"royal",
"freecreate",
"galaxy",
"lighteffects",
"neondevil",
"frozen",
"metal3d",
"ligatures",
"sunset",
"clouds",
"colorido",
"desfoque",
"naruto",
"amongus",
"comic3d"
],
categoria: "logos",
info: {
"descricao": "Executa o comando darkgreen.",
"uso": "darkgreen",
"categoria": "logos"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q.trim())
return reply(mess.usologo(prefix, command))
await reagir(from, '🎨')
const url = `${API_URL}/api/${command}?texto=${encodeURIComponent(q.trim())}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
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
console.log('[ERRO LOGO]', modulos.sanitizarErro(erro, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
return reply(mess.erroApi(API_URL))
}
}
}
}
}
)
