/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "autoaprovacao",
  comandos: ["autoaprovacao", "aprovacaoauto"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando autoaprovacao.",
    "uso": "autoaprovacao",
    "categoria": "grupo"
  },
  async executar(ctx) {
    with (ctx) {
      {
        if (!isGroup)
          return reply(mess.sogrupo())
        if (!isGroupAdmins)
          return reply(mess.soadm())
        if (!isBotGroupAdmins)
          return reply(mess.botadm())
        await funcoes.aprovacao.configurar({
          grupo: from,
          dataGp,
          setGp,
          q,
          prefix,
          command,
          reply,
          automatico: true
        })
        if (String(q).trim() === '1') {
          const jids = await funcoes.aprovacao.decidirTodos({
            tokito,
            grupo: from,
            acao: 'approve'
          })
          if (jids.length)
            await reply(mess.aprovacaoAutomatica(jids.length), jids)
        }
      }
    }
  }
}
