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

/*
 * NPM Search + Download
 *
 * Pesquisa informações de pacotes no NPM
 * e envia o arquivo original publicado.
 *
 * Dev: Dylan Modz
 * GitHub: @dylanModz
 */

const axios = require("axios")

const cortarTexto = (
texto,
limite = 500
) => {
const valor = String(
texto || ""
).trim()

if (!valor) {
return "Não informado"
}

if (
valor.length <= limite
) {
return valor
}

return `${valor.slice(0, limite)}...`
}

const formatarNumero = valor => {
const numero = Number(
valor || 0
)

return numero.toLocaleString(
"pt-BR"
)
}

const formatarData = data => {
if (!data) {
return "Não informado"
}

try {
return new Date(
data
).toLocaleString(
"pt-BR",
{
day: "2-digit",
month: "2-digit",
year: "numeric",
hour: "2-digit",
minute: "2-digit"
}
)
}
catch {
return String(
data
)
}
}

const nomeArquivoSeguro = nome => {
return String(
nome || "pacote"
)
.replace(
/^@/,
""
)
.replace(
/[\/\\:*?"<>|]/g,
"-"
)
.replace(
/\s+/g,
"-"
)
.replace(
/-+/g,
"-"
)
.trim()
}

const pegarAutor = (
pacote,
detalhes
) => {
if (
detalhes?.author?.name
) {
return detalhes.author.name
}

if (
typeof detalhes?.author ===
"string"
) {
return detalhes.author
}

if (
pacote?.publisher?.username
) {
return pacote.publisher.username
}

if (
pacote?.publisher?.email
) {
return pacote.publisher.email
}

if (
pacote?.author?.name
) {
return pacote.author.name
}

if (
typeof pacote?.author ===
"string"
) {
return pacote.author
}

return "Não informado"
}

const pegarRepositorio = (
pacote,
detalhes
) => {
let repositorio =
pacote?.links?.repository ||
detalhes?.repository?.url ||
detalhes?.repository ||
""

if (
typeof repositorio ===
"object"
) {
repositorio =
repositorio?.url ||
""
}

repositorio = String(
repositorio || ""
)
.replace(
/^git\+/i,
""
)
.replace(
/^git:/i,
"https:"
)
.replace(
/\.git$/i,
""
)

return repositorio ||
null
}

const pegarHomepage = (
pacote,
detalhes
) => {
return (
pacote?.links?.homepage ||
detalhes?.homepage ||
null
)
}

const pegarDownloads = async nome => {
try {
const pacote =
encodeURIComponent(
nome
)

const {
data
} = await axios.get(
`https://api.npmjs.org/downloads/point/last-week/${pacote}`,
{
timeout: 20000
}
)

return Number(
data?.downloads || 0
)
}
catch {
return 0
}
}

const pesquisarNpm = async pesquisa => {
const {
data
} = await axios.get(
"https://registry.npmjs.org/-/v1/search",
{
params: {
text: pesquisa,
size: 10
},

timeout: 30000,

headers: {
"User-Agent":
"TokitoBot/10.0"
}
}
)

return Array.isArray(
data?.objects
)
? data.objects
: []
}

const escolherPacote = (
resultados,
pesquisa
) => {
const procura = String(
pesquisa || ""
)
.trim()
.toLowerCase()

const exato =
resultados.find(
item =>
String(
item?.package?.name ||
""
)
.toLowerCase() ===
procura
)

return exato ||
resultados[0] ||
null
}

const pegarDetalhes = async nome => {
const pacote =
encodeURIComponent(
nome
)

const {
data
} = await axios.get(
`https://registry.npmjs.org/${pacote}/latest`,
{
timeout: 30000,

headers: {
"User-Agent":
"TokitoBot/10.0"
}
}
)

return data || {}
}

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: "npm",

comandos: [
"npm",
"npmsearch"
],

categoria: "pesquisa",

info: {
descricao:
"Pesquisa pacotes no NPM e envia o arquivo original.",

uso:
"npm axios",

categoria:
"pesquisa"
},

async executar(ctx) {
with (ctx) {
if (
!q ||
!q.trim()
) {
return reply(
`- 📦 \`𝙽𝙿𝙼 𝚂𝙴𝙰𝚁𝙲𝙷\`

> *Digite o nome do pacote que deseja pesquisar.*

『 📌 \`𝙴𝚇𝙴𝙼𝙿𝙻𝙾𝚂\` 』

${prefix + command} axios
${prefix + command} baileys
${prefix + command} express
${prefix + command} yt-search
${prefix + command} baileys`
)
}

try {
await reagir(
from,
"🔎"
)

const pesquisa =
q.trim()

/*
         * Pesquisa os pacotes.
         */

const resultados =
await pesquisarNpm(
pesquisa
)

if (
!resultados.length
) {
await reagir(
from,
"❌"
).catch(
() => {}
)

return reply(mess.padraoAviso({
emoji: '📦',
titulo: 'PACOTE NÃO ENCONTRADO',
descricao: `Nenhum pacote encontrado para ${pesquisa}.`
}))
}

/*
         * Dá preferência a um resultado
         * com nome exatamente igual.
         */

const resultado =
escolherPacote(
resultados,
pesquisa
)

const pacote =
resultado?.package ||
{}

const nomePacote =
pacote?.name ||
pesquisa

/*
         * Busca os dados completos
         * da versão mais recente.
         */

let detalhes = {}

try {
detalhes =
await pegarDetalhes(
nomePacote
)
}
catch (erroDetalhes) {
console.log(
"[NPM DETALHES]",
erroDetalhes
?.response
?.data ||
erroDetalhes
?.message ||
erroDetalhes
)
}

const versao =
detalhes?.version ||
pacote?.version ||
"Não informado"

const descricao =
detalhes?.description ||
pacote?.description ||
"Sem descrição."

const autor =
pegarAutor(
pacote,
detalhes
)

const licenca =
detalhes?.license ||
"Não informado"

const downloads =
await pegarDownloads(
nomePacote
)

const atualizado =
pacote?.date ||
null

const npmLink =
pacote?.links?.npm ||
`https://www.npmjs.com/package/${nomePacote}`

const repositorio =
pegarRepositorio(
pacote,
detalhes
)

const homepage =
pegarHomepage(
pacote,
detalhes
)

const arquivoNpm =
detalhes?.dist?.tarball ||
null

const integridade =
detalhes?.dist?.integrity ||
detalhes?.dist?.shasum ||
null

const nodeVersao =
detalhes?.engines?.node ||
"Não informado"

const npmVersao =
detalhes?.engines?.npm ||
"Não informado"

const dependencias =
detalhes?.dependencies &&
typeof detalhes.dependencies ===
"object"
? Object.keys(
detalhes.dependencies
).length
: 0

const devDependencias =
detalhes?.devDependencies &&
typeof detalhes.devDependencies ===
"object"
? Object.keys(
detalhes.devDependencies
).length
: 0

const peerDependencias =
detalhes?.peerDependencies &&
typeof detalhes.peerDependencies ===
"object"
? Object.keys(
detalhes.peerDependencies
).length
: 0

let keywords =
detalhes?.keywords ||
pacote?.keywords ||
[]

if (
typeof keywords ===
"string"
) {
keywords =
keywords.split(
/[\s,]+/
)
}

const palavras =
Array.isArray(
keywords
)
? keywords
.filter(
Boolean
)
.slice(
0,
10
)
.join(
", "
)
: "Não informado"

/*
         * Pacotes relacionados.
         */

const relacionados =
resultados
.filter(
item =>
item?.package?.name &&
item.package.name !==
nomePacote
)
.slice(
0,
5
)
.map(
item =>
item.package.name
)

let texto =
`- 📦 \`𝙽𝙿𝙼 𝚂𝙴𝙰𝚁𝙲𝙷\`

『 📦 \`𝙿𝙰𝙲𝙾𝚃𝙴\` 』— ${nomePacote}
『 🏷️ \`𝚅𝙴𝚁𝚂𝙰̃𝙾\` 』— ${versao}
『 👨‍💻 \`𝙰𝚄𝚃𝙾𝚁\` 』— ${autor}
『 📜 \`𝙻𝙸𝙲𝙴𝙽𝙲̧𝙰\` 』— ${licenca}
『 📅 \`𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙳𝙾\` 』— ${formatarData(atualizado)}
『 📥 \`𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝚂 𝟽𝙳\` 』— ${formatarNumero(downloads)}

- 📝 \`𝙳𝙴𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾\`

${cortarTexto(descricao, 600)}

- ⚙️ \`𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲̧𝙾̃𝙴𝚂\`

『 📚 \`𝙳𝙴𝙿𝙴𝙽𝙳𝙴̂𝙽𝙲𝙸𝙰𝚂\` 』— ${dependencias}
『 🛠️ \`𝙳𝙴𝚅 𝙳𝙴𝙿𝚂\` 』— ${devDependencias}
『 🔗 \`𝙿𝙴𝙴𝚁 𝙳𝙴𝙿𝚂\` 』— ${peerDependencias}
『 🟢 \`𝙽𝙾𝙳𝙴\` 』— ${nodeVersao}
『 📦 \`𝙽𝙿𝙼\` 』— ${npmVersao}

『 🔎 \`𝙺𝙴𝚈𝚆𝙾𝚁𝙳𝚂\` 』
${cortarTexto(palavras, 300)}

- 💻 \`𝙸𝙽𝚂𝚃𝙰𝙻𝙰𝙲̧𝙰̃𝙾\`

\`npm install ${nomePacote}\`

- 🔗 \`𝙽𝙿𝙼\`

${npmLink}`

if (
repositorio
) {
texto +=
`

- 💻 \`𝚁𝙴𝙿𝙾𝚂𝙸𝚃𝙾́𝚁𝙸𝙾\`

${repositorio}`
}

if (
homepage &&
homepage !== repositorio
) {
texto +=
`

- 🌐 \`𝚂𝙸𝚃𝙴\`

${homepage}`
}

if (
relacionados.length
) {
texto +=
`

- 🔎 \`𝚁𝙴𝙻𝙰𝙲𝙸𝙾𝙽𝙰𝙳𝙾𝚂\`

${relacionados
  .map(
    (nome, index) =>
      `${index + 1}. ${nome}`
  )
  .join("\n")}`
}

/*
         * Envia as informações primeiro.
         */

await tokito.sendMessage(
from,
{
text: texto,

contextInfo:
typeof canalInfo ===
"function"
? canalInfo([])
: {}
},
{
quoted: selo
}
)

/*
         * Se existir tarball, manda
         * o pacote como documento.
         */

if (
arquivoNpm
) {
await reagir(
from,
"📦"
)

const nomeArquivo =
nomeArquivoSeguro(
nomePacote
)

let caption =
`- 📦 \`𝙿𝙰𝙲𝙾𝚃𝙴 𝙽𝙿𝙼\`

『 📦 \`𝙿𝙰𝙲𝙾𝚃𝙴\` 』— ${nomePacote}
『 🏷️ \`𝚅𝙴𝚁𝚂𝙰̃𝙾\` 』— ${versao}

> *Arquivo original da versão publicada no NPM.*`

if (
integridade
) {
caption +=
`

`
}

try {
await tokito.sendMessage(
from,
{
document: {
url: arquivoNpm
},

mimetype:
"application/gzip",

fileName:
`${nomeArquivo}-${versao}.tgz`,

caption,

contextInfo:
typeof canalInfo ===
"function"
? canalInfo([])
: {}
},
{
quoted: selo
}
)
}
catch (erroDocumento) {
console.log(
"[NPM DOCUMENTO]",
erroDocumento
?.response
?.data ||
erroDocumento
?.message ||
erroDocumento
)

/*
             * Segunda tentativa:
             * baixa o pacote para Buffer
             * e manda diretamente.
             */

try {
const respostaArquivo =
await axios.get(
arquivoNpm,
{
responseType:
"arraybuffer",

timeout:
120000,

maxContentLength:
Infinity,

maxBodyLength:
Infinity,

headers: {
"User-Agent":
"TokitoBot/10.0"
}
}
)

const buffer =
Buffer.from(
respostaArquivo.data
)

await tokito.sendMessage(
from,
{
document:
buffer,

mimetype:
"application/gzip",

fileName:
`${nomeArquivo}-${versao}.tgz`,

caption,

contextInfo:
typeof canalInfo ===
"function"
? canalInfo([])
: {}
},
{
quoted: selo
}
)
}
catch (erroBuffer) {
console.log(
"[NPM BUFFER]",
erroBuffer
?.response
?.data ||
erroBuffer
?.message ||
erroBuffer
)

await reply(mess.padraoAviso({
emoji: '📦',
titulo: 'DOCUMENTO NÃO ENVIADO',
descricao: `Encontrei ${nomePacote} ${versao}, mas não consegui enviar o documento.`,
detalhe: arquivoNpm
}))
}
}
}
else {
await reply(mess.padraoAviso({
emoji: '📦',
titulo: 'DOWNLOAD INDISPONÍVEL',
descricao: 'Esse pacote não informou um arquivo de download no NPM.'
}))
}

await reagir(
from,
"✅"
)
}
catch (e) {
console.log(
"[NPM SEARCH]",
e?.response?.data ||
e?.message ||
e
)

await reagir(
from,
"❌"
).catch(
() => {}
)

return reply(mess.padraoErro({
titulo: 'ERRO NO NPM',
descricao: 'Não consegui pesquisar esse pacote no NPM.'
}))
}
}
}
}
)
