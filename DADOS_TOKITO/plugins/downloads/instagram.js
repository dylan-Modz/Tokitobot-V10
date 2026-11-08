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

const axios = require('axios')
const scraper = require('../../scrapers/downloads/instagram')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "instagram",
comandos: ["instagram", "insta"],
categoria: "downloads",
info: {
"descricao": "Executa o comando instagram.",
"uso": "instagram",
"categoria": "downloads"
},
async executar(ctx) {
with (ctx) {
{
try {
if (!q || !q.trim())
return reply(mess.downloadUso({ tipo: 'LINK INSTAGRAM', prefix, command, exemplo: 'https://instagram.com/reel/...' }))
await reagir(from, '📸')
await reply(mess.wait())
// A API envia a mídia binária diretamente. Instagram pode devolver foto
// ou vídeo: detectar o tipo antes de encaminhar ao WhatsApp.
const resposta = await axios.get(scraper.url(q.trim()), {
  responseType: 'arraybuffer',
  timeout: 90000,
  maxContentLength: 40 * 1024 * 1024,
  maxBodyLength: 40 * 1024 * 1024,
  validateStatus: () => true
})
if (resposta.status !== 200) throw new Error('Falha no download do Instagram: HTTP ' + resposta.status)
const arquivo = Buffer.from(resposta.data || [])
if (arquivo.length < 12) throw new Error('Mídia do Instagram vazia ou inválida')
const tipo = String(resposta.headers?.['content-type'] || '').split(';')[0].trim().toLowerCase()
const jpg = arquivo[0] === 0xff && arquivo[1] === 0xd8 && arquivo[2] === 0xff
const png = arquivo[0] === 0x89 && arquivo.toString('ascii', 1, 4) === 'PNG'
const webp = arquivo.toString('ascii', 0, 4) === 'RIFF' && arquivo.toString('ascii', 8, 12) === 'WEBP'
const mp4 = arquivo.toString('ascii', 4, 8) === 'ftyp'
const webm = arquivo[0] === 0x1a && arquivo[1] === 0x45 && arquivo[2] === 0xdf && arquivo[3] === 0xa3
const isImage = jpg || png || webp || /^image\//.test(tipo)
const isVideo = mp4 || webm || /^video\//.test(tipo)
if (!isImage && !isVideo) throw new Error('API não retornou foto nem vídeo válido')
const conteudo = isImage
  ? { image: arquivo, mimetype: jpg ? 'image/jpeg' : png ? 'image/png' : webp ? 'image/webp' : tipo }
  : { video: arquivo, mimetype: webm ? 'video/webm' : 'video/mp4' }
await tokito.sendMessage(from, {
  ...conteudo,
  contextInfo: {
    ...newsletter,
    mentionedJid: [sender]
  }
}, { quoted: selo })
await reagir(from, '✅')
}
catch (e) {
console.log('[INSTAGRAM]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
await reagir(from, '❌').catch(() => {
})
await reply(mess.erroApi(API_URL))
}
}
}
}
}
)
