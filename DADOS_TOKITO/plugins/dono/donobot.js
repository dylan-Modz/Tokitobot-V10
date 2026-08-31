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
nome: "donobot",
comandos: ["donobot", "numero-dono"],
categoria: "dono",
info: {
"descricao": "Executa o comando donobot.",
"uso": "donobot",
"categoria": "dono"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(mess.onlyOwner())
let alvo = menc_os2 || menc_prt || String(q || '')
if (Array.isArray(alvo))
alvo = alvo[0]
alvo = normalizar(alvo)
let numero = String(alvo || '').split('@')[0].replace(/\D/g, '')
if (!numero)
numero = String(q || '').replace(/\D/g, '')
if (!numero)
return reply(mess.mainOwnerRequired(prefix))
setting.ownerNumber = numero
fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/config-all.json', JSON.stringify(setting, null, 2))
await tokito.sendMessage(from, {
text: mess.mainOwnerChanged(numero),
contextInfo: {
...newsletter,
mentionedJid: [`${numero}@s.whatsapp.net`]
}
}, {
quoted: selo
})
}
}
}
}
)
