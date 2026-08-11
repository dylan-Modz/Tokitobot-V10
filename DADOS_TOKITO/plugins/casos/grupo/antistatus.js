/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "antistatus",
  comandos: ["antistatus"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando antistatus.",
    "uso": "antistatus",
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
        await funcoes.antistatus.configurar({
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
