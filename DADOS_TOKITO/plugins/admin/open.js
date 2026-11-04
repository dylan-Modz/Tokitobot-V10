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

const CAMADAS = ['ephemeralMessage', 'viewOnceMessage', 'viewOnceMessageV2',
  'viewOnceMessageV2Extension', 'documentWithCaptionMessage', 'editedMessage']

const desenrolar = entrada => {
  let msg = entrada?.message || entrada || {}
  for (let i = 0; i < 12; i++) {
    const camada = CAMADAS.find(c => msg?.[c]?.message)
    if (!camada) break
    msg = msg[camada].message
  }
  return msg
}

const pegarContexto = entrada => {
  let msg = entrada?.message || entrada || {}
  for (let i = 0; i < 12; i++) {
    const contexto = msg?.extendedTextMessage?.contextInfo ||
      msg?.imageMessage?.contextInfo || msg?.videoMessage?.contextInfo ||
      msg?.audioMessage?.contextInfo || msg?.documentMessage?.contextInfo ||
      msg?.stickerMessage?.contextInfo
    if (contexto) return contexto
    const camada = CAMADAS.find(c => msg?.[c]?.message)
    if (!camada) break
    msg = msg[camada].message
  }
  return null
}

// A citação de visualização única pode omitir dados presentes no original.
// O bot só consulta metadados que já recebeu, mantidos brevemente em RAM.
const obterOriginal = (socket, jid, stanzaId) => {
if (!jid || !stanzaId) return null
const chave = jid + '|' + stanzaId
const item = socket?.__tokitoMidiasOriginais?.get(chave)
if (!item || Date.now() - item.at > 10 * 60 * 1000) {
socket?.__tokitoMidiasOriginais?.delete(chave)
return null
}
return desenrolar(item.message)
}

const extrairMedia = msg => msg?.imageMessage || msg?.videoMessage ||
  msg?.ptvMessage || msg?.audioMessage || null

const bufferMidia = async (ctx, tipo, midias) => {
if (typeof ctx.getFileBuffer !== 'function')
throw new Error('getFileBuffer não está disponível.')

let ultimaFalha = null
for (const media of midias) {
try {
const buffer = await ctx.getFileBuffer(media, tipo)
if (!Buffer.isBuffer(buffer) || !buffer.length)
throw new Error('O download retornou um arquivo vazio.')
return { buffer, media }
} catch (error) {
ultimaFalha = error
}
}
throw ultimaFalha || new Error('O WhatsApp não disponibilizou os dados da mídia.')
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'open',
comandos: ['open', 'revelar'],
categoria: 'admin',

info: {
descricao: 'Reenvia mídia respondida, inclusive visualização única quando o arquivo foi recebido pela Stone.',
uso: 'open respondendo uma mídia',
permissao: 'ADM',
categoria: 'admin'
},

async executar(ctx) {
with (ctx) {
try {
if (!isGroup)
return reply(mess.sogrupo())

if (!isGroupAdmins)
return reply(mess.soadm())

await reagir(from, '👁️').catch(() => {})

const contexto = ctxMsg?.quotedMessage ? ctxMsg : pegarContexto(info)
const marcada = contexto?.quotedMessage || null
const origem = marcada || (contexto?.stanzaId ? null : info?.message)

if (!origem) {
await reagir(from, '❌').catch(() => {})
return reply(`- 👁️ \`𝙾𝙿𝙴𝙽\`

> *『 ${prefix + command} 』— ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ, ᴠɪ́ᴅᴇᴏ ᴏᴜ ᴀ́ᴜᴅɪᴏ.*`)
}

const msg = desenrolar(origem)
const usandoMarcada = Boolean(marcada)
const salvo = contexto?.stanzaId ? obterOriginal(tokito, from, contexto.stanzaId) : null
const mediaSalva = extrairMedia(salvo)
const midias = []
const addMedia = valor => {
if (valor && !midias.includes(valor)) midias.push(valor)
}
addMedia(extrairMedia(msg))
addMedia(mediaSalva)
// Quando a citação está incompleta, tenta o original antes dela.
if (midias.length === 2) {
const citada = midias[0]
if (!citada.mediaKey || !(citada.directPath || citada.url))
midias.reverse()
}

if (msg?.imageMessage || salvo?.imageMessage) {
const { buffer, media } = await bufferMidia(ctx, 'image', midias)
const caption = usandoMarcada ? String(media.caption || '').trim() : ''

await tokito.sendMessage(from, {
image: buffer,
caption,
mimetype: media.mimetype || 'image/jpeg',
contextInfo: canalInfo([sender])
}, { quoted: selo })

await reagir(from, '✅')
return
}

if (msg?.videoMessage || msg?.ptvMessage || salvo?.videoMessage || salvo?.ptvMessage) {
const { buffer, media } = await bufferMidia(ctx, 'video', midias)
const caption = usandoMarcada ? String(media.caption || '').trim() : ''

await tokito.sendMessage(from, {
video: buffer,
caption,
mimetype: media.mimetype || 'video/mp4',
gifPlayback: Boolean(media.gifPlayback),
contextInfo: canalInfo([sender])
}, { quoted: selo })

await reagir(from, '✅')
return
}

if (msg?.audioMessage || salvo?.audioMessage) {
const { buffer, media } = await bufferMidia(ctx, 'audio', midias)
const mimetype = String(media.mimetype || 'audio/ogg; codecs=opus').trim()

await tokito.sendPresenceUpdate('recording', from).catch(() => {})

try {
await tokito.sendMessage(from, {
audio: buffer,
mimetype,
ptt: false,
contextInfo: canalInfo([sender])
}, { quoted: selo })
} finally {
await tokito.sendPresenceUpdate('paused', from).catch(() => {})
}

await reagir(from, '✅')
return
}

await reagir(from, '❌').catch(() => {})

return reply(`- 👁️ \`𝙾𝙿𝙴𝙽\`

> *『 ❌ 』— ᴀ ᴍᴇɴsᴀɢᴇᴍ ᴍᴀʀᴄᴀᴅᴀ ɴᴀ̃ᴏ ᴘᴏssᴜɪ ɪᴍᴀɢᴇᴍ, ᴠɪ́ᴅᴇᴏ ᴏᴜ ᴀ́ᴜᴅɪᴏ ᴄᴏᴍᴘᴀᴛɪ́ᴠᴇʟ.*`)

} catch (error) {
console.log('[OPEN/REVELAR]', error?.stack || error?.message || error)
await reagir(from, '❌').catch(() => {})

return reply(mess.padraoErro({
titulo: 'ERRO NO OPEN',
descricao: 'Não consegui baixar essa mídia, mesmo tentando os dados originais recebidos. O WhatsApp pode não ter enviado o arquivo.'
}))
}
}
}
}
)
