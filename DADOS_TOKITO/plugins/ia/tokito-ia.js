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
nome: "tokito-ia",
comandos: ["tokito-ia"],
categoria: "ia",
info: {
"descricao": "Executa o comando tokito-ia.",
"uso": "tokito-ia",
"categoria": "ia"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(mess.padraoUso({
emoji: '🧠',
titulo: 'TOKITO IA',
uso: `${prefix}${command} sua pergunta`,
descricao: 'Faça uma pergunta para a Tokito IA.'
}))
const apiUrl = `${API_URL}/api/tokito-ia?texto=${encodeURIComponent(q.trim())}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
const { data } = await axios.get(apiUrl, { timeout: 90000 })
const resposta = String(data?.resposta ||
data?.resultado ||
data?.result ||
data?.message ||
data?.texto ||
'').trim()
if (!resposta) {
return reply(mess.padraoErro({
titulo: 'TOKITO IA',
descricao: 'A Tokito IA não retornou nenhuma resposta agora.'
}))
}
await tokito.sendMessage(from, {
text: resposta,
contextInfo: canalInfo([sender])
}, { quoted: selo })
}
catch (error) {
console.log('[TOKITO IA ERRO]', modulos.sanitizarErro(error, [API_KEY_TOKITO]))
await reply(mess.erroApi(API_URL))
}
}
}
}
}
)
