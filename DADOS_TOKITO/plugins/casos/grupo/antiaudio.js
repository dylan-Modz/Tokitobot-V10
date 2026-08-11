/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "antiaudio",
  comandos: ["antiaudio"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando antiaudio.",
    "uso": "antiaudio",
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
        await funcoes.antiaudio.configurar({
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
