const adv = require('../../sistemas/advertencias')

module.exports = {
  nome: 'advlist',
  comandos: ['advlist', 'listaadv', 'advertencias'],
  categoria: 'admin',
  info: {
    descricao: 'Lista advertências do grupo.',
    uso: 'advlist',
    permissao: 'ADM',
    categoria: 'admin'
  },
  async executar(ctx) {
    const { isGroup, isGroupAdmins, SoDono, dataGp, reply, mess } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isGroupAdmins && !SoDono)
      return reply(mess.soadm())
    const lista = adv.listar(dataGp)
    return reply(mess.advLista(lista), lista.map(x => x.jid))
  }
}
