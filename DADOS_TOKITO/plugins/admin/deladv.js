const adv = require('../../sistemas/advertencias')

module.exports = {
  nome: 'deladv',
  comandos: ['deladv', 'rmadv', 'limparadv'],
  categoria: 'admin',
  info: {
    descricao: 'Remove advertência de um membro.',
    uso: 'deladv @usuario [tudo]',
    permissao: 'ADM',
    categoria: 'admin'
  },
  async executar(ctx) {
    const { isGroup, isGroupAdmins, SoDono, menc_jid2, menc_prt, q, dataGp, setGp, reply, mess, normalizar } = ctx
    if (!isGroup)
      return reply(mess.sogrupo())
    if (!isGroupAdmins && !SoDono)
      return reply(mess.soadm())
    const alvo = normalizar((menc_jid2 || [])[0] || menc_prt || '')
    if (!alvo)
      return reply(mess.delAdvUso(ctx.prefix))
    const r = adv.remover({
      dataGp,
      setGp,
      grupo: ctx.from,
      jid: alvo,
      tudo: /\btudo\b/i.test(String(q || ''))
    })
    return reply(r.ok ? mess.advRemovida(alvo, r.quantidade) : mess.advNenhuma(alvo), [alvo])
  }
}
