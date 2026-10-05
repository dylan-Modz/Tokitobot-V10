/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const dylan = require('../../database/lib/comandos')

const configuracoes = {
stickerbv: { indice: 3, campo: 'stickerbv', tipo: 'sticker', momento: 'entrada' },
stickersaiu: { indice: 3, campo: 'stickersaiu', tipo: 'sticker', momento: 'saída' },
audiobv: { indice: 4, campo: 'audiobv', tipo: 'audio', momento: 'entrada' },
audiosaiu: { indice: 4, campo: 'audiosaiu', tipo: 'audio', momento: 'saída' }
}

const contextoDaMensagem = mensagem => (
mensagem?.extendedTextMessage?.contextInfo ||
mensagem?.imageMessage?.contextInfo ||
mensagem?.videoMessage?.contextInfo ||
mensagem?.audioMessage?.contextInfo ||
mensagem?.stickerMessage?.contextInfo ||
mensagem?.documentMessage?.contextInfo ||
{}
)

const apagarArquivo = (ctx, salvo) => {
const nome = String(salvo?.arquivo || '').trim()
if (!nome) return

try {
const base = ctx.path.resolve(ctx.runtimeSub.mediaDir)
const local = ctx.path.resolve(base, ctx.path.basename(nome))

if (
local !== base &&
local.startsWith(base + ctx.path.sep) &&
ctx.fs.existsSync(local)
) {
ctx.fs.unlinkSync(local)
}
}
catch {
}
}

const extensaoAudio = mimetype => {
const tipo = String(mimetype || '').toLowerCase()

if (tipo.includes('mpeg')) return '.mp3'
if (tipo.includes('mp4')) return '.m4a'
if (tipo.includes('opus')) return '.opus'
return '.ogg'
}

dylan.setCommand({
nome: 'stickerbv',
comandos: ['stickerbv', 'stickersaiu', 'audiobv', 'audiosaiu'],
categoria: 'grupo',
info: {
descricao: 'Configura figurinha ou áudio dos modos Bem-vindo 4 e 5.',
uso: 'stickerbv respondendo uma figurinha',
permissao: 'ADM'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())

if (!ctx.isBotGroupAdmins)
return ctx.reply(ctx.mess.botadm())

const configCmd = configuracoes[String(ctx.command || '').toLowerCase()]
if (!configCmd) return false

if (!Array.isArray(ctx.dataGp?.[0]?.wellcome))
ctx.dataGp[0].wellcome = []

const padrao = configCmd.indice === 3
? { bemvindo4: false, stickerbv: null, stickersaiu: null }
: { bemvindo5: false, audiobv: null, audiosaiu: null }

const config = ctx.dataGp[0].wellcome[configCmd.indice] || padrao
ctx.dataGp[0].wellcome[configCmd.indice] = config

const acao = String(ctx.q || '').trim().toLowerCase()

if (['0', 'off', 'del', 'remover'].includes(acao)) {
apagarArquivo(ctx, config[configCmd.campo])
config[configCmd.campo] = null
ctx.setGp(ctx.dataGp)

await ctx.reagir(ctx.from, '✅').catch(() => {})

return ctx.reply(
ctx.mess.bemvindoMidiaRemovida(configCmd.tipo, configCmd.momento)
)
}

const contexto = contextoDaMensagem(ctx.mensagem)
const marcada = ctx.extrair(
ctx.ctxMsg?.quotedMessage ||
contexto?.quotedMessage ||
ctx.mensagem
)

const midia = configCmd.tipo === 'sticker'
? marcada?.stickerMessage
: marcada?.audioMessage

if (!midia) {
return ctx.reply(
ctx.mess.bemvindoMidiaUso(
configCmd.tipo,
configCmd.momento,
ctx.prefix,
ctx.command
)
)
}

await ctx.reagir(ctx.from, '⏳').catch(() => {})
ctx.runtimeSub.ensure(ctx.runtimeSub.mediaDir)

const buffer = await ctx.getFileBuffer(midia, configCmd.tipo)
const mimetype = configCmd.tipo === 'sticker'
? String(midia.mimetype || 'image/webp')
: String(midia.mimetype || 'audio/ogg; codecs=opus')

const extensao = configCmd.tipo === 'sticker'
? '.webp'
: extensaoAudio(mimetype)

const nome = `${String(ctx.from || 'grupo').split('@')[0]}-${configCmd.campo}-${Date.now()}-${ctx.getRandom(extensao)}`
const destino = ctx.path.join(ctx.runtimeSub.mediaDir, nome)

ctx.fs.writeFileSync(destino, buffer)
apagarArquivo(ctx, config[configCmd.campo])

config[configCmd.campo] = {
arquivo: nome,
mimetype,
...(configCmd.tipo === 'audio' ? { ptt: midia.ptt === true } : {})
}

ctx.setGp(ctx.dataGp)

await ctx.reagir(ctx.from, '✅').catch(() => {})

return ctx.reply(
ctx.mess.bemvindoMidiaSalva(configCmd.tipo, configCmd.momento)
)
}
})
