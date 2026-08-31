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

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'gerarlink',
comandos: ['gerarlink', 'link'],
categoria: 'outros',
info: {
descricao: 'Gera um link temporário de imagem, vídeo, áudio, sticker ou documento.',
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
const url = await modulos.uploadTemp(b, e)

await ctx.reagir(ctx.from, '✅').catch(() => {})
return ctx.reply(ctx.mess.gerarLinkResultado(d.n, e, url))
}
catch (e) {
await ctx.reagir(ctx.from, '❌').catch(() => {})
console.log('[GERARLINK]', modulos.sanitizarErro(e, [ctx.API_KEY_TOKITO]))
return ctx.reply(ctx.mess.gerarLinkFalhou())
}
}
}
)
