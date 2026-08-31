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

const scraper = require('../../scrapers/downloads/playstore')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "playstore",
comandos: ["playstore"],
categoria: "downloads",
info: {
"descricao": "Executa o comando playstore.",
"uso": "playstore",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(mess.downloadUso({ tipo: 'APP', prefix, command, exemplo: 'whatsapp' }))
await reagir(from, '📱')
await reply(mess.wait())
const dados = await scraper.buscar(q.trim())
const lista = Array.isArray(dados) ? dados.slice(0, 5) : itens(dados).slice(0, 5)
if (!lista.length)
return reply(mess.downloadNaoEncontrado('APP'))
const texto = mess.padraoInfo({
emoji: '📱',
titulo: 'PLAY STORE',
linhas: [
{ rotulo: '🔎 𝙱𝚄𝚂𝙲𝙰', valor: q.trim() },
...lista.map((item, index) => ({
rotulo: `${index + 1}`,
valor: `${item?.nome || item?.name || item?.title || 'Aplicativo'}\n> *『 🔗 𝙻𝙸𝙽𝙺 』— ${item?.link || item?.url || 'Indisponível'}*`
}))
]
})
await reply(texto)
await reagir(from, '✅')
}
catch (e) {
console.log('[PLAYSTORE]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
)
