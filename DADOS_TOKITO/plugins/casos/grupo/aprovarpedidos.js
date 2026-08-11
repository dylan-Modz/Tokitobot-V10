/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "aprovarpedidos",
  comandos: ["aprovarpedidos", "aprovartodos"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando aprovarpedidos.",
    "uso": "aprovarpedidos",
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
            acao: 'approve'
          })
          if (!jids.length)
            return reply(mess.semPedidos())
          await reply(mess.todosAprovados(jids.length), jids)
        }
        catch (error) {
          console.log('[APROVAR TODOS]', error)
          await reply(mess.error())
        }
      }
    }
  }
}
