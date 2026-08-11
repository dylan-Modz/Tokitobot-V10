module.exports = {
  nome: 'quando',
  comandos: ['quando'],
  categoria: 'brincadeiras',
  info: {
    descricao: 'Prevê de brincadeira quando algo vai acontecer.',
    uso: 'quando pergunta',
    requisitos: 'Modo Brincadeiras'
  },
  async executar(ctx) {
    const q = String(ctx.q || '').trim()
    if (!q)
      return ctx.reply('Digite a pergunta!')
    const base = ['Hoje', 'Amanhã', 'Nunca', 'dia', 'semana', 'mês', 'ano']
    const plural = ['dias', 'semanas', 'meses', 'anos']
    const tipo = base[Math.floor(Math.random() * base.length)]
    const n = Math.floor(Math.random() * 11) + 1
    let resposta
    if (['Hoje', 'Amanhã', 'Nunca'].includes(tipo))
      resposta = tipo
    else if (n === 1)
      resposta = `1 ${tipo}`
    else
      resposta = `${n} ${plural[Math.floor(Math.random() * plural.length)]}`
    return ctx.reply(`Pergunta: ${q}\nResposta: ${resposta}`)
  }
}
