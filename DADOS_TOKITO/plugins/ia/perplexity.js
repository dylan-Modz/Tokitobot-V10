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
nome: "perplexity",
comandos: ["perplexity", "perplexityai", "ppx"],
categoria: "ia",
info: {
"descricao": "Executa o comando perplexity.",
"uso": "perplexity",
"categoria": "ia"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q)
return reply(mess.padraoUso({
emoji: '🧠',
titulo: 'PERPLEXITY',
uso: `${prefix}${command} sua pergunta`,
descricao: 'Digite sua pergunta para a IA.'
}))
const pergunta = encodeURIComponent(q.trim())
const apiUrl = `${API_URL}/api/perplexity-ai?q=${pergunta}&query=${pergunta}&apikey=${API_KEY_TOKITO}`
const { data } = await axios.get(apiUrl)
if (!data || data.status !== true || !data.resposta) {
return reply(mess.padraoErro({
titulo: 'PERPLEXITY',
descricao: 'A IA não retornou uma resposta válida.'
}))
}
await reply(data.resposta)
}
catch (e) {
console.log('[API]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
reply(mess.erroApi(API_URL))
}
}
}
}
}
)
