/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "bemvindo",
  comandos: ["bemvindo"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando bemvindo.",
    "uso": "bemvindo",
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
          dataGp[0].name = groupName
          dataGp[0].wellcome[0].bemvindo1 = !isWelkom
          setGp(dataGp)
          await reagir(from, dataGp[0].wellcome[0].bemvindo1 ? '✅' : '❌')
          return reply(mess.bemvindo(dataGp[0].wellcome[0].bemvindo1))
        }
        catch (e) {
          console.log('Erro no bemvindo:', e)
          return reply(mess.error())
        }
      }
    }
  }
}
