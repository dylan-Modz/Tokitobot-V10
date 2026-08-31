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

const pasta = path.join(__dirname, '..', 'database', 'grupos', 'ATIVAÇÕES-TOKITO')

if (!fs.existsSync(pasta))
fs.mkdirSync(pasta, { recursive: true })

const caminho = grupo => path.join(pasta, `${grupo}.json`)

const lerGrupo = (grupo, nome = 'Grupo') => {
try {
const dados = JSON.parse(fs.readFileSync(caminho(grupo), 'utf8'))
if (Array.isArray(dados) && dados[0] && typeof dados[0] === 'object')
return dados
}
catch {
}
return [{
name: nome,
groupId: grupo,
funcoes: {}
}]
}

const salvarGrupo = (grupo, dados) => {
if (!grupo || !Array.isArray(dados) || !dados[0])
return false
if (!dados[0].name)
dados[0].name = 'Grupo'
if (!dados[0].groupId)
dados[0].groupId = grupo
if (!dados[0].funcoes || typeof dados[0].funcoes !== 'object')
dados[0].funcoes = {}
fs.writeFileSync(caminho(grupo), JSON.stringify(dados, null, 2) + '\n')
return true
}

const config = grupo => {
const dados = lerGrupo(grupo)
return dados?.[0]?.funcoes && typeof dados[0].funcoes === 'object' ? dados[0].funcoes : {}
}

const alterar = (grupo, campo, valor) => {
const dados = lerGrupo(grupo)
if (!dados[0].funcoes || typeof dados[0].funcoes !== 'object')
dados[0].funcoes = {}
dados[0].funcoes[campo] = valor
salvarGrupo(grupo, dados)
return dados[0].funcoes
}

const normalizar = jid => {
jid = String(jid || '')
if (!jid)
return ''
const dominio = jid.includes('@') ? jid.split('@').pop() : 's.whatsapp.net'
const numero = jid.split('@')[0].split(':')[0].replace(/\D/g, '')
return numero ? `${numero}@${dominio === 'lid' ? 'lid' : dominio}` : jid
}

const numero = jid => String(jid || '').split('@')[0].split(':')[0].replace(/\D/g, '')

const esperar = ms => new Promise(resolve => setTimeout(resolve, ms))

const apagar = async (tokito, info) => {
try {
await tokito.sendMessage(info.key.remoteJid, { delete: info.key })
return true
}
catch {
return false
}
}

const desenrolar = message => {
let atual = message || {}
for (let i = 0; i < 8; i++) {
const proxima = atual?.ephemeralMessage?.message || atual?.viewOnceMessage?.message || atual?.viewOnceMessageV2?.message || atual?.viewOnceMessageV2Extension?.message || atual?.documentWithCaptionMessage?.message || atual
if (proxima === atual)
break
atual = proxima
}
return atual
}

const texto = message => {
const msg = desenrolar(message)
return String(msg?.conversation ||
msg?.extendedTextMessage?.text ||
msg?.imageMessage?.caption ||
msg?.videoMessage?.caption ||
msg?.documentMessage?.caption ||
msg?.buttonsResponseMessage?.selectedButtonId ||
msg?.listResponseMessage?.singleSelectReply?.selectedRowId ||
'').trim()
}

const tipo = message => {
const msg = desenrolar(message)
if (msg?.conversation || msg?.extendedTextMessage)
return 'texto'
if (msg?.imageMessage)
return 'imagem'
if (msg?.videoMessage)
return 'vídeo'
if (msg?.audioMessage)
return 'áudio'
if (msg?.stickerMessage)
return 'figurinha'
if (msg?.documentMessage)
return 'documento'
if (msg?.contactMessage || msg?.contactsArrayMessage)
return 'contato'
if (msg?.locationMessage || msg?.liveLocationMessage)
return 'localização'
if (msg?.pollCreationMessage || msg?.pollCreationMessageV2 || msg?.pollCreationMessageV3)
return 'enquete'
return 'mensagem'
}

module.exports = {
pasta,
caminho,
lerGrupo,
salvarGrupo,
config,
alterar,
normalizar,
numero,
esperar,
apagar,
desenrolar,
texto,
tipo
}
