/* Comando migrado automaticamente do tokito.js para o sistema de plugins.
 * Lógica original preservada. Dev: dylan Modz.
 */
module.exports = {
  nome: "delfundos",
  comandos: ["delfundos"],
  categoria: "grupo",
  info: {
    "descricao": "Executa o comando delfundos.",
    "uso": "delfundos",
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
          dataGp[0].wellcome[0].fundobv = null
          dataGp[0].wellcome[0].fundobv_tipo = null
          dataGp[0].wellcome[0].fundosaiu = null
          dataGp[0].wellcome[0].fundosaiu_tipo = null
          setGp(dataGp)
          await reagir(from, '✅')
          return reply(mess.fundos())
        }
        catch (e) {
          console.log('Erro no delfundos:', e)
          return reply(mess.error())
        }
      }
    }
  }
}
