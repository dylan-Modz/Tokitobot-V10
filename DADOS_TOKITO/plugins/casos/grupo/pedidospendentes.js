/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "pedidospendentes",
  comandos: ["pedidospendentes", "listarpedidos", "pedidos"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando pedidospendentes.",
    "uso": "pedidospendentes",
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
          const pedidos = await funcoes.aprovacao.sincronizar(tokito, from)
          if (!pedidos.length)
            return reply(mess.semPedidos())
          await reply(mess.pedidosPendentes(pedidos), pedidos.map(pedido => pedido.jid))
        }
        catch (error) {
          console.log('[LISTAR PEDIDOS]', error)
          await reply(mess.error())
        }
      }
    }
  }
}
