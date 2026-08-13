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

const axios = require('axios')
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require('@whiskeysockets/baileys')

module.exports = {
nome: 'akinator',
comandos: ['akinator', 'aki'],
categoria: 'jogos',

info: {
descricao: 'Jogo do Akinator.',
uso: 'akinator',
categoria: 'jogos'
},

async executar(ctx) {
with (ctx) {
try {
if (!isGroup) return reply(mess.sogrupo())
if (!modoJogosAtivo(from, dataGp)) return reply(mess.modoJogosDesativado(prefix))

await reagir(from, '🧞‍♂️')

if (!global.akinatorJogos) global.akinatorJogos = {}
if (!global.akinatorMensagens) global.akinatorMensagens = {}

const canalAki = typeof canalInfo === 'function' ? canalInfo([sender]) : undefined
const jogo = global.akinatorJogos[from]
const id = jogo?.id || `${from}_${sender}`

const apagar = async () => {
try {
const antiga = global.akinatorMensagens[from]
if (!antiga) return
await tokito.sendMessage(from, { delete: antiga }).catch(() => {})
delete global.akinatorMensagens[from]
} catch {}
}

if (jogo && jogo.sender !== sender) {
return reply(`-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️

『 ⚠️ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Já existe uma partida em andamento.
『 👤 \`𝙹𝙾𝙶𝙰𝙳𝙾𝚁\` 』— ${jogo.nome || 'Alguém'}

> *Aguarde a partida atual terminar ou ser cancelada.*`)
}

const normalizar = (txt = '') => String(txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim()

const quick = (id, texto) => ({
name: 'quick_reply',
buttonParamsJson: JSON.stringify({ display_text: texto, id: `${prefix + command} ${id}` })
})

const lista = () => ({
name: 'single_select',
buttonParamsJson: JSON.stringify({
title: '🧞‍♂️ ᴍᴇɴᴜ ᴀᴋɪɴᴀᴛᴏʀ',
sections: [{
title: '🔮 ᴀᴄᴏᴇs',
rows: [
{ title: '↩️ ᴠᴏʟᴛᴀʀ', description: 'ᴠᴏʟᴛᴀʀ ᴘᴀʀᴀ ᴀ ᴘᴇʀɢᴜɴᴛᴀ ᴀɴᴛᴇʀɪᴏʀ.', id: `${prefix + command} voltar` },
{ title: '❌ ᴄᴀɴᴄᴇʟᴀʀ', description: 'ᴇɴᴄᴇʀʀᴀʀ ᴇsᴛᴇ ᴊᴏɢᴏ.', id: `${prefix + command} cancelar` }
]
}]
})
})

const botoesInicio = [
quick('iniciar', '🧞‍♂️ ᴊᴏɢᴀʀ'),
quick('cancelar', '❌ ᴄᴀɴᴄᴇʟᴀʀ')
]

const botoesResposta = [
quick('sim', '✅ sɪᴍ'),
quick('nao', '❌ ɴᴀᴏ'),
quick('naosei', '🤔 ɴᴀᴏ sᴇɪ'),
quick('provavelmente', '✨ ᴘʀᴏᴠᴀᴠᴇʟᴍᴇɴᴛᴇ sɪᴍ'),
quick('provavelmentenao', '🌙 ᴘʀᴏᴠᴀᴠᴇʟᴍᴇɴᴛᴇ ɴᴀᴏ'),
lista()
]

const botoesResultado = [
quick('acertei', '🎯 ᴀᴄᴇʀᴛᴇɪ'),
quick('errou', '😅 ᴇʀʀᴏᴜ'),
quick('iniciar', '🔄 ᴊᴏɢᴀʀ ᴅᴇ ɴᴏᴠᴏ')
]

const interativo = async ({ texto, imagem = null, botoes = [], apagarAntiga = true }) => {
if (apagarAntiga) await apagar()

let header = {}

if (imagem) {
const media = await prepareWAMessageMedia({ image: { url: imagem } }, { upload: tokito.waUploadToServer })
header = proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: true, imageMessage: media.imageMessage })
}

const msg = generateWAMessageFromContent(from, {
viewOnceMessage: {
message: {
interactiveMessage: proto.Message.InteractiveMessage.create({
body: proto.Message.InteractiveMessage.Body.create({ text: texto }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: NomeDoBot }),
...(imagem ? { header } : {}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: botoes }),
...(canalAki ? { contextInfo: canalAki } : {})
})
}
}
}, { quoted: info })

await tokito.relayMessage(from, msg.message, { messageId: msg.key.id })

global.akinatorMensagens[from] = { remoteJid: from, fromMe: true, id: msg.key.id }
return msg
}

const resultado = (r = {}) => {
const fontes = [
r, r.resultado, r.result, r.acerto, r.guess, r.win, r.personagem, r.data,
Array.isArray(r.guesses) ? r.guesses[0] : null,
Array.isArray(r.answers) ? r.answers[0] : null
].filter(Boolean)

for (const item of fontes) {
const nome = item.personagem || item.nome || item.name || item.character || item.proposition || item.name_proposition || item.sugestion_name || item.suggestion_name || ''
const desc = item.descricao || item.description || item.desc || item.pseudo || item.title || item.titulo || item.description_proposition || item.prop_desc || item.sugestion_desc || item.suggestion_desc || ''
const foto = item.imagem || item.foto || item.image || item.photo || item.picture || item.avatar || item.absolute_picture_path || item.photo_path || item.sugestion_photo || item.suggestion_photo || ''
if (nome || desc || foto) return { nome, desc, foto }
}

return { nome: '', desc: '', foto: '' }
}

const pergunta = async (r = {}, titulo = 'ᴀᴋɪɴᴀᴛᴏʀ') => {
const p = r.pergunta || r.question || 'ʀᴇsᴘᴏɴᴅᴀ ᴀ ᴘᴇʀɢᴜɴᴛᴀ'
const etapa = r.etapa || r.step || 1
const progresso = Number(r.progresso || r.progress || r.progression || 0).toFixed(1)
const img = `${API_URL}/canvas/akinator?modo=pergunta&etapa=${encodeURIComponent(etapa)}&pergunta=${encodeURIComponent(p)}&progresso=${encodeURIComponent(progresso)}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`

let msg = `-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️\n\n`
msg += `『 ❓ \`𝙿𝙴𝚁𝙶𝚄𝙽𝚃𝙰\` 』— ${etapa}\n`
msg += `『 📊 \`𝙿𝚁𝙾𝙶𝚁𝙴𝚂𝚂𝙾\` 』— ${progresso}%\n\n`
msg += `> *${p}*\n\n`
msg += `*Escolha uma resposta abaixo.*`

return interativo({ texto: msg, imagem: img, botoes: botoesResposta })
}

if (!q || !q.trim()) {
const img = `${API_URL}/canvas/akinator?modo=inicio&apikey=${encodeURIComponent(API_KEY_TOKITO)}`

let msg = `-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️\n\n`
msg += `『 💭 \`𝙾𝙱𝙹𝙴𝚃𝙸𝚅𝙾\` 』— Pense em um personagem.\n`
msg += `『 🎭 \`𝚃𝙸𝙿𝙾\` 』— Pode ser real ou fictício.\n\n`
msg += `> *Toque em Jogar para começar a partida.*`

return interativo({ texto: msg, imagem: img, botoes: botoesInicio })
}

const arg = normalizar(q)

if (['acertei', 'acertou', 'sim acertou'].includes(arg)) {
let msg = `-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️\n\n`
msg += `『 🎯 \`𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾\` 』— Acertei!\n`
msg += `『 😎 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Eu sabia que conseguiria.\n\n`
msg += `> *Foi um ótimo desafio. Quer jogar novamente?*`

await interativo({ texto: msg, botoes: botoesInicio })
delete global.akinatorJogos[from]
return
}

if (['errou', 'nao acertou', 'não acertou', 'naoacertou'].includes(arg)) {
let msg = `-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️\n\n`
msg += `『 😅 \`𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾\` 』— Dessa vez eu errei.\n`
msg += `『 🔮 \`𝙳𝙴𝚂𝙰𝙵𝙸𝙾\` 』— Na próxima eu tento acertar.\n\n`
msg += `> *Quer começar uma nova partida?*`

await interativo({ texto: msg, botoes: botoesInicio })
delete global.akinatorJogos[from]
return
}

if (['iniciar', 'start', 'jogar'].includes(arg)) {
global.akinatorJogos[from] = { sender, id, nome: pushname, inicio: Date.now() }

const { data } = await axios.get(`${API_URL}/api/akinator/start`, {
params: { id, apikey: API_KEY_TOKITO },
timeout: 30000
})

if (!data?.status) {
delete global.akinatorJogos[from]
return reply(`-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️

『 ❌ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Não foi possível iniciar a partida.
『 ⚠️ \`𝙼𝙾𝚃𝙸𝚅𝙾\` 』— ${data?.resultado || data?.erro || 'Tente novamente em alguns instantes.'}`)
}

return pergunta(data.resultado || data.result || {})
}

if (!jogo) {
let msg = `-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️\n\n`
msg += `『 💭 \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Nenhuma partida em andamento.\n\n`
msg += `> *Toque em Jogar para começar.*`

return interativo({ texto: msg, botoes: botoesInicio })
}

if (['cancelar', 'sair', 'parar', 'end'].includes(arg)) {
try {
await axios.get(`${API_URL}/api/akinator/end`, {
params: { id, apikey: API_KEY_TOKITO },
timeout: 30000
})
} catch {}

delete global.akinatorJogos[from]

let msg = `-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️\n\n`
msg += `『 ❌ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Partida encerrada.\n`
msg += `『 🔮 \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 』— Quando quiser, podemos tentar novamente.`

return interativo({ texto: msg, botoes: botoesInicio })
}

if (['voltar', 'back'].includes(arg)) {
const { data } = await axios.get(`${API_URL}/api/akinator/back`, {
params: { id, apikey: API_KEY_TOKITO },
timeout: 30000
})

if (!data?.status) {
return reply(`-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️

『 ❌ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Não foi possível voltar.
『 ⚠️ \`𝙼𝙾𝚃𝙸𝚅𝙾\` 』— ${data?.resultado || data?.erro || 'Não existe uma pergunta anterior disponível.'}`)
}

return pergunta(data.resultado || data.result || {})
}

const mapa = {
sim: 'sim', s: 'sim',
nao: 'nao', n: 'nao', não: 'nao',
naosei: 'naosei', 'nao sei': 'naosei', 'não sei': 'naosei',
provavelmente: 'provavelmente', 'provavelmente sim': 'provavelmente', provavelmentesim: 'provavelmente',
provavelmentenao: 'provavelmentenao', 'provavelmente nao': 'provavelmentenao',
'provavelmente não': 'provavelmentenao', 'prov nao': 'provavelmentenao',
'prov não': 'provavelmentenao', 'prov. nao': 'provavelmentenao', 'prov. não': 'provavelmentenao'
}

const resposta = mapa[arg]

if (!resposta) {
return interativo({
texto: `-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️

『 🤔 \`𝚁𝙴𝚂𝙿𝙾𝚂𝚃𝙰\` 』— Escolha uma das opções abaixo.`,
botoes: botoesResposta
})
}

const { data } = await axios.get(`${API_URL}/api/akinator/answer`, {
params: { id, resposta, apikey: API_KEY_TOKITO },
timeout: 30000
})

if (!data?.status) {
return reply(`-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️

『 ❌ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Ocorreu um problema ao processar a resposta.
『 ⚠️ \`𝙼𝙾𝚃𝙸𝚅𝙾\` 』— ${data?.resultado || data?.erro || 'Tente novamente.'}`)
}

const r = data.resultado || data.result || {}

if (r.finalizado) {
delete global.akinatorJogos[from]

const acerto = resultado(r)
const nome = acerto.nome || 'ᴘᴇʀsᴏɴᴀɢᴇᴍ'
const desc = acerto.desc || 'ᴅᴇsᴄʀɪᴄᴀᴏ ɴᴀᴏ ᴅɪsᴘᴏɴɪᴠᴇʟ'
const foto = acerto.foto || ''
const progresso = Number(r.progresso || r.progress || r.progression || 0).toFixed(1)
const img = `${API_URL}/canvas/akinator?modo=resultado&personagem=${encodeURIComponent(nome)}&descricao=${encodeURIComponent(desc)}&foto=${encodeURIComponent(foto)}&progresso=${encodeURIComponent(progresso)}&apikey=${encodeURIComponent(API_KEY_TOKITO)}`

let msg = `-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️\n\n`
msg += `『 🎭 \`𝙿𝙴𝚁𝚂𝙾𝙽𝙰𝙶𝙴𝙼\` 』— ${nome}\n`
msg += `『 📊 \`𝙲𝙾𝙽𝙵𝙸𝙰𝙽𝙲̧𝙰\` 』— ${progresso}%\n\n`
msg += `『 📖 \`𝙳𝙴𝚂𝙲𝚁𝙸𝙲̧𝙰̃𝙾\` 』— ${desc}\n\n`
msg += `> *Acertei o personagem?*`

return interativo({ texto: msg, imagem: img, botoes: botoesResultado })
}

return pergunta(r)

} catch (e) {
console.log('[AKINATOR]', e?.response?.data || e?.message || e)
await reagir(from, '❌').catch(() => {})
return reply(`-  \`𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁\` 🧞‍♂️

『 ❌ \`𝚂𝚃𝙰𝚃𝚄𝚂\` 』— Ocorreu um erro no Akinator.
『 ⚠️ \`𝙴𝚁𝚁𝙾\` 』— ${e?.response?.data?.erro || e?.message || 'Erro desconhecido'}`)
}
}
}
}
