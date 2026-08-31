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

dylan.setCommand({
nome: "geminitts",
comandos: ["geminitts", "ttsgemini"],
categoria: "ia",
info: {
"descricao": "Executa o comando geminitts.",
"uso": "geminitts",
"categoria": "ia"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q)
return reply(mess.padraoUso({
emoji: '🎙️',
titulo: 'GEMINI TTS',
uso: `${prefix}${command} seu texto`,
descricao: 'Digite o texto que deseja transformar em áudio.'
}))
const apiUrl = `${API_URL}/api/gemini-tts?texto=${encodeURIComponent(q)}&apikey=${API_KEY_TOKITO}`
await tokito.sendMessage(from, {
audio: {
url: apiUrl
},
mimetype: 'audio/mpeg',
ptt: false,
contextInfo: canalInfo([sender])
}, {
quoted: selo
})
}
catch (e) {
console.log('[ɢᴇᴍɪɴɪ ᴛᴛs ᴇʀʀᴏ]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
return reply(mess.erroApi(API_URL))
}
}
}
}
}
)
