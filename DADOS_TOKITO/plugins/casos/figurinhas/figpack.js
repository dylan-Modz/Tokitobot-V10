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

const fs = require('fs')
const path = require('path')
const os = require('os')
const Crypto = require('crypto')
const {
MAX_FIGURINHAS,
prepararImagem,
criarStickerPackNativo
} = require('./_packbase')

const sessoes = new Map()

const chave = ctx => `${ctx.from}:${ctx.normalizar(ctx.sender)}`

const pastaSessao = () => path.join(
os.tmpdir(),
`tokito-figpack-${Date.now()}-${Crypto.randomBytes(6).toString('hex')}`
)

const limpar = sessao => {
if (!sessao)
return
if (sessao.timer)
clearTimeout(sessao.timer)
try {
fs.rmSync(sessao.pasta, { recursive: true, force: true })
}
catch {}
}

const imagemMensagem = ctx => {
const m = ctx.mensagem || ctx.info?.message || {}
return m.imageMessage ||
m.viewOnceMessageV2?.message?.imageMessage ||
m.viewOnceMessage?.message?.imageMessage ||
m.ephemeralMessage?.message?.imageMessage ||
null
}

const imagemMarcada = ctx => {
const m = ctx.info?.message || ctx.mensagem || {}
const q = m.extendedTextMessage?.contextInfo?.quotedMessage ||
m.imageMessage?.contextInfo?.quotedMessage ||
{}
return q.imageMessage ||
q.viewOnceMessageV2?.message?.imageMessage ||
q.viewOnceMessage?.message?.imageMessage ||
q.ephemeralMessage?.message?.imageMessage ||
null
}

const adicionarImagem = async (ctx, sessao, imagem) => {
if (!imagem || sessao.arquivos.length >= MAX_FIGURINHAS)
return false

const original = await ctx.getFileBuffer(imagem, 'image')
if (!original?.length)
return false

const webp = await prepararImagem(original)
const hash = Crypto.createHash('sha256').update(webp).digest('base64url')

if (sessao.hashes.has(hash))
return false

sessao.hashes.add(hash)
const arquivo = path.join(
sessao.pasta,
`${String(sessao.arquivos.length).padStart(2, '0')}_${hash}.webp`
)
fs.writeFileSync(arquivo, webp)
sessao.arquivos.push(arquivo)
return true
}

const enviarStatus = async (ctx, sessao, textoExtra = '') => {
const texto =
`- 🧊 \`𝙵𝙸𝙶𝙿𝙰𝙲𝙺 𝙴𝙼 𝙼𝙾𝙽𝚃𝙰𝙶𝙴𝙼\`\n\n` +
`> *『 𝙿𝙰𝙲𝙺 』— ${sessao.nome}*\n` +
`> *『 𝙸𝙼𝙰𝙶𝙴𝙽𝚂 』— ${sessao.arquivos.length}/${MAX_FIGURINHAS}*\n` +
`> *『 𝙰𝚂𝚂𝙸𝙽𝙰𝚃𝚄𝚁𝙰 』— Channel - Tokito Apis*` +
(textoExtra ? `\n\n> *${textoExtra}*` : '')
return ctx.tokito.sendMessage(
ctx.from,
{ text: texto },
{ quoted: ctx.selo }
).catch(() => {})
}

const agendarStatus = (ctx, id, sessao) => {
if (sessao.timer)
clearTimeout(sessao.timer)
sessao.timer = setTimeout(() => {
const atual = sessoes.get(id)
if (!atual)
return
const extra = atual.arquivos.length >= MAX_FIGURINHAS
? `ʟɪᴍɪᴛᴇ ᴀᴛɪɴɢɪᴅᴏ. ᴜsᴇ ${atual.prefix}figpack gerar.`
: `ᴄᴏɴᴛɪɴᴜᴇ ᴇɴᴠɪᴀɴᴅᴏ ɪᴍᴀɢᴇɴs ᴏᴜ ᴀ́ʟʙᴜɴs.`
enviarStatus(ctx, atual, extra).catch(() => {})
}, 1000)
sessao.timer.unref?.()
}

module.exports = {
nome: 'figpack',
comandos: ['figpack', 'fazerpack'],
categoria: 'figurinhas',
info: {
descricao: 'Monta um pack com as imagens enviadas pelo usuário.',
uso: 'figpack criar Nome do Pack',
categoria: 'figurinhas'
},
async executar(ctx) {
const id = chave(ctx)
const texto = String(ctx.q || '').trim()
const [acaoBruta, ...resto] = texto.split(/\s+/)
const acao = String(acaoBruta || '').toLowerCase()
const nome = resto.join(' ').trim()

if (!acao) {
return ctx.reply(
`- 🧊 \`𝙵𝙸𝙶𝙿𝙰𝙲𝙺\`\n\n` +
`> *『 ${ctx.prefix}figpack criar ɴᴏᴍᴇ 』— ɪɴɪᴄɪᴀ ᴜᴍ ᴘᴀᴄᴋ.*\n` +
`> *『 ${ctx.prefix}figpack status 』— ᴠᴇ̂ ᴏ ᴘʀᴏɢʀᴇssᴏ.*\n` +
`> *『 ${ctx.prefix}figpack gerar 』— ᴍᴏɴᴛᴀ ᴇ ᴇɴᴠɪᴀ ᴏ ᴘᴀᴄᴋ.*\n` +
`> *『 ${ctx.prefix}figpack cancelar 』— ᴄᴀɴᴄᴇʟᴀ ᴀ ᴍᴏɴᴛᴀɢᴇᴍ.*\n\n` +
`> *ᴅᴇᴘᴏɪs ᴅᴇ ᴄʀɪᴀʀ, ᴇɴᴠɪᴇ ɪᴍᴀɢᴇɴs ᴏᴜ ᴀ́ʟʙᴜɴs. ᴏ ʙᴏᴛ ᴄᴀᴘᴛᴜʀᴀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ᴀᴛᴇ́ ${MAX_FIGURINHAS}.*`
)
}

if (acao === 'criar' || acao === 'novo') {
if (!nome)
return ctx.reply(`- ❌ \`𝙽𝙾𝙼𝙴 𝙳𝙾 𝙿𝙰𝙲𝙺\`\n\n> *ᴜsᴇ: ${ctx.prefix}figpack criar Meu Pack*`)
const antiga = sessoes.get(id)
if (antiga)
limpar(antiga)
const pasta = pastaSessao()
fs.mkdirSync(pasta, { recursive: true })
const sessao = {
nome: nome.slice(0, 64),
pasta,
arquivos: [],
hashes: new Set(),
criadoEm: Date.now(),
prefix: ctx.prefix,
timer: null
}
sessoes.set(id, sessao)

const inicial = imagemMensagem(ctx) || imagemMarcada(ctx)
if (inicial) {
try {
await adicionarImagem(ctx, sessao, inicial)
}
catch (error) {
console.log('[FIGPACK IMAGEM INICIAL]', error?.message || error)
}
}

return ctx.reply(
`- ✅ \`𝙵𝙸𝙶𝙿𝙰𝙲𝙺 𝙸𝙽𝙸𝙲𝙸𝙰𝙳𝙾\`\n\n` +
`> *『 𝙿𝙰𝙲𝙺 』— ${sessao.nome}*\n` +
`> *『 𝙸𝙼𝙰𝙶𝙴𝙽𝚂 』— ${sessao.arquivos.length}/${MAX_FIGURINHAS}*\n` +
`> *『 𝙰𝚂𝚂𝙸𝙽𝙰𝚃𝚄𝚁𝙰 』— Channel - Tokito Apis*\n\n` +
`> *ᴀɢᴏʀᴀ ᴇɴᴠɪᴇ sᴜᴀs ɪᴍᴀɢᴇɴs ᴏᴜ ᴀ́ʟʙᴜɴs. ǫᴜᴀɴᴅᴏ ǫᴜɪsᴇʀ ᴄᴏɴᴄʟᴜɪʀ, ᴜsᴇ ${ctx.prefix}figpack gerar.*`
)
}

if (acao === 'status') {
const sessao = sessoes.get(id)
if (!sessao)
return ctx.reply(`- ⚠️ \`𝙽𝙴𝙽𝙷𝚄𝙼 𝙵𝙸𝙶𝙿𝙰𝙲𝙺 𝙰𝙱𝙴𝚁𝚃𝙾\`\n\n> *ᴜsᴇ ${ctx.prefix}figpack criar Nome do Pack.*`)
return enviarStatus(ctx, sessao)
}

if (acao === 'cancelar' || acao === 'apagar') {
const sessao = sessoes.get(id)
if (!sessao)
return ctx.reply(`- ⚠️ \`𝙽𝙰𝙳𝙰 𝙿𝙰𝚁𝙰 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝚁\``)
limpar(sessao)
sessoes.delete(id)
return ctx.reply(`- 🗑️ \`𝙵𝙸𝙶𝙿𝙰𝙲𝙺 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝙳𝙾\`\n\n> *ᴀ ᴍᴏɴᴛᴀɢᴇᴍ ғᴏɪ ᴅᴇsᴄᴀʀᴛᴀᴅᴀ.*`)
}

if (acao === 'gerar' || acao === 'pronto' || acao === 'concluir') {
const sessao = sessoes.get(id)
if (!sessao)
return ctx.reply(`- ⚠️ \`𝙽𝙴𝙽𝙷𝚄𝙼 𝙵𝙸𝙶𝙿𝙰𝙲𝙺 𝙰𝙱𝙴𝚁𝚃𝙾\`\n\n> *ᴜsᴇ ${ctx.prefix}figpack criar Nome do Pack.*`)
if (!sessao.arquivos.length)
return ctx.reply(`- ❌ \`𝙵𝙸𝙶𝙿𝙰𝙲𝙺 𝚅𝙰𝚉𝙸𝙾\`\n\n> *ᴇɴᴠɪᴇ ᴘᴇʟᴏ ᴍᴇɴᴏs ᴜᴍᴀ ɪᴍᴀɢᴇᴍ ᴀɴᴛᴇs ᴅᴇ ɢᴇʀᴀʀ.*`)
try {
await ctx.reagir(ctx.from, '📦').catch(() => {})
const buffers = sessao.arquivos.map(arquivo => fs.readFileSync(arquivo))
const total = await criarStickerPackNativo(ctx, buffers, sessao.nome)
limpar(sessao)
sessoes.delete(id)
await ctx.reagir(ctx.from, '✅').catch(() => {})
return ctx.reply(
`- ✅ \`𝙵𝙸𝙶𝙿𝙰𝙲𝙺 𝙿𝚁𝙾𝙽𝚃𝙾\`\n\n` +
`> *『 𝙿𝙰𝙲𝙺 』— ${sessao.nome}*\n` +
`> *『 𝙵𝙸𝙶𝚄𝚁𝙸𝙽𝙷𝙰𝚂 』— ${total}/${MAX_FIGURINHAS}*\n` +
`> *『 𝙰𝚂𝚂𝙸𝙽𝙰𝚃𝚄𝚁𝙰 』— Channel - Tokito Apis*`
)
}
catch (error) {
console.log('[FIGPACK GERAR]', error?.stack || error?.message || error)
return ctx.reply(`- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝙵𝙸𝙶𝙿𝙰𝙲𝙺\`\n\n> *ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ɢᴇʀᴀʀ ᴏ ᴘᴀᴄᴋ. ᴀs ɪᴍᴀɢᴇɴs ғɪᴄᴀʀᴀᴍ sᴀʟᴠᴀs ɴᴀ sᴇssᴀ̃ᴏ ᴘᴀʀᴀ ᴠᴏᴄᴇ̂ ᴛᴇɴᴛᴀʀ ɴᴏᴠᴀᴍᴇɴᴛᴇ.*`)
}
}

return ctx.reply(`- ❌ \`𝙾𝙿𝙲̧𝙰̃𝙾 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙰\`\n\n> *ᴜsᴇ: criar, status, gerar ou cancelar.*`)
},
async evento(ctx) {
if (ctx.info?.key?.fromMe || ctx.isCmd)
return false
const id = chave(ctx)
const sessao = sessoes.get(id)
if (!sessao)
return false
if (Date.now() - sessao.criadoEm > 60 * 60 * 1000) {
limpar(sessao)
sessoes.delete(id)
return false
}
if (sessao.arquivos.length >= MAX_FIGURINHAS)
return false
const imagem = imagemMensagem(ctx)
if (!imagem)
return false
try {
const adicionou = await adicionarImagem(ctx, sessao, imagem)
if (adicionou)
agendarStatus(ctx, id, sessao)
return true
}
catch (error) {
console.log('[FIGPACK IMAGEM]', error?.message || error)
return true
}
}
}
