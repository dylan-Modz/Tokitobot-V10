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

/* Auto Like diário.
 * Dev: Dylan Modz
 */

const fs = require('fs')
const path = require('path')
const axios = require('axios')

const FILE = path.join(
__dirname,
'..',
'database',
'sistemas',
'autolike.json'
)

const CFG = path.join(
__dirname,
'..',
'INFO_DADOS',
'config-all.json'
)

const GROUPS = path.join(
__dirname,
'..',
'database',
'grupos',
'ATIVAÇÕES-TOKITO'
)

const modoFreeFireAtivo = chat => {
if (!String(chat || '').endsWith('@g.us'))
return true

try {
const arquivo = path.join(GROUPS, `${chat}.json`)
const bruto = JSON.parse(fs.readFileSync(arquivo, 'utf8'))
const grupo = Array.isArray(bruto) ? bruto[0] : bruto
const funcoes = grupo?.funcoes || {}

if (typeof funcoes.modofreefire === 'boolean')
return funcoes.modofreefire

return funcoes.modox4 === true
} catch {
return false
}
}

const ler = () => {
try {
const d = JSON.parse(
fs.readFileSync(
FILE,
'utf8'
)
)

return Array.isArray(d)
? d
: []
}
catch {
return []
}
}

const salvar = d => {
const pasta = path.dirname(FILE)

if (!fs.existsSync(pasta)) {
fs.mkdirSync(
pasta,
{
recursive: true
}
)
}

fs.writeFileSync(
FILE,
JSON.stringify(
d,
null,
2
) + '\n'
)
}

const hoje = () => {
return new Intl.DateTimeFormat(
'en-CA',
{
timeZone:
'America/Fortaleza',

year:
'numeric',

month:
'2-digit',

day:
'2-digit'
}
).format(
new Date()
)
}

const cfg = () => {
try {
return JSON.parse(
fs.readFileSync(
CFG,
'utf8'
)
)
}
catch {
return {}
}
}

const registrar = (
owner,
chat,
uid
) => {
const d = ler()

const e = d.find(
x =>
x.owner === owner &&
x.uid === uid
)

if (e) {
e.ativo = true
e.chat = chat
}
else {
d.push({
owner,
chat,
uid,
ativo: true,
ultimoSucesso: null,
criadoEm: Date.now()
})
}

salvar(d)
}

const remover = (
owner,
uid
) => {
let d = ler()

const antes =
d.length

d = d.filter(
x =>
!(
x.owner === owner &&
x.uid === uid
)
)

salvar(d)

return antes !== d.length
}

const enviar = async e => {
const c = cfg()

const token = String(
c.TOKEN_LIKE_FF ||
process.env.TOKEN_LIKE_FF ||
c.API_KEY_TOKITO ||
''
).trim()

if (
!token ||
!c.API_URL
) {
return false
}

const {
data
} = await axios.post(
`${c.API_URL}/api/v1/likes`,
{
player_id:
String(e.uid),

region:
'BR'
},
{
headers: {
Authorization:
`Bearer ${token}`,

'Content-Type':
'application/json',

Accept:
'application/json',

'User-Agent':
'TokitoBot/1.0'
},

timeout:
90000
}
)

if (
!data?.success ||
data?.status !==
'SUCESSO_LIKES'
) {
return false
}

const conta =
data?.data?.conta ||
{}

const likes =
data?.data?.likes ||
{}

const limite =
data?.data?.limite ||
{}

const pedido =
data?.data?.pedido ||
{}

const uid =
conta.uid ||
data.player_id ||
e.uid

const nick =
conta.nickname ||
data.nickname ||
'Não encontrado'

const antes = Number(
likes.antes ??
data.likes_before ??
0
)

const adicionados = Number(
likes.adicionados ??
data.likes_added ??
0
)

const depois = Number(
likes.depois ??
data.likes_end ??
0
)

const limiteDiario = Number(
limite.diario ??
data.daily_limit ??
0
)

const usadosHoje = Number(
limite.usados_hoje ??
data.used_today ??
0
)

const restantes = Number(
limite.restantes ??
data.remaining_today ??
0
)

const orderId =
pedido.order_id ||
data.order_id ||
'Não informado'

const statusLikes =
likes.status ||
(
adicionados > 0
? 'ENVIADOS'
: 'SEM_ALTERACAO'
)

e.ultimoSucesso =
hoje()

return {
sucesso: true,

uid:
String(uid),

nick,

antes,

adicionados,

depois,

limiteDiario,

usadosHoje,

restantes,

orderId,

statusLikes,

resposta:
data
}
}

const mensagemSucesso = r => {
const status =
r.adicionados > 0
? '✅ Enviados'
: r.statusLikes ===
'LIMITE_ATINGIDO'
? '⚠️ Limite atingido'
: '⚠️ Nenhum like adicionado'

return `- ❤️ \`𝙰𝚄𝚃𝙾 𝙻𝙸𝙺𝙴\`

『 👤 \`𝙽𝙸𝙲𝙺\` 』— ${r.nick}
『 🆔 \`𝚄𝙸𝙳\` 』— ${r.uid}

『 ❤️ \`𝙰𝙽𝚃𝙴𝚂\` 』— ${r.antes}
『 ➕ \`𝙰𝙳𝙸𝙲𝙸𝙾𝙽𝙰𝙳𝙾𝚂\` 』— ${r.adicionados}
『 📈 \`𝙳𝙴𝙿𝙾𝙸𝚂\` 』— ${r.depois}

『 📊 \`𝙻𝙸𝙼𝙸𝚃𝙴 𝙳𝙸𝙰́𝚁𝙸𝙾\` 』— ${r.limiteDiario}
『 📥 \`𝚄𝚂𝙰𝙳𝙾𝚂 𝙷𝙾𝙹𝙴\` 』— ${r.usadosHoje}
『 📤 \`𝚁𝙴𝚂𝚃𝙰𝙽𝚃𝙴𝚂\` 』— ${r.restantes}

『 📅 \`𝙳𝙰𝚃𝙰\` 』— ${hoje()}
『 📌 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— ${status}`
}

const processar = async () => {
if (
global.__AUTO_LIKE_RODANDO__
) {
return
}

global.__AUTO_LIKE_RODANDO__ =
true

try {
const d = ler()
const h = hoje()

let mudou =
false

for (const e of d) {
if (
!e.ativo ||
e.ultimoSucesso === h ||
!modoFreeFireAtivo(e.chat)
) {
continue
}

try {
const r =
await enviar(e)

if (!r) {
continue
}

mudou =
true

const bot =
global.tokito

if (
bot &&
e.chat
) {
await bot.sendMessage(
e.chat,
{
text:
mensagemSucesso(r)
}
).catch(
() => {}
)
}
}
catch (err) {
console.log(
'[AUTO LIKE]',
e.uid,
err?.response?.data?.message ||
err?.message ||
err
)
}
}

if (mudou) {
salvar(d)
}
}
finally {
global.__AUTO_LIKE_RODANDO__ =
false
}
}

if (
!global.__AUTO_LIKE_INTERVAL__
) {
global.__AUTO_LIKE_INTERVAL__ =
setInterval(
() =>
processar().catch(
() => {}
),

15 * 60 * 1000
)

setTimeout(
() =>
processar().catch(
() => {}
),

15000
)
}

module.exports = {
ler,
salvar,
registrar,
remover,
processar,
hoje,
modoFreeFireAtivo
}
