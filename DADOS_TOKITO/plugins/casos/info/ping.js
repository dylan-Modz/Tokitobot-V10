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

module.exports = {
nome: "ping",
comandos: ["ping"],
categoria: "info",
info: {
"descricao": "Executa o comando ping.",
"uso": "ping",
"categoria": "info"
},
async executar(ctx) {
with (ctx) {
{
try {
await reagir(from, '🏃🏻‍♂️')
const inicio = performance.now()
try {
await tokito.sendPresenceUpdate('available', from)
}
catch {
}
const latency = (performance.now() - inicio).toFixed(2)
const speedConverted = (Number(latency) / 1000).toFixed(3)
const sistema = `${os.type()} ${os.arch()}`
const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
const ramUsada = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)
const cpu = Math.min(100, (os.loadavg()[0] / Math.max(os.cpus().length, 1)) * 100).toFixed(1)
const nodejs = process.version
const baileysV = baileysVersion
const gruposAtivos = await tokito.groupFetchAllParticipating().catch(() => ({}))
const totalGrupos = Object.keys(gruposAtivos || {}).length
const totalCmd = plugins.contar().total
const uptime = Math.floor(process.uptime())
const dias = Math.floor(uptime / 86400)
const horas = Math.floor((uptime % 86400) / 3600)
const minutos = Math.floor((uptime % 3600) / 60)
const segundos = uptime % 60
const tempoOnline = `${dias}d ${horas}h ${minutos}m ${segundos}s`
const texto = mess.ping({
NomeDoBot,
pushname,
speedConverted,
latency,
sistema,
ramUsada,
ramTotal,
baileysV,
cpu,
nodejs,
totalGrupos,
totalCmd,
tempoOnline
})
const fundoPing = 'https://raw.githubusercontent.com/dylanModz/uploadsgg/main/midias/imagens/922e987a70d.jpg'
const botJid = jidNormalizedUser(tokito.user?.id || '')
const avatar = await tokito.profilePictureUrl(botJid, 'image').catch(() => fundoPing)
const cardPing = `${API_URL}/canvas/ping2?ping=${encodeURIComponent(`${speedConverted} s`)}&latency=${encodeURIComponent(`${latency} ms`)}&uptime=${encodeURIComponent(tempoOnline)}&memory=${encodeURIComponent(`${ramUsada} GB / ${ramTotal} GB`)}&cpu=${encodeURIComponent(`${cpu}%`)}&platform=${encodeURIComponent(sistema)}&node=${encodeURIComponent(nodejs)}&commands=${encodeURIComponent(totalCmd)}&avatar=${encodeURIComponent(avatar)}&fundo=${encodeURIComponent(fundoPing)}&color=${encodeURIComponent('#1e90ff')}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`
const botoes = [
{
texto: mess.botaoMenu(),
id: `${prefix}menu`
}
]
if (!isBotoes) {
await tokito.sendMessage(from, {
image: { url: cardPing },
caption: texto,
mentions: [sender],
contextInfo: canalInfo([sender])
}, { quoted: selo })
return
}
const media = await prepareWAMessageMedia({
image: { url: cardPing }
}, {
upload: tokito.waUploadToServer
})
const msg = generateWAMessageFromContent(from, {
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: {
...canalInfo([sender]),
mentionedJid: [sender]
},
header: proto.Message.InteractiveMessage.Header.create({
hasMediaAttachment: true,
imageMessage: media.imageMessage
}),
body: proto.Message.InteractiveMessage.Body.create({
text: texto
}),
footer: proto.Message.InteractiveMessage.Footer.create({
text: ''
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: enviarbuton(botoes)
})
})
}, {
quoted: selo,
userJid: tokito.user.id
})
await tokito.relayMessage(from, msg.message, {
messageId: msg.key.id
})
}
catch (e) {
console.log('[PING API]', modulos.sanitizarErro(e, [API_KEY_TOKITO]))
reply(mess.erroApi(API_URL))
}
return
}
}
}
}
