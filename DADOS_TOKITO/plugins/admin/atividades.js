module.exports = {
  nome: 'atividades',
  comandos: ['atividades', 'inativos'],
  categoria: 'admin',
  info: {
    descricao: 'Ranking de atividade e membros inativos.',
    uso: 'atividades | inativos 5',
    permissao: 'ADM'
  },
  async executar(ctx) {
    if (!ctx.isGroup)
      return ctx.reply(ctx.mess.sogrupo())
    if (!ctx.isGroupAdmins && !ctx.SoDono)
      return ctx.reply(ctx.mess.soadm())
    const a = ctx.dataGp[0].atividades && typeof ctx.dataGp[0].atividades === 'object' ? ctx.dataGp[0].atividades : {}
    const atuais = [...new Set((ctx.groupMembers || []).map(m => ctx.nJid(m)).filter(Boolean))]
    const linhas = atuais.map(j => {
      const d = a[j] || {}
      return {
        j,
        total: Number(d.total || 0),
        comandos: Number(d.comandos || 0),
        figus: Number(d.figus || 0)
      }
    })
    if (ctx.command === 'atividades') {
      linhas.sort((x, y) => y.total - x.total)
      return ctx.reply(`📊 *ATIVIDADES DO GRUPO*\n\n${linhas.slice(0, 50).map((v, i) => `${i + 1}. @${v.j.split('@')[0]} — ${v.total} msg | ${v.comandos} cmd | ${v.figus} fig`).join('\n')}`, [...linhas.slice(0, 50).map(v => v.j)])
    }
    const limite = Math.max(0, Number(String(ctx.q || '0').replace(/\D/g, '')) || 0)
    const f = linhas.filter(v => v.total <= limite).sort((x, y) => x.total - y.total)
    return ctx.reply(`😴 *INATIVOS — LIMITE ${limite}*\n\n${f.length ? f.map((v, i) => `${i + 1}. @${v.j.split('@')[0]} — ${v.total}`).join('\n') : 'Nenhum membro encontrado.'}`, f.map(v => v.j))
  }
}
