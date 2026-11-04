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
return { message: desenrolar(item.message), key: item.key || {} }
}

const extrairMedia = msg => msg?.imageMessage || msg?.videoMessage ||
  msg?.ptvMessage || msg?.audioMessage || null

const codigoErro = (codigo, descricao, causa = null) => {
const erro = new Error(descricao)
erro.code = codigo
if (causa) erro.cause = causa
return erro
}

const statusHttp = erro => Number(
erro?.output?.statusCode || erro?.status || erro?.statusCode ||
erro?.response?.status || 0
)

const bufferMidia = async (ctx, tipo, midias, referencia = {}) => {
if (typeof ctx.getFileBuffer !== 'function')
throw codigoErro('DOWNLOAD_INDISPONIVEL', 'getFileBuffer não está disponível.')

let ultimaFalha = null
let existeChave = false
let existeCaminho = false
let renovacaoTentada = false

for (const media of midias) {
if (!media) continue
if (!media.mediaKey) continue
existeChave = true
if (media.url || media.directPath) existeCaminho = true

// Mídias com mediaKey mas sem URL também podem solicitar reenvio nativo.
try {
if (!media.url && !media.directPath)
throw codigoErro('SEM_CAMINHO', 'Mídia recebida sem URL ou directPath.')
const buffer = await ctx.getFileBuffer(media, tipo)
if (!Buffer.isBuffer(buffer) || !buffer.length)
throw codigoErro('ARQUIVO_VAZIO', 'Download retornou um arquivo vazio.')
return { buffer, media }
} catch (error) {
ultimaFalha = error
const status = statusHttp(error)
const renovavel = !media.url && !media.directPath || status === 404 || status === 410
if (!renovavel || renovacaoTentada ||
    typeof ctx.tokito?.updateMediaMessage !== 'function' ||
    !referencia.stanzaId) continue

renovacaoTentada = true
const campo = tipo === 'image' ? 'imageMessage' :
  tipo === 'audio' ? 'audioMessage' : 'videoMessage'
const mensagem = {
key: {
remoteJid: ctx.from,
id: referencia.stanzaId,
fromMe: Boolean(referencia.fromMe),
...(referencia.participant ? { participant: referencia.participant } : {})
},
message: { [campo]: media }
}
try {
await Promise.race([
ctx.tokito.updateMediaMessage(mensagem),
new Promise((_, rejeitar) => setTimeout(
() => rejeitar(codigoErro('TIMEOUT_REUPLOAD', 'Tempo limite no reenvio nativo.')), 15000
))
])
const buffer = await ctx.getFileBuffer(media, tipo)
if (!Buffer.isBuffer(buffer) || !buffer.length)
throw codigoErro('ARQUIVO_VAZIO', 'Download após reenvio retornou vazio.')
return { buffer, media }
} catch (erroRenovacao) {
ultimaFalha = erroRenovacao
}
}
}

if (!existeChave)
throw codigoErro('SEM_CHAVE', 'O WhatsApp não disponibilizou a chave de mídia.')
if (!existeCaminho && !renovacaoTentada)
throw codigoErro('SEM_CAMINHO', 'A mídia chegou sem URL ou directPath.')
throw codigoErro('FALHA_DOWNLOAD', 'A tentativa de download não foi concluída.', ultimaFalha)
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
const itemSalvo = contexto?.stanzaId ? obterOriginal(tokito, from, contexto.stanzaId) : null
const salvo = itemSalvo?.message || null
const origem = marcada || salvo || (contexto?.stanzaId ? null : info?.message)

if (!origem) {
await reagir(from, '❌').catch(() => {})
return reply(`- 👁️ \`𝙾𝙿𝙴𝙽\`

> *『 ${prefix + command} 』— ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴜᴍᴀ ɪᴍᴀɢᴇᴍ, ᴠɪ́ᴅᴇᴏ ᴏᴜ ᴀ́ᴜᴅɪᴏ.*`)
}

const msg = desenrolar(origem)
const usandoMarcada = Boolean(marcada)
const referencia = {
stanzaId: contexto?.stanzaId || '',
fromMe: Boolean(itemSalvo?.key?.fromMe),
participant: itemSalvo?.key?.participant || contexto?.participant || ''
}
let etapa = 'baixando'
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
const { buffer, media } = await bufferMidia(ctx, 'image', midias, referencia)
const caption = usandoMarcada ? String(media.caption || '').trim() : ''

etapa = 'enviando'
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
const { buffer, media } = await bufferMidia(ctx, 'video', midias, referencia)
const caption = usandoMarcada ? String(media.caption || '').trim() : ''

etapa = 'enviando'
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
const { buffer, media } = await bufferMidia(ctx, 'audio', midias, referencia)
const mimetype = String(media.mimetype || 'audio/ogg; codecs=opus').trim()

await tokito.sendPresenceUpdate('recording', from).catch(() => {})

try {
etapa = 'enviando'
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
const codigo = String(error?.code || '').toUpperCase()
const http = statusHttp(error?.cause || error)
console.log('[OPEN/REVELAR]', {
codigo: codigo || 'INDEFINIDO',
http: http || null,
etapa: typeof etapa === 'string' ? etapa : 'preparando',
temCitacao: Boolean(ctxMsg?.stanzaId),
cacheOriginal: Boolean(ctxMsg?.stanzaId &&
  tokito?.__tokitoMidiasOriginais?.has(from + '|' + ctxMsg.stanzaId))
})
await reagir(from, '❌').catch(() => {})

const descricao = (typeof etapa === 'string' && etapa === 'enviando')
? 'A mídia foi baixada, mas houve um erro ao reenviar no grupo.'
: codigo === 'SEM_CHAVE'
? 'O WhatsApp não entregou a chave do arquivo ao bot. Não é possível descriptografar a mídia sem ela.'
: codigo === 'SEM_CAMINHO'
? 'Recebi a chave, mas o WhatsApp não forneceu o endereço da mídia.'
: codigo === 'FALHA_DOWNLOAD'
? 'A Stone tentou baixar e atualizar o endereço da mídia, mas o servidor não disponibilizou o arquivo.'
: 'Não foi possível obter o arquivo. Confira o diagnóstico [OPEN/REVELAR] no terminal.'
return reply(mess.padraoErro({
titulo: 'ERRO NO OPEN',
descricao
}))
}
}
}
}
)
