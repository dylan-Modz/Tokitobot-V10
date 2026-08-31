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

/* Link de convite do grupo.
 * Dev: Dylan Modz
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "linkgrupo",

comandos: [
"linkgrupo",
"linkgp"
],

categoria: "grupo",

info: {
descricao: "Puxa o link de convite do grupo atual.",
uso: "linkgrupo",
categoria: "grupo"
},

async executar(ctx) {
with (ctx) {
if (!isGroup) {
return reply(
mess.onlyGroup()
)
}

if (!isBotGroupAdmins) {
return reply(
mess.onlyBotAdmin()
)
}

try {
await reagir(
from,
"🔗"
)

const metadata = await tokito
.groupMetadata(from)
.catch(() => null)

const nomeGrupo =
metadata?.subject ||
groupName ||
"Grupo"

const codigo = await tokito
.groupInviteCode(from)

if (!codigo) {
return reply(mess.padraoErro({
titulo: 'LINK DO GRUPO',
descricao: 'Não consegui obter o link deste grupo.'
}))
}

const link =
`https://chat.whatsapp.com/${codigo}`

const texto =
`- 🔗 \`𝙻𝙸𝙽𝙺 𝙳𝙾 𝙶𝚁𝚄𝙿𝙾\`

『 👥 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${nomeGrupo}

『 🔗 \`𝙻𝙸𝙽𝙺\` 』
${link}

> *Toque no link acima para entrar no grupo.*`

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

await reagir(
from,
"✅"
)
}
catch (e) {
console.log(
"[LINK GRUPO]",
e?.message || e
)

return reply(mess.padraoErro({
titulo: 'LINK DO GRUPO',
descricao: 'Não consegui obter o link deste grupo.'
}))
}
}
}
}
)
