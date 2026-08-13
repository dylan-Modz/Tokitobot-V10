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

const modulos = require('../../sistemas/modulos')

const POR_PAGINA = 15
const pendentes = global.__TOKITO_BANGPLIT__ ||= new Map()

const lerGrupo = (ctx, id) => {
const local = ctx.pathgroupjson(id)

try {
if (!ctx.fs.existsSync(local))
return []

const dados = JSON.parse(ctx.fs.readFileSync(local, 'utf8'))

return Array.isArray(dados)
? dados
: []
} catch {
return []
}
}

const estado = (ctx, id) => {
const dados = lerGrupo(ctx, id)
return dados?.[0]?.funcoes?.bangp === true
}

const salvarEstado = (ctx, grupo, ativo) => {
const local = ctx.pathgroupjson(grupo.id)
let dados = lerGrupo(ctx, grupo.id)

if (!dados.length) {
dados = [{
name: grupo.nome || 'Grupo',
groupId: grupo.id,
funcoes: {}
}]
}

if (!dados[0] || typeof dados[0] !== 'object')
dados[0] = {}

dados[0].name = dados[0].name || grupo.nome || 'Grupo'
dados[0].groupId = dados[0].groupId || grupo.id

if (!dados[0].funcoes || typeof dados[0].funcoes !== 'object')
dados[0].funcoes = {}

dados[0].funcoes.bangp = ativo === true

ctx.salvarJson(local, dados)

return dados[0].funcoes.bangp
}

const carregar = async ctx => {
const todos = await ctx.tokito.groupFetchAllParticipating()

return Object.values(todos || {})
.sort((a, b) => String(a.subject || '').localeCompare(String(b.subject || ''), 'pt-BR'))
.map(g => ({
id: g.id,
nome: g.subject || g.id,
bangp: estado(ctx, g.id)
}))
}

const paginas = s => Math.max(1, Math.ceil(s.grupos.length / POR_PAGINA))

const render = s => {
const totalPaginas = paginas(s)

s.page = Math.max(
0,
Math.min(
Number(s.page || 0),
totalPaginas - 1
)
)

const inicio = s.page * POR_PAGINA
const lista = s.grupos.slice(inicio, inicio + POR_PAGINA)

const itens = lista.length
? lista.map((g, i) => {
const status = g.bangp ? '🔴 ON' : '🟢 OFF'
return `『 \`${i + 1}°\` 』— 👥 ${g.nome}\n> BANGP: *${status}*`
}).join('\n\n')
: '> *Nenhum grupo conectado.*'

const nav = totalPaginas > 1
? `『 \`97°\` 』— ⬅️ ᴘᴀ́ɢɪɴᴀ ᴀɴᴛᴇʀɪᴏʀ
『 \`98°\` 』— ➡️ ᴘʀᴏ́xɪᴍᴀ ᴘᴀ́ɢɪɴᴀ
`
: ''

return `- 🛡️ \`𝙱𝙰𝙽𝙶𝙿 𝙳𝙾𝚂 𝙶𝚁𝚄𝙿𝙾𝚂\`

『 📄 \`𝙿𝙰́𝙶𝙸𝙽𝙰\` 』— ${s.page + 1}/${totalPaginas}
『 👥 \`𝚃𝙾𝚃𝙰𝙻\` 』— ${s.grupos.length}

─────────────────────
${itens}
─────────────────────
${nav}『 \`0°\` 』— ❌ 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝚁

> *Digite apenas o número do grupo que deseja configurar.*`
}

const renderAcao = grupo => {
return `- 🛡️ \`𝙲𝙾𝙽𝙵𝙸𝙶𝚄𝚁𝙰𝚁 𝙱𝙰𝙽𝙶𝙿\`

『 👥 \`𝙶𝚁𝚄𝙿𝙾\` 』— ${grupo.nome}
『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${grupo.bangp ? '🔴 ATIVADO' : '🟢 DESATIVADO'}

『 \`1°\` 』— 🔴 𝙰𝚃𝙸𝚅𝙰𝚁 𝙱𝙰𝙽𝙶𝙿
『 \`2°\` 』— 🟢 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝚁 𝙱𝙰𝙽𝙶𝙿
『 \`3°\` 』— ↩️ 𝚅𝙾𝙻𝚃𝙰𝚁
『 \`0°\` 』— ❌ 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝚁

> *Você não precisa entrar no grupo para alterar o BANGP.*`
}

const iniciar = async ctx => {
const chave = `${ctx.from}|${ctx.sender}`

modulos.pendentesSairall?.delete(chave)
modulos.pendentesAtivar?.delete(chave)
pendentes.delete(chave)

const grupos = await carregar(ctx)

if (!grupos.length) {
return ctx.reply(`- ⚠️ \`𝙱𝙰𝙽𝙶𝙿𝙻𝙸𝚃\`

> *ᴏ ʙᴏᴛ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴇᴍ ɴᴇɴʜᴜᴍ ɢʀᴜᴘᴏ.*`)
}

const s = {
grupos,
page: 0,
modo: 'lista',
selecionado: null,
expira: Date.now() + 180000
}

pendentes.set(chave, s)

return ctx.reply(render(s))
}

module.exports = {
nome: 'bangplit',
comandos: ['bangplit'],
categoria: 'dono',

info: {
descricao: 'Lista todos os grupos e permite configurar o BANGP sem entrar neles.',
uso: 'bangplit',
permissao: 'Dono'
},

POR_PAGINA,
pendentes,
estado,
salvarEstado,
carregar,
render,
renderAcao,
paginas,
iniciar,

async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())

try {
return await iniciar(ctx)
} catch (error) {
console.log('[BANGPLIT]', error?.stack || error?.message || error)

return ctx.reply(`- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝙱𝙰𝙽𝙶𝙿𝙻𝙸𝚃\`

> *ɴᴀ̃ᴏ ғᴏɪ ᴘᴏssɪ́ᴠᴇʟ ᴄᴀʀʀᴇɢᴀʀ ᴏs ɢʀᴜᴘᴏs ᴀɢᴏʀᴀ.*`)
}
}
}
