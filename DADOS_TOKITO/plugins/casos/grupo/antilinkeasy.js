/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "antilinkeasy",
  comandos: ["antilinkeasy"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando antilinkeasy.",
    "uso": "antilinkeasy",
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
        await funcoes.antilink.configurar({
          grupo: from,
          dataGp,
          setGp,
          nivel: 'easy',
          q,
          prefix,
          command,
          reply
        })
      }
    }
  }
}
