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
const base = require('./base.js')
const mess = require('../database/lib/global.js')

const arq = path.join(__dirname, '..', 'INFO_DADOS', 'nescessario.json')

const btn = () => {
try {
return JSON.parse(fs.readFileSync(arq, 'utf8')).botoes !== false
}
catch {
return true
}
}

const e = global.__TOKITO_APROVACAO_ESTADO__ ||= {
pendentes: new Map(),
avisados: new Map(),
processando: new Set(),
concluidos: new Map(),
notificacoesGrupo: new Map(),
respostas: new Map()
}

e.respostas ||= new Map()

const p = e.pendentes
const a = e.avisados
const x = e.processando
const c = e.concluidos
const n = e.notificacoesGrupo
const r = e.respostas

const mapa = g => {
if (!p.has(g))
p.set(g, new Map())
return p.get(g)
}

const jid = p => String(
p?.participantPn ||
p?.phoneNumber ||
p?.jid ||
p?.participant ||
p?.id ||
''
).trim()

const estado = g => {
const c = base.config(g)

return {
ativo: Boolean(c.aprovacao),
automatico: Boolean(c.autoaprovacao)
}
}

const editar = (g, d, s, f) => {
const l = Array.isArray(d) && d[0] && typeof s === 'function'
const x = l ? d : base.lerGrupo(g)

if (!x[0].funcoes || typeof x[0].funcoes !== 'object')
x[0].funcoes = {}

f(x[0].funcoes)

if (l)
s(x)
else
base.salvarGrupo(g, x)

return {
ativo: Boolean(x[0].funcoes.aprovacao),
automatico: Boolean(x[0].funcoes.autoaprovacao)
}
}

const ativar = (g, v, d, s) => editar(g, d, s, f => {
f.aprovacao = Boolean(v)

if (!v)
f.autoaprovacao = false
})

const automatico = (g, v, d, s) => editar(g, d, s, f => {
f.aprovacao = Boolean(v) || Boolean(f.aprovacao)
f.autoaprovacao = Boolean(v)
})

const listar = g => [...mapa(g).values()]

const primeiro = g => listar(g)[0] || null

const remover = (g, j) => mapa(g).delete(j)

const limpar = g => p.delete(g)

const sincronizar = async (t, g) => {
const ps = await t.groupRequestParticipantsList(g).catch(() => [])
const m = mapa(g)
const v = new Set()

for (const p of ps || []) {
const j = jid(p)

if (!j)
continue

v.add(j)

m.set(j, {
...p,
jid: j
})
}

for (const j of m.keys())
if (!v.has(j))
m.delete(j)

return listar(g)
}

const aviso = async (t, g, p, prefix) => {
const j = p.jid
const num = base.numero(j)
const md = await t.groupMetadata(g).catch(() => ({}))
const nome = md?.subject || 'Grupo'

if (!btn()) {
const m = await t.sendMessage(g, {
text: mess.novaSolicitacaoSemBotoes(num, nome),
mentions: [j],
contextInfo: {
mentionedJid: [j]
}
})

const id = m?.key?.id

if (id) {
r.set(`${g}:${id}`, {
jid: j,
t: Date.now()
})
}

return m
}

await t.relayMessage(g, {
interactiveMessage: {
header: {
title: '📥 NOVA SOLICITAÇÃO',
hasMediaAttachment: false
},
body: {
text: mess.novaSolicitacao(num, nome)
},
footer: {
text: 'Sistema de aprovação'
},
nativeFlowMessage: {
buttons: [
{
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: mess.botaoAprovar(),
id: `${prefix}aprovarpedido ${j}`
})
},
{
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: mess.botaoRecusar(),
id: `${prefix}recusarpedido ${j}`
})
}
],
messageParamsJson: '{}'
},
contextInfo: {
mentionedJid: [j]
}
}
}, {})
}

const processar = async (t, g, p, prefix) => {
const cf = estado(g)

if (!cf.ativo)
return

const j = jid(p)

if (!j)
return

const k = `${g}:${j}`
const fim = c.get(k) || 0

if (Date.now() - fim < 60000)
return

if (x.has(k))
return

x.add(k)

try {
if (cf.automatico) {
await t.groupRequestParticipantsUpdate(g, [j], 'approve')

remover(g, j)
c.set(k, Date.now())

await t.sendMessage(g, {
text: mess.aprovacaoAutomatica(1),
mentions: [j]
}).catch(() => {
})

return
}

const u = a.get(k) || 0

if (Date.now() - u < 60000)
return

mapa(g).set(j, {
...p,
jid: j
})

await aviso(t, g, {
...p,
jid: j
}, prefix)

a.set(k, Date.now())
}
finally {
x.delete(k)
}
}

const achar = (n, tag) => {
if (!n)
return false

if (n.tag === tag)
return true

const c = Array.isArray(n.content)
? n.content
: []

return c.some(i => {
return i &&
typeof i === 'object' &&
achar(i, tag)
})
}

const txt = m => {
const x = m?.message || {}

return String(
x.conversation ||
x.extendedTextMessage?.text ||
''
).trim()
}

const cit = m => String(
m?.message
?.extendedTextMessage
?.contextInfo
?.stanzaId ||
''
).trim()

const adm = async (t, g, s) => {
const m = await t.groupMetadata(g).catch(() => null)

if (!m)
return false

const num = base.numero(s)

return (m.participants || []).some(p => {
const ids = [
p.id,
p.jid,
p.lid,
p.phoneNumber
].filter(Boolean)

const ok = ids.some(i => {
return i === s ||
base.numero(i) === num
})

return ok && Boolean(p.admin)
})
}

const resp = async (t, m) => {
const g = m?.key?.remoteJid

if (!g?.endsWith('@g.us'))
return

if (m?.key?.fromMe)
return

const op = txt(m)

if (!['1', '2'].includes(op))
return

const id = cit(m)

if (!id)
return

const k = `${g}:${id}`
const d = r.get(k)

if (!d)
return

if (Date.now() - d.t > 600000) {
r.delete(k)
return
}

const s = m?.key?.participant

if (!s)
return

if (!await adm(t, g, s))
return

const j = d.jid
const ps = await t.groupRequestParticipantsList(g).catch(() => [])

const ok = ps.some(p => jid(p) === j)

if (!ok) {
r.delete(k)

await t.sendMessage(g, {
text: mess.solicitacaoIndisponivel()
}, {
quoted: m
}).catch(() => {
})

return
}

const ac = op === '1'
? 'approve'
: 'reject'

await t.groupRequestParticipantsUpdate(
g,
[j],
ac
)

remover(g, j)

c.set(
`${g}:${j}`,
Date.now()
)

r.delete(k)

await t.sendMessage(g, {
text: mess.solicitacaoRespondida(
base.numero(j),
op === '1'
),
mentions: [j]
}, {
quoted: m
}).catch(() => {
})
}

const iniciar = (t, prefix = '!') => {
if (!t?.ws?.on || t.aprovacaoTokitoIniciada)
return

t.aprovacaoTokitoIniciada = true

t.ws.on('CB:notification', async n => {
try {
if (
global.__TOKITO_SOCKET_ATUAL__ &&
global.__TOKITO_SOCKET_ATUAL__ !== t
)
return

const g = n?.attrs?.from

if (!g?.endsWith('@g.us'))
return

if (!achar(n, 'created_membership_requests'))
return

const ag = Date.now()
const u = e.notificacoesGrupo.get(g) || 0

if (ag - u < 5000)
return

e.notificacoesGrupo.set(g, ag)

const ps = await t.groupRequestParticipantsList(g).catch(() => [])

for (const p of ps || [])
await processar(t, g, p, prefix)
}
catch (er) {
console.log(
'[APROVAÇÃO NOTIFICAÇÃO]',
er?.message || er
)
}
})

t.ev.on('messages.upsert', async ({ messages }) => {
try {
if (
global.__TOKITO_SOCKET_ATUAL__ &&
global.__TOKITO_SOCKET_ATUAL__ !== t
)
return

for (const m of messages || [])
await resp(t, m)
}
catch (er) {
console.log(
'[APROVAÇÃO RESPOSTA]',
er?.message || er
)
}
})
}

const configurar = async ({
grupo,
dataGp,
setGp,
q,
prefix,
command,
reply,
automatico: auto = false
}) => {
const ac = String(q || '').trim()

const t = auto
? '𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾 𝙰𝚄𝚃𝙾𝙼𝙰́𝚃𝙸𝙲𝙰'
: '𝚂𝙸𝚂𝚃𝙴𝙼𝙰 𝙳𝙴 𝙰𝙿𝚁𝙾𝚅𝙰𝙲̧𝙰̃𝙾'

const d = auto
? 'ᴀᴘʀᴏᴠᴀ ᴛᴏᴅᴀs ᴀs ɴᴏᴠᴀs sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ.'
: 'ᴀᴠɪsᴀ ᴇ ᴍᴏsᴛʀᴀ ᴏᴘᴄ̧ᴏ̃ᴇs ᴘᴀʀᴀ ᴀᴘʀᴏᴠᴀʀ ᴏᴜ ʀᴇᴄᴜsᴀʀ ɴᴏᴠᴏs ᴍᴇᴍʙʀᴏs.'

if (!['0', '1'].includes(ac))
return reply(
mess.funcaoUso(
auto ? '🤖' : '📥',
t,
prefix,
command,
d
)
)

if (auto)
automatico(
grupo,
ac === '1',
dataGp,
setGp
)
else
ativar(
grupo,
ac === '1',
dataGp,
setGp
)

return reply(
ac === '1'
? mess.funcaoAtivada(
auto ? '🤖' : '📥',
t,
d
)
: mess.funcaoDesativada(
auto ? '🤖' : '📥',
t,
auto
? 'ᴀs sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs ᴠᴏʟᴛᴀʀᴀ̃ᴏ ᴀ sᴇʀ ᴀɴᴀʟɪsᴀᴅᴀs ᴍᴀɴᴜᴀʟᴍᴇɴᴛᴇ.'
: 'ᴏ ʙᴏᴛ ɴᴀ̃ᴏ ᴀᴠɪsᴀʀᴀ́ sᴏʙʀᴇ ɴᴏᴠᴀs sᴏʟɪᴄɪᴛᴀᴄ̧ᴏ̃ᴇs.'
)
)
}

const decidir = async ({
tokito,
grupo,
alvo,
acao
}) => {
await sincronizar(tokito, grupo)

const j = String(
alvo ||
primeiro(grupo)?.jid ||
''
).trim()

if (!j)
return {
ok: false,
vazio: true
}

const ps = await tokito
.groupRequestParticipantsList(grupo)
.catch(() => [])

const ok = ps.some(p => jid(p) === j)

if (!ok) {
remover(grupo, j)

return {
ok: false,
indisponivel: true,
jid: j
}
}

await tokito.groupRequestParticipantsUpdate(
grupo,
[j],
acao
)

remover(grupo, j)

return {
ok: true,
jid: j
}
}

const decidirTodos = async ({
tokito,
grupo,
acao
}) => {
const ps = await sincronizar(tokito, grupo)

const js = ps
.map(p => p.jid)
.filter(Boolean)

if (!js.length)
return []

await tokito.groupRequestParticipantsUpdate(
grupo,
js,
acao
)

for (const j of js)
remover(grupo, j)

return js
}

module.exports = {
iniciar,
estado,
ativar,
automatico,
listar,
primeiro,
remover,
limpar,
sincronizar,
configurar,
decidir,
decidirTodos
}