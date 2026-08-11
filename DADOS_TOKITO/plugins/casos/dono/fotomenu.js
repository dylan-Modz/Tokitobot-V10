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
nome: "fotomenu",
comandos: ["fotomenu", "fundomenu"],
categoria: "dono",
info: {
"descricao": "Executa o comando fotomenu.",
"uso": "fotomenu",
"categoria": "dono"
},
async executar(ctx) {
with (ctx) {
{
if (!SoDono)
return reply(mess.onlyOwner())
const contexto = info.message?.extendedTextMessage?.contextInfo || info.message?.imageMessage?.contextInfo || info.message?.videoMessage?.contextInfo || {}
const marcada = contexto.quotedMessage || mensagem || {}
const midia = marcada?.ephemeralMessage?.message || marcada?.viewOnceMessage?.message || marcada?.viewOnceMessageV2?.message || marcada?.viewOnceMessageV2Extension?.message || marcada
const video = midia?.videoMessage
const imagem = midia?.imageMessage
const videoPath = path.join(__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'fotomenu.mp4')
const imagemPath = path.join(__dirname, 'DADOS_TOKITO', 'INFO_DADOS', 'LOGOS', 'fotomenu.png')
if (video) {
await reagir(from, '⏳')
const buffer = await getFileBuffer(video, 'video')
if (fs.existsSync(imagemPath))
fs.unlinkSync(imagemPath)
fs.writeFileSync(videoPath, buffer)
await reagir(from, '✅')
return reply(mess.menuMediaSaved('video'))
}
if (imagem) {
await reagir(from, '⏳')
const buffer = await getFileBuffer(imagem, 'image')
if (fs.existsSync(videoPath))
fs.unlinkSync(videoPath)
fs.writeFileSync(imagemPath, buffer)
await reagir(from, '✅')
return reply(mess.menuMediaSaved('image'))
}
await reply(mess.menuMediaRequired())
}
}
}
}
