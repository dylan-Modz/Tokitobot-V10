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

/* Limpeza visual do chat.
 * Dev: Dylan Modz
 */

const sleep = ms => {
return new Promise(resolve => {
setTimeout(resolve, ms)
})
}

const clear = `🗑️${"\n".repeat(150)}🗑️
❲❗❳ *Lɪᴍᴘᴇᴢᴀ ᴅᴇ Cʜᴀᴛ* ✅`

module.exports = {
nome: "limpar",

comandos: [
"limpar"
],

categoria: "admin",

info: {
descricao: "Realiza uma limpeza visual no chat do grupo.",
uso: "limpar",
categoria: "admin"
},

async executar(ctx) {
with (ctx) {
if (!isGroup) {
return reply(
mess.onlyGroup()
)
}

if (!isGroupAdmins) {
return reply(
mess.onlyAdmins()
)
}

if (!isBotGroupAdmins) {
return reply(
mess.onlyBotAdmin()
)
}

await reagir(
from,
"🗑️"
)

await reply(
"*ʟɪᴍᴘᴇᴢᴀ ᴅᴇ ᴄʜᴀᴛ 💁‍♂️*"
)

await sleep(
1000
)

for (
let i = 0;
i < 10;
i++
) {
await reply(
clear
)

await sleep(
300
)
}

await reply(
"*ᴘʀᴏɴᴛᴏ sᴇɴʜᴏʀ, ᴀᴄᴀʙᴇɪ ᴅᴇ ʟɪᴍᴘᴀʀ ᴏ ᴄʜᴀᴛ 🙇‍♂️*"
)
}
}
}
