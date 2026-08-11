module.exports = {
  nome: 'desmute',
  comandos: ['desmute', 'unmute'],
  categoria: 'admin',
  info: {
    descricao: 'Remove o silenciamento de um membro.',
    uso: 'desmute @usuario',
    permissao: 'ADM',
    categoria: 'admin'
  },
  async executar(ctx) {
    const { isGroup, isGroupAdmins, SoDono, menc_jid2, menc_prt, dataGp, setGp, reply, mess, normalizar } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isGroupAdmins && !SoDono)
      return reply(mess.soadm())
    const alvo = normalizar((menc_jid2 || [])[0] || menc_prt || '')
    if (!alvo)
      return reply(mess.desmuteUso(ctx.prefix))
    if (!Array.isArray(dataGp[0].silenciados))
      dataGp[0].silenciados = []
    const antes = dataGp[0].silenciados.length
    dataGp[0].silenciados = dataGp[0].silenciados.filter(x => x.id !== alvo)
    if (antes === dataGp[0].silenciados.length)
      return reply(mess.muteNaoAtivo(alvo), [alvo])
    setGp(dataGp)
    return reply(mess.muteDesativado(alvo), [alvo])
  }
}
