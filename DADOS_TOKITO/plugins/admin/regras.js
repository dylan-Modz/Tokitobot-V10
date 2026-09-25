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
nome: "regras",

comandos: [
"regras",
"rules"
],

categoria: "grupo",

info: {
descricao: "Mostra as regras e informações do grupo.",
uso: "regras",
categoria: "grupo"
},

async executar(ctx) {
with (ctx) {

if (!isGroup) {
return reply(mess.sogrupo())
}

try {

await reagir(from, "📜")

const metadata = await tokito
.groupMetadata(from)
.catch(() => null)

if (!metadata) {
return reply(mess.padraoErro({
titulo: "REGRAS",
descricao: "Não consegui obter as informações deste grupo."
}))
}

const nomeGrupo =
metadata.subject ||
groupName ||
"Grupo"

const participantes =
Array.isArray(metadata.participants)
? metadata.participants
: []

const membros = participantes.length

const admins = participantes.filter(
membro =>
membro?.admin === "admin" ||
membro?.admin === "superadmin"
).length

const descricao =
String(metadata.desc || "").trim() ||
"Este grupo ainda não possui uma descrição definida."

const texto =
`- 📜 \`𝚁𝙴𝙶𝚁𝙰𝚂 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`

『 👥 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${nomeGrupo}
『 👤 \`𝙼𝙴𝙼𝙱𝚁𝙾𝚂\` 』— ${membros}
『 👑 \`𝙰𝙳𝙼𝙸𝙽𝚂\` 』— ${admins}

『 📋 \`𝚁𝙴𝙶𝚁𝙰𝚂\` 』

> Leia com atenção e respeite as regras abaixo para manter uma boa convivência no grupo. 🤝

${descricao}`

await tokito.sendMessage(
from,
{
text: texto,

contextInfo:
typeof canalInfo === "function"
? canalInfo([])
: {}
},
{
quoted: selo
}
)

await reagir(from, "✅")

} catch (e) {

console.log(
"[REGRAS]",
e?.message || e
)

return reply(mess.padraoErro({
titulo: "REGRAS",
descricao: "Não consegui carregar as regras deste grupo."
}))

}

}
}
})
