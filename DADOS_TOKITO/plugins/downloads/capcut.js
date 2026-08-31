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

const scraper = require('../../scrapers/downloads/capcut')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "capcut",
comandos: ["capcut", "capcutdl"],
categoria: "downloads",
info: {
"descricao": "Executa o comando capcut.",
"uso": "capcut",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(mess.downloadUso({ tipo: 'LINK CAPCUT', prefix, command, exemplo: 'https://www.capcut.com/...' }))
await reagir(from, '🎬')
await reply(mess.wait())
const dados = await scraper.buscar(q.trim())
const res = dados?.resultado || dados?.result || dados?.data
if (!res)
return reply(mess.downloadNaoEncontrado('CAPCUT'))
const titulo = res?.title || res?.titulo || 'CapCut'
const capa = achar(res?.thumbnail, res?.thumb, res?.image)
const link = achar(res?.url, res?.download, res?.video)
if (!link)
return reply(mess.downloadSemMidia('VÍDEO'))
if (capa)
await tokito.sendMessage(from, {
image: { url: capa },
caption: mess.padraoInfo({ emoji: '🎬', titulo: 'CAPCUT', linhas: [{ rotulo: '🎞️ 𝚃𝙸́𝚃𝚄𝙻𝙾', valor: titulo }] }),
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
await tokito.sendMessage(from, {
video: { url: link },
mimetype: 'video/mp4',
caption: mess.padraoInfo({ emoji: '🎬', titulo: 'CAPCUT', linhas: [{ rotulo: '🎞️ 𝚃𝙸́𝚃𝚄𝙻𝙾', valor: titulo }] }),
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: capa ? undefined : selo })
await reagir(from, '✅')
}
catch (e) {
console.log('[CAPCUT]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
)
