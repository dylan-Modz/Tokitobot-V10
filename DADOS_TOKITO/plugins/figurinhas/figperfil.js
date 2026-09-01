/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Dev: Dylan Modz
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'figperfil',

comandos: [
'figperfil',
'perfilfig',
'stickerperfil'
],

categoria: 'figurinhas',

info: {
descricao: 'Transforma a foto de perfil em figurinha.',
uso: 'figperfil @usuario',
categoria: 'figurinhas'
},

async executar(ctx) {
const {
isGroup,
reply,
mess,
prefix,
command,
sender,
pushname,
NomeDoBot,
tokito,
from,
selo,
destino,
sendImageAsSticker2,
DLT_FL,
reagir,
modulos,
API_KEY_TOKITO
} = ctx

if (!isGroup)
return reply(
typeof mess.figPerfilGrupo === 'function'
? mess.figPerfilGrupo()
: mess.sogrupo()
)

try {
await reagir(
from,
'🖼️'
).catch(() => {})

const dados =
typeof destino === 'function'
? await destino()
: null

const alvo =
dados?.consulta ||
dados?.mencao ||
dados?.alvo ||
sender

const mencao =
dados?.mencao ||
dados?.consulta ||
dados?.alvo ||
sender

const numero =
String(
mencao ||
alvo ||
sender
)
.split('@')[0]
.split(':')[0]

let fotoPerfil = null

try {
fotoPerfil =
await tokito.profilePictureUrl(
alvo,
'image'
)
}
catch {
fotoPerfil = null
}

if (
!fotoPerfil &&
alvo !== mencao
) {
try {
fotoPerfil =
await tokito.profilePictureUrl(
mencao,
'image'
)
}
catch {
fotoPerfil = null
}
}

if (!fotoPerfil) {
const texto =
typeof mess.figPerfilSemFoto === 'function'
? mess.figPerfilSemFoto(numero)
: mess.padraoAviso({
emoji: '🖼️',
titulo: 'SEM FOTO DE PERFIL',
descricao: `A pessoa @${numero} não possui foto de perfil ou ela está privada.`
})

return tokito.sendMessage(
from,
{
text: texto,
mentions: [
mencao
]
},
{
quoted: selo
}
)
}

const textoGerando =
typeof mess.figPerfilGerando === 'function'
? mess.figPerfilGerando(numero)
: mess.padraoInfo({
emoji: '🖼️',
titulo: 'FIGURINHA DE PERFIL',
linhas: [
{
rotulo: '👤 USUÁRIO',
valor: `@${numero}`
},
{
rotulo: '⚙️ STATUS',
valor: 'Gerando figurinha...'
}
]
})

await tokito.sendMessage(
from,
{
text: textoGerando,
mentions: [
mencao
]
},
{
quoted: selo
}
)

const arquivo =
await sendImageAsSticker2(
tokito,
from,
fotoPerfil,
selo,
{
packname: pushname,
author: NomeDoBot
}
)

if (arquivo)
await DLT_FL(arquivo)

return true
}
catch (error) {
console.log(
'[FIGPERFIL]',
modulos?.sanitizarErro
? modulos.sanitizarErro(
error,
[
API_KEY_TOKITO
]
)
: error?.message || error
)

const texto =
typeof mess.figPerfilErro === 'function'
? mess.figPerfilErro()
: mess.padraoErro({
titulo: 'ERRO NO FIGPERFIL',
descricao: 'Não foi possível gerar a figurinha da foto de perfil.'
})

return reply(texto)
}
}
})
