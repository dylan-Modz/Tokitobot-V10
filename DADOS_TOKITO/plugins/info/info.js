const plugins = require('../index')

module.exports = {
  nome: 'info',
  comandos: ['info', 'infocmd'],
  categoria: 'info',
  info: {
    descricao: 'Mostra como usar qualquer comando carregado.',
    uso: 'info comando',
    categoria: 'info'
  },
  async executar(ctx) {
    const nome = String(ctx.q || '').trim().toLowerCase()
    if (!nome)
      return ctx.reply(ctx.mess.infoUso(ctx.prefix))
    const r = plugins.resolver(nome)
    if (!r)
      return ctx.reply(ctx.mess.infoNaoExiste(nome))
    const mod = r.mod
    const meta = mod.info || {}
    return ctx.reply(ctx.mess.infoComando({
      nome: r.canonico,
      aliases: (mod.comandos || []).filter(x => x !== r.canonico),
      categoria: mod.categoria || meta.categoria || 'outros',
      descricao: meta.descricao || `Executa o comando ${r.canonico}.`,
      uso: meta.uso ? `${ctx.prefix}${meta.uso}` : `${ctx.prefix}${r.canonico}`,
      permissao: meta.permissao || 'Todos',
      requisitos: meta.requisitos || ''
    }))
  }
}
