const modulos = require('../../../sistemas/modulos')

const sticker = ctx => ctx.ctxMsg?.quotedMessage?.stickerMessage || ctx.mensagem?.stickerMessage

const cmdNorm = s => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ç/g, 'c').replace(/^\W+/, '')

module.exports = {
  nome: 'rgfig',
  comandos: ['rgfig', 'delfig', 'listafig'],
  categoria: 'dono',
  info: {
    descricao: 'Mapeia uma figurinha para executar um comando.',
    uso: 'rgfig ban',
    permissao: 'Dono'
  },
  async executar(ctx) {
    if (!ctx.SoDono)
      return ctx.reply(ctx.mess.onlyOwner())
    const db = modulos.figuras()
    if (ctx.command === 'listafig') {
      const a = Object.entries(db)
      return ctx.reply(a.length ? '🧊 *SYSTEM FIGURINHAS*\n\n' + a.map(([h, c], i) => `${i + 1}. ${c} — ${h.slice(0, 12)}…`).join('\n') : '🧊 Nenhuma figurinha registrada.')
    }
    const st = sticker(ctx)
    const h = st?.fileSha256 ? Buffer.from(st.fileSha256).toString('base64') : ''
    if (!h)
      return ctx.reply('❌ Responda a uma figurinha.')
    if (ctx.command === 'delfig') {
      if (!db[h])
        return ctx.reply('❌ Essa figurinha não está registrada.')
      delete db[h]
      modulos.salvarFiguras(db)
      return ctx.reply('✅ Figurinha removida do sistema.')
    }
    const cmd = cmdNorm(String(ctx.q || '').split(/\s+/)[0])
    if (!cmd)
      return ctx.reply(`Use *${ctx.prefix}rgfig ban* respondendo uma figurinha.`)
    if (!ctx.plugins.resolver(cmd))
      return ctx.reply(`❌ O comando *${cmd}* não existe.`)
    db[h] = cmd
    modulos.salvarFiguras(db)
    return ctx.reply(`✅ Essa figurinha agora executa *${ctx.prefix}${cmd}*.`)
  }
}
