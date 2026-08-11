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
nome: "channel",
comandos: ["channel", "setchannel"],
categoria: "dono",
info: {
"descricao": "Executa o comando channel.",
"uso": "channel",
"categoria": "dono"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(mess.onlyOwner())
const entradaCanal = String(q || '').trim()
if (!entradaCanal)
return reply(mess.channelRequired(prefix, command))
if (entradaCanal === '0') {
setting.channeldl = '0@newsletter'
fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/config-all.json', JSON.stringify(setting, null, 2))
return reply(mess.channelDisabled())
}
try {
let jidReal = entradaCanal.endsWith('@newsletter') ? entradaCanal : ''
if (!jidReal) {
const convite = entradaCanal
.replace(/.*whatsapp\.com\/channel\//i, '')
.replace(/.*wa\.me\/channel\//i, '')
.split(/[\/?\s]/)[0]
if (!convite)
return reply(mess.error())
const meta = await tokito.newsletterMetadata('invite', convite)
jidReal = meta?.jid || meta?.id || ''
}
if (!jidReal)
return reply(mess.error())
setting.channeldl = jidReal
fs.writeFileSync('./DADOS_TOKITO/INFO_DADOS/config-all.json', JSON.stringify(setting, null, 2))
await reply(mess.channelEnabled(jidReal, entradaCanal))
}
catch (e) {
console.log('[SETCHANNEL ERRO]', e)
await reply(mess.error())
}
}
}
}
}
