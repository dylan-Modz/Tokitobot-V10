/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "recusarpedidos",
  comandos: ["recusarpedidos", "recusartodos"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando recusarpedidos.",
    "uso": "recusarpedidos",
    "categoria": "grupo"
  },
  async executar(ctx) {
    with (ctx) {
      {
        try {
          if (!isGroup)
            return reply(mess.sogrupo())
          if (!isGroupAdmins)
            return reply(mess.soadm())
          if (!isBotGroupAdmins)
            return reply(mess.botadm())
          const jids = await funcoes.aprovacao.decidirTodos({
            tokito,
            grupo: from,
            acao: 'reject'
          })
          if (!jids.length)
            return reply(mess.semPedidos())
          await reply(mess.todosRecusados(jids.length), jids)
        }
        catch (error) {
          console.log('[RECUSAR TODOS]', error)
          await reply(mess.error())
        }
      }
    }
  }
}
