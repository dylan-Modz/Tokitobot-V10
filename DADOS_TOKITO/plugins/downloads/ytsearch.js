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

const scraper = require('../../scrapers/downloads/ytsearch')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "ytsearch",
comandos: ["ytsearch", "yts"],
categoria: "downloads",
info: {
"descricao": "Executa o comando ytsearch.",
"uso": "ytsearch",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(mess.downloadUso({ tipo: 'VÍDEO', prefix, command, exemplo: 'matue 1993' }))
await reagir(from, '🔎')
await reply(mess.wait())
const dados = await scraper.buscar(q.trim())
const lista = itens(dados).slice(0, 5)
if (!lista.length)
return reply(mess.downloadNaoEncontrado('VÍDEO'))
let texto = `*🔎 | ʏᴏᴜᴛᴜʙᴇ sᴇᴀʀᴄʜ*\n\n- *🔍 | ʙᴜsᴄᴀ → ${q.trim()}*\n\n`
for (let i = 0; i < lista.length; i++) {
const item = lista[i]
texto += `*${i + 1}. ${item?.title || item?.titulo || 'Sem título'}*\n- *📺 | ᴄᴀɴᴀʟ → ${item?.author?.name || item?.canal || item?.channel || 'Desconhecido'}*\n- *⏱️ | ᴅᴜʀᴀᴄᴀᴏ → ${item?.timestamp || item?.duration || item?.duracao || '0:00'}*\n- *🔗 | ʟɪɴᴋ → ${item?.url || item?.link || ''}*\n\n`
}
const capa = achar(lista[0]?.thumbnail, lista[0]?.image, lista[0]?.thumb)
if (capa)
await tokito.sendMessage(from, {
image: { url: capa },
caption: texto,
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo })
else
await reply(texto)
await reagir(from, '✅')
}
catch (e) {
console.log('[YTSEARCH]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
)
