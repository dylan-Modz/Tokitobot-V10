/*
 * Tokito Bot V10 — Administração simples de parcerias por limite diário.
 */
const parcerias = require('../../sistemas/parcerias')
const dylan = require('../../database/lib/comandos')

const marcado = jid => '@' + String(jid || '').split('@')[0]
const alvo = (ctx, texto) => {
  let mencao = ctx.menc_os2 || ctx.menc_prt || ''
  if (Array.isArray(mencao)) mencao = mencao[0] || ''
  return parcerias.normalizarUsuario(mencao || String(texto || '').trim())
}
const responderMarcando = (ctx, jid, texto) => ctx.tokito.sendMessage(ctx.from, {
  text: texto,
  mentions: [jid],
  contextInfo: { ...(ctx.newsletter || {}), mentionedJid: [jid] }
}, { quoted: ctx.selo })

dylan.setCommand({
  nome: 'gerenciarparceria',
  comandos: ['addparceria', 'editarparceria', 'removerparceria', 'delparceria'],
  categoria: 'admin',
  info: {
    descricao: 'Libera, ajusta ou remove o limite diário de links de um parceiro.',
    uso: 'addparceria @usuario 3 | editarparceria @usuario 5 | removerparceria @usuario',
    permissao: 'ADM'
  },
  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono) return ctx.reply(ctx.mess.soadm())
    if (!parcerias.modoAtivo(ctx.from)) return ctx.reply(ctx.mess.parceriaModoDesativado(ctx.prefix))
    const comando = String(ctx.command || '').toLowerCase()
    const partes = String(ctx.q || '').trim().split(/\s+/).filter(Boolean)
    const remover = ['delparceria', 'removerparceria'].includes(comando)
    const quantidade = remover ? 0 : Number(partes.pop())
    const usuario = alvo(ctx, partes.join(' '))
    if (!usuario || (!remover && (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 1000)))
      return ctx.reply(remover
        ? ctx.mess.parceriaRemoverUso(ctx.prefix)
        : ctx.mess.parceriaAddUso(ctx.prefix))

    if (remover) {
      const resultado = parcerias.excluirParceiro(ctx.from, usuario)
      if (!resultado.ok) return ctx.reply(ctx.mess.parceriaNaoEncontrada())
      return responderMarcando(ctx, usuario, ctx.mess.parceriaRemovida(usuario))
    }

    const resultado = parcerias.definirParceiro(ctx.from, usuario, quantidade)
    if (!resultado.ok) return ctx.reply(ctx.mess.parceriaAddUso(ctx.prefix))
    return responderMarcando(ctx, usuario,
      ctx.mess.parceriaDefinida(usuario, quantidade, resultado.atualizado))
  }
})
