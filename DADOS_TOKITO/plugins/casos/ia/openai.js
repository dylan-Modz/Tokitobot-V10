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
nome: "openai",
comandos: ["openai", "gpt", "chatgpt"],
categoria: "ia",
info: {
"descricao": "Executa o comando openai.",
"uso": "openai",
"categoria": "ia"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q)
return reply('ᴅɪɢɪᴛᴇ sᴜᴀ ᴘᴇʀɢᴜɴᴛᴀ.')
await reagir(from, '💬')
const apiUrl = `${API_URL}/api/openai?q=${encodeURIComponent(q)}&apikey=${API_KEY_TOKITO}`
const { data } = await axios.get(apiUrl)
if (!data || !data.status || !data.resposta) {
await reagir(from, '❌')
return reply('ᴇʀʀᴏ ᴀᴏ ᴏʙᴛᴇʀ ʀᴇsᴘᴏsᴛᴀ.')
}
await reply(data.resposta)
await reagir(from, '✅')
}
catch (e) {
console.log('[API]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌')
reply(mess.erroApi(API_URL))
}
}
}
}
}
