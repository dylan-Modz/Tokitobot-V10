/*
 * Tokito V10 — comunicados oficiais publicados no repositório.
 * Cada instalação consulta o GitHub e envia somente ao seu próprio dono.
 * Não coleta números, contatos ou mensagens dos usuários.
 */
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const runtime = require('../sub/runtime')

const URL_AVISOS = 'https://raw.githubusercontent.com/dylan-Modz/Tokitobot-V10/main/DADOS_TOKITO/INFO_DADOS/avisos.json'
const ARQUIVO_ESTADO = path.join(__dirname, '..', 'database', 'sistemas', 'avisos-oficiais.json')
const INTERVALO = 5 * 60 * 1000
const PRAZO = 30 * 24 * 60 * 60 * 1000
const MAX_MENSAGEM = 3500

let socket = null
let timer = null
let ocupado = false
let ultimaFalha = ''

const falha = motivo => {
  const mensagem = String(motivo?.message || motivo || 'Erro desconhecido').slice(0, 240)
  if (mensagem === ultimaFalha) return
  ultimaFalha = mensagem
  console.log('[ AVISOS OFICIAIS ] Falha:', mensagem)
}

const estado = () => {
  try {
    const dados = JSON.parse(fs.readFileSync(ARQUIVO_ESTADO, 'utf8'))
    return Array.isArray(dados?.enviados)
      ? [...new Set(dados.enviados.filter(id => typeof id === 'string'))].slice(-500)
      : []
  } catch {
    return []
  }
}

const registrar = (id, anteriores) => {
  const enviados = [...new Set([...anteriores, id])].slice(-500)
  fs.mkdirSync(path.dirname(ARQUIVO_ESTADO), { recursive: true })
  const temporario = ARQUIVO_ESTADO + '.' + process.pid + '.tmp'
  fs.writeFileSync(temporario, JSON.stringify({ enviados }, null, 2) + '\n')
  fs.renameSync(temporario, ARQUIVO_ESTADO)
}

const listar = (dados, agora = Date.now()) => {
  if (!dados || dados.bot !== 'tokito-v10' || !Array.isArray(dados.avisos))
    throw new Error('Formato de avisos inválido.')

  return dados.avisos.filter(aviso => {
    if (!aviso || aviso.ativo === false || !/^[a-z0-9][a-z0-9_-]{3,63}$/i.test(String(aviso.id || '')))
      return false

    const titulo = String(aviso.titulo || '').trim()
    const mensagem = String(aviso.mensagem || '').trim()
    if (!titulo || titulo.length > 100 || !mensagem || mensagem.length > MAX_MENSAGEM)
      return false

    const publicado = Date.parse(aviso.publicadoEm || '')
    if (!Number.isFinite(publicado) || publicado > agora || agora - publicado > PRAZO)
      return false

    if (aviso.expiraEm) {
      const expira = Date.parse(aviso.expiraEm)
      if (!Number.isFinite(expira) || expira <= agora) return false
    }
    return true
  }).sort((a, b) => Date.parse(a.publicadoEm) - Date.parse(b.publicadoEm))
}

const textoAviso = aviso => {
  const titulo = String(aviso.titulo).trim().replace(/[\r\n]+/g, ' ').slice(0, 100)
  const mensagem = String(aviso.mensagem).trim()
  return [
    '- 🧊 `𝙰𝚅𝙸𝚂𝙾 𝙾𝙵𝙸𝙲𝙸𝙰𝙻`',
    '',
    '> 👑 ׄ ( ᴅʏʟᴀɴ ᴍᴏᴅᴢ — ᴄʀɪᴀᴅᴏʀ )',
    '> 📢 ׄ ( ' + titulo + ' )',
    '',
    mensagem,
    '',
    '> 🧊 ׄ ( ᴄᴏᴍᴜɴɪᴄᴀᴅᴏ ᴏғɪᴄɪᴀʟ ᴛᴏᴋɪᴛᴏ ʙᴏᴛ ᴠ10 )'
  ].join('\n')
}

const verificar = async (tokito = socket) => {
  if (runtime.isSubBot || ocupado || !tokito?.sendMessage) return false
  if (runtime.config()?.avisosOficiais === false) return false

  ocupado = true
  try {
    const resposta = await axios.get(URL_AVISOS + '?t=' + Date.now(), {
      timeout: 10000,
      maxContentLength: 128 * 1024,
      headers: { 'User-Agent': 'TokitoBot-V10/Avisos', 'Cache-Control': 'no-cache' }
    })

    const pendentes = listar(resposta.data)
    ultimaFalha = ''
    const enviados = estado()
    const aviso = pendentes.find(item => !enviados.includes(String(item.id)))
    if (!aviso) return false

    const numero = String(runtime.config()?.ownerNumber || '').replace(/\D/g, '')
    if (numero.length < 11 || numero.length > 15) {
      falha('ownerNumber não configurado ou inválido.')
      return false
    }

    const destino = numero + '@s.whatsapp.net'
    const resultado = await tokito.sendMessage(destino, { text: textoAviso(aviso) })
    if (!resultado) throw new Error('WhatsApp não confirmou o envio do comunicado.')

    registrar(String(aviso.id), enviados)
    console.log('[ AVISOS OFICIAIS ] Comunicado ' + aviso.id + ' enviado ao dono.')
    return true
  } catch (error) {
    falha(error)
    return false
  } finally {
    ocupado = false
  }
}

const iniciar = tokito => {
  if (runtime.isSubBot) return
  socket = tokito

  setTimeout(() => {
    if (socket) verificar(socket).catch(falha)
  }, 12000).unref?.()

  if (timer) return
  timer = setInterval(() => {
    if (socket) verificar(socket).catch(falha)
  }, INTERVALO)
  timer.unref?.()
}

const pausar = tokito => {
  if (!tokito || socket === tokito) socket = null
}

module.exports = { iniciar, pausar, verificar, listar, textoAviso, URL_AVISOS, INTERVALO }
