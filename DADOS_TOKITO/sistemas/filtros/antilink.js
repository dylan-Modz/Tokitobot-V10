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
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 * ============================================================
 */

const base = require('../grupos.js')
const parcerias = require('../parcerias.js')
const mess = require('../../mensagens/mensagens.js')

const regex = /(?:https?:\/\/)?(?:www\.)?(?:chat\.whatsapp\.com\/\S+|whatsapp\.com\/channel\/\S+|wa\.me\/channel\/\S+)/i
const linksRegex = /(?:https?:\/\/|www\.)[^\s<>"']+|(?:[a-z\d-]+\.)+[a-z]{2,24}(?::\d{2,5})?(?:\/[^\s<>"']*)?/gi
const medioRegex = /(?:^|\.)(?:instagram\.com|facebook\.com|fb\.com|tiktok\.com|youtube\.com|youtu\.be|twitter\.com|x\.com|threads\.net|kwai\.com|discord\.gg|discord\.com|t\.me|telegram\.me|wa\.me|linktr\.ee|bit\.ly|tinyurl\.com|cutt\.ly|encurtador\.com\.br|is\.gd|goo\.gl|rebrand\.ly|shorturl\.at)$/i
const dadosNivel = {
  easy: { emoji: '🛡️', titulo: '𝙰𝙽𝚃𝙸-𝙻𝙸𝙽𝙺 𝙴𝙰𝚂𝚈', descricao: 'ᴀᴘᴀɢᴀ ᴄᴏɴᴠɪᴛᴇs ᴅᴇ ɢʀᴜᴘᴏs ᴇ ᴄᴀɴᴀɪs ᴇ ᴀᴠɪsᴀ.' },
  medium: { emoji: '🔒', titulo: '𝙰𝙽𝚃𝙸-𝙻𝙸𝙽𝙺 𝙼𝙴𝙳𝙸𝚄𝙼', descricao: 'ʙʟᴏǫᴜᴇɪᴀ ᴄᴏɴᴠɪᴛᴇs, ʀᴇᴅᴇs sᴏᴄɪᴀɪs ᴇ ᴇɴᴄᴜʀᴛᴀᴅᴏʀᴇs; ʀᴇᴍᴏᴠᴇ ɴᴀ 𝟹ª ɪɴғʀᴀᴄ̧ᴀ̃ᴏ ᴇᴍ 𝟸𝟺ʜ.' },
  hard: { emoji: '🚫', titulo: '𝙰𝙽𝚃𝙸-𝙻𝙸𝙽𝙺 𝙷𝙰𝚁𝙳', descricao: 'ʙʟᴏǫᴜᴇɪᴀ ǫᴜᴀʟǫᴜᴇʀ ʟɪɴᴋ ᴏᴜ sɪᴛᴇ ᴇ ʀᴇᴍᴏᴠᴇ ᴅɪʀᴇᴛᴀᴍᴇɴᴛᴇ.' }
}

const extrairLinks = entrada => {
  const texto = String(entrada || '').replace(/[\u200b-\u200d\u2060\ufeff]/g, '').replace(/\[\s*\.\s*\]|\(\s*\.\s*\)/g, '.').replace(/\bhxxp(s?):\/\//gi, 'http$1://')
  const links = []
  for (const m of texto.matchAll(linksRegex)) {
    if (m.index > 0 && /[\w@.-]/.test(texto[m.index - 1])) continue
    const bruto = m[0].replace(/[.,;:!?)\]}]+$/g, '')
    const partes = bruto.replace(/^https?:\/\//i, '').match(/^([^\/?#:]+)(\/[^?#]*)?/)
    if (partes?.[1]?.includes('.')) links.push({ dominio: partes[1].toLowerCase(), caminho: partes[2] || '/', bruto })
  }
  return links
}
const limparDominio = entrada => {
  const host = String(entrada || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./).split(/[/?#]/)[0]
  return /^(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,24}$/.test(host) ? host : ''
}
const permitidos = dados => Array.isArray(dados?.[0]?.funcoes?.antilinkDominios) ? dados[0].funcoes.antilinkDominios : []
const detectar = (texto, nivel, lista = []) => extrairLinks(texto).find(link => {
  const host = link.dominio.replace(/^www\./, '')
  if (lista.some(d => host === d || host.endsWith('.' + d))) return false
  if (nivel === 'hard') return true
  const convite = (link.dominio === 'chat.whatsapp.com' && link.caminho.length > 1)
    || (['whatsapp.com', 'www.whatsapp.com', 'wa.me'].includes(link.dominio) && /^\/channel\/[^/]+/i.test(link.caminho))
  return convite || (nivel === 'medium' && medioRegex.test(host))
}) || null
const grupoEstado = ctx => {
  const dados = Array.isArray(ctx.dataGp) && ctx.dataGp[0] ? ctx.dataGp : base.lerGrupo(ctx.from)
  if (!dados[0].funcoes || typeof dados[0].funcoes !== 'object') dados[0].funcoes = {}
  if (!dados[0].antilinkEstado || typeof dados[0].antilinkEstado !== 'object')
    dados[0].antilinkEstado = { avisos: {}, estatisticas: { apagados: 0, removidos: 0 } }
  const estado = dados[0].antilinkEstado
  if (!estado.avisos || typeof estado.avisos !== 'object') estado.avisos = {}
  if (!estado.estatisticas || typeof estado.estatisticas !== 'object') estado.estatisticas = { apagados: 0, removidos: 0 }
  return { dados, estado }
}
const salvar = (ctx, dados) => typeof ctx.setGp === 'function' ? ctx.setGp(dados) : base.salvarGrupo(ctx.from, dados)

const configurar = async ({ grupo, dataGp, setGp, nivel, q, prefix, command, reply }) => {
  const acao = String(q || '').trim(), tipo = dadosNivel[nivel]
  if (!tipo) return false
  if (!['0', '1'].includes(acao))
    return reply(mess.funcaoUso(tipo.emoji, tipo.titulo, prefix, command, tipo.descricao))
  const ctx = { from: grupo, dataGp, setGp }, { dados } = grupoEstado(ctx)
  dados[0].funcoes.antilink = acao === '1' ? { ativo: true, nivel } : { ativo: false, nivel: null }
  salvar(ctx, dados)
  return reply(acao === '1'
    ? mess.funcaoAtivada(tipo.emoji, tipo.titulo, tipo.descricao + ' ᴀᴘᴇɴᴀs ᴍᴇᴍʙʀᴏs sᴇʀᴀ̃ᴏ ᴘᴜɴɪᴅᴏs.')
    : mess.funcaoDesativada(tipo.emoji, tipo.titulo, 'ᴏ sɪsᴛᴇᴍᴀ ᴀɴᴛɪ-ʟɪɴᴋ ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ɴᴇsᴛᴇ ɢʀᴜᴘᴏ.'))
}
const status = ctx => {
  const { dados, estado } = grupoEstado(ctx), config = dados[0].funcoes.antilink || {}
  return mess.antilinkPainel(config.ativo ? String(config.nivel || '').toUpperCase() : 'DESLIGADO', permitidos(dados), estado.estatisticas)
}
const dominio = (ctx, acao, entrada) => {
  const host = limparDominio(entrada)
  if (!host) return mess.antilinkDominio('invalido', entrada)
  const { dados } = grupoEstado(ctx), lista = permitidos(dados)
  if (acao === 'adicionar') {
    if (lista.includes(host)) return mess.antilinkDominio('existe', host)
    if (lista.length >= 30) return mess.antilinkDominio('limite', host)
    dados[0].funcoes.antilinkDominios = [...lista, host]
  } else {
    if (!lista.includes(host)) return mess.antilinkDominio('nao', host)
    dados[0].funcoes.antilinkDominios = lista.filter(x => x !== host)
  }
  salvar(ctx, dados)
  return mess.antilinkDominio(acao === 'adicionar' ? 'adicionado' : 'removido', host)
}
const marcar = ctx => {
  const nome = String(ctx.pushname || ctx.info?.pushName || 'membro').replace(/[\r\n@>*]/g, '').trim().slice(0, 40)
  return '@' + (nome || 'membro')
}
const avisar = async (ctx, nivel, detalhes = {}) => ctx.tokito.sendMessage(ctx.from, {
  text: mess.antilinkDetectado(nivel, marcar(ctx), detalhes),
  mentions: [ctx.sender],
  contextInfo: { ...ctx.newsletter, mentionedJid: [ctx.sender] }
}, { quoted: ctx.selo }).catch(() => {})
const remover = async ctx => {
  try {
    const retorno = await ctx.tokito.groupParticipantsUpdate(ctx.from, [ctx.sender], 'remove')
    return !Array.isArray(retorno) || retorno.every(x => !x?.status || ['200','201'].includes(String(x.status)))
  } catch (error) { console.log('[ANTILINK REMOVER]', error?.message || error); return false }
}
const fecharSpam = async ctx => {
  let alterado = false
  try {
    const meta = await ctx.tokito.groupMetadata(ctx.from)
    if (meta?.announce === false) {
      await ctx.tokito.groupSettingUpdate(ctx.from, 'announcement')
      alterado = true
      await base.esperar(3000)
    }
  } catch (error) { console.log('[ANTILINK SPAM]', error?.message || error) }
  finally { if (alterado) await ctx.tokito.groupSettingUpdate(ctx.from, 'not_announcement').catch(() => {}) }
}
const verificar = async ctx => {
  const { tokito, info, from, sender, body, isGroup, isGroupAdmins, isBotGroupAdmins, config } = ctx
  if (!isGroup || !config?.antilink?.ativo || !dadosNivel[config.antilink.nivel]) return false
  if (isGroupAdmins || ctx.dono || ctx.SoDono || info?.key?.fromMe || !isBotGroupAdmins) return false
  if (parcerias.podeIgnorarAntiLink(from, sender)) return false
  const { dados, estado } = grupoEstado(ctx), nivel = config.antilink.nivel
  if (!detectar(body, nivel, permitidos(dados))) return false
  if (!await base.apagar(tokito, info)) return false
  estado.estatisticas.apagados = Number(estado.estatisticas.apagados || 0) + 1
  if (nivel === 'easy') {
    salvar(ctx, dados)
    await avisar(ctx, 'easy')
    return true
  }
  if (nivel === 'medium') {
    const chave = base.normalizar(sender), agora = Date.now(), aviso = estado.avisos[chave]
    const quantidade = (Number(aviso?.expiraEm || 0) > agora ? Number(aviso?.quantidade || 0) : 0) + 1
    if (quantidade >= 3) delete estado.avisos[chave]
    else estado.avisos[chave] = { quantidade, expiraEm: agora + 86400000 }
    const removido = quantidade >= 3 ? await remover(ctx) : false
    if (removido) estado.estatisticas.removidos = Number(estado.estatisticas.removidos || 0) + 1
    const recentes = Array.isArray(estado.recentes) ? estado.recentes : []
    estado.recentes = recentes.filter(t => Number(t) > agora - 30000).concat(agora).slice(-10)
    const spam = estado.recentes.length >= 5 && agora - Number(estado.ultimoFechamento || 0) > 90000
    if (spam) { estado.recentes = []; estado.ultimoFechamento = agora }
    salvar(ctx, dados)
    if (spam) await fecharSpam(ctx)
    await avisar(ctx, 'medium', { quantidade, removido })
    return true
  }
  const removido = await remover(ctx)
  if (removido) estado.estatisticas.removidos = Number(estado.estatisticas.removidos || 0) + 1
  salvar(ctx, dados)
  await avisar(ctx, 'hard', { removido })
  return true
}
module.exports = { configurar, verificar, detectar, extrairLinks, limparDominio, status, dominio, regex, dadosNivel }
