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

const scraper = require('../../scrapers/downloads/soundcloud')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "soundcloud",
comandos: ["soundcloud", "soundplay", "sc"],
categoria: "downloads",

info: {
descricao: "Executa o comando soundcloud.",
uso: "soundcloud",
categoria: "downloads"
},

async executar(ctx) {
with (ctx) {
try {
if (!q || !q.trim()) {
return reply(mess.downloadUso({ tipo: 'MÚSICA', prefix, command, exemplo: 'mc poze' }))
}

await reagir(from, '☁️')

const dados = await scraper.buscar(q.trim())

const res =
dados?.resultado ||
dados?.result ||
dados?.data

if (!res) {
await reagir(from, '❌')

return reply(mess.downloadNaoEncontrado('MÚSICA'))
}

const titulo =
res?.titulo ||
res?.title ||
'SoundCloud'

const artista =
res?.autor ||
res?.artist ||
res?.author ||
'Desconhecido'

const duracao =
res?.duracao ||
res?.duration ||
'Não informado'

const publicado =
res?.publicado ||
res?.published ||
res?.date ||
'Não informado'

const genero =
res?.genero ||
res?.genre ||
'Não informado'

const likes =
res?.likes ??
res?.like_count ??
0

const comentarios =
res?.comentarios ??
res?.comments ??
res?.comment_count ??
0

const url =
res?.url ||
res?.link ||
q.trim()

const capa = achar(
res?.imagem,
res?.image,
res?.thumbnail,
res?.artwork
)

const link = achar(
res?.audio,
res?.download,
res?.download_url,
res?.audio_url
)

if (!link) {
await reagir(from, '❌')

return reply(mess.downloadSemMidia('ÁUDIO'))
}

const numeroUsuario = sender.split('@')[0]

const formatarNumero = (numero) => {
const valor = Number(numero)

if (!Number.isFinite(valor)) {
return String(numero || '0')
}

return valor.toLocaleString('pt-BR')
}

const texto = `⏤͟͟͞͞𝐌𝐮́𝐬𝐢𝐜𝐚 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐝𝐚! 𖤐⃝☁️
•
> ╭ ℹ️ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒
> *[✏️]* • *𝚝𝚒́𝚝𝚞𝚕𝚘:* *${titulo}*
> *[👨‍🎤]* • *ᴀᴜᴛᴏʀ:* ${artista}
> *[⏱️]* • *ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ:* ${duracao}
> *[📆]* • *ᴘᴜʙʟɪᴄᴀᴅᴏ:* ${publicado}
> *[❤️]* • *ʟɪᴋᴇs:* ${formatarNumero(likes)}
> *[💬]* • *ᴄᴏᴍᴇɴᴛᴀ́ʀɪᴏs:* ${formatarNumero(comentarios)}
> *[🎵]* • *ɢᴇ̂ɴᴇʀᴏ:* ${genero}
> *[🔗]* • *ʟɪɴᴋ:* ${url}
•
> *[🎼]* • *𝙴𝚗𝚟𝚒𝚊𝚗𝚍𝚘 𝚘 𝚜𝚎𝚞 𝚊́𝚞𝚍𝚒𝚘* _@${numeroUsuario}_`

const contextInfo = {
...newsletter,
mentionedJid: [sender]
}

if (capa) {
await tokito.sendMessage(
from,
{
image: {
url: capa
},

caption: texto,

contextInfo
},
{
quoted: selo
}
)
} else {
await tokito.sendMessage(
from,
{
text: texto,
contextInfo
},
{
quoted: selo
}
)
}

await tokito.sendMessage(
from,
{
audio: {
url: link
},

mimetype: 'audio/mpeg',

fileName: `${limpar(titulo)}.mp3`,

ptt: false,

contextInfo
},
{
quoted: selo
}
)

await reagir(from, '✅')
} catch (e) {
console.log(
'[SOUNDCLOUD]',
modulos.sanitizarErro(
e,
[API_KEY_TOKITO]
)
)

await reagir(from, '❌').catch(() => {})

await reply(
mess.erroApi(API_URL)
)
}
}
}
}
)
