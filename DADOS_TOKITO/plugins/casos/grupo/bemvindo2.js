/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "bemvindo2",
  comandos: ["bemvindo2"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando bemvindo2.",
    "uso": "bemvindo2",
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
          dataGp[0].wellcome[1].bemvindo2 = !isWelkom2
          setGp(dataGp)
          await reagir(from, dataGp[0].wellcome[1].bemvindo2 ? '✅' : '❌')
          return reply(mess.bemvindoModo(2, dataGp[0].wellcome[1].bemvindo2))
        }
        catch (e) {
          console.log('Erro no bemvindo2:', e)
          return reply(mess.error())
        }
      }
    }
  }
}
