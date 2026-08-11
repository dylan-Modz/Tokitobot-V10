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
nome: "gemini-pro",
comandos: ["gemini-pro"],
categoria: "outros",
info: {
"descricao": "Executa o comando gemini-pro.",
"uso": "gemini-pro",
"categoria": "outros"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply('*❌ | Faça uma pergunta para a IA.*')
await reagir(from, '✨')
const apiUrl = `${API_URL}/api/gemini-pro?texto=${encodeURIComponent(q.trim())}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
const { data } = await axios.get(apiUrl, { timeout: 90000 })
let resposta = ''
if (typeof data?.resposta === 'string') {
resposta = data.resposta.trim()
}
else if (data?.resposta?.candidates?.length) {
resposta = data.resposta.candidates[0]?.content?.parts?.map(parte => parte?.text || '').join('').trim()
}
else if (data?.candidates?.length) {
resposta = data.candidates[0]?.content?.parts?.map(parte => parte?.text || '').join('').trim()
}
else if (typeof data?.resultado === 'string') {
resposta = data.resultado.trim()
}
else if (typeof data?.result === 'string') {
resposta = data.result.trim()
}
if (!resposta) {
await reagir(from, '❌')
return reply('*❌ | A IA não retornou nenhuma resposta.*')
}
await tokito.sendMessage(from, {
text: resposta,
contextInfo: canalInfo([sender])
}, { quoted: selo })
await reagir(from, '✅')
}
catch (error) {
console.log('[GEMINI PRO ERRO]', modulos.sanitizarErro(error, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
