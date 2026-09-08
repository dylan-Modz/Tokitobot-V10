/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */
const normalizar = texto => String(texto || '')
.toLowerCase()
.normalize('NFD')
.replace(/[\u0300-\u036f]/g, '')
.replace(/\s+/g, ' ')
.trim()

const garantir = ctx => {
if (!ctx.dataGp?.[0]) return null
if (!ctx.dataGp[0].funcoes || typeof ctx.dataGp[0].funcoes !== 'object')
ctx.dataGp[0].funcoes = {}

const existeLista = Array.isArray(ctx.dataGp[0].funcoes.reacoesNome)
const origem = existeLista ? ctx.dataGp[0].funcoes.reacoesNome : []
const vistos = new Set()
const normalizadas = []
let mudou = !existeLista

// Compatibilidade com registros antigos que possam ter sido salvos
// sem "chave" ou usando nomes de campos de versões anteriores.
for (const item of origem) {
if (!item || typeof item !== 'object') {
mudou = true
continue
}

const nome = String(
item.nome || item.palavra || item.texto || item.chave || ''
).trim()
const emoji = String(item.emoji || item.reacao || '').trim()
const chave = normalizar(nome)

if (!nome || !emoji || !chave) {
mudou = true
continue
}

// Evita duplicar a mesma palavra/nome normalizado.
if (vistos.has(chave)) {
mudou = true
continue
}

vistos.add(chave)

const novo = {
...item,
nome,
chave,
emoji
}

if (
String(item.nome || '') !== nome ||
String(item.chave || '') !== chave ||
String(item.emoji || '') !== emoji
) mudou = true

normalizadas.push(novo)
}

ctx.dataGp[0].funcoes.reacoesNome = normalizadas

if (mudou && typeof ctx.setGp === 'function')
ctx.setGp(ctx.dataGp)

return normalizadas
}

const salvar = ctx => {
if (typeof ctx.setGp === 'function') ctx.setGp(ctx.dataGp)
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'rgreacao',
comandos: ['rgreacao', 'registrarreacao', 'rmreacao', 'removerreacao', 'listareacao', 'reacoes'],
categoria: 'freefire',

info: {
descricao: 'Registra palavras ou nomes para o bot reagir automaticamente.',
uso: 'rgreacao 😻 | dylan',
permissao: 'ADM',
categoria: 'freefire'
},
async executar(ctx) {
if (!ctx.isGroup)
return ctx.reply(ctx.mess.sogrupo())

if (!ctx.isGroupAdmins && !ctx.SoDono)
return ctx.reply(ctx.mess.soadm())

const lista = garantir(ctx)

if (!lista)
return ctx.reply(ctx.mess.error())

const cmd = String(ctx.command || '').toLowerCase()

if (['listareacao', 'reacoes'].includes(cmd)) {
if (!lista.length)
return ctx.reply(
`- 🎭 \`𝚁𝙴𝙰𝙲̧𝙾̃𝙴𝚂\`

> *『 0 』— ɴᴇɴʜᴜᴍᴀ ʀᴇᴀᴄ̧ᴀ̃ᴏ ғᴏɪ ʀᴇɢɪsᴛʀᴀᴅᴀ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.*`
)
const texto = lista
.map((item, i) => `> *『 ${i + 1} 』— ${item.emoji} → ${item.nome}*`)
.join('\n')

return ctx.reply(
`- 🎭 \`𝚁𝙴𝙰𝙲̧𝙾̃𝙴𝚂 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝙳𝙰𝚂\`

${texto}`
)
}

if (['rmreacao', 'removerreacao'].includes(cmd)) {
const nome = String(ctx.q || '').trim()
const chave = normalizar(nome)

if (!chave)
return ctx.reply(
`- ❌ \`𝚁𝙴𝙼𝙾𝚅𝙴𝚁 𝚁𝙴𝙰𝙲̧𝙰̃𝙾\`

> *『 𝚄𝚂𝙾 』— ${ctx.prefix}rmreacao dylan*`
)

const index = lista.findIndex(item =>
normalizar(item?.chave || item?.nome || item?.palavra || item?.texto) === chave
)
if (index < 0)
return ctx.reply(
`- ⚠️ \`𝚁𝙴𝙰𝙲̧𝙰̃𝙾 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰\`

> *『 ${nome} 』— ɴᴀ̃ᴏ ᴇxɪsᴛᴇ ᴜᴍᴀ ʀᴇᴀᴄ̧ᴀ̃ᴏ ʀᴇɢɪsᴛʀᴀᴅᴀ ᴘᴀʀᴀ ᴇssᴇ ɴᴏᴍᴇ.*`
)

const removida = lista.splice(index, 1)[0]
salvar(ctx)

return ctx.reply(
`- ✅ \`𝚁𝙴𝙰𝙲̧𝙰̃𝙾 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙰\`

> *『 ${removida.emoji} 』— ${removida.nome}*`
)
}

const entrada = String(ctx.q || '').trim()
const partes = entrada.split('|')

if (partes.length < 2)
return ctx.reply(
`- 🎭 \`𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝚁 𝚁𝙴𝙰𝙲̧𝙰̃𝙾\`

> *『 𝚄𝚂𝙾 』— ${ctx.prefix}rgreacao 😻 | dylan*
> *ǫᴜᴀɴᴅᴏ ᴀʟɢᴜᴇ́ᴍ ғᴀʟᴀʀ "dylan", ᴏ ʙᴏᴛ ᴠᴀɪ ʀᴇᴀɢɪʀ ᴄᴏᴍ 😻.*`
)

const emoji = String(partes.shift() || '').trim()
const nome = String(partes.join('|') || '').trim()
const chave = normalizar(nome)

if (!emoji || !nome || !chave)
return ctx.reply(
`- ❌ \`𝙳𝙰𝙳𝙾𝚂 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾𝚂\`

> *『 𝚄𝚂𝙾 』— ${ctx.prefix}rgreacao 😻 | dylan*`
)

if (emoji.length > 20)
return ctx.reply(
`- ❌ \`𝙴𝙼𝙾𝙹𝙸 𝙸𝙽𝚅𝙰́𝙻𝙸𝙳𝙾\`

> *ᴜsᴇ ᴜᴍ ᴇᴍᴏᴊɪ ᴄᴜʀᴛᴏ ᴘᴀʀᴀ ᴀ ʀᴇᴀᴄ̧ᴀ̃ᴏ.*`
)

const existente = lista.find(item =>
normalizar(item?.chave || item?.nome || item?.palavra || item?.texto) === chave
)
if (existente) {
existente.emoji = emoji
existente.nome = nome
existente.chave = chave
existente.atualizadoEm = new Date().toISOString()
salvar(ctx)

return ctx.reply(
`- ✅ \`𝚁𝙴𝙰𝙲̧𝙰̃𝙾 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙳𝙰\`

> *『 ${emoji} 』— ${nome}*`
)
}

if (lista.length >= 30)
return ctx.reply(
`- ⚠️ \`𝙻𝙸𝙼𝙸𝚃𝙴 𝙳𝙴 𝚁𝙴𝙰𝙲̧𝙾̃𝙴𝚂\`

> *ᴏ ʟɪᴍɪᴛᴇ ᴇ́ ᴅᴇ 30 ʀᴇᴀᴄ̧ᴏ̃ᴇs ᴘᴏʀ ɢʀᴜᴘᴏ.*`
)

lista.push({
nome,
chave,
emoji,
criadoPor: ctx.sender,
criadoEm: new Date().toISOString()
})

salvar(ctx)

return ctx.reply(
`- ✅ \`𝚁𝙴𝙰𝙲̧𝙰̃𝙾 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝙳𝙰\`

> *『 ${emoji} 』— ${nome}*
> *ᴀɢᴏʀᴀ, ǫᴜᴀɴᴅᴏ ᴀʟɢᴜᴇ́ᴍ ғᴀʟᴀʀ "${nome}", ᴇᴜ ᴠᴏᴜ ʀᴇᴀɢɪʀ ᴄᴏᴍ ${emoji}.*`
)
}
})
