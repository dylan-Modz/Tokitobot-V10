/*
 * Tokito Bot V10 — Divulgação por parceria.
 * Controla os links enviados automaticamente, sem comandos de divulgação.
 */
const parcerias = require('../parcerias.js')
const antilink = require('./antilink.js')
const base = require('../grupos.js')
const mess = require('../../mensagens/mensagens.js')

const verificar = async ctx => {
  if (!ctx.isGroup || !parcerias.modoAtivo(ctx.from)) return false
  if (ctx.isGroupAdmins || ctx.SoDono || ctx.dono || ctx.info?.key?.fromMe) return false
  const links = antilink.extrairLinks(ctx.body || '')
  if (!links.length) return false
  if (!ctx.isBotGroupAdmins) return false

  // Só desconta após verificar previamente o saldo.
  // Mensagem com 2 links consome 2 divulgações.
  const info = parcerias.consultarParceiro(ctx.from, ctx.sender)
  if (info && links.length <= info.restantes) {
    const resultado = parcerias.consumirDivulgacoes(ctx.from, ctx.sender, links.length)
    if (resultado.permitido) {
      // O mesmo evento prossegue pelos demais filtros; apenas Anti-Link e
      // Anti-Canal deixam passar o link previamente autorizado.
      ctx.parceriaLiberada = true
      return false
    }
  }

  // A exclusão precisa ser confirmada antes do aviso: não pune nem consome
  // o saldo quando o WhatsApp não permite apagar a mensagem.
  if (!await base.apagar(ctx.tokito, ctx.info)) return false
  const nome = String(ctx.pushname || 'membro').replace(/[\r\n@>*]/g, '').trim().slice(0, 40)
  const marcado = '@' + (nome || 'membro')
  const texto = info
    ? mess.parceriaLimite(marcado, info.limite, info.restantes)
    : mess.parceriaNaoAutorizada(marcado)

  await ctx.tokito.sendMessage(ctx.from, {
    text: texto,
    mentions: [ctx.sender],
    contextInfo: { ...(ctx.newsletter || {}), mentionedJid: [ctx.sender] }
  }, { quoted: ctx.selo }).catch(() => {})
  return true
}

module.exports = { verificar }
