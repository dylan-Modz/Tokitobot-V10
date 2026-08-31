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

const POR_PAGINA = 20

const carregar = async (ctx) => {
const all = await ctx.tokito.groupFetchAllParticipating()

return Object.values(all || {})
.sort((a, b) => String(a.subject || '').localeCompare(String(b.subject || ''), 'pt-BR'))
.map(g => ({
id: g.id,
nome: g.subject || g.id
}))
}

const render = s => {
const totalPaginas = Math.max(1, Math.ceil(s.grupos.length / POR_PAGINA))
s.page = Math.max(0, Math.min(Number(s.page || 0), totalPaginas - 1))

const inicio = s.page * POR_PAGINA
const gruposPagina = s.grupos.slice(inicio, inicio + POR_PAGINA)

const lista = gruposPagina.length
? gruposPagina.map((g, i) => {
const numero = i + 1
return `『 \`${numero}°\` 』— 👥 ${g.nome}`
}).join('\n')
: '> *Nenhum grupo conectado.*'

const navegacao = totalPaginas > 1
? `『 \`97°\` 』— ⬅️ ᴘᴀ́ɢɪɴᴀ ᴀɴᴛᴇʀɪᴏʀ
『 \`98°\` 』— ➡️ ᴘʀᴏ́xɪᴍᴀ ᴘᴀ́ɢɪɴᴀ`
: ''

return `\`\`\`👥 𝙶𝚁𝚄𝙿𝙾𝚂 𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙳𝙾𝚂\`\`\`

『 📄 \`𝙿𝙰́𝙶𝙸𝙽𝙰\` 』— ${s.page + 1}/${totalPaginas}
『 👥 \`𝚃𝙾𝚃𝙰𝙻\` 』— ${s.grupos.length}

─────────────────────
${lista}
─────────────────────
${navegacao ? `${navegacao}\n` : ''}『 \`99°\` 』— 🚪 𝚂𝙰𝙸𝚁 𝙳𝙴 𝚃𝙾𝙳𝙾𝚂
『 \`0°\` 』— ❌ 𝙲𝙰𝙽𝙲𝙴𝙻𝙰𝚁

> *Digite apenas o número do grupo desta página.*
> *Use \`99\` para sair de todos os grupos ou \`0\` para cancelar.*`
}

const iniciar = async (ctx) => {
const s = {
grupos: await carregar(ctx),
page: 0,
expira: Date.now() + 180000,
confirmar: false
}

modulos.pendentesSairall.set(
`${ctx.from}|${ctx.sender}`,
s
)

return ctx.reply(
render(s)
)
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'sairall',
comandos: ['sairall'],
categoria: 'dono',

info: {
descricao: 'Lista os grupos e permite sair de um ou todos.',
uso: 'sairall',
permissao: 'Dono'
},

POR_PAGINA,
carregar,
render,
iniciar,

async executar(ctx) {
if (!ctx.SoDono) {
return ctx.reply(
ctx.mess.onlyOwner()
)
}

return iniciar(ctx)
}
}
)
