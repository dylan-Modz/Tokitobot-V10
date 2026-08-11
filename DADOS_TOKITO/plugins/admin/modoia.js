module.exports = {
  nome: 'modoia',
  comandos: ['modoia'],
  categoria: 'admin',
  info: {
    descricao: 'Ativa a Tokito IA no grupo em modo texto ou áudio.',
    uso: 'modoia 1 texto|audio',
    permissao: 'ADM',
    categoria: 'admin'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())
    const p = String(ctx.q || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (!p.length)
      return ctx.reply(ctx.mess.modoIaUso(ctx.prefix))
    let cfg = ctx.dataGp[0].funcoes.modoia
    if (!cfg || typeof cfg !== 'object')
      cfg = {
        ativo: false,
        tipo: 'texto'
      }
    if (p[0] === '0') {
      cfg.ativo = false
    }
    else if (['texto', 'audio', 'áudio'].includes(p[0])) {
      cfg.ativo = true
      cfg.tipo = p[0].startsWith('a') ? 'audio' : 'texto'
    }
    else if (p[0] === '1') {
      cfg.ativo = true
      if (['texto', 'audio', 'áudio'].includes(p[1]))
        cfg.tipo = p[1].startsWith('a') ? 'audio' : 'texto'
    }
    else
      return ctx.reply(ctx.mess.modoIaUso(ctx.prefix))
    ctx.dataGp[0].funcoes.modoia = cfg
    ctx.setGp(ctx.dataGp)
    return ctx.reply(ctx.mess.modoIaAlterado(cfg.ativo, cfg.tipo))
  }
}
