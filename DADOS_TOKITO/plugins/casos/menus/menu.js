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
try {
if (!isBotoes)
return dylanModz(linguagem.menu(NomeDoBot, sender, isCargo, isChVip, horaBR, prefix, ownerName, baileysVersion))
await reagir(from, '🧊')
const caminhoVideo = path.join(__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'fotomenu.mp4')
const caminhoImagem = path.join(__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'fotomenu.png')
let menuMedia
if (fs.existsSync(caminhoVideo)) {
menuMedia = await prepareWAMessageMedia({
video: { url: caminhoVideo },
mimetype: 'video/mp4',
gifPlayback: true,
seconds: 8
}, { upload: tokito.waUploadToServer })
}
else {
menuMedia = await prepareWAMessageMedia({ image: { url: caminhoImagem } }, { upload: tokito.waUploadToServer })
}
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
description: 'sᴀʟᴀs ғғ, ʟɪᴋᴇs ɪᴍᴇᴅɪᴀᴛᴏs ᴇ ᴀᴜᴛᴏ ʟɪᴋᴇ.',
id: `${prefix}menuff`
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
{
title: '🧊⃞ ᴍᴇɴᴜ ᴅᴏɴᴏ ⃞🧊',
description: 'ᴍᴏsᴛʀᴀ ᴏs ᴄᴏᴍᴀɴᴅᴏs ᴇxᴄʟᴜsɪᴠᴏs ᴅᴏ ᴅᴏɴᴏ ᴅᴏ ʙᴏᴛ.',
id: `${prefix}menudono`
}
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
}
]
}
]
}
const botoes = [
{
name: 'single_select',
buttonParamsJson: JSON.stringify(listaMenus)
}
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
├⊹ 🧊 ʙᴀɪʟᴇʏs: ${baileysVersion}
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
console.log('ᴇʀʀᴏ ɴᴏ ᴍᴇɴᴜ:', e)
await tokito.sendMessage(from, {
text: mess.error()
}, {
quoted: selo
})
}
}
}
}
}
