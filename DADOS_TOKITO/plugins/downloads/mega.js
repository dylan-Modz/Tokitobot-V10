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

const scraper = require('../../scrapers/downloads/mega')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "mega",
comandos: ["mega", "mg"],
categoria: "downloads",
info: {
"descricao": "Executa o comando mega.",
"uso": "mega",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(mess.downloadUso({ tipo: 'LINK MEGA', prefix, command, exemplo: 'https://mega.nz/file/...' }))
await reagir(from, '📦')
await reply(mess.wait())
const res = await scraper.buscar(q.trim())
if (!res?.status || !res?.download)
return reply(res?.resultado || mess.downloadNaoEncontrado('ARQUIVO'))
const nome = limpar(res?.filename || decodeURIComponent(String(res.download).split('/').pop().split('?')[0]))
await reply(mess.padraoInfo({
emoji: '📦',
titulo: 'MEGA',
linhas: [
{ rotulo: '📁 𝙽𝙾𝙼𝙴', valor: nome },
{ rotulo: '📦 𝚃𝙰𝙼𝙰𝙽𝙷𝙾', valor: res?.filesize || 'Desconhecido' }
]
}))
await tokito.sendMessage(from, {
document: { url: res.download },
mimetype: res?.mimetype || 'application/octet-stream',
fileName: nome,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
await reagir(from, '✅')
}
catch (e) {
console.log('[MEGA]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
)
