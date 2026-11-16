/*
 * Tokito Bot V10 — Consultas e central do Modo Parceria.
 */
const parcerias = require('../../sistemas/parcerias')
const dylan = require('../../database/lib/comandos')

dylan.setCommand({
  nome: 'parceria',
  comandos: ['parceria', 'parcerias', 'minhaparceria'],
  categoria: 'admin',
  info: {
    descricao: 'Central, lista de parceiros e saldo diário de divulgações.',
    uso: 'parceria | parcerias | minhaparceria'
  },
  async executar(ctx) {
    if (!ctx.isGroup) return ctx.reply(ctx.mess.sogrupo())
    if (!parcerias.modoAtivo(ctx.from)) return ctx.reply(ctx.mess.parceriaModoDesativado(ctx.prefix))
    const comando = String(ctx.command || '').toLowerCase()
    if (comando === 'parceria')
      return ctx.reply(ctx.mess.parceriaCentral(ctx.prefix))
    if (comando === 'minhaparceria') {
      const atual = parcerias.consultarParceiro(ctx.from, ctx.sender)
      return ctx.reply(atual
        ? ctx.mess.parceriaSaldo('@' + String(ctx.sender).split('@')[0], atual)
        : ctx.mess.parceriaSemMinha())
    }
    const lista = parcerias.listarParceiros(ctx.from)
    if (!lista.length) return ctx.reply(ctx.mess.parceriaSemCadastradas())
    const linhas = lista.map(item =>
      '> 🤝 ׄ ( @' + String(item.responsavel).split('@')[0] +
      ' — ' + item.restantes + '/' + item.limite + ' ʟɪɴᴋs ᴅɪsᴘᴏɴɪ́ᴠᴇɪs )').join('\n')
    return ctx.tokito.sendMessage(ctx.from, {
      text: ctx.mess.parceriaLista(linhas, lista.length),
      mentions: lista.map(item => item.responsavel),
      contextInfo: {
        ...(ctx.newsletter || {}),
        mentionedJid: lista.map(item => item.responsavel)
      }
    }, { quoted: ctx.selo })
  }
})
