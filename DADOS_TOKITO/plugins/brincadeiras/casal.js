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
nome: 'casal',

comandos: [
'casal',
'casais'
],

categoria: 'brincadeiras',

info: {
descricao: 'Sorteia um casal do grupo e mostra a compatibilidade.',
uso: 'casal',
categoria: 'brincadeiras',
requisitos: 'Modo brincadeiras'
},

async executar(ctx) {
const {
isGroup,
isModobn,
reply,
mess,
prefix,
groupMembers,
membrosGrupo,
tokito,
from,
reagir,
API_URL,
canalInfo,
selo,
NomeDoBot
} = ctx

if (!isGroup)
return reply(
mess.sogrupo()
)

if (!isModobn)
return reply(
mess.onlyGroupFun(prefix)
)

const membros = [
...new Set(
(
membrosGrupo?.length
? membrosGrupo
: (groupMembers || []).map(x =>
x?.id ||
x?.jid ||
x?.participant ||
x
)
)
.filter(Boolean)
)
]

if (membros.length < 2)
return reply(
'- ❌ Preciso de pelo menos 2 membros no grupo.'
)

await reagir(
from,
'💘'
).catch(() => {})

const p1 =
membros[
Math.floor(
Math.random() *
membros.length
)
]

let p2 = p1

while (p2 === p1) {
p2 =
membros[
Math.floor(
Math.random() *
membros.length
)
]
}

const porcentagem =
Math.floor(
Math.random() * 101
)

const foto = async jid =>
tokito
.profilePictureUrl(
jid,
'image'
)
.catch(() =>
'https://raw.githubusercontent.com/dylanModz/uploads/main/midias/imagens/747wlpa89.jpg'
)

const f1 =
await foto(p1)

const f2 =
await foto(p2)

const url =
`${String(API_URL).replace(/\/$/, '')}/canvas/casal2` +
`?foto1=${encodeURIComponent(f1)}` +
`&foto2=${encodeURIComponent(f2)}` +
`&porcentagem=${porcentagem}`

let frase = ''

if (porcentagem >= 95) {
const frases = [
'💍 ᴊᴀ́ ᴘᴏᴅᴇ ᴍᴀʀᴄᴀʀ ᴏ ᴄᴀsᴀᴍᴇɴᴛᴏ, ɪssᴏ ᴀǫᴜɪ ᴛᴀ́ ғᴏʀᴛᴇ ᴅᴇᴍᴀɪs. 😂❤️',
'❤️ ᴏ ᴄᴜᴘɪᴅᴏ ɴᴀ̃ᴏ ᴇʀʀᴏᴜ ᴅᴇssᴀ ᴠᴇᴢ... ǫᴜᴀsᴇ ᴜᴍ ᴄᴀsᴀʟ ᴘᴇʀғᴇɪᴛᴏ.',
'💘 ɪssᴏ ᴀǫᴜɪ ᴊᴀ́ ᴘᴀssᴏᴜ ᴅᴇ ᴄᴏɪɴᴄɪᴅᴇ̂ɴᴄɪᴀ. 👀❤️'
]

frase =
frases[
Math.floor(
Math.random() *
frases.length
)
]
}

else if (porcentagem >= 80) {
const frases = [
'💕 ᴛᴇᴍ ǫᴜɪ́ᴍɪᴄᴀ ᴀɪ́... sᴏ́ ғᴀʟᴛᴀ ᴜᴍ ᴅᴏs ᴅᴏɪs ᴛᴏᴍᴀʀ ᴄᴏʀᴀɢᴇᴍ. 👀',
'💞 ᴇssᴇ ᴄᴀsᴀʟ ᴀᴛᴇ́ ǫᴜᴇ ᴄᴏᴍʙɪɴᴀ, ʜᴇɪɴ? 😂❤️',
'🏹 ᴏ ᴄᴜᴘɪᴅᴏ ᴛᴀ́ ᴏʟʜᴀɴᴅᴏ ᴘʀᴀ ᴠᴏᴄᴇ̂s ᴅᴏɪs. 👀'
]

frase =
frases[
Math.floor(
Math.random() *
frases.length
)
]
}

else if (porcentagem >= 60) {
const frases = [
'💗 ᴅᴀ́ ᴘʀᴀ ᴛᴇɴᴛᴀʀ... ᴠᴀɪ ǫᴜᴇ ᴅᴀ́ ᴄᴇʀᴛᴏ. 😂',
'👀 ᴛᴇᴍ ᴜᴍ ᴄʟɪᴍᴀ ᴀɪ́, ᴍᴀs ᴀɪɴᴅᴀ ᴛᴇᴍ ǫᴜᴇ ᴛʀᴀʙᴀʟʜᴀʀ ᴇssᴀ ǫᴜɪ́ᴍɪᴄᴀ.',
'💘 ᴏ ʙᴏᴛ ᴅɪssᴇ ǫᴜᴇ ᴛᴇᴍ ᴄʜᴀɴᴄᴇ... ᴀɢᴏʀᴀ ᴇ́ ᴄᴏᴍ ᴠᴏᴄᴇ̂s.'
]

frase =
frases[
Math.floor(
Math.random() *
frases.length
)
]
}

else if (porcentagem >= 30) {
const frases = [
'😂 ᴛᴀʟᴠᴇᴢ ᴄᴏᴍ ᴜᴍ ᴘᴏᴜᴄᴏ ᴅᴇ ᴇsғᴏʀᴄ̧ᴏ ᴅᴀ́ ᴘʀᴀ sᴀʟᴠᴀʀ.',
'😅 ᴏ ᴄᴜᴘɪᴅᴏ ᴀᴛɪʀᴏᴜ ᴀ ғʟᴇᴄʜᴀ ᴍᴇɪᴏ ᴛᴏʀᴛᴀ ᴅᴇssᴀ ᴠᴇᴢ.',
'💔 ɴᴀ̃ᴏ ᴇ́ ᴏ ᴍᴇʟʜᴏʀ ᴄᴀsᴀʟ ᴅᴏ ᴍᴜɴᴅᴏ... ᴍᴀs ᴊᴀ́ ᴠɪ ᴘɪᴏʀ. 😂'
]

frase =
frases[
Math.floor(
Math.random() *
frases.length
)
]
}

else {
const frases = [
'💀 ᴏ ᴄᴜᴘɪᴅᴏ ᴘᴇᴅɪᴜ ᴅᴇᴍɪssᴀ̃ᴏ ᴅᴇᴘᴏɪs ᴅᴇssᴀ.',
'😭 ᴍᴇʟʜᴏʀ ᴄᴀᴅᴀ ᴜᴍ ғɪᴄᴀʀ ɴᴏ sᴇᴜ ᴄᴀɴᴛᴏ ᴍᴇsᴍᴏ.',
'😂 ᴏ ʙᴏᴛ ᴛᴇɴᴛᴏᴜ... ᴍᴀs ɴᴇᴍ ᴇʟᴇ ᴄᴏɴsᴇɢᴜɪᴜ ғᴀᴢᴇʀ ᴇssᴇ ᴄᴀsᴀʟ ғᴜɴᴄɪᴏɴᴀʀ.'
]

frase =
frases[
Math.floor(
Math.random() *
frases.length
)
]
}

const cap =
`「💘」 *ᴄᴀsᴀʟ sᴏʀᴛᴇᴀᴅᴏ*

『 💞 』— @${p1.split('@')[0]}
『 💞 』— @${p2.split('@')[0]}

『 📊 』— *ᴄᴏᴍᴘᴀᴛɪʙɪʟɪᴅᴀᴅᴇ: ${porcentagem}%*

> *${frase}*

> 🌫️ | ${NomeDoBot}`

try {
return await tokito.sendMessage(
from,
{
image: {
url
},
caption: cap,
mentions: [
p1,
p2
],
contextInfo:
canalInfo([
p1,
p2
])
},
{
quoted: selo
}
)
}
catch (error) {
console.log(
'[CASAL API]',
ctx.modulos.sanitizarErro(
error,
[
ctx.API_KEY_TOKITO
]
) ||
'Erro sem detalhes'
)

return reply(
mess.erroApi(
API_URL
)
)
}
}
}