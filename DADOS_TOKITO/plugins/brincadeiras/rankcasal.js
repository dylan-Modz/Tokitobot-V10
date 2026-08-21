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

const links = require('../../INFO_DADOS/LOGOS/links_img.json')

module.exports = {
nome: 'rankcasal',
comandos: ['rankcasalzin', 'rankcasais', 'rankcasal'],
categoria: 'brincadeiras',

info: {
descricao: 'Sorteia os casais mais compatíveis do grupo.',
uso: 'rankcasal',
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
membrosGrupo,
groupMembers,
tokito,
from,
canalInfo,
selo
} = ctx

if (!isGroup)
return reply(mess.sogrupo())

if (!isModobn)
return reply(mess.onlyGroupFun(prefix))

let membros = [
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
return reply(mess.error())

membros = membros
.map(v => ({
v,
r: Math.random()
}))
.sort((a, b) => a.r - b.r)
.map(x => x.v)

const quantidade =
Math.min(
5,
Math.floor(membros.length / 2)
)

const casais = []

for (let i = 0; i < quantidade; i++) {
const a = membros[i * 2]
const b = membros[(i * 2) + 1]

if (!a || !b)
continue

casais.push({
a,
b,
porcentagem:
Math.floor(Math.random() * 101)
})
}

casais.sort(
(a, b) =>
b.porcentagem -
a.porcentagem
)

const mencoes = []

const linhas =
casais.map((casal, i) => {
mencoes.push(
casal.a,
casal.b
)

const posicao =
i === 0
? '🥇'
: i === 1
? '🥈'
: i === 2
? '🥉'
: `『 ${i + 1}° 』`

return `${posicao} — *${casal.porcentagem}%*\n> 💘 @${casal.a.split('@')[0]} + @${casal.b.split('@')[0]}`
})

const frases = [
'💘 ᴏ ᴄᴜᴘɪᴅᴏ ᴘᴀssᴏᴜ ᴘᴇʟᴏ ɢʀᴜᴘᴏ ʜᴏᴊᴇ... 👀❤️',
'💕 sᴇʀᴀ́ ǫᴜᴇ ᴀʟɢᴜᴍ ᴅᴇssᴇs ᴄᴀsᴀɪs ᴀɪɴᴅᴀ ᴠɪʀᴀ ʀᴇᴀʟɪᴅᴀᴅᴇ? 👀',
'🏹 ᴏ ᴄᴜᴘɪᴅᴏ ғᴇᴢ ᴀ ᴘᴀʀᴛᴇ ᴅᴇʟᴇ, ᴀɢᴏʀᴀ ᴇ́ ᴄᴏᴍ ᴠᴏᴄᴇ̂s. 😂❤️',
'❤️ ᴛᴇᴍ ǫᴜɪ́ᴍɪᴄᴀ ᴀɪ́ ᴏᴜ ᴏ ʙᴏᴛ ᴛᴀ́ ɪɴᴠᴇɴᴛᴀɴᴅᴏ ᴍᴏᴅᴀ? 👀',
'💍 ᴊᴀ́ ᴘᴏᴅᴇ ᴘʀᴇᴘᴀʀᴀʀ ᴏ ᴄᴀsᴀᴍᴇɴᴛᴏ ᴏᴜ ᴀɪɴᴅᴀ ᴛᴀ́ ᴄᴇᴅᴏ? 😂',
'💞 ᴏ ʀᴀɴᴋɪɴɢ ғᴀʟᴏᴜ... ᴀɢᴏʀᴀ ǫᴜᴇᴍ ᴠᴀɪ ᴛᴇʀ ᴄᴏʀᴀɢᴇᴍ ᴅᴇ ᴄʜᴀᴍᴀʀ ɴᴏ ᴘʀɪᴠᴀᴅᴏ? 👀😂',
'🥰 ᴛᴇᴍ ᴜɴs ᴄᴀsᴀɪs ᴀɪ́ ǫᴜᴇ ᴏ ʙᴏᴛ ᴀᴘᴏsᴛᴀ ᴀʟᴛᴏ. ❤️',
'👀 ᴇᴜ ɴᴀ̃ᴏ ǫᴜᴇʀᴏ ᴄʀɪᴀʀ ғᴏғᴏᴄᴀ... ᴍᴀs ᴇssᴇ ʀᴀɴᴋɪɴɢ ᴛᴀ́ sᴜsᴘᴇɪᴛᴏ. 😂❤️'
]

const frase =
frases[
Math.floor(
Math.random() *
frases.length
)
]

const caption =
`- 💞 \`𝚁𝙰𝙽𝙺 𝙳𝙴 𝙲𝙰𝚂𝙰𝙸𝚂\`

${linhas.join('\n\n')}

> *${frase}*`

const media =
String(
links.rankcasal ||
''
).trim()

if (media) {
return tokito.sendMessage(
from,
{
image: {
url: media
},
caption,
mentions: [
...new Set(mencoes)
],
contextInfo:
canalInfo([
...new Set(mencoes)
])
},
{
quoted: selo
}
)
}

return tokito.sendMessage(
from,
{
text: caption,
mentions: [
...new Set(mencoes)
],
contextInfo:
canalInfo([
...new Set(mencoes)
])
},
{
quoted: selo
}
)
}
}