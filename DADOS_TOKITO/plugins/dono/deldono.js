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
nome: "deldono",
comandos: ["deldono"],
categoria: "dono",
info: {
"descricao": "Executa o comando deldono.",
"uso": "deldono",
"categoria": "dono"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(mess.onlyOwner())
if (!q)
return reply(mess.ownerSlotRequired())
const numDono = Number(String(q).replace(/\D/g, ''))
if (!Number.isInteger(numDono) || numDono < 1 || numDono > 6) {
return reply(mess.ownerSlotInvalid())
}
const chave = `numero_dono${numDono}`
const numeroAntigo = String(nescessario[chave] || '').replace(/\D/g, '')
if (!numeroAntigo) {
return reply(mess.ownerSlotNotRegistered(numDono))
}
nescessario[chave] = '.'
fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/nescessario.json', JSON.stringify(nescessario, null, 2))
await tokito.sendMessage(from, {
text: mess.ownerRemoved(numeroAntigo),
contextInfo: {
...newsletter,
mentionedJid: [`${numeroAntigo}@s.whatsapp.net`]
}
}, {
quoted: selo
})
}
}
}
}
)
