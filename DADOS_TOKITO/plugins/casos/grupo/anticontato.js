/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "anticontato",
  comandos: ["anticontato"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando anticontato.",
    "uso": "anticontato",
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
        await funcoes.anticontato.configurar({
          grupo: from,
          dataGp,
          setGp,
          q,
          prefix,
          command,
          reply
        })
      }
    }
  }
}
