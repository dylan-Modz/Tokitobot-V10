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

const scraper = require('../../scrapers/downloads/tiktoksearch')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "tiktoksearch",
comandos: ["tiktoksearch"],
categoria: "downloads",
info: {
"descricao": "Executa o comando tiktoksearch.",
"uso": "tiktoksearch",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(mess.downloadUso({ tipo: 'VÍDEO', prefix, command, exemplo: 'edit tokito' }))
await reagir(from, '🔎')
await reply(mess.wait())
const dados = await scraper.buscar(q.trim())
const lista = itens(dados)
if (!lista.length)
return reply(mess.downloadNaoEncontrado('VÍDEO'))
const item = lista[Math.floor(Math.random() * lista.length)]
const link = achar(item?.video_sem_marca, item?.video, item?.download, item?.url)
if (!link)
return reply(mess.downloadSemMidia('VÍDEO'))
await tokito.sendMessage(from, {
video: { url: link },
mimetype: 'video/mp4',
caption: item?.titulo || item?.title || undefined,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
await reagir(from, '✅')
}
catch (e) {
console.log('[TIKTOK SEARCH]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
)
