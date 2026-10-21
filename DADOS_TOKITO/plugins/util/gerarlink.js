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

const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const { proto, generateWAMessageFromContent } = require('@stone-wpp/ofc')
const LIMITE_MB = 12
const modulos = require('../../sistemas/modulos')

const extMime = mime => {
mime = String(mime || '').toLowerCase()
if (mime.includes('jpeg')) return 'jpg'
if (mime.includes('png')) return 'png'
if (mime.includes('webp')) return 'webp'
if (mime.includes('gif')) return 'gif'
if (mime.includes('quicktime')) return 'mov'
if (mime.includes('matroska')) return 'mkv'
if (mime.includes('msvideo')) return 'avi'
if (mime.includes('video/mp4')) return 'mp4'
if (mime.includes('mpeg')) return 'mp3'
if (mime.includes('audio/mp4')) return 'm4a'
if (mime.includes('wav')) return 'wav'
if (mime.includes('webm')) return 'webm'
if (mime.includes('ogg') || mime.includes('opus')) return 'ogg'
if (mime.includes('pdf')) return 'pdf'
if (mime.includes('json')) return 'json'
if (mime.includes('text/plain')) return 'txt'
if (mime.includes('zip')) return 'zip'
if (mime.includes('rar')) return 'rar'
if (mime.includes('7z')) return '7z'
if (mime.includes('wordprocessingml')) return 'docx'
if (mime.includes('msword')) return 'doc'
if (mime.includes('spreadsheetml')) return 'xlsx'
if (mime.includes('ms-excel')) return 'xls'
if (mime.includes('presentationml')) return 'pptx'
if (mime.includes('ms-powerpoint')) return 'ppt'
return ''
}

const dadosMidia = ctx => {
const m = modulos.mediaAtual(ctx)
if (m.image) return { m: m.image, t: 'image', n: 'Imagem' }
if (m.video) return { m: m.video, t: 'video', n: 'Vídeo' }
if (m.audio) return { m: m.audio, t: 'audio', n: 'Áudio' }
if (m.document) return { m: m.document, t: 'document', n: 'Documento' }
if (m.sticker) return { m: m.sticker, t: 'sticker', n: 'Sticker' }
return null
}

const extensao = d => {
const nome = String(d?.m?.fileName || '').trim()
const e = nome ? path.extname(nome).replace('.', '').toLowerCase() : ''
if (e && /^[a-z0-9]{1,10}$/.test(e)) return e
if (d?.t === 'sticker') return 'webp'
return extMime(d?.m?.mimetype) || (d?.t === 'image' ? 'jpg' : d?.t === 'video' ? 'mp4' : d?.t === 'audio' ? 'ogg' : 'bin')
}


const uploadTokito = async (buffer, ext, mime, ctx) => {
  const token = String(ctx.API_KEY_TOKITO || '').trim()
  if (!token) throw new Error('A API key do Tokito não está configurada.')
  const base = String(ctx.API_URL || 'https://tokito-apis.com.br').replace(/\/+$/, '')
  const form = new FormData()
  form.append('file', buffer, {
    filename: 'tokito_' + Date.now() + '.' + ext,
    contentType: String(mime || 'application/octet-stream').split(';')[0]
  })
  const resposta = await axios.post(base + '/api/upload', form, {
    headers: {
      ...form.getHeaders(),
      'x-api-key': token,
      Accept: 'application/json'
    },
    timeout: 120000,
    maxBodyLength: 16 * 1024 * 1024,
    maxContentLength: 2 * 1024 * 1024,
    validateStatus: () => true
  })
  const dados = resposta.data || {}
  if (resposta.status < 200 || resposta.status >= 300 || dados.status === false || dados.sucesso === false) {
    throw new Error('Tokito APIs: ' + String(dados.erro || dados.mensagem || dados.message || ('HTTP ' + resposta.status)))
  }
  const url = String(dados.url || dados.link || '').trim()
  if (!/^https:\/\/raw\.githubusercontent\.com\//i.test(url)) {
    throw new Error('A API não retornou um link direto válido.')
  }
  return { url, ext: path.extname(String(dados.filename || '')).slice(1) || ext }
}

// Botão nativo de copiar igual ao usado em outros comandos do Tokito.
// Se não for aceito no dispositivo, envia o link como texto normalmente.
const enviarComBotao = async (ctx, texto, url) => {
  if (typeof ctx.tokito?.relayMessage !== 'function') return ctx.reply(texto)
  try {
    const interativo = proto.Message.InteractiveMessage.create({
      body: proto.Message.InteractiveMessage.Body.create({ text: texto }),
      footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
        buttons: [{
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: '📋﹚𝐂𝐎𝐏𝐈𝐀𝐑 𝐋𝐈𝐍𝐊﹙📋',
            id: 'tokito_link_' + Date.now(),
            copy_code: url
          })
        }],
        messageParamsJson: JSON.stringify({})
      })
    })
    const mensagem = generateWAMessageFromContent(ctx.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: interativo
        }
      }
    }, {
      quoted: ctx.selo || undefined,
      userJid: ctx.tokito.user?.id
    })
    await ctx.tokito.relayMessage(ctx.from, mensagem.message, {
      messageId: mensagem.key.id
    })
    return true
  } catch (erro) {
    console.log('[GERARLINK BOTAO]', erro?.message || String(erro))
    return ctx.reply(texto)
  }
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'gerarlink',
comandos: ['gerarlink', 'link'],
categoria: 'outros',
info: {
descricao: 'Gera um link direto de imagem, vídeo, áudio, sticker ou documento.',
uso: 'gerarlink respondendo uma mídia',
categoria: 'outros'
},

async executar(ctx) {
const d = dadosMidia(ctx)
if (!d) return ctx.reply(ctx.mess.gerarLinkSemMidia(ctx.prefix))

await ctx.reagir(ctx.from, '🔗').catch(() => {})

try {
const b = await ctx.getFileBuffer(d.m, d.t)
if (!Buffer.isBuffer(b) || !b.length) throw new Error('Não foi possível baixar a mídia.')

const e = extensao(d)
if (b.length > LIMITE_MB * 1024 * 1024) {
  await ctx.reagir(ctx.from, '❌').catch(() => {})
  return ctx.reply('- ⚠️ ' + String.fromCharCode(96) + '𝙰𝚁𝚀𝚄𝙸𝚅𝙾 𝙼𝚄𝙸𝚃𝙾 𝙶𝚁𝙰𝙽𝙳𝙴' + String.fromCharCode(96) + '\n\n> 📦 ׄ ( ʟɪᴍɪᴛᴇ ᴅᴏ ᴜᴘʟᴏᴀᴅ: 12 ᴍʙ. )')
}
const resultado = await uploadTokito(b, e, d.m.mimetype, ctx)

await ctx.reagir(ctx.from, '✅').catch(() => {})
const texto = "- 🔗 `𝙻𝙸𝙽𝙺 𝙶𝙴𝚁𝙰𝙳𝙾`\n\n"
  + "> 📁 ׄ ( ᴛɪᴘᴏ: " + d.n + " )\n"
  + "> 🧩 ׄ ( ғᴏʀᴍᴀᴛᴏ: " + resultado.ext.toUpperCase() + " )\n"
  + "> 🔗 ׄ ( ᴜʀʟ: " + resultado.url + " )\n\n"
  + "> ✅ ׄ ( sᴇᴜ ᴀʀǫᴜɪᴠᴏ ғᴏɪ ᴄᴏɴᴠᴇʀᴛɪᴅᴏ ᴇᴍ ʟɪɴᴋ ᴄᴏᴍ sᴜᴄᴇssᴏ! )"
return enviarComBotao(ctx, texto, resultado.url)
}
catch (e) {
await ctx.reagir(ctx.from, '❌').catch(() => {})
console.log('[GERARLINK]', modulos.sanitizarErro(e, [ctx.API_KEY_TOKITO]))
return ctx.reply(ctx.mess.gerarLinkFalhou())
}
}
}
)
