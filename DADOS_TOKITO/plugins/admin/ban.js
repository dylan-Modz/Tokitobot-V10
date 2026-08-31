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
nome: "ban",
comandos: ["ban"],
categoria: "grupo",
info: {
"descricao": "Executa o comando ban.",
"uso": "ban",
"categoria": "grupo"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!isGroup)
return reply(mess.sogrupo())
if (!isGroupAdmins)
return reply(mess.soadm())
if (!isBotGroupAdmins)
return reply(mess.botadm())
let alvo = menc_os2 || menc_prt || String(q || '')
if (Array.isArray(alvo))
alvo = alvo[0]
if (!String(alvo).includes('@')) {
const numero = String(alvo).replace(/\D/g, '')
alvo = numero ? `${numero}@s.whatsapp.net` : ''
}
alvo = normalizar(alvo)
if (!alvo)
return reply(mess.marque())
if (alvo === botNumber)
return reply(mess.nobot())
if (numerodono.includes(alvo))
return reply(mess.nodono())
await tokito.groupParticipantsUpdate(from, [alvo], 'remove')
await tokito.sendMessage(from, {
text: mess.banido(alvo),
contextInfo: {
...newsletter,
mentionedJid: [alvo]
}
}, { quoted: selo })
}
catch (e) {
console.log('Erro no ban:', e)
await reply(mess.falha())
}
}
}
}
}
)
