/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "bemvindo3",
  comandos: ["bemvindo3"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando bemvindo3.",
    "uso": "bemvindo3",
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
          dataGp[0].wellcome[2].bemvindo3 = !isWelkom3
          setGp(dataGp)
          await reagir(from, dataGp[0].wellcome[2].bemvindo3 ? '✅' : '❌')
          return reply(mess.bemvindoModo(3, dataGp[0].wellcome[2].bemvindo3))
        }
        catch (e) {
          console.log('Erro no bemvindo3:', e)
          return reply(mess.error())
        }
      }
    }
  }
}
