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
nome: "s",
comandos: ["s", "sticker", "figurinha", "fig"],
categoria: "figurinhas",
info: {
"descricao": "Executa o comando s.",
"uso": "s",
"categoria": "figurinhas"
},
async executar(ctx) {
with (ctx) {
{
try {
const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
const img = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage
const vid = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage
const dados = {
packname: `🧊 ${NomeDoBot}`,
author: pushname
}
if (img) {
const buffer = await getFileBuffer(img, 'image')
const arquivo = await sendImageAsSticker2(tokito, from, buffer, selo, dados)
DLT_FL(arquivo)
}
else if (vid && Number(vid.seconds || 0) < 11) {
const buffer = await getFileBuffer(vid, 'video')
const arquivo = await sendVideoAsSticker2(tokito, from, buffer, selo, dados)
DLT_FL(arquivo)
}
else {
reply('*🧊 ᴍᴀʀǫᴜᴇ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ ᴏᴜ ᴠɪ́ᴅᴇᴏ ᴄᴏᴍ ɴᴏ ᴍᴀ́xɪᴍᴏ 9.9 sᴇɢᴜɴᴅᴏs. 🙇‍♂️*')
}
}
catch (e) {
console.log('Erro na figurinha:', e)
reply('❌ | ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄʀɪᴀʀ ᴀ ғɪɢᴜʀɪɴʜᴀ.')
}
return
}
}
}
}
