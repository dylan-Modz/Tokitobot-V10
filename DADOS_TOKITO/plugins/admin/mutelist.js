module.exports = {
  nome: 'mutelist',
  comandos: ['mutelist', 'listamute'],
  categoria: 'admin',
  info: {
    descricao: 'Lista membros silenciados.',
    uso: 'mutelist',
    permissao: 'ADM',
    categoria: 'admin'
  },
  async executar(ctx) {
    const { isGroup, isGroupAdmins, SoDono, dataGp, reply, mess } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isGroupAdmins && !SoDono)
      return reply(mess.soadm())
    const lista = Array.isArray(dataGp?.[0]?.silenciados) ? dataGp[0].silenciados : []
    return reply(mess.muteLista(lista), lista.map(x => x.id))
  }
}
