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
nome: "play_audio",
comandos: ["play_audio"],
categoria: "outros",
info: {
"descricao": "Executa o comando play_audio.",
"uso": "play_audio",
"categoria": "outros"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(`*❌ | ɪɴsɪʀᴀ ᴏ ɴᴏᴍᴇ ᴏᴜ ʟɪɴᴋ ᴅᴀ ᴍᴜsɪᴄᴀ.*

      *📌 | ᴇxᴇᴍᴘʟᴏ:*
      > ${prefix + command} ᴠᴇᴍ ᴄᴀ`)
await reagir(from, '🎧')
await reply(mess.wait())
const pesquisa = q.trim()
const contextInfo = {
...newsletter,
mentionedJid: [sender]
}
const apiUrl = `${API_URL}/api/youtube-audio?q=${encodeURIComponent(pesquisa)}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
await tokito.sendMessage(from, {
audio: { url: apiUrl },
mimetype: 'audio/mpeg',
fileName: 'audio.mp3',
ptt: false,
contextInfo
}, {
quoted: selo
})
await reagir(from, '✅')
}
catch (e) {
console.log('[PLAY AUDIO ERRO]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
