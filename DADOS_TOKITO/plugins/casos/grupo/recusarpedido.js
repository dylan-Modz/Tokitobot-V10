/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "recusarpedido",
  comandos: ["recusarpedido"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando recusarpedido.",
    "uso": "recusarpedido",
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
          const resultado = await funcoes.aprovacao.decidir({
            tokito,
            grupo: from,
            alvo: q,
            acao: 'reject'
          })
          if (resultado.vazio)
            return reply(mess.semPedidos())
          if (resultado.indisponivel)
            return reply(mess.pedidoIndisponivel(funcoes.base.numero(resultado.jid)))
          await tokito.sendMessage(from, {
            text: mess.pedidoRecusado(funcoes.base.numero(resultado.jid)),
            contextInfo: {
              ...newsletter,
              mentionedJid: [resultado.jid]
            }
          }, { quoted: selo })
        }
        catch (error) {
          console.log('[RECUSAR PEDIDO]', error)
          await reply(mess.error())
        }
      }
    }
  }
}
