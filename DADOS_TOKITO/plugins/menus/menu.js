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

const dylan = require('../../database/lib/comandos')
const { version } = require('../../../package.json')
const canalOficial = require('../../sistemas/canal-oficial')

dylan.setCommand({
nome: "menu",
comandos: ["menu"],
categoria: "menus",
info: {
"descricao": "Executa o comando menu.",
"uso": "menu",
"categoria": "menus"
},
async executar(ctx) {
with (ctx) {
{
// Os menus preservam texto original; acesso ao canal só por botão CTA.
const textoMenuSeguro = () =>
  linguagem.menu(NomeDoBot, sender, isCargo, isChVip, horaBR, prefix, ownerName, stoneVersion)
try {
if (!isBotoes)
return dylanModz(textoMenuSeguro())
reagir(from, '🧊').catch(() => {})
const caminhoVideo = path.join(__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'fotomenu.mp4')
const caminhoImagem = path.join(__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'fotomenu.png')
let menuMedia = await modulos.midiaMenu(tokito)
const listaMenus = {
title: '🧊⃞ ᴍᴇɴᴜ-ʟɪsᴛᴀs ⃞🧊',
sections: [
{
title: '🧊⃞ ᴇsᴄᴏʟʜᴀ ᴜᴍ ᴍᴇɴᴜ ⃞🧊',
rows: [
{
title: '🧊⃞ ᴍᴇɴᴜ ᴘʀɪɴᴄɪᴘᴀʟ ⃞🧊',
description: 'ᴍᴏsᴛʀᴀ ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴘʀɪɴᴄɪᴘᴀɪs, ɪᴀ, ғɪɢᴜʀɪɴʜᴀs ᴇ ᴏᴜᴛʀᴏs.',
id: `${prefix}menuzz`
},
{
title: '🧊⃞ ᴍᴇɴᴜ ᴀʟᴛᴇʀᴀᴅᴏʀᴇs ⃞🧊',
description: 'ᴀʟᴛᴇʀᴀ ᴠᴇʟᴏᴄɪᴅᴀᴅᴇ, ᴛᴏᴍ, ɢʀᴀᴠᴇ ᴇ ᴇғᴇɪᴛᴏs ᴅᴇ ᴀᴜᴅɪᴏ/ᴠɪᴅᴇᴏ.',
id: `${prefix}menualt`
},
{
title: '🧊⃞ ᴍᴇɴᴜ ᴅᴏᴡɴʟᴏᴀᴅs ⃞🧊',
description: 'ʏᴏᴜᴛᴜʙᴇ, ʀᴇᴅᴇs sᴏᴄɪᴀɪs, ᴍᴜsɪᴄᴀs, ᴀᴘᴘs ᴇ ᴀʀǫᴜɪᴠᴏs.',
id: `${prefix}menudown`
},
{
title: '🧊⃞ ᴍᴇɴᴜ ʟᴏɢᴏs ⃞🧊',
description: 'ᴇғᴇɪᴛᴏs ᴅᴇ ᴛᴇxᴛᴏ, ʟᴏɢᴏs ᴇ ɢᴇʀᴀᴅᴏʀᴇs ᴠɪsᴜᴀɪs.',
id: `${prefix}menulogos`
},
{
title: '🧊⃞ ᴍᴇɴᴜ ᴊᴏɢᴏs ⃞🧊',
description: 'ᴍᴏsᴛʀᴀ ᴏs ᴊᴏɢᴏs ᴇ ᴅᴇsᴀғɪᴏs ᴅɪsᴘᴏɴɪᴠᴇɪs ɴᴏ ʙᴏᴛ.',
id: `${prefix}menujogos`
},
{
title: '🧊⃞ ᴍᴇɴᴜ ʀᴘɢ ⃞🧊',
description: 'ʟᴇᴠᴇʟ, ᴘᴇᴛs, ᴘᴏᴋᴇᴍᴏɴ ᴇ ᴘʀᴏɢʀᴇssᴀᴏ ʀᴘɢ.',
id: `${prefix}menurpg`
},
{
title: '🧊⃞ ᴍᴇɴᴜ ɴ-ᴄᴏɪɴs ⃞🧊',
description: 'ᴍɪɴᴇʀᴀᴄᴀᴏ, ᴄɪᴅᴀᴅᴇ, ʙᴀɴᴄᴏ ᴇ ᴇᴄᴏɴᴏᴍɪᴀ.',
id: `${prefix}menucoins`
},
{
title: '🧊⃞ ᴍᴇɴᴜ ғʀᴇᴇ ғɪʀᴇ ⃞🧊',
description: 'ᴄᴏɴsᴜʟᴛᴀ ɪɴғᴏ ғғ, ʟɪᴋᴇs ᴍᴀɴᴜᴀɪs ᴇ sᴀʟᴀs.',
id: `${prefix}menuff`
},
{
title: '🧊⃞ ɪɴғᴏ ғʀᴇᴇ ғɪʀᴇ ⃞🧊',
description: 'ᴄᴏɴsᴜʟᴛᴇ ᴜᴍ ᴊᴏɢᴀᴅᴏʀ ᴘᴇʟᴏ ɪᴅ ᴄᴏᴍ ʙᴀɴɴᴇʀ ᴇ ᴅᴀᴅᴏs.',
id: `${prefix}infoff`
},
{
title: '🧊⃞ ᴍᴇɴᴜ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs ⃞🧊',
description: 'ᴍᴏsᴛʀᴀ ᴀs ʙʀɪɴᴄᴀᴅᴇɪʀᴀs, ʀᴀɴᴋs ᴇ ᴅɪᴠᴇʀsᴀᴏ ᴅᴏ ɢʀᴜᴘᴏ.',
id: `${prefix}menubn`
},
{
title: '🧊⃞ ᴍᴇɴᴜ ᴀᴅᴍ ⃞🧊',
description: 'ᴍᴏsᴛʀᴀ ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴘᴀʀᴀ ᴀᴅᴍɪɴɪsᴛʀᴀʀ ᴏ ɢʀᴜᴘᴏ.',
id: `${prefix}menuadm`
},
...(isSubBot ? [] : [{
title: '🧊⃞ ᴍᴇɴᴜ ᴅᴏɴᴏ ⃞🧊',
description: 'ᴍᴏsᴛʀᴀ ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴇxᴄʟᴜsɪᴠᴏs ᴅᴏ ᴅᴏɴᴏ ᴅᴏ ʙᴏᴛ.',
id: `${prefix}menudono`
}])
]
},
{
title: '🧊⃞ ɪɴғᴏʀᴍᴀᴄᴏᴇs ᴇ ᴀᴛᴀʟʜᴏs ⃞🧊',
rows: [
{
title: '🧊⃞ ᴍᴇᴜ ᴘᴇʀғɪʟ ⃞🧊',
description: 'ᴍᴏsᴛʀᴀ sᴇᴜ ᴘᴇʀғɪʟ, ʙɪᴏ, ᴄᴀʀɢᴏ, ᴠɪᴘ ᴇ ɴɪᴠᴇɪs.',
id: `${prefix}perfil`
},
{
title: '🧊⃞ ᴘɪɴɢ ᴅᴏ ʙᴏᴛ ⃞🧊',
description: 'ᴍᴏsᴛʀᴀ ᴀ ᴠᴇʟᴏᴄɪᴅᴀᴅᴇ, ʟᴀᴛᴇɴᴄɪᴀ ᴇ ᴏ ᴅᴇsᴇᴍᴘᴇɴʜᴏ ᴅᴏ ʙᴏᴛ.',
id: `${prefix}ping`
},
{
title: '🧊⃞ ᴄʀɪᴀᴅᴏʀ ⃞🧊',
description: 'ᴍᴏsᴛʀᴀ ᴀs ɪɴғᴏʀᴍᴀᴄᴏᴇs ᴇ ᴏ ᴄᴏɴᴛᴀᴛᴏ ᴅᴏ ᴄʀɪᴀᴅᴏʀ.',
id: `${prefix}criador`
},
{
title: '🤖 ᴛᴏᴋɪᴛᴏ ʙᴏᴛ ᴠ10',
description: 'ᴄᴏɴʜᴇᴄ̧ᴀ ᴏ ʙᴏᴛ ᴇ ᴏ ɢɪᴛʜᴜʙ ᴏғɪᴄɪᴀʟ.',
id: `${prefix}gitbot`
},
{
title: '🌐 ᴛᴏᴋɪᴛᴏ ᴀᴘɪs',
description: 'ʟɪᴋᴇs, ᴘᴀssᴇ ʙᴏᴏʏᴀʜ, ᴀᴘɪs ᴇ ᴘᴀɪɴᴇʟ.',
id: `${prefix}site`
},
{
title: '💚 sᴛᴏɴᴇ ᴡᴘᴘ',
description: 'ʙɪʙʟɪᴏᴛᴇᴄᴀ, ɴᴘᴍ, ɢᴀᴛᴇᴡᴀʏ ᴇ sᴛᴜᴅɪᴏ.',
id: `${prefix}stone`
}
]
}
]
}
const botoes = [
{
name: 'single_select',
buttonParamsJson: JSON.stringify(listaMenus)
},
...(canalOficial.botaoAcesso(ctx.setting || {}) ? [canalOficial.botaoAcesso(ctx.setting || {})] : [])
]
const carouselMessage = {
cards: [
{
header: {
hasMediaAttachment: true,
...(menuMedia.videoMessage
? { videoMessage: menuMedia.videoMessage }
: { imageMessage: menuMedia.imageMessage })
},
headerType: menuMedia.videoMessage ? 'VIDEO' : 'IMAGE',
body: {
text: `❪🧊.ꯧᴍᴇɴᴜ ʟɪsᴛꯧ⸼🧊❫
┏☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┓
├⊹ 🧊 ʙᴏᴛ: ${NomeDoBot}
├⊹ 🧊 ᴄʀɪᴀᴅᴏʀ: ${ownerName}
├⊹ 🧊 ᴜsᴜᴀʀɪᴏ: ${pushname}
├⊹ 🧊 ᴄᴀʀɢᴏ: ${isCargo}
├⊹ 🧊 ᴠɪᴘ: ${isChVip}
├⊹ 🧊 ᴅɪsᴘᴏsɪᴛɪᴠᴏ: ${whatIsPhone}
├⊹ 🧊 ᴠᴇʀsᴀ̃ᴏ: ${version}
├⊹ 🧊 𝚂𝚃𝙾𝙽𝙴-𝚆𝙿𝙿: ${stoneVersion}
┗☆∻∹⋰ ★∻∹⋰ ☆∻∹⋰ ★∻∹⋰┛`
},
footer: {
text: 'ᴇsᴄᴏʟʜᴀ ᴜᴍᴀ ᴏᴘᴄᴀᴏ ᴀʙᴀɪxᴏ'
},
nativeFlowMessage: {
buttons: botoes
}
}
]
}
await tokito.relayMessage(from, {
interactiveMessage: {
contextInfo: {
quotedMessage: selo.message,
...(selo.key?.participant ? { participant: selo.key.participant } : {}),
stanzaId: selo.key?.id,
remoteJid: selo.key?.remoteJid,
mentionedJid: [sender]
},
body: {
text: `*🧊⃞ ᴀǫᴜɪ ᴇsᴛᴀ sᴇᴜ ᴍᴇɴᴜ ⃞🧊*`
},
carouselMessage
}
}, {})
}
catch (e) {
console.log('[MENU] Falha no envio interativo, utilizando texto:', e?.message || e)
try {
  return await dylanModz(textoMenuSeguro())
} catch (fallbackError) {
  console.log('[MENU] Falha também no envio do texto:', fallbackError?.message || fallbackError)
  return reply(mess.error())
}
}
}
}
}
}
)