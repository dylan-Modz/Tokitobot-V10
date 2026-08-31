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

const { jidNormalizedUser } = require('baileys')

const pegarContexto = info => {
const m = info?.message || {}

return m?.extendedTextMessage?.contextInfo ||
m?.imageMessage?.contextInfo ||
m?.videoMessage?.contextInfo ||
m?.audioMessage?.contextInfo ||
m?.documentMessage?.contextInfo ||
m?.stickerMessage?.contextInfo ||
m?.buttonsResponseMessage?.contextInfo ||
m?.listResponseMessage?.contextInfo ||
m?.templateButtonReplyMessage?.contextInfo ||
m?.interactiveResponseMessage?.contextInfo ||
null
}

const normalizarJid = jid => {
try {
return jid ? jidNormalizedUser(jid) : ''
} catch {
return String(jid || '').replace(/:\d+@/, '@')
}
}

const ehMensagemDoBot = (tokito, participante) => {
const autor = normalizarJid(participante)

if (!autor)
return false

const ids = [
tokito?.user?.id,
tokito?.user?.lid
]
.map(normalizarJid)
.filter(Boolean)

return ids.includes(autor)
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'del',
comandos: ['del', 'apagar'],
categoria: 'admin',

info: {
descricao: 'Apaga uma mensagem respondida por um administrador.',
uso: 'del respondendo uma mensagem',
permissao: 'ADM',
categoria: 'admin'
},

async executar(ctx) {
with (ctx) {
try {
if (!isGroup)
return reply(mess.sogrupo())

if (!isGroupAdmins && !SoDono)
return reply(mess.soadm())

if (!isBotGroupAdmins)
return reply(mess.botadm())

const contexto = pegarContexto(info)
const id = contexto?.stanzaId
const participante =
contexto?.participantAlt ||
contexto?.participant ||
''

if (!id) {
return reply(`- 🗑️ \`𝙰𝙿𝙰𝙶𝙰𝚁 𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼\`

> *『 ${prefix + command} 』— ʀᴇsᴘᴏɴᴅᴀ ᴀ̀ ᴍᴇɴsᴀɢᴇᴍ ǫᴜᴇ ᴅᴇsᴇᴊᴀ ᴀᴘᴀɢᴀʀ. 🙇‍♂️*`)
}

const fromMe = ehMensagemDoBot(tokito, participante)

const chave = {
remoteJid: from,
fromMe,
id
}

if (participante)
chave.participant = participante

await tokito.sendMessage(from, {
delete: chave
})

await reagir(from, '🗑️').catch(() => {})

} catch (error) {
console.log('[DEL/APAGAR]', error?.stack || error?.message || error)

await reagir(from, '❌').catch(() => {})

return reply(mess.padraoErro({
titulo: 'ERRO AO APAGAR',
descricao: 'Não foi possível apagar essa mensagem.'
}))
}
}
}
}
)
