module.exports = {
  comandos: ['soadm', 'so_adm'],
  async executar(ctx) {
    const { isGroup, isGroupAdmins, isBotGroupAdmins, q, dataGp, setGp, reply, mess, prefix, command, reagir, from } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isGroupAdmins)
      return reply(mess.soadm())
    if (!isBotGroupAdmins)
      return reply(mess.botadm())
    const acao = String(q || '').trim()
    if (!['0', '1'].includes(acao))
      return reply(mess.soadmUso(prefix, command))
    const atual = dataGp?.[0]?.funcoes?.soadm === true
    if (acao === '1' && atual)
      return reply(mess.soadmJaAtivo())
    if (acao === '0' && !atual)
      return reply(mess.soadmJaInativo())
    if (!dataGp[0].funcoes)
      dataGp[0].funcoes = {}
    dataGp[0].funcoes.soadm = acao === '1'
    setGp(dataGp)
    await reagir(from, acao === '1' ? '✅' : '❌')
    return reply(mess.soadmAlterado(acao === '1'))
  }
}
