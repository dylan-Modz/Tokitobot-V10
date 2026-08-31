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

const base = require('../../sistemas/grupos.js')
const toggle = require('../../sistemas/toggle.js')
const mess = require('../../mensagens/mensagens.js')

const usuarios = new Map()

const configurar = ctx => toggle({
...ctx,
campo: 'antispam',
emoji: '🚨',
titulo: '𝙰𝙽𝚃𝙸-𝚂𝙿𝙰𝙼',
descricao: 'ʙʟᴏǫᴜᴇɪᴀ sᴘᴀᴍ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs, ᴀᴘʟɪᴄᴀ ᴀᴅᴠᴇʀᴛᴇ̂ɴᴄɪᴀs ᴇ ʀᴇᴍᴏᴠᴇ ɴᴀ ǫᴜɪɴᴛᴀ ᴏᴄᴏʀʀᴇ̂ɴᴄɪᴀ.'
})

const verificar = async (ctx) => {
const { tokito, from, sender, isGroup, isGroupAdmins, isBotGroupAdmins, isCmd, config, newsletter, selo } = ctx
if (!isGroup || !config?.antispam || isGroupAdmins || !isBotGroupAdmins || !isCmd)
return false
const chave = `${from}:${sender}`
const agora = Date.now()
const dados = usuarios.get(chave) || {
comandos: [],
bloqueadoAte: 0,
advertencias: 0,
ultimoAviso: 0
}
if (dados.bloqueadoAte && agora >= dados.bloqueadoAte) {
dados.comandos = []
dados.bloqueadoAte = 0
dados.ultimoAviso = 0
}
if (dados.bloqueadoAte > agora) {
const restante = Math.ceil((dados.bloqueadoAte - agora) / 1000)
if (agora - dados.ultimoAviso > 5000) {
dados.ultimoAviso = agora
await tokito.sendMessage(from, {
text: mess.antiSpamEspera(base.numero(sender), restante),
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo }).catch(() => {
})
}
usuarios.set(chave, dados)
return true
}
dados.comandos.push(agora)
dados.comandos = dados.comandos.filter(tempo => agora - tempo < 20000)
if (dados.comandos.length < 7) {
usuarios.set(chave, dados)
return false
}
dados.comandos = []
dados.advertencias = Number(dados.advertencias || 0) + 1
dados.ultimoAviso = agora
if (dados.advertencias >= 5) {
usuarios.delete(chave)
await base.esperar(400)
await tokito.groupParticipantsUpdate(from, [sender], 'remove').catch(() => {
})
await tokito.sendMessage(from, {
text: mess.antiSpamRemovido(base.numero(sender)),
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo }).catch(() => {
})
return true
}
const tempoBloqueio = dados.advertencias >= 4 ? 120000 : dados.advertencias >= 3 ? 90000 : dados.advertencias >= 2 ? 60000 : 30000
dados.bloqueadoAte = agora + tempoBloqueio
usuarios.set(chave, dados)
await tokito.sendMessage(from, {
text: mess.antiSpamAdvertencia(base.numero(sender), dados.advertencias, Math.ceil(tempoBloqueio / 1000), 5 - dados.advertencias),
contextInfo: {
...newsletter,
mentionedJid: [sender]
}
}, { quoted: selo }).catch(() => {
})
return true
}

module.exports = {
configurar,
verificar
}
