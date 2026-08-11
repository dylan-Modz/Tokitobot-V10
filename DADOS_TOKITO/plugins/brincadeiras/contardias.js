module.exports = {
  nome: 'contardias',
  comandos: ['contardias'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Conta quantos dias existem entre uma data e hoje, como no Tokito V8.',
    uso: 'contardias 31/03/2024'
  },
  async executar(ctx) {
    const q = String(ctx.q || '').trim()
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(q))
      return ctx.reply(`Use uma data completa: *${ctx.prefix}contardias 31/03/2024*`)
    const [d, m, y] = q.split('/').map(Number)
    const alvo = new Date(y, m - 1, d)
    if (alvo.getFullYear() !== y || alvo.getMonth() !== m - 1 || alvo.getDate() !== d)
      return ctx.reply('❌ Data inválida.')
    const agora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Fortaleza' }))
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
    const dias = Math.ceil(Math.abs(hoje - alvo) / 86400000)
    return ctx.reply(`*${dias}* dia(s).`)
  }
}
